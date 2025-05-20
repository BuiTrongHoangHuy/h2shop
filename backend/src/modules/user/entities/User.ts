interface UserProps {
  id?: number | null;
  fullName?: string;
  phone?: string;
  gender?: 'male' | 'female' | 'other';
  role?: 'admin' | 'user';
  avatar?: any | null;
  address?: string;
  status?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

class User {
  id: number | null;
  fullName: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  role: 'admin' | 'user';
  avatar: any | null;
  address: string;
  status: number;
  createdAt: Date;
  updatedAt: Date;

  constructor({
    id = null,
    fullName = '',
    phone = '',
    gender = 'other',
    role = 'user',
    avatar = null,
    address = '',
    status = 1,
    createdAt = new Date(),
    updatedAt = new Date()
  }: UserProps = {}) {
    this.id = id;
    this.fullName = fullName;
    this.phone = phone;
    this.gender = gender;
    this.role = role;
    this.avatar = avatar;
    this.address = address;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Validate user data
  validate(): boolean {
    if (!this.fullName) {
      throw new Error('Full name is required');
    }
    
    if (this.phone && !/^\d{10,15}$/.test(this.phone)) {
      throw new Error('Phone number is invalid');
    }
    
    if (!['male', 'female', 'other'].includes(this.gender)) {
      throw new Error('Gender must be male, female, or other');
    }
    
    if (!['admin', 'user'].includes(this.role)) {
      throw new Error('Role must be admin or user');
    }
    
    return true;
  }
}

export default User;