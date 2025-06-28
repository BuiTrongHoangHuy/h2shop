'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { reportApi } from '@/services/api/reportApi';
import { toast } from 'sonner';

interface ReportGeneratorProps {
  onReportGenerated: () => void;
}

const reportTypes = [
  { value: 'Sales', label: 'Sales Report', description: 'Revenue, orders, and product performance' },
  { value: 'Products', label: 'Product Report', description: 'Inventory status and product performance' },
  { value: 'Financial', label: 'Financial Report', description: 'Revenue, cost, and profit analysis' },
  { value: 'Reviews', label: 'Review Report', description: 'Product reviews and rating analysis' },
];

export default function ReportGenerator({ onReportGenerated }: ReportGeneratorProps) {
  const [selectedType, setSelectedType] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [lowStock, setLowStock] = useState<boolean>(false);
  const [productId, setProductId] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!selectedType) {
      toast.error('Please select a report type');
      return;
    }

    setIsGenerating(true);
    try {
      const filters: any = {};
      
      if (startDate) filters.startDate = new Date(startDate);
      if (endDate) filters.endDate = new Date(endDate);
      if (categoryId) filters.categoryId = categoryId;
      if (status) filters.status = status;
      if (lowStock) filters.lowStock = lowStock;
      if (productId) filters.productId = productId;

      let response;
      switch (selectedType) {
        case 'Sales':
          response = await reportApi.generateSalesReport(filters);
          break;
        case 'Products':
          response = await reportApi.generateProductReport(filters);
          break;
        case 'Financial':
          response = await reportApi.generateFinancialReport(filters);
          break;
        case 'Reviews':
          response = await reportApi.generateReviewReport(filters);
          break;
        default:
          throw new Error('Invalid report type');
      }

      toast.success('Report generated successfully');
      onReportGenerated();
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };


  const showDateFilters = ['Sales', 'Orders', 'Financial', 'Reviews'].includes(selectedType);


  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate New Report</CardTitle>
        <CardDescription>
          Create comprehensive reports to analyze your business performance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="report-type">Report Type</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {reportTypes.map((type) => (
              <div
                key={type.value}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedType === type.value
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => setSelectedType(type.value)}
              >
                <div className="font-medium text-gray-900">{type.label}</div>
                <div className="text-sm text-gray-600">{type.description}</div>
              </div>
            ))}
          </div>
        </div>

        {showDateFilters && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Date Range</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {startDate && endDate && (
              <div className="p-3 bg-blue-50 rounded-md">
                <div className="text-sm text-blue-800">
                  <strong>Selected period:</strong> {new Date(startDate).toLocaleDateString('vi-VN')} - {new Date(endDate).toLocaleDateString('vi-VN')}
                </div>
              </div>
            )}
          </div>
        )}

        <Button
          onClick={handleGenerate} 
          disabled={isGenerating || !selectedType}
          className="w-full bg-orange-500 cursor-pointer hover:bg-orange-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Report...
            </>
          ) : (
            'Generate Report'
          )}
        </Button>
      </CardContent>
    </Card>
  );
} 