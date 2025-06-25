import { injectable } from 'inversify';

export interface Payment {
    id: number;
    orderId: number;
    userId: number;
    amount: number;
    paymentMethod: string;
    status: 'Pending' | 'Completed' | 'Failed';
    createdAt: Date;
    updatedAt: Date;
}

export interface IPaymentRepository {
    createPayment(payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Payment>;
    updatePaymentStatus(id: number, status: 'Pending' | 'Completed' | 'Failed'): Promise<void>;
    getPaymentByOrderId(orderId: number): Promise<Payment | null>;
    getAllPayments(): Promise<Payment[]>;
} 