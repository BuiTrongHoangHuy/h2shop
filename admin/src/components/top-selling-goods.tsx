'use client';

import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { ChevronDown, Loader2 } from 'lucide-react';
import { startOfDay, startOfWeek, startOfMonth } from 'date-fns';
import { vi } from 'date-fns/locale';
import { fetchOrders } from '@/services/api/overviewApi';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface TopProduct {
  name: string;
  value: number; // Doanh thu (triệu đồng)
  quantity: number; // Số lượng bán ra
}

export default function TopSellingGoods() {
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [filter, setFilter] = useState<'day' | 'week' | 'month'>('month');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTopProducts = async () => {
      setIsLoading(true);
      try {
        const orders = await fetchOrders();
        const today = new Date();
        let startDate: Date;

        if (filter === 'day') {
          startDate = startOfDay(today);
        } else if (filter === 'week') {
          startDate = startOfWeek(today, { locale: vi });
        } else {
          startDate = startOfMonth(today);
        }

        // Lọc đơn hàng theo khoảng thời gian
        const filteredOrders = orders.filter((o) => new Date(o.order.createdAt) >= startDate);

        // Tính doanh thu và số lượng theo sản phẩm
        const productRevenue: { [key: string]: { name: string; revenue: number; quantity: number } } = {};
        filteredOrders.forEach((order) => {
          order.details.forEach((detail) => {
            const key = detail.productId;
            if (!productRevenue[key]) {
              productRevenue[key] = { name: detail.productName, revenue: 0, quantity: 0 };
            }
            productRevenue[key].revenue += parseFloat(detail.price) * detail.quantity;
            productRevenue[key].quantity += detail.quantity;
          });
        });

        // Chuyển thành mảng và sắp xếp
        const products = Object.values(productRevenue)
          .map((p) => ({
            name: p.name,
            value: p.revenue / 1000000, // Chuyển sang triệu đồng
            quantity: p.quantity,
          }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 10);

        setTopProducts(products);
      } catch (error) {
        console.error('Error fetching top products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTopProducts();
  }, [filter]);

  // Dữ liệu cho Chart.js
  const barData = {
    labels: topProducts.map((p) => p.name),
    datasets: [
      {
        label: 'Revenue (million VND)',
        data: topProducts.map((p) => p.value),
        backgroundColor: 'rgba(249, 115, 22, 0.6)', // Màu cam nhạt
        borderColor: 'rgba(249, 115, 22, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  // Tùy chọn cho biểu đồ
  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.raw.toFixed(1)} million VND`,
          afterLabel: (context: any) => `Quantity: ${topProducts[context.dataIndex].quantity}`,
        },
      },
    },
    scales: {
      x: {
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
      y: {
        title: {
          display: true,
          text: 'Product',
        },
      },
    },
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(50vh-70px)] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading top selling...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          TOP 10 BEST SELLING PRODUCTS {filter === 'day' ? 'TODAY' : filter === 'week' ? 'THIS WEEK' : 'THIS MONTH'}
        </h2>
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

      <div className="h-96">
        {topProducts.length > 0 ? (
          <Bar data={barData} options={options} />
        ) : (
          <Bar data={{ labels: [], datasets: [] }} options={options} />
        )}
      </div>
    </div>
  );
}