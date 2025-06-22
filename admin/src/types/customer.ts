export interface Customer {
  id: number;
  full_name: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  role: 'admin' | 'user';
  avatar: any; // hoặc dùng Record<string, any> hoặc một interface cụ thể nếu biết cấu trúc JSON
  address: string;
  status: number;
  created_at: string; // hoặc Date nếu bạn chuyển đổi về object Date
  updated_at: string; // hoặc Date nếu bạn chuyển đổi về object Date
}