'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Download, Eye, Trash2, Calendar, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Report } from '@/services/api/reportApi';
import { format } from 'date-fns';

interface ReportCardProps {
  report: Report;
  onView: (report: Report) => void;
  onExport: (id: string, format: 'pdf' | 'excel' | 'csv') => void;
  onDelete: (id: string) => void;
}

const getReportTypeColor = (type: string) => {
  switch (type) {
    case 'Sales':
      return 'bg-green-100 text-green-800';
    case 'Users':
      return 'bg-blue-100 text-blue-800';
    case 'Products':
      return 'bg-purple-100 text-purple-800';
    case 'Orders':
      return 'bg-orange-100 text-orange-800';
    case 'Revenue':
      return 'bg-emerald-100 text-emerald-800';
    case 'Inventory':
      return 'bg-red-100 text-red-800';
    case 'Financial':
      return 'bg-indigo-100 text-indigo-800';
    case 'Reviews':
      return 'bg-pink-100 text-pink-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getReportTypeIcon = (type: string) => {
  switch (type) {
    case 'Sales':
      return '📈';
    case 'Users':
      return '👥';
    case 'Products':
      return '📦';
    case 'Orders':
      return '🛒';
    case 'Revenue':
      return '💰';
    case 'Inventory':
      return '📊';
    case 'Financial':
      return '💹';
    case 'Reviews':
      return '⭐';
    default:
      return '📄';
  }
};

export default function ReportCard({ report, onView, onExport, onDelete }: ReportCardProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'pdf' | 'excel' | 'csv') => {
    setIsExporting(true);
    try {
      await onExport(report.id, format);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{getReportTypeIcon(report.reportType)}</div>
            <div>
              <CardTitle className="text-lg font-semibold">{report.title}</CardTitle>
              <CardDescription className="text-sm text-gray-600">
                {report.description}
              </CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(report)}>
                <Eye className="mr-2 h-4 w-4" />
                View Report
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('pdf')} disabled={isExporting}>
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('excel')} disabled={isExporting}>
                <Download className="mr-2 h-4 w-4" />
                Export Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('csv')} disabled={isExporting}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(report.id)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-3">
          <Badge className={getReportTypeColor(report.reportType)}>
            {report.reportType}
          </Badge>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>
                {report.generatedAt 
                  ? format(new Date(report.generatedAt), 'MMM dd, yyyy')
                  : 'Unknown'
                }
              </span>
            </div>
            {report.generatedBy && (
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{report.generatedBy}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          {report.filters && (
            <div className="text-xs text-gray-500">
              {report.filters.startDate && report.filters.endDate && (
                <div>
                  Period: {format(new Date(report.filters.startDate), 'MMM dd')} - {format(new Date(report.filters.endDate), 'MMM dd, yyyy')}
                </div>
              )}
              {report.filters.categoryId && (
                <div>Category: {report.filters.categoryId}</div>
              )}
              {report.filters.status && (
                <div>Status: {report.filters.status}</div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 