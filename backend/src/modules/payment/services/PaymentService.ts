import { injectable, inject } from 'inversify';
import { VNPayService, VNPayConfig, VNPayPaymentData } from '../../../utils/vnpay';
import { TYPES } from '../../../types';
import { IOrderRepository } from '../../order/repositories/IOrderRepository';
import { IPaymentService } from "./IPaymentService";
import { IpnFailChecksum, VerifyIpnCall, VerifyReturnUrl } from "vnpay";
import { AppError } from "../../../utils/AppError";
import { IPaymentRepository, Payment } from '../repositories/IPaymentRepository';
import { IProductService } from '../../product/services/IProductService';

@injectable()
export class PaymentService implements IPaymentService {
    private vnpayService: VNPayService;

    constructor(
        @inject(TYPES.IOrderRepository) private orderRepository: IOrderRepository,
        @inject(TYPES.IPaymentRepository) private paymentRepository: IPaymentRepository,
        @inject(TYPES.IProductService) private productService: IProductService
    ) {
        const vnpayConfig: VNPayConfig = {
            vnp_TmnCode: process.env.VNP_TMN_CODE || 'OIFQGNLI',
            vnp_HashSecret: process.env.VNP_HASH_SECRET || '8SBGDQ4R16TPVWCT9F9BPVWUCWNYV45Q',
            vnp_Url: process.env.VNP_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
            vnp_ReturnUrl: process.env.VNP_RETURN_URL || 'http://localhost:8080/payment/vnpay_return',
            testMode: true,
            hashAlgorithm: 'SHA512'
        };
        this.vnpayService = new VNPayService(vnpayConfig);
    }

    async createPaymentUrl(orderId: string, amount: number, ipAddr: string): Promise<string> {
        const order = await this.orderRepository.getOrderById(orderId);
        if (!order) {
            throw new Error('Order not found');
        }

        await this.paymentRepository.createPayment({
            orderId: parseInt(orderId),
            userId: parseInt(order.order.userId),
            amount: amount,
            paymentMethod: 'Bank Transfer',
            status: 'Pending'
        });

        const paymentData: VNPayPaymentData = {
            amount: amount,
            orderInfo: `Thanh toan don hang #${orderId}`,
            orderId: orderId,
            ipAddr: ipAddr
        };
        return this.vnpayService.createUrl(paymentData);
    }

    async getPaymentByOrderId(orderId: string): Promise<Payment | null> {
        return this.paymentRepository.getPaymentByOrderId(parseInt(orderId));
    }

    async getAllPayments(): Promise<Payment[]> {
        return this.paymentRepository.getAllPayments();
    }

    private async handleSuccessfulPayment(orderId: string, payment: Payment): Promise<void> {
        if (payment.status === 'Completed') return;

        await this.paymentRepository.updatePaymentStatus(payment.id, 'Completed');
        const order = await this.orderRepository.getOrderById(orderId);

        if (!order) {
            throw new AppError('Order not found', 404);
        }

        for (const detail of order.details) {
            await this.productService.updateProductStock(
                detail.productId!,
                detail.variantId,
                -detail.quantity
            );
        }
    }

    async verifyPayment(vnpParams: VerifyIpnCall): Promise<boolean> {
        const isValid = this.vnpayService.verifyIPN(vnpParams);
        if (isValid) {
            const orderId = vnpParams['vnp_TxnRef'];
            const responseCode = vnpParams['vnp_ResponseCode'];

            const payment = await this.paymentRepository.getPaymentByOrderId(parseInt(orderId));
            if (!payment) {
                throw new AppError('Payment record not found', 404);
            }

            if (responseCode === '00') {
                await this.handleSuccessfulPayment(orderId, payment);
                return true;
            } else {
                await this.paymentRepository.updatePaymentStatus(payment.id, 'Failed');
            }
        }
        return false;
    }

    async verifyIPN(query: VerifyIpnCall): Promise<VerifyReturnUrl> {
        try {
            console.log('VerifyIpnCall');
            const verify = this.vnpayService.verifyIPN(query);

            if (verify && verify.isVerified && verify.isSuccess) {
                const orderId = query['vnp_TxnRef'];
                const payment = await this.paymentRepository.getPaymentByOrderId(parseInt(orderId));
                if (payment) {
                    await this.handleSuccessfulPayment(orderId, payment);
                }
            }
            return verify;
        } catch (e) {
            throw new AppError('Error Internal Server', 500);
        }
    }
} 