import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../types';
import { IReportService } from '../services/IReportService';
import Report from '../entities/Report';

@injectable()
export class ReportController {
  constructor(
    @inject(TYPES.IReportService) private reportService: IReportService
  ) {}

  // Get all reports with optional filters
  async getAllReports(req: Request, res: Response): Promise<void> {
    try {
      const { reportType, startDate, endDate, generatedBy, page, limit, search } = req.query;
      
      const filters: any = {};
      if (reportType) filters.reportType = reportType;
      if (startDate) filters.startDate = new Date(startDate as string);
      if (endDate) filters.endDate = new Date(endDate as string);
      if (generatedBy) filters.generatedBy = generatedBy;
      if (page) filters.page = parseInt(page as string);
      if (limit) filters.limit = parseInt(limit as string);
      if (search) filters.search = search as string;

      const paginatedReports = await this.reportService.getAllReports(filters);
      res.status(200).json({
        success: true,
        data: {
          reports: paginatedReports.reports.map(report => report.toResponse()),
          pagination: {
            total: paginatedReports.total,
            page: paginatedReports.page,
            limit: paginatedReports.limit,
            totalPages: paginatedReports.totalPages
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch reports',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get report by ID
  async getReportById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const report = await this.reportService.getReportById(id);
      
      res.status(200).json({
        success: true,
        data: report.toResponse()
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: 'Report not found',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get reports by type
  async getReportsByType(req: Request, res: Response): Promise<void> {
    try {
      const { type } = req.params;
      const reports = await this.reportService.getReportsByType(type);
      
      res.status(200).json({
        success: true,
        data: reports.map(report => report.toResponse())
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch reports by type',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Create a new report
  async createReport(req: Request, res: Response): Promise<void> {
    try {
      const reportData = req.body;
      const report = new Report(reportData);
      const createdReport = await this.reportService.createReport(report);
      
      res.status(201).json({
        success: true,
        data: createdReport.toResponse()
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Failed to create report',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Update a report
  async updateReport(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const updatedReport = await this.reportService.updateReport(id, updateData);
      
      res.status(200).json({
        success: true,
        data: updatedReport.toResponse()
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Failed to update report',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Delete a report
  async deleteReport(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.reportService.deleteReport(id);
      
      res.status(200).json({
        success: true,
        message: 'Report deleted successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Failed to delete report',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Generate sales report
  async generateSalesReport(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate, categoryId } = req.query;
      
      const filters: any = {};
      if (startDate) filters.startDate = new Date(startDate as string);
      if (endDate) filters.endDate = new Date(endDate as string);
      if (categoryId) filters.categoryId = categoryId;

      const report = await this.reportService.generateSalesReport(filters);
      
      res.status(200).json({
        success: true,
        data: report.toResponse()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to generate sales report',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Generate user report
  async generateUserReport(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = req.query;
      
      const filters: any = {};
      if (startDate) filters.startDate = new Date(startDate as string);
      if (endDate) filters.endDate = new Date(endDate as string);

      const report = await this.reportService.generateUserReport(filters);
      
      res.status(200).json({
        success: true,
        data: report.toResponse()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to generate user report',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Generate product report
  async generateProductReport(req: Request, res: Response): Promise<void> {
    try {
      const { categoryId, lowStock } = req.query;
      
      const filters: any = {};
      if (categoryId) filters.categoryId = categoryId;
      if (lowStock) filters.lowStock = lowStock === 'true';

      const report = await this.reportService.generateProductReport(filters);
      
      res.status(200).json({
        success: true,
        data: report.toResponse()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to generate product report',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Generate order report
  async generateOrderReport(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate, status } = req.query;
      
      const filters: any = {};
      if (startDate) filters.startDate = new Date(startDate as string);
      if (endDate) filters.endDate = new Date(endDate as string);
      if (status) filters.status = status;

      const report = await this.reportService.generateOrderReport(filters);
      
      res.status(200).json({
        success: true,
        data: report.toResponse()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to generate order report',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Generate revenue report
  async generateRevenueReport(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate, categoryId } = req.query;
      
      const filters: any = {};
      if (startDate) filters.startDate = new Date(startDate as string);
      if (endDate) filters.endDate = new Date(endDate as string);
      if (categoryId) filters.categoryId = categoryId;

      const report = await this.reportService.generateRevenueReport(filters);
      
      res.status(200).json({
        success: true,
        data: report.toResponse()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to generate revenue report',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Generate inventory report
  async generateInventoryReport(req: Request, res: Response): Promise<void> {
    try {
      const { categoryId, lowStock } = req.query;
      
      const filters: any = {};
      if (categoryId) filters.categoryId = categoryId;
      if (lowStock) filters.lowStock = lowStock === 'true';

      const report = await this.reportService.generateInventoryReport(filters);
      
      res.status(200).json({
        success: true,
        data: report.toResponse()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to generate inventory report',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Generate financial report
  async generateFinancialReport(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate, categoryId } = req.query;
      
      const filters: any = {};
      if (startDate) filters.startDate = new Date(startDate as string);
      if (endDate) filters.endDate = new Date(endDate as string);
      if (categoryId) filters.categoryId = categoryId;

      const report = await this.reportService.generateFinancialReport(filters);
      
      res.status(200).json({
        success: true,
        data: report.toResponse()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to generate financial report',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Generate review report
  async generateReviewReport(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate, categoryId, productId } = req.query;
      
      const filters: any = {};
      if (startDate) filters.startDate = new Date(startDate as string);
      if (endDate) filters.endDate = new Date(endDate as string);
      if (categoryId) filters.categoryId = categoryId;
      if (productId) filters.productId = productId;

      const report = await this.reportService.generateReviewReport(filters);
      
      res.status(200).json({
        success: true,
        data: report.toResponse()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to generate review report',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get dashboard statistics
  async getDashboardStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.reportService.getDashboardStats();
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch dashboard stats',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Export report
  async exportReport(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { format = 'pdf' } = req.query;
      
      const buffer = await this.reportService.exportReport(id, format as 'pdf' | 'excel' | 'csv');
      
      const contentType = {
        pdf: 'application/pdf',
        excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        csv: 'text/csv'
      }[format as string] || 'application/octet-stream';

      const filename = `report-${id}.${format}`;
      
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(buffer);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to export report',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
