import  axiosInstance  from './axiosInstance';

export interface ReportFilters {
  reportType?: 'Sales' | 'Users' | 'Products' | 'Orders' | 'Revenue' | 'Inventory' | 'Financial' | 'Reviews';
  startDate?: Date;
  endDate?: Date;
  generatedBy?: string;
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedReportsResponse {
  reports: Report[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface SalesReportData {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  topProducts: Array<{
    productId: string;
    productName: string;
    quantity: number;
    revenue: number;
  }>;
  salesByDate: Array<{
    date: string;
    sales: number;
    orders: number;
  }>;
  salesByCategory: Array<{
    categoryId: string;
    categoryName: string;
    sales: number;
    orders: number;
  }>;
}

export interface UserReportData {
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  usersByGender: Array<{
    gender: string;
    count: number;
  }>;
  usersByMonth: Array<{
    month: string;
    newUsers: number;
    totalUsers: number;
  }>;
  topCustomers: Array<{
    userId: string;
    userName: string;
    totalOrders: number;
    totalSpent: number;
  }>;
}

export interface ProductReportData {
  totalProducts: number;
  totalVariants: number;
  lowStockProducts: Array<{
    productId: string;
    productName: string;
    currentStock: number;
    minStock: number;
  }>;
  topSellingProducts: Array<{
    productId: string;
    productName: string;
    categoryName: string;
    totalSold: number;
    revenue: number;
  }>;
  productsByCategory: Array<{
    categoryId: string;
    categoryName: string;
    productCount: number;
    totalStock: number;
  }>;
}

export interface OrderReportData {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  averageOrderValue: number;
  ordersByStatus: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  ordersByDate: Array<{
    date: string;
    orders: number;
    revenue: number;
  }>;
  topOrderSources: Array<{
    source: string;
    orders: number;
    revenue: number;
  }>;
}

export interface RevenueReportData {
  totalRevenue: number;
  revenueGrowth: number;
  averageOrderValue: number;
  revenueByDate: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
  revenueByCategory: Array<{
    categoryId: string;
    categoryName: string;
    revenue: number;
    percentage: number;
  }>;
  revenueByPaymentMethod: Array<{
    paymentMethod: string;
    revenue: number;
    orders: number;
  }>;
}

export interface InventoryReportData {
  totalProducts: number;
  totalStock: number;
  lowStockItems: number;
  outOfStockItems: number;
  inventoryValue: number;
  stockByCategory: Array<{
    categoryId: string;
    categoryName: string;
    productCount: number;
    totalStock: number;
    inventoryValue: number;
  }>;
  lowStockAlerts: Array<{
    productId: string;
    productName: string;
    variantId: string;
    currentStock: number;
    minStock: number;
  }>;
  stockMovements: Array<{
    productId: string;
    productName: string;
    movementType: 'in' | 'out';
    quantity: number;
    date: string;
  }>;
}

export interface FinancialReportData {
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  profitMargin: number;
  revenueByDate: Array<{
    date: string;
    revenue: number;
    cost: number;
    profit: number;
  }>;
  profitByCategory: Array<{
    categoryId: string;
    categoryName: string;
    revenue: number;
    cost: number;
    profit: number;
    margin: number;
  }>;
  costBreakdown: Array<{
    costType: string;
    amount: number;
    percentage: number;
  }>;
  profitTrends: Array<{
    period: string;
    revenue: number;
    cost: number;
    profit: number;
    margin: number;
  }>;
}

export interface ReviewReportData {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: Array<{
    rating: number;
    count: number;
    percentage: number;
  }>;
  reviewsByProduct: Array<{
    productId: string;
    productName: string;
    totalReviews: number;
    averageRating: number;
    ratingDistribution: Array<{
      rating: number;
      count: number;
    }>;
  }>;
  reviewsByCategory: Array<{
    categoryId: string;
    categoryName: string;
    totalReviews: number;
    averageRating: number;
  }>;
  recentReviews: Array<{
    reviewId: string;
    productName: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
  }>;
  topRatedProducts: Array<{
    productId: string;
    productName: string;
    averageRating: number;
    totalReviews: number;
  }>;
}

export interface Report {
  id: string;
  reportType: 'Sales' | 'Users' | 'Products' | 'Orders' | 'Revenue' | 'Inventory' | 'Financial' | 'Reviews';
  title: string;
  description?: string;
  data: SalesReportData | UserReportData | ProductReportData | OrderReportData | RevenueReportData | InventoryReportData | FinancialReportData | ReviewReportData;
  filters?: {
    startDate?: Date;
    endDate?: Date;
    categoryId?: string;
    userId?: string;
    status?: string;
  };
  generatedAt?: Date;
  generatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  recentOrders: any[];
  topProducts: any[];
  lowStockAlerts: any[];
}

class ReportApi {
  // Get all reports with optional filters
  async getAllReports(filters?: ReportFilters): Promise<{ data: PaginatedReportsResponse }> {
    const params = new URLSearchParams();
    if (filters?.reportType) params.append('reportType', filters.reportType);
    if (filters?.startDate) params.append('startDate', filters.startDate.toISOString());
    if (filters?.endDate) params.append('endDate', filters.endDate.toISOString());
    if (filters?.generatedBy) params.append('generatedBy', filters.generatedBy);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.search) params.append('search', filters.search);

    const response = await axiosInstance.get(`/reports?${params.toString()}`);
    return response.data;
  }

  // Get dashboard statistics
  async getDashboardStats() {
    const response = await axiosInstance.get('/reports/dashboard');
    return response.data;
  }

  // Get reports by type
  async getReportsByType(type: string) {
    const response = await axiosInstance.get(`/reports/type/${type}`);
    return response.data;
  }

  // Get report by ID
  async getReportById(id: string) {
    const response = await axiosInstance.get(`/reports/${id}`);
    return response.data;
  }

  // Create a new report
  async createReport(report: Partial<Report>) {
    const response = await axiosInstance.post('/reports', report);
    return response.data;
  }

  // Update a report
  async updateReport(id: string, data: Partial<Report>) {
    const response = await axiosInstance.put(`/reports/${id}`, data);
    return response.data;
  }

  // Delete a report
  async deleteReport(id: string) {
    const response = await axiosInstance.delete(`/reports/${id}`);
    return response.data;
  }

  // Generate sales report
  async generateSalesReport(filters?: { startDate?: Date; endDate?: Date; categoryId?: string }) {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate.toISOString());
    if (filters?.endDate) params.append('endDate', filters.endDate.toISOString());
    if (filters?.categoryId) params.append('categoryId', filters.categoryId);

    const response = await axiosInstance.post(`/reports/generate/sales?${params.toString()}`);
    return response.data;
  }

  // Generate user report
  async generateUserReport(filters?: { startDate?: Date; endDate?: Date }) {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate.toISOString());
    if (filters?.endDate) params.append('endDate', filters.endDate.toISOString());

    const response = await axiosInstance.post(`/reports/generate/users?${params.toString()}`);
    return response.data;
  }

