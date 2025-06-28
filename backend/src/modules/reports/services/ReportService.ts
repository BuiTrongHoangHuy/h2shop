import { injectable, inject } from 'inversify';
import Report from '../entities/Report';
import { IReportRepository, ReportFilters, PaginatedReports } from '../repositories/IReportRepository';
import { IReportService } from './IReportService';
import { TYPES } from '../../../types';

@injectable()
export class ReportService implements IReportService {
  constructor(
    @inject(TYPES.IReportRepository) private reportRepository: IReportRepository
  ) {}

  async createReport(report: Report): Promise<Report> {
    // Validate report data
    if (!report.title || !report.reportType) {
      throw new Error('Report title and type are required');
    }

    // Set generated timestamp
    report.generatedAt = new Date();
    
    return await this.reportRepository.create(report);
  }

  async getReportById(id: string): Promise<Report> {
    const report = await this.reportRepository.findById(id);
    if (!report) {
      throw new Error('Report not found');
    }
    return report;
  }

  async getAllReports(filters?: ReportFilters): Promise<PaginatedReports> {
    return await this.reportRepository.findAll(filters);
  }

  async getReportsByType(reportType: string): Promise<Report[]> {
    return await this.reportRepository.findByType(reportType);
  }

  async updateReport(id: string, data: Partial<Report>): Promise<Report> {
    const existingReport = await this.reportRepository.findById(id);
    if (!existingReport) {
      throw new Error('Report not found');
    }

    return await this.reportRepository.update(id, data);
  }

  async deleteReport(id: string): Promise<void> {
    const existingReport = await this.reportRepository.findById(id);
    if (!existingReport) {
      throw new Error('Report not found');
    }

    await this.reportRepository.delete(id);
  }

  async generateSalesReport(filters?: { startDate?: Date; endDate?: Date; categoryId?: string }): Promise<Report> {
    const report = await this.reportRepository.generateSalesReport(filters);
    
    return await this.reportRepository.create(report);
  }

  async generateUserReport(filters?: { startDate?: Date; endDate?: Date }): Promise<Report> {
    const report = await this.reportRepository.generateUserReport(filters);
    
    return await this.reportRepository.create(report);
  }

  async generateProductReport(filters?: { categoryId?: string; lowStock?: boolean }): Promise<Report> {
    const report = await this.reportRepository.generateProductReport(filters);
    
    return await this.reportRepository.create(report);
  }

  async generateOrderReport(filters?: { startDate?: Date; endDate?: Date; status?: string }): Promise<Report> {
    const report = await this.reportRepository.generateOrderReport(filters);
    
    return await this.reportRepository.create(report);
  }

  async generateRevenueReport(filters?: { startDate?: Date; endDate?: Date; categoryId?: string }): Promise<Report> {
    const report = await this.reportRepository.generateRevenueReport(filters);
    
    return await this.reportRepository.create(report);
  }

  async generateInventoryReport(filters?: { categoryId?: string; lowStock?: boolean }): Promise<Report> {
    const report = await this.reportRepository.generateInventoryReport(filters);
    
    return await this.reportRepository.create(report);
  }

  async generateFinancialReport(filters?: { startDate?: Date; endDate?: Date; categoryId?: string }): Promise<Report> {
    const report = await this.reportRepository.generateFinancialReport(filters);
    
    return await this.reportRepository.create(report);
  }

  async generateReviewReport(filters?: { startDate?: Date; endDate?: Date; categoryId?: string; productId?: string }): Promise<Report> {
    const report = await this.reportRepository.generateReviewReport(filters);
    
    return await this.reportRepository.create(report);
  }

  async getDashboardStats(): Promise<{
    totalSales: number;
    totalOrders: number;
    totalUsers: number;
    totalProducts: number;
    recentOrders: any[];
    topProducts: any[];
    lowStockAlerts: any[];
  }> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const salesReport = await this.reportRepository.generateSalesReport({
      startDate: startOfMonth
    });

    const userReport = await this.reportRepository.generateUserReport();
    const productReport = await this.reportRepository.generateProductReport();
    const inventoryReport = await this.reportRepository.generateInventoryReport();

    const orderReport = await this.reportRepository.generateOrderReport({
      startDate: startOfMonth
    });

    return {
      totalSales: (salesReport.data as any).totalSales || 0,
      totalOrders: (salesReport.data as any).totalOrders || 0,
      totalUsers: (userReport.data as any).totalUsers || 0,
      totalProducts: (productReport.data as any).totalProducts || 0,
      recentOrders: (orderReport.data as any).ordersByDate?.slice(0, 10) || [],
      topProducts: (salesReport.data as any).topProducts?.slice(0, 5) || [],
      lowStockAlerts: (inventoryReport.data as any).lowStockAlerts?.slice(0, 5) || []
    };
  }

  async exportReport(id: string, format: 'pdf' | 'excel' | 'csv'): Promise<Buffer> {
    const report = await this.getReportById(id);

    const reportData = {
      ...report.toResponse(),
      exportedAt: new Date().toISOString(),
      format
    };

    return Buffer.from(JSON.stringify(reportData, null, 2));
  }
}
