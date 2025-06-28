import Report from '../entities/Report';

export interface ReportFilters {
  reportType?: 'Sales' | 'Users' | 'Products' | 'Orders' | 'Revenue' | 'Inventory' | 'Financial' | 'Reviews';
  startDate?: Date;
  endDate?: Date;
  generatedBy?: string;
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedReports {
  reports: Report[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IReportRepository {
  create(report: Report): Promise<Report>;
  findById(id: string): Promise<Report | null>;
  findAll(filters?: ReportFilters): Promise<PaginatedReports>;
  findByType(reportType: string): Promise<Report[]>;
  update(id: string, data: Partial<Report>): Promise<Report>;
  delete(id: string): Promise<void>;
  
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
}
