export interface Payment {
  id: number
  order_id: number
  amount: number
  payment_method: 'credit card' | 'bank transfer' | 'cash on delivery'
  status: 'pending' | 'completed' | 'failed'
  created_at: string
  updated_at: string
}
