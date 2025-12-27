import React, { useMemo } from 'react';
import { useData } from '../context/DataContext';
import {
  ShoppingBag,
  CreditCard,
  Clock,
  Package,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';

const UserDashboard = () => {
  const { orders, customers, loading } = useData();

  // Simulate a logged-in user (using a specific ID from the dataset for demo)
  // In a real app, this would come from Auth Context
  const currentUserId = 457;

  const userStats = useMemo(() => {
    if (loading) return { user: null, userOrders: [], stats: {} };

    // Find User
    const user = customers.find(c => c.customer_id === currentUserId) || {
      first_name: "Guest",
      last_name: "User",
      customer_full_name: "Guest User"
    };

    // Filter User Orders
    const userOrders = orders
      .filter(o => o.customer_id === currentUserId)
      .sort((a, b) => new Date(b.order_date) - new Date(a.order_date)); // Newest first

    // Calculate Stats
    const totalOrders = userOrders.length;
    const totalSpent = userOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
    const activeOrders = userOrders.filter(o => o.order_status === 'Pending' || o.order_status === 'Processing').length;

    // Prepare Chart Data (Orders per Month)
    const monthlyData = userOrders.reduce((acc, order) => {
      const date = new Date(order.order_date);
      const key = format(date, 'MMM yyyy');
      if (!acc[key]) acc[key] = { date: key, orders: 0, spend: 0 };
      acc[key].orders += 1;
      acc[key].spend += order.total_amount || 0;
      return acc;
    }, {});

    const chartData = Object.values(monthlyData).reverse(); // Show oldest to newest if needed, or keeping newest first depends on chart style. usually chronological.
    // Let's sort chronological
    const chartDataSorted = Object.values(monthlyData).sort((a, b) => new Date(a.date) - new Date(b.date));

    return {
      user,
      userOrders,
      stats: {
        totalOrders,
        totalSpent,
        activeOrders
      },
      chartData: chartDataSorted
    };
  }, [orders, customers, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-slate-500 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const { user, userOrders, stats, chartData } = userStats;

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Top Navbar Placeholder - Assuming this is rendered inside MainLayout or similar, 
          but adding a specific header for the dashboard view if needed. 
          For now, just the dashboard content container. */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* 1. Welcome Card */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:shadow-md">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Welcome back, {user?.first_name}! 👋
            </h1>
            <p className="text-slate-500 text-lg font-light">
              Here's what's happening with your account today.
            </p>
          </div>
          <div className="px-6 py-3 bg-blue-50 text-blue-700 rounded-full font-medium text-sm border border-blue-100">
            Member since {user?.customer_created_date ? new Date(user.customer_created_date).getFullYear() : '2022'}
          </div>
        </div>

        {/* 2. KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Orders */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:scale-110 transition-transform">
                <ShoppingBag size={24} />
              </div>
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">All Time</span>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-1">{stats.totalOrders}</h3>
            <p className="text-slate-500 font-medium">Total Orders</p>
          </div>

          {/* Amount Spent */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
                <CreditCard size={24} />
              </div>
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Lifetime</span>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-1">${stats.totalSpent.toFixed(2)}</h3>
            <p className="text-slate-500 font-medium">Total Amount Spent</p>
          </div>

          {/* Active Orders */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:scale-110 transition-transform">
                <Clock size={24} />
              </div>
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Current</span>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-1">{stats.activeOrders}</h3>
            <p className="text-slate-500 font-medium">Active Orders</p>
          </div>
        </div>

        {/* 3. Main Content Grid: Chart + Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Recent Orders Table (2/3 width) */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-lg">Recent Orders</h3>
              <button className="text-blue-600 text-sm font-semibold hover:text-blue-700 transition-colors">View All</button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-500">
                <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider font-semibold text-xs">
                  <tr>
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {userOrders.slice(0, 5).map(order => (
                    <tr key={order.order_id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">
                        #{order.order_id}
                      </td>
                      <td className="px-6 py-4">
                        {format(new Date(order.order_date), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        ${order.total_amount?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={order.order_status} />
                      </td>
                    </tr>
                  ))}
                  {userOrders.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-slate-400">No orders found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Line Chart (1/3 width or full width depending on implementation. Usually better as side card or full width row. 
                User asked for separate section, but good layout puts it effectively. 
                Let's put chart in a nice card.) */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col">
            <h3 className="font-bold text-slate-900 text-lg mb-6">Spending Activity</h3>
            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                    dy={10}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="#3b82f6"
                    strokeWidth={4}
                    dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  switch (status?.toLowerCase()) {
    case 'delivered':
    case 'completed':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
          <CheckCircle size={12} /> Delivered
        </span>
      );
    case 'pending':
    case 'processing':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-100">
          <Clock size={12} /> Processing
        </span>
      );
    case 'returned':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-100">
          <AlertCircle size={12} /> Returned
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
          <Package size={12} /> {status}
        </span>
      );
  }
}

export default UserDashboard;
