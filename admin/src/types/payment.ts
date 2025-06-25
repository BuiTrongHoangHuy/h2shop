export interface Payment {
  id: number
  order_id: number
  amount: number
  payment_method: string;
  status: string;
  created_at: string
  updated_at: string
}
