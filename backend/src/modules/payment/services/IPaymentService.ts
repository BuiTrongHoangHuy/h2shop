import { VerifyIpnCall, VerifyReturnUrl } from "vnpay";
import { Payment } from "../repositories/IPaymentRepository";

export interface IPaymentService {

    createPaymentUrl(orderId: string, amount: number, ipAddr: string): Promise<string>
    verifyPayment(vnpParams: VerifyIpnCall): Promise<boolean>

    verifyIPN(query: VerifyIpnCall): Promise<VerifyReturnUrl>

    getPaymentByOrderId(orderId: string): Promise<Payment | null>

    getAllPayments(): Promise<Payment[]>

}