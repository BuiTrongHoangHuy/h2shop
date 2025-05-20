
import User from '../entities/User';

export interface IUserRepository {

  findById(id: number): Promise<User | null>;

  findByPhone(phone: string): Promise<User | null>;

  create(user: User): Promise<User>;

  update(user: User): Promise<User>;

  delete(id: number): Promise<boolean>;

  findAll(page?: number, limit?: number): Promise<{
    users: User[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }>;
}
