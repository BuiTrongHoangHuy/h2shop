import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../types';
import { PaymentService } from '../services/PaymentService';
import { IPaymentService } from "../services/IPaymentService";
import { IpnFailChecksum, IpnSuccess, IpnUnknownError, VerifyIpnCall } from "vnpay";

@injectable()
export class PaymentController {
    constructor(
        @inject(TYPES.IPaymentService) private paymentService: IPaymentService
    ) { }

    async createPaymentUrl(req: Request, res: Response) {
        try {
            const { orderId, amount } = req.body;
            const ipAddr = req.ip || req.socket.remoteAddress || '127.0.0.1';

            const paymentUrl = await this.paymentService.createPaymentUrl(orderId, amount, ipAddr);
            res.json({ status: 'success', data: { paymentUrl } });
        } catch (error) {
            console.error('Error creating payment URL:', error);
            res.status(400).json({ status: 'error', message: 'Failed to create payment URL' });
        }
    }

    async getPaymentByOrderId(req: Request, res: Response) {
        try {
            const { orderId } = req.params;
            const payment = await this.paymentService.getPaymentByOrderId(orderId);
            if (!payment) {
                return res.status(404).json({ status: 'error', message: 'Payment not found' });
            }
            res.json({ status: 'success', data: payment });
        } catch (error) {
            console.error('Error getting payment:', error);
            res.status(400).json({ status: 'error', message: 'Failed to get payment' });
        }
    }

    async getAllPayments(req: Request, res: Response) {
        try {
            const payments = await this.paymentService.getAllPayments();
            res.json({ status: 'success', data: payments });
        } catch (error) {
            console.error('Error getting all payments:', error);
            res.status(400).json({ status: 'error', message: 'Failed to get payments' });
        }
    }

    async handleVNPayReturn(req: Request, res: Response) {
        try {
            const isValid = await this.paymentService.verifyPayment(req.query as unknown as VerifyIpnCall);
            const orderId = req.query.vnp_TxnRef as string;

            if (isValid) {
                res.redirect(`${process.env.FRONTEND_URL}/payment/success?vnp_TxnRef=${orderId}`);
            } else {
                const errorCode = req.query.vnp_ResponseCode;
                const errorMessage = req.query.vnp_Message;
                res.redirect(
                    `${process.env.FRONTEND_URL}/payment/failure?vnp_TxnRef=${orderId}&vnp_ResponseCode=${errorCode}&vnp_Message=${errorMessage}`
                );
            }
        } catch (error) {
            console.error('Error handling VNPay return:', error);
            res.redirect(`${process.env.FRONTEND_URL}/payment/failure`);
        }
    }

    async handleVNPayIPN(req: Request, res: Response) {
        try {
            const verify = await this.paymentService.verifyIPN(req.query as unknown as VerifyIpnCall);
            if (!verify.isVerified) {
                return res.json(IpnFailChecksum);
            }
            return res.json(IpnSuccess);

        } catch (error) {
            console.error('Error handling VNPay IPN:', error);
            return res.json(IpnUnknownError);
        }
    }
} 