  // Generate product report
  async generateProductReport(filters?: { categoryId?: string; lowStock?: boolean }) {
    const params = new URLSearchParams();
    if (filters?.categoryId) params.append('categoryId', filters.categoryId);
    if (filters?.lowStock) params.append('lowStock', filters.lowStock.toString());

    const response = await axiosInstance.post(`/reports/generate/products?${params.toString()}`);
    return response.data;
  }

  // Generate order report
  async generateOrderReport(filters?: { startDate?: Date; endDate?: Date; status?: string }) {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate.toISOString());
    if (filters?.endDate) params.append('endDate', filters.endDate.toISOString());
    if (filters?.status) params.append('status', filters.status);

    const response = await axiosInstance.post(`/reports/generate/orders?${params.toString()}`);
    return response.data;
  }

  // Generate revenue report
  async generateRevenueReport(filters?: { startDate?: Date; endDate?: Date; categoryId?: string }) {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate.toISOString());
    if (filters?.endDate) params.append('endDate', filters.endDate.toISOString());
    if (filters?.categoryId) params.append('categoryId', filters.categoryId);

    const response = await axiosInstance.post(`/reports/generate/revenue?${params.toString()}`);
    return response.data;
  }

  // Generate inventory report
  async generateInventoryReport(filters?: { categoryId?: string; lowStock?: boolean }) {
    const params = new URLSearchParams();
    if (filters?.categoryId) params.append('categoryId', filters.categoryId);
    if (filters?.lowStock) params.append('lowStock', filters.lowStock.toString());

    const response = await axiosInstance.post(`/reports/generate/inventory?${params.toString()}`);
    return response.data;
  }

  // Generate financial report
  async generateFinancialReport(filters?: { startDate?: Date; endDate?: Date; categoryId?: string }) {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate.toISOString());
    if (filters?.endDate) params.append('endDate', filters.endDate.toISOString());
    if (filters?.categoryId) params.append('categoryId', filters.categoryId);

    const response = await axiosInstance.post(`/reports/generate/financial?${params.toString()}`);
    return response.data;
  }

  // Generate review report
  async generateReviewReport(filters?: { startDate?: Date; endDate?: Date; categoryId?: string; productId?: string }) {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate.toISOString());
    if (filters?.endDate) params.append('endDate', filters.endDate.toISOString());
    if (filters?.categoryId) params.append('categoryId', filters.categoryId);
    if (filters?.productId) params.append('productId', filters.productId);

    const response = await axiosInstance.post(`/reports/generate/reviews?${params.toString()}`);
    return response.data;
  }

  // Export report
  async exportReport(id: string, format: 'pdf' | 'excel' | 'csv') {
    const response = await axiosInstance.get(`/reports/${id}/export?format=${format}`, {
      responseType: 'blob'
    });
    return response.data;
  }
}

export const reportApi = new ReportApi(); 