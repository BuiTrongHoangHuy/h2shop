import Report from '../entities/Report';
import { ReportFilters, PaginatedReports } from '../repositories/IReportRepository';

export interface IReportService {
  createReport(report: Report): Promise<Report>;
  getReportById(id: string): Promise<Report>;
  getAllReports(filters?: ReportFilters): Promise<PaginatedReports>;
  getReportsByType(reportType: string): Promise<Report[]>;
  updateReport(id: string, data: Partial<Report>): Promise<Report>;
  deleteReport(id: string): Promise<void>;
  
  // Report generation methods
  generateSalesReport(filters?: {
    startDate?: Date;
    endDate?: Date;
    categoryId?: string;
  }): Promise<Report>;

  generateUserReport(filters?: {
    startDate?: Date;
    endDate?: Date;
  }): Promise<Report>;
  
  generateProductReport(filters?: {
    categoryId?: string;
    lowStock?: boolean;
  }): Promise<Report>;

  generateOrderReport(filters?: {
    startDate?: Date;
    endDate?: Date;
    status?: string;
  }): Promise<Report>;

  generateRevenueReport(filters?: {
    startDate?: Date;
    endDate?: Date;
    categoryId?: string;
  }): Promise<Report>;

  generateInventoryReport(filters?: {
    categoryId?: string;
    lowStock?: boolean;
  }): Promise<Report>;

  generateFinancialReport(filters?: {
    startDate?: Date;
    endDate?: Date;
    categoryId?: string;
  }): Promise<Report>;

  generateReviewReport(filters?: {
    startDate?: Date;
    endDate?: Date;
    categoryId?: string;
    productId?: string;
  }): Promise<Report>;
  
  // Dashboard methods
  getDashboardStats(): Promise<{
    totalSales: number;
    totalOrders: number;
    totalUsers: number;
    totalProducts: number;
    recentOrders: any[];
    topProducts: any[];
    lowStockAlerts: any[];
  }>;
  
  exportReport(id: string, format: 'pdf' | 'excel' | 'csv'): Promise<Buffer>;
}
