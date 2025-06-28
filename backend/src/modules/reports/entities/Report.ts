export interface ReportProps {
  id?: string;
  reportType: 'Sales' | 'Users' | 'Products' | 'Orders' | 'Revenue' | 'Inventory' | 'Financial' | 'Reviews';
  title: string;
  description?: string;
  data: any;
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

class Report {
  id?: string;
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

  constructor({
    id,
    reportType,
    title,
    description,
    data,
    filters,
    generatedAt,
    generatedBy,
    createdAt,
    updatedAt
  }: ReportProps) {
    this.id = id;
    this.reportType = reportType;
    this.title = title;
    this.description = description;
    this.data = data;
    this.filters = filters;
    this.generatedAt = generatedAt || new Date();
    this.generatedBy = generatedBy;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toResponse() {
    return {
      id: this.id,
      reportType: this.reportType,
      title: this.title,
      description: this.description,
      data: this.data,
      filters: this.filters,
      generatedAt: this.generatedAt,
      generatedBy: this.generatedBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

export default Report;
