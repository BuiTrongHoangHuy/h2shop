'use client';

import { useState, useEffect } from 'react';
import { Search, MoreHorizontal, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReportSidebar from './components/report-sidebar';
import ReportTable from './components/report-table';
import ReportGenerator from './components/ReportGenerator';
import ReportViewer from './components/ReportViewer';
import { reportApi, Report, ReportFilters, DashboardStats, PaginatedReportsResponse } from '@/services/api/reportApi';
import { toast } from 'sonner';

// Define API response type
interface ApiReportResponse {
  status: string;
  data: Report[];
}

export default function ReportPage() {
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("All time");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("All types");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });

  const [pendingDateRange, setPendingDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [appliedDateRange, setAppliedDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  // Fetch data from API
  useEffect(() => {
    fetchReports();
  }, [currentPage, selectedTypeFilter, appliedDateRange, searchQuery]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      
      const filters: ReportFilters = {
        page: currentPage,
        limit: 10,
        search: searchQuery || undefined
      };

      if (selectedTypeFilter !== "All types") {
        filters.reportType = selectedTypeFilter as any;
      }

      if (selectedTimeFilter === "Other options" && appliedDateRange.startDate && appliedDateRange.endDate) {
        filters.startDate = new Date(appliedDateRange.startDate);
        filters.endDate = new Date(appliedDateRange.endDate);
      }

      const [reportsResponse, statsResponse] = await Promise.all([
        reportApi.getAllReports(filters),
        reportApi.getDashboardStats()
      ]);
      
      setReports(reportsResponse.data.reports || []);
      setPagination(reportsResponse.data.pagination);
      setDashboardStats(statsResponse.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load reports");
      setLoading(false);
      console.error('Error loading reports:', err);
    }
  };

  const handleViewDetails = (report: Report) => {
    setSelectedReport(report);
    setIsDetailModalOpen(true);
  };

  const handleReportGenerated = () => {
    // Reload reports after generation
    window.location.reload();
    setIsGeneratorOpen(false);
  };

  const reloadReports = async () => {
    await fetchReports();
  };

  // Handle report export
  const handleExport = async (id: string, format: 'pdf' | 'excel' | 'csv') => {
    try {
      const blob = await reportApi.exportReport(id, format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${id}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success(`Report exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error('Failed to export report');
    }
  };

  // Handle report deletion
  const handleDelete = async (id: string) => {
    try {
      await reportApi.deleteReport(id);
      toast.success('Report deleted successfully');
      reloadReports();
    } catch (error) {
      console.error('Error deleting report:', error);
      toast.error('Failed to delete report');
    }
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN")
  }
  if (loading) {
    return <div className="flex h-[calc(100vh-140px)] items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading reports...</p>
      </div>
    </div>;
  }

  if (error) {
    return <div className="flex h-[calc(100vh-140px)] items-center justify-center">
      <div className="text-center">
        <p className="text-red-600">{error}</p>
        <Button onClick={reloadReports} className="mt-4">Retry</Button>
      </div>
    </div>;
  }

  return (
    <div className="flex h-[calc(100vh-140px)]">
      <ReportSidebar
        selectedTimeFilter={selectedTimeFilter}
        onTimeFilterChange={setSelectedTimeFilter}
        selectedTypeFilter={selectedTypeFilter}
        onTypeFilterChange={(type) => {
          setSelectedTypeFilter(type);
          setCurrentPage(1); // Reset to first page when changing type filter
        }}
        dateRange={pendingDateRange}
        onDateRangeChange={setPendingDateRange}
        onApplyDateRange={() => {
          setAppliedDateRange(pendingDateRange);
          setCurrentPage(1); // Reset to first page when applying filters
        }}
        onClearDateRange={() => {
          setPendingDateRange({ startDate: "", endDate: "" });
          setAppliedDateRange({ startDate: "", endDate: "" });
          setCurrentPage(1); // Reset to first page when clearing filters
        }}
        dashboardStats={dashboardStats}
      />

      <div className="flex-1 bg-white">
        <div className="p-4 border-b">
          <h1 className="text-xl font-semibold mb-4">Reports & Analytics</h1>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by report title, description or type"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1); // Reset to first page when searching
                  }}
                />
              </div>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Button 
                onClick={() => setIsGeneratorOpen(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
              >
                <Plus className="h-4 w-4 mr-2" />
                Generate Report
              </Button>

            </div>
          </div>
        </div>

        <ReportTable
          reports={reports}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onViewDetails={handleViewDetails}
          onExport={handleExport}
          onDelete={handleDelete}
          pagination={pagination}
        />
      </div>

      {/* Report Generator Modal */}
      {isGeneratorOpen && (
        <div className="fixed inset-0 bg-gray-500/20 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <ReportGenerator onReportGenerated={handleReportGenerated} />
            </div>
            <div className="flex justify-end p-6 border-t">
              <Button variant="outline" onClick={() => setIsGeneratorOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Report Viewer Modal */}
      {isDetailModalOpen && selectedReport && (
        <ReportViewer
          report={selectedReport}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedReport(null);
          }}
          onExport={handleExport}
        />
      )}
    </div>
  );
}
