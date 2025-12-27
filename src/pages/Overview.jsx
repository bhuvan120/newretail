import React, { useMemo, useState } from 'react';
import { useData } from '../context/DataContext';
import MetricCard from '../components/MetricCard';
import {
    DollarSign, TrendingUp, ShoppingCart, Users, Package, AlertCircle
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { format, parseISO, getYear, getMonth } from 'date-fns';

const Overview = () => {
    const { products, orders, returns, customers, orderItems, loading, dataStatus } = useData();

    // Filters State
    const [selectedYear, setSelectedYear] = useState('All');
    const [selectedMonth, setSelectedMonth] = useState('All');

    // --- KPI & CHART CALCULATIONS ---
    const dashboardData = useMemo(() => {
        if (loading) return null;

        let filteredOrders = orders;

        // Apply Filters
        if (selectedYear !== 'All') {
            filteredOrders = filteredOrders.filter(o => getYear(parseISO(o.order_date)).toString() === selectedYear);
        }
        if (selectedMonth !== 'All') {
            // selectedMonth is 0-indexed (0 = Jan) or 1-indexed? Let's use 1-12
            filteredOrders = filteredOrders.filter(o => (getMonth(parseISO(o.order_date)) + 1).toString() === selectedMonth);
        }

        // 1. KPIs
        const totalProducts = products.length; // Products usually static but could filter by creation date if available
        const totalCustomers = customers.length;
        const totalOrders = filteredOrders.length;
        const totalRevenue = filteredOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);

        // 2. Charts Data
        // Revenue by Month (Line) & Orders by Month (Bar)
        // Aggregate by formatted date (e.g. "Jan 2023" or just "Jan" if year filtered)
        const monthlyStats = {};

        filteredOrders.forEach(o => {
            const date = parseISO(o.order_date);
            const key = format(date, selectedYear === 'All' ? 'MMM yyyy' : 'MMM');
            const sortKey = date.getTime(); // For sorting

            if (!monthlyStats[key]) monthlyStats[key] = { name: key, revenue: 0, orders: 0, sortKey };
            monthlyStats[key].revenue += (o.total_amount || 0);
            monthlyStats[key].orders += 1;
        });

        const chartData = Object.values(monthlyStats).sort((a, b) => a.sortKey - b.sortKey);

        // Returns vs Completed (Pie)
        const returnedCount = returns.filter(r => {
            // Filter returns by date if possible, but returns usually linked to orders. 
            // For simplicity, using total returns count vs total completed orders in filtered set.
            // Ideally we check if the returned order is in filteredOrders.
            // Let's approximate: Returns that map to the filtered orders list.
            return filteredOrders.some(o => o.order_id === r.order_id);
        }).length;

        const completedCount = filteredOrders.filter(o => o.order_status === 'Completed' || o.order_status === 'Delivered').length;

        const pieData = [
            { name: 'Completed', value: completedCount, color: '#10b981' }, // emerald-500
            { name: 'Returned', value: returnedCount, color: '#f43f5e' }, // rose-500
            { name: 'Other', value: totalOrders - completedCount - returnedCount, color: '#94a3b8' } // slate-400
        ].filter(d => d.value > 0);

        // 3. Top 5 Tables
        // Top Products by Revenue
        const productRevenue = {};
        // Map relevant items
        const relevantOrderIds = new Set(filteredOrders.map(o => o.order_id));
        const filteredItems = orderItems.filter(i => relevantOrderIds.has(i.order_id));

        filteredItems.forEach(item => {
            if (!productRevenue[item.product_id]) productRevenue[item.product_id] = 0;
            productRevenue[item.product_id] += (item.total_amount || 0);
        });

        const topProducts = Object.entries(productRevenue)
            .map(([pid, amt]) => {
                const p = products.find(prod => prod.product_id?.toString() === pid);
                return { name: p?.product_name || `ID ${pid}`, revenue: amt };
            })
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

        // Top Customers by Spend
        const customerSpend = {};
        filteredOrders.forEach(o => {
            if (!customerSpend[o.customer_id]) customerSpend[o.customer_id] = 0;
            customerSpend[o.customer_id] += (o.total_amount || 0);
        });

        const topCustomers = Object.entries(customerSpend)
            .map(([cid, amt]) => {
                const c = customers.find(cust => cust.customer_id?.toString() === cid);
                return { name: c?.customer_full_name || `ID ${cid}`, spend: amt };
            })
            .sort((a, b) => b.spend - a.spend)
            .slice(0, 5);


        return {
            kpi: { totalProducts, totalCustomers, totalOrders, totalRevenue },
            chartData,
            pieData,
            topProducts,
            topCustomers
        };
    }, [products, orders, returns, customers, orderItems, loading, selectedYear, selectedMonth]);


    // Year Options generator
    const years = useMemo(() => {
        if (!orders.length) return [];
        const uniqueYears = [...new Set(orders.map(o => getYear(parseISO(o.order_date))))].sort().reverse();
        return uniqueYears;
    }, [orders]);


    if (loading || !dashboardData) return <div className="p-8 text-center text-slate-500">Loading Admin Dashboard...</div>;

    const { kpi, chartData, pieData, topProducts, topCustomers } = dashboardData;

    return (
        <div className="space-y-8 fade-in pb-10">
            {/* Loading Indicator for Full Data */}
            {(dataStatus === 'initial_loaded' || dataStatus === 'loading_full') && (
                <div className="bg-blue-50 border border-blue-100 text-blue-700 px-4 py-3 rounded-xl flex items-center justify-between animate-pulse">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="font-medium text-sm">Showing preview data. Loading full history in background...</span>
                    </div>
                </div>
            )}
            {/* Header with Filters */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Admin Dashboard</h2>
                    <p className="text-slate-500">Performance overview & analytics</p>
                </div>

                <div className="flex items-center gap-3 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
                    <select
                        className="bg-transparent text-sm font-medium text-slate-700 outline-none px-2 py-1 cursor-pointer"
                        value={selectedYear}
                        onChange={e => setSelectedYear(e.target.value)}
                    >
                        <option value="All">All Years</option>
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <div className="w-[1px] h-4 bg-slate-200" />
                    <select
                        className="bg-transparent text-sm font-medium text-slate-700 outline-none px-2 py-1 cursor-pointer"
                        value={selectedMonth}
                        onChange={e => setSelectedMonth(e.target.value)}
                    >
                        <option value="All">All Months</option>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                            <option key={m} value={m}>{format(new Date(2022, m - 1, 1), 'MMMM')}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* --- KPI CARDS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Total Revenue"
                    value={kpi.totalRevenue}
                    prefix="$"
                    icon={DollarSign}
                    color="text-emerald-500"
                    bgColor="bg-emerald-50"
                    subtitle="Gross Sales"
                />
                <MetricCard
                    title="Total Orders"
                    value={kpi.totalOrders}
                    isCurrency={false}
                    icon={ShoppingCart}
                    color="text-blue-500"
                    bgColor="bg-blue-50"
                    subtitle="Processed Orders"
                />
                <MetricCard
                    title="Total Customers"
                    value={kpi.totalCustomers}
                    isCurrency={false}
                    icon={Users}
                    color="text-purple-500"
                    bgColor="bg-purple-50"
                    subtitle="Registered Users"
                />
                <MetricCard
                    title="Total Products"
                    value={kpi.totalProducts}
                    isCurrency={false}
                    icon={Package}
                    color="text-amber-500"
                    bgColor="bg-amber-50"
                    subtitle="In Calendar"
                />
            </div>

            {/* --- ANALYTICS CHARTS --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* 1. Revenue Line Chart (2/3) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <TrendingUp size={18} className="text-emerald-500" /> Revenue Trend
                    </h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                                    tickFormatter={(val) => `$${val / 1000}k`}
                                />
                                <Tooltip
                                    formatter={(val) => [`$${val.toLocaleString()}`, 'Revenue']}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. Order Status Pie (1/3) */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <AlertCircle size={18} className="text-slate-400" /> Order Status
                    </h3>
                    <div className="h-72 flex flex-col items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3. Orders Bar Chart (Full Width) */}
                <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Orders Volume</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

            {/* --- TOP 5 TABLES --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Top Products */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-50">
                        <h3 className="font-bold text-slate-900">Top 5 Products</h3>
                    </div>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 font-medium">
                            <tr>
                                <th className="px-6 py-3">Product Name</th>
                                <th className="px-6 py-3 text-right">Revenue</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {topProducts.map((p, i) => (
                                <tr key={i} className="group hover:bg-slate-50/50">
                                    <td className="px-6 py-3 font-medium text-slate-700 group-hover:text-blue-600 truncate max-w-xs" title={p.name}>
                                        {p.name}
                                    </td>
                                    <td className="px-6 py-3 text-right font-bold text-slate-900">
                                        ${p.revenue.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Top Customers */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-50">
                        <h3 className="font-bold text-slate-900">Top 5 Customers</h3>
                    </div>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 font-medium">
                            <tr>
                                <th className="px-6 py-3">Customer Name</th>
                                <th className="px-6 py-3 text-right">Total Spend</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {topCustomers.map((c, i) => (
                                <tr key={i} className="group hover:bg-slate-50/50">
                                    <td className="px-6 py-3 font-medium text-slate-700 group-hover:text-blue-600">
                                        {c.name}
                                    </td>
                                    <td className="px-6 py-3 text-right font-bold text-slate-900">
                                        ${c.spend.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Overview;
