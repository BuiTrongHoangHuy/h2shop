import Auth from '../entities/Auth';

/**
 * Interface for Auth Repository
 */
export interface IAuthRepository {

  findByUserId(userId: number): Promise<Auth | null>;

  findByEmail(email: string): Promise<Auth | null>;

  create(auth: Auth): Promise<Auth>;

  update(auth: Auth): Promise<Auth>;

  delete(userId: number): Promise<boolean>;

  verifyPassword(email: string, password: string): Promise<Auth | null>;
}
