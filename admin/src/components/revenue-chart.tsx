'use client';

import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { ChevronDown, Loader2 } from 'lucide-react';
import { format, parse, startOfDay, startOfWeek, startOfMonth } from 'date-fns';
import { vi } from 'date-fns/locale';
import { fetchOrders } from '@/services/api/overviewApi';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ChartData {
  label: string;
  value: number;
  date: Date; // Thêm trường date để sắp xếp
}

export default function RevenueChart() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [filter, setFilter] = useState<'day' | 'week' | 'month'>('month');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: format(new Date(), "yyyy-MM-01"),
    end: format(new Date(), "yyyy-MM-dd"),
  });

  const [pendingDateRange, setPendingDateRange] = useState(dateRange);

  useEffect(() => {
    const loadRevenueData = async () => {
      setIsLoading(true);
      try {
        const orders = await fetchOrders();
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        endDate.setHours(23, 59, 59, 999);

        // Lọc đơn hàng theo khoảng thời gian
        const filteredOrders = orders.filter((o) => {
          const orderDate = new Date(o.order.createdAt);
          return orderDate >= startDate && orderDate <= endDate;
        });

        // Tính tổng doanh thu
        const total = filteredOrders.reduce((sum, o) => sum + parseFloat(o.order.totalPrice), 0);
        setTotalRevenue(total);

        // Nhóm doanh thu theo ngày
        const revenueByDate: { [key: string]: { value: number; date: Date } } = {};
        filteredOrders.forEach((o) => {
          const date = format(new Date(o.order.createdAt), 'dd/MM', { locale: vi });
          if (!revenueByDate[date]) {
            revenueByDate[date] = { value: 0, date: new Date(o.order.createdAt) };
          }
          revenueByDate[date].value += parseFloat(o.order.totalPrice);
        });

        // Chuyển thành mảng chartData và sắp xếp
        const data = Object.entries(revenueByDate)
          .map(([label, { value, date }]) => ({
            label,
            value: value / 1000000,
            date,
          }))
          .sort((a, b) => a.date.getTime() - b.date.getTime());

        setChartData(data);
      } catch (error) {
        console.error('Error fetching revenue data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRevenueData();
  }, [dateRange]);

  // Dữ liệu cho Chart.js
  const barData = {
    labels: chartData.map((item) => item.label),
    datasets: [
      {
        label: 'Revenue (million VND)',
        data: chartData.map((item) => item.value),
        backgroundColor: 'rgba(249, 115, 22, 0.6)', // Màu cam nhạt
        borderColor: 'rgba(249, 115, 22, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  // Tùy chọn cho biểu đồ
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.raw.toFixed(1)} million VND`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Revenue (million VND)',
        },
        ticks: {
          callback: function (tickValue: string | number) {
            return `${tickValue} million`;
          },
        },
      },
      x: {
        title: {
          display: true,
          text: filter === 'day' ? 'Hour' : 'Date',
        },
      },
    },
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(50vh-70px)] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading revenue chart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            REVENUE BY DATE RANGE
          </h2>
          <div className="flex items-center mt-2">
            <span className="text-2xl font-bold text-blue-600">
              ₫ {totalRevenue.toLocaleString('vi-VN')}
            </span>
          </div>
        </div>
        {/* Date range picker */}
        <div className="flex items-center space-x-2">
          <input
            type="date"
            value={pendingDateRange.start}
            max={pendingDateRange.end}
            onChange={e => setPendingDateRange(r => ({ ...r, start: e.target.value }))}
            className="border rounded px-2 py-1"
          />
          <span>-</span>
          <input
            type="date"
            value={pendingDateRange.end}
            min={pendingDateRange.start}
            onChange={e => setPendingDateRange(r => ({ ...r, end: e.target.value }))}
            className="border rounded px-2 py-1"
          />
          <button
            className="ml-2 px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
            onClick={() => setDateRange(pendingDateRange)}
            disabled={
              dateRange.start === pendingDateRange.start &&
              dateRange.end === pendingDateRange.end
            }
          >
            Apply
          </button>
        </div>
      </div>

      <div className="h-64">
        {chartData.length > 0 ? (
          <Bar data={barData} options={options} />
        ) : (
          <Bar
            data={{
              labels: [],
              datasets: [
                {
                  label: 'Revenue (million VND)',
                  data: [],
                  backgroundColor: 'rgba(249, 115, 22, 0.6)',
                  borderColor: 'rgba(249, 115, 22, 1)',
                  borderWidth: 1,
                  borderRadius: 4,
                },
              ],
            }}
            options={options}
          />
        )}
      </div>
    </div>
  );
}