'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, Download, BarChart3, TrendingUp, Users, Package, ShoppingCart } from 'lucide-react';
import { Report } from '@/services/api/reportApi';
import { format } from 'date-fns';

interface ReportViewerProps {
  report: Report | null;
  onClose: () => void;
  onExport: (id: string, format: 'pdf' | 'excel' | 'csv') => void;
}

export default function ReportViewer({ report, onClose, onExport }: ReportViewerProps) {
  const [isExporting, setIsExporting] = useState(false);

  if (!report) return null;

  const handleExport = async (format: 'pdf' | 'excel' | 'csv') => {
    setIsExporting(true);
    try {
      await onExport(report.id, format);
    } finally {
      setIsExporting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
  };
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const renderSalesReport = (data: any) => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.totalSales)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.totalOrders)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.averageOrderValue)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Quantity Sold</TableHead>
                <TableHead>Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.topProducts?.slice(0, 10).map((product: any, index: number) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{product.productName}</TableCell>
                  <TableCell>{formatNumber(product.quantity)}</TableCell>
                  <TableCell>{formatCurrency(product.revenue)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Sales by Category */}
      <Card>
        <CardHeader>
          <CardTitle>Sales by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead>Orders</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.salesByCategory?.map((category: any, index: number) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{category.categoryName}</TableCell>
                  <TableCell>{formatCurrency(category.sales)}</TableCell>
                  <TableCell>{formatNumber(category.orders)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderUserReport = (data: any) => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.totalUsers)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">New Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.newUsers)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.activeUsers)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Users by Gender */}
      <Card>
        <CardHeader>
          <CardTitle>Users by Gender</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gender</TableHead>
                <TableHead>Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.usersByGender?.map((item: any, index: number) => (
                <TableRow key={index}>
                  <TableCell className="font-medium capitalize">{item.gender}</TableCell>
                  <TableCell>{formatNumber(item.count)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Top Customers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Total Orders</TableHead>
                <TableHead>Total Spent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.topCustomers?.slice(0, 10).map((customer: any, index: number) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{customer.userName}</TableCell>
                  <TableCell>{formatNumber(customer.totalOrders)}</TableCell>
                  <TableCell>{formatCurrency(customer.totalSpent)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderProductReport = (data: any) => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.totalProducts)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Variants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.totalVariants)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Products */}
      <Card>
        <CardHeader>
          <CardTitle>Low Stock Products</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Min Stock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.lowStockProducts?.map((product: any, index: number) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{product.productName}</TableCell>
                  <TableCell>
                    <Badge variant={product.currentStock === 0 ? "destructive" : "secondary"}>
                      {formatNumber(product.currentStock)}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatNumber(product.minStock)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Top Selling Products */}
      <Card>
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Total Sold</TableHead>
                <TableHead>Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.topSellingProducts?.slice(0, 10).map((product: any, index: number) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{product.productName}</TableCell>
                  <TableCell>{product.categoryName}</TableCell>
                  <TableCell>{formatNumber(product.totalSold)}</TableCell>
                  <TableCell>{formatCurrency(product.revenue)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );


  const renderFinancialReport = (data: any) => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(data.totalRevenue)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(data.totalCost)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(data.totalProfit)}</div>
          </CardContent>
        </Card>
        {/*<Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{data.profitMargin.toFixed(2)}%</div>
          </CardContent>
        </Card>*/}
      </div>

      {/* Profit by Category */}
      <Card>
        <CardHeader>
          <CardTitle>Profit by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Profit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.profitByCategory?.map((item: any, index: number) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.categoryName}</TableCell>
                  <TableCell>{formatCurrency(item.revenue)}</TableCell>
                  <TableCell>{formatCurrency(item.cost)}</TableCell>
                  <TableCell className={item.profit >= 0 ? "text-green-600" : "text-red-600"}>
                    {formatCurrency(item.profit)}
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Financial Data by Date */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Data by Date</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Profit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.revenueByDate?.slice(0, 10).map((item: any, index: number) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{formatDateTime(item.date) }</TableCell>
                  <TableCell>{formatCurrency(item.revenue)}</TableCell>
                  <TableCell>{formatCurrency(item.cost)}</TableCell>
                  <TableCell className={item.profit >= 0 ? "text-green-600" : "text-red-600"}>
                    {formatCurrency(item.profit)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderReviewReport = (data: any) => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.totalReviews)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{data.averageRating.toFixed(1)} ⭐</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Top Rated Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.topRatedProducts?.length || 0)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Rating Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Rating Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rating</TableHead>
                <TableHead>Count</TableHead>
                <TableHead>Percentage</TableHead>
                <TableHead>Visual</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.ratingDistribution?.map((item: any, index: number) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <span className="mr-2">{item.rating} ⭐</span>
                    </div>
                  </TableCell>
                  <TableCell>{formatNumber(item.count)}</TableCell>
                  <TableCell>{item.percentage.toFixed(1)}%</TableCell>
                  <TableCell>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full" 
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Top Rated Products */}
      <Card>
        <CardHeader>
          <CardTitle>Top Rated Products</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Average Rating</TableHead>
                <TableHead>Total Reviews</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.topRatedProducts?.map((item: any, index: number) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.productName}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="mr-2">{item.averageRating.toFixed(1)} ⭐</span>
                    </div>
                  </TableCell>
                  <TableCell>{formatNumber(item.totalReviews)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Reviews by Category */}
      <Card>
        <CardHeader>
          <CardTitle>Reviews by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Total Reviews</TableHead>
                <TableHead>Average Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.reviewsByCategory?.map((item: any, index: number) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.categoryName}</TableCell>
                  <TableCell>{formatNumber(item.totalReviews)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="mr-2">{item.averageRating.toFixed(1)} ⭐</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Reviews */}
      {/*<Card>
        <CardHeader>
          <CardTitle>Recent Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.recentReviews?.map((item: any, index: number) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.productName}</TableCell>
                  <TableCell>{item.userName}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="mr-2">{item.rating} ⭐</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{item.comment}</TableCell>
                  <TableCell>{formatDateTime(item.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>*/}

      {/* Reviews by Product */}
      <Card>
        <CardHeader>
          <CardTitle>Reviews by Product</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Total Reviews</TableHead>
                <TableHead>Average Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.reviewsByProduct?.slice(0, 10).map((item: any, index: number) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.productName}</TableCell>
                  <TableCell>{formatNumber(item.totalReviews)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="mr-2">{item.averageRating.toFixed(1)} ⭐</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderReportContent = () => {
    switch (report.reportType) {
      case 'Sales':
        return renderSalesReport(report.data);
      case 'Users':
        return renderUserReport(report.data);
      case 'Products':
        return renderProductReport(report.data);
      case 'Financial':
        return renderFinancialReport(report.data);
      case 'Reviews':
        return renderReviewReport(report.data);
      default:
        return (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">Report data visualization coming soon...</p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500/20  bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold">{report.title}</h2>

          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={onClose} className="text-muted-foreground cursor-pointer">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="mb-4 flex items-center space-x-4">
            <Badge variant="secondary">{report.reportType}</Badge>
            {report.generatedAt && (
              <span className="text-sm text-muted-foreground">
                Generated on {format(new Date(report.generatedAt), 'PPP')}
              </span>
            )}
            {report.generatedBy && (
              <span className="text-sm text-muted-foreground">
                by {report.generatedBy}
              </span>
            )}
          </div>

          {renderReportContent()}
        </div>
      </div>
    </div>
  );
} 