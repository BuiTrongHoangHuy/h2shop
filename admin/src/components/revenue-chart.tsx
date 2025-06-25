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

  useEffect(() => {
    const loadRevenueData = async () => {
      setIsLoading(true);
      try {
        const orders = await fetchOrders();
        const today = new Date();
        let startDate: Date;
        let groupByFormat: string;

        if (filter === 'day') {
          startDate = startOfDay(today);
          groupByFormat = 'HH:mm';
        } else if (filter === 'week') {
          startDate = startOfWeek(today, { locale: vi });
          groupByFormat = 'dd/MM';
        } else {
          startDate = startOfMonth(today);
          groupByFormat = 'dd/MM';
        }

        // Lọc đơn hàng theo khoảng thời gian
        const filteredOrders = orders.filter((o) => new Date(o.order.createdAt) >= startDate);

        // Tính tổng doanh thu
        const total = filteredOrders.reduce((sum, o) => sum + parseFloat(o.order.totalPrice), 0);
        setTotalRevenue(total);

        // Nhóm doanh thu theo thời gian
        const revenueByTime: { [key: string]: { value: number; date: Date } } = {};
        filteredOrders.forEach((o) => {
          const date = new Date(o.order.createdAt);
          let key: string;

          if (filter === 'day') {
            key = format(date, 'HH:mm', { locale: vi });
          } else {
            key = format(date, 'dd/MM', { locale: vi });
          }

          if (!revenueByTime[key]) {
            revenueByTime[key] = { value: 0, date };
          }
          revenueByTime[key].value += parseFloat(o.order.totalPrice);
        });

        // Chuyển thành mảng chartData và sắp xếp
        const data = Object.entries(revenueByTime)
          .map(([label, { value, date }]) => ({
            label,
            value: value / 1000000, // Chuyển sang triệu đồng
            date,
          }))
          .sort((a, b) => a.date.getTime() - b.date.getTime()); // Sắp xếp theo thời gian

        setChartData(data);
      } catch (error) {
        console.error('Error fetching revenue data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRevenueData();
  }, [filter]);

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
            REVENUE {filter === 'day' ? 'TODAY' : filter === 'week' ? 'THIS WEEK' : 'THIS MONTH'}
          </h2>
          <div className="flex items-center mt-2">
            <span className="text-2xl font-bold text-blue-600">
              ₫ {totalRevenue.toLocaleString('vi-VN')}
            </span>
          </div>
        </div>
        <div className="relative">
          <button
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span>{filter === 'day' ? 'Today' : filter === 'week' ? 'This week' : 'This month'}</span>
            <ChevronDown className="h-4 w-4" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-10">
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  setFilter('day');
                  setIsDropdownOpen(false);
                }}
              >
                Today
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  setFilter('week');
                  setIsDropdownOpen(false);
                }}
              >
                This week
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  setFilter('month');
                  setIsDropdownOpen(false);
                }}
              >
                This month
              </button>
            </div>
          )}
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