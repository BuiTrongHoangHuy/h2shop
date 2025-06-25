'use client';

import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { vi } from 'date-fns/locale';
import { format } from 'date-fns';
import { fetchOrders } from '@/services/api/overviewApi';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface TopProduct {
  name: string;
  value: number; // Doanh thu (triệu đồng)
  quantity: number; // Số lượng bán ra
}

export default function TopSellingGoods() {
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Thêm state cho date range
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: format(new Date(), "yyyy-MM-01"),
    end: format(new Date(), "yyyy-MM-dd"),
  });
  const [pendingDateRange, setPendingDateRange] = useState(dateRange);

  useEffect(() => {
    const loadTopProducts = async () => {
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
  }, [dateRange]);

  // Dữ liệu cho Chart.js
  const barData = {
    labels: topProducts.map((p) => p.name),
    datasets: [
      {
        label: 'Revenue (million VND)',
        data: topProducts.map((p) => p.value),
        backgroundColor: 'rgba(249, 115, 22, 0.6)',
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
          afterLabel: (context: any) => `Quantity: ${topProducts[context.dataIndex]?.quantity ?? 0}`,
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
          TOP 10 BEST SELLING PRODUCTS BY DATE RANGE
        </h2>
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