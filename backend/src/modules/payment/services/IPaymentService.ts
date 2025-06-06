import {VerifyIpnCall, VerifyReturnUrl} from "vnpay";

export interface IPaymentService {

    createPaymentUrl(orderId: string, amount: number, ipAddr: string): Promise<string>
    verifyPayment(vnpParams: VerifyIpnCall): Promise<boolean>

    verifyIPN(query : VerifyIpnCall): Promise<VerifyReturnUrl >

}