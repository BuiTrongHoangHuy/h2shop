export interface Order {
  id: number
  user_id: number
  total_price: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  created_at: string // hoặc Date nếu bạn đã parse
  updated_at: string
}