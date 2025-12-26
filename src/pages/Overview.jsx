import React, { useMemo } from 'react';
import { useFilteredData } from '../hooks/useFilteredData';
import MetricCard from '../components/MetricCard';
import { calculateProfitTrends } from '../utils/analyticsUtils';
import {
    DollarSign, TrendingUp, ShoppingCart, AlertCircle,
    Package, Archive, Filter
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';

const Overview = () => {
    const {
        orders,
        orderItems,
        products: filteredProducts,
        loading
    } = useFilteredData();

    // --- KPI CALCULATIONS ---
    const stats = useMemo(() => {
        if (loading) return { revenue: 0, profit: 0, cost: 0, returns: 0, active: 0, inactive: 0, filteredOrders: 0 };

        let revenue = 0;
        let cost = 0;
        let returns = 0;

        // Product Cost Map
        const productMap = new Map();
        filteredProducts.forEach(p => productMap.set(p.product_id, p));

        orderItems.forEach(item => {
            if (item.is_returned) {
                returns++;
                return; // Exclude returned items from revenue/profit? 
                // Usually "Total Returns" count is needed. 
                // Net Sales excludes returns.
            }
            const p = productMap.get(item.product_id);
            if (!p) return;

            const r = item.total_amount || 0;
            const c = (p.cost_unit_price || 0) * item.ordered_quantity;

            revenue += r;
            cost += c;
        });

        const active = filteredProducts.filter(p => p.is_product_active).length;
        const inactive = filteredProducts.length - active;

        return {
            revenue,
            profit: revenue - cost,
            cost,
            returns,
            active,
            inactive,
            filteredOrders: orders.length
        };
    }, [orders, orderItems, filteredProducts, loading]);

    const trendData = useMemo(() => {
        if (loading) return [];
        return calculateProfitTrends(orders, orderItems, filteredProducts);
    }, [orders, orderItems, filteredProducts, loading]);


    if (loading) return <div className="p-8 text-center text-slate-500">Loading dashboard...</div>;

    return (
        <div className="space-y-8 fade-in pb-10">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Dashboard Overview</h2>
                <p className="text-slate-500">Welcome back, Admin. Here's what's happening today.</p>
            </div>

            {/* --- ROW 1: FINANCIALS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Total Revenue"
                    value={stats.revenue}
                    prefix="$"
                    icon={DollarSign}
                    color="text-emerald-500"
                    bgColor="bg-emerald-50"
                    subtitle="Net Sales (Filtered)"
                />
                <MetricCard
                    title="Total Profit"
                    value={stats.profit}
                    prefix="$"
                    icon={TrendingUp}
                    color="text-blue-500"
                    bgColor="bg-blue-50"
                    subtitle={`${((stats.profit / stats.revenue) * 100 || 0).toFixed(1)}% Margin`}
                />
                <MetricCard
                    title="Total Cost"
                    value={stats.cost}
                    prefix="$"
                    icon={ShoppingCart}
                    color="text-purple-500"
                    bgColor="bg-purple-50"
                    subtitle="COGS"
                />
                <MetricCard
                    title="Total Returns"
                    value={stats.returns}
                    isCurrency={false}
                    icon={AlertCircle}
                    color="text-rose-500"
                    bgColor="bg-rose-50"
                    subtitle="Returned Items"
                />
            </div>

            {/* --- ROW 2: INVENTORY & ORDERS --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard
                    title="Active Products"
                    value={stats.active}
                    isCurrency={false}
                    icon={Package}
                    color="text-emerald-600"
                    bgColor="bg-emerald-50"
                    subtitle="In Catalogue"
                />
                <MetricCard
                    title="Inactive Products"
                    value={stats.inactive}
                    isCurrency={false}
                    icon={Archive}
                    color="text-slate-600"
                    bgColor="bg-slate-50"
                    subtitle="Archived/Draft"
                />
                <MetricCard
                    title="Filtered Orders"
                    value={stats.filteredOrders}
                    isCurrency={false}
                    icon={Filter}
                    color="text-indigo-600"
                    bgColor="bg-indigo-50"
                    subtitle="Matching Criteria"
                />
            </div>

            {/* --- ROW 3: CHARTS --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Trend Chart (2/3 width) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Revenue & Profit Trend</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="displayDate" />
                                <YAxis tickFormatter={(val) => `$${val / 1000}k`} />
                                <Tooltip formatter={(val) => `$${val.toLocaleString()}`} />
                                <Line type="monotone" dataKey="Revenue" stroke="#10b981" strokeWidth={3} dot={false} />
                                <Line type="monotone" dataKey="Profit" stroke="#3b82f6" strokeWidth={3} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Categories (1/3 width) - Placeholder or simple bar */}
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Top Categories by Revenue</h3>
                    <div className="flex items-center justify-center h-80 text-slate-400">
                        {/* We could reuse existing category chart logic here if we passed it in, 
                            but for now keeping it simple as per screenshot layout focus */}
                        <p>Chart Loading...</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview;
