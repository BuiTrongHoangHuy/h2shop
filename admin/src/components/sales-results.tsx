// components/sales-results.tsx
'use client';

import { useEffect, useState } from 'react';
import { FileText, Loader2, ShoppingCart, TrendingDown, TrendingUp } from 'lucide-react';
import { fetchOrders } from '@/services/api/overviewApi';


interface SalesData {
  label: string;
  value: string;
  icon: React.ComponentType<any>;
  bgColor: string;
  iconColor: string;
}

export default function SalesResults() {
  const [salesData, setSalesData] = useState<SalesData[]>([
    { label: 'Today\'s Revenue', value: '0', icon: FileText, bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
    { label: 'Orders', value: '0', icon: ShoppingCart, bgColor: 'bg-orange-100', iconColor: 'text-orange-600' },
    { label: 'Compared to last month', value: '0%', icon: TrendingUp, bgColor: 'bg-green-100', iconColor: 'text-green-600' },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSalesData = async () => {
      setIsLoading(true);
      try {
        const orders = await fetchOrders();
        const today = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const yesterdayStart = new Date(todayStart);
        yesterdayStart.setDate(todayStart.getDate() - 1);
        const yesterdayEnd = new Date(todayStart);
        yesterdayEnd.setMilliseconds(-1);

        // Đơn hôm nay
        const todayOrders = orders.filter(
          (o) => {
            const created = new Date(o.order.createdAt);
            return created >= todayStart;
          }
        );
        // Đơn hôm qua
        const yesterdayOrders = orders.filter(
          (o) => {
            const created = new Date(o.order.createdAt);
            return created >= yesterdayStart && created < todayStart;
          }
        );

        // Doanh thu hôm nay
        const todayRevenue = todayOrders.reduce((sum, o) => sum + parseFloat(o.order.totalPrice), 0);
        // Số đơn hôm nay
        const todayOrderCount = todayOrders.length;
        // Doanh thu hôm qua
        const yesterdayRevenue = yesterdayOrders.reduce((sum, o) => sum + parseFloat(o.order.totalPrice), 0);

        // So sánh phần trăm doanh thu hôm nay với hôm qua
        const comparison = yesterdayRevenue
          ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100
          : 0;
        const comparisonValue = comparison.toFixed(2) + '%';
        const comparisonIcon = comparison >= 0 ? TrendingUp : TrendingDown;
        const comparisonBg = comparison >= 0 ? 'bg-green-100' : 'bg-red-100';
        const comparisonColor = comparison >= 0 ? 'text-green-600' : 'text-red-600';

        setSalesData([
          {
            label: 'Today\'s Revenue',
            value: todayRevenue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
            icon: FileText,
            bgColor: 'bg-blue-100',
            iconColor: 'text-blue-600',
          },
          {
            label: 'Today\'s Orders',
            value: todayOrderCount.toString(),
            icon: ShoppingCart,
            bgColor: 'bg-orange-100',
            iconColor: 'text-orange-600',
          },
          {
            label: 'Compared to yesterday',
            value: comparisonValue,
            icon: comparisonIcon,
            bgColor: comparisonBg,
            iconColor: comparisonColor,
          },
        ]);
      } catch (error) {
        console.error('Error fetching sales data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSalesData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[calc(50vh-70px)] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading sales...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">TODAY'S SALES RESULTS</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {salesData.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="flex items-center space-x-3">
              <div className={`p-3 rounded-full ${item.bgColor}`}>
                <Icon className={`h-6 w-6 ${item.iconColor}`} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{item.value}</div>
                <div className="text-sm text-gray-500">{item.label}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}