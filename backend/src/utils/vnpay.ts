import crypto from 'crypto';
import moment from 'moment';
import {dateFormat, HashAlgorithm, ProductCode, VerifyIpnCall, VNPay, VnpLocale} from "vnpay";

export interface VNPayConfig {
    vnp_TmnCode: string;
    vnp_HashSecret: string;
    vnp_Url: string;
    vnp_ReturnUrl: string;
    testMode: boolean;
    hashAlgorithm: string;
}

export interface VNPayPaymentData {
    amount: number;
    orderInfo: string;
    orderId: string;
    locale?: string;
    ipAddr?: string;
}

const vnpay = new VNPay({
    tmnCode: process.env.VNP_TMN_CODE ||"",
    secureSecret:  process.env.VNP_HASH_SECRET||'',
    vnpayHost: 'https://sandbox.vnpayment.vn',
    queryDrAndRefundHost: 'https://sandbox.vnpayment.vn',

    testMode: true,
    hashAlgorithm: HashAlgorithm.SHA512,
    enableLog: true,
    endpoints: {
        paymentEndpoint: 'paymentv2/vpcpay.html',
        queryDrRefundEndpoint: 'merchant_webapi/api/transaction',
        getBankListEndpoint: 'qrpayauth/api/merchant/get_bank_list',
    },
});

export class VNPayService {
    private config: VNPayConfig;

    constructor(config: VNPayConfig) {
        this.config = config;
    }

    createUrl(data: VNPayPaymentData): string {
        const date = new Date();
        const createDate = moment(date).format('YYYYMMDDHHmmss');

        //const orderId = moment(date).format('HHmmss') + data.orderId;
        const orderId = data.orderId;
        const amount = data.amount;

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return vnpay.buildPaymentUrl({
            vnp_Amount: amount,
            vnp_IpAddr: '127.0.0.1',
            vnp_TxnRef: orderId,
            vnp_OrderInfo: data.orderInfo,
            vnp_OrderType: ProductCode.Other,
            vnp_ReturnUrl: process.env.VNP_RETURN_URL || '',
            vnp_Locale: VnpLocale.VN,
            vnp_CreateDate: dateFormat(new Date()),
            vnp_ExpireDate: dateFormat(tomorrow),

        });
    }

    verifyReturnUrl(vnpParams: Record<string, string>): boolean {
        const secureHash = vnpParams['vnp_SecureHash'];
        delete vnpParams['vnp_SecureHash'];
        delete vnpParams['vnp_SecureHashType'];
        const sortedParams = this.sortObject(vnpParams);
        const signData = this.createSignData(sortedParams);
        const checkSum = this.createSecureHash(signData);

        return secureHash === checkSum;
    }

    verifyIPN(query : VerifyIpnCall): VerifyIpnCall {
        return vnpay.verifyIpnCall(query)
    }

    private sortObject(obj: Record<string, string>): Record<string, string> {
        return Object.keys(obj)
            .sort()
            .reduce((result: Record<string, string>, key: string) => {
                result[key] = obj[key];
                return result;
            }, {});
    }

    private createSignData(params: Record<string, string>): string {
        return Object.entries(params)
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join('&');
    }

    private createSecureHash(signData: string): string {
        return crypto
            .createHmac('sha512', this.config.vnp_HashSecret)
            .update(signData)
            .digest('hex');
    }

    private createPaymentUrlWithParams(params: Record<string, string>): string {
        const queryString = Object.entries(params)
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join('&');
        return `${this.config.vnp_Url}?${queryString}`;
    }
}
