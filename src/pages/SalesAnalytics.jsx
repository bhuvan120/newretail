import React, { useMemo } from 'react';
import { useFilteredData } from '../hooks/useFilteredData';
import { calculateProfitTrends } from '../utils/analyticsUtils';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend, BarChart, Bar
} from 'recharts';
import { Download } from 'lucide-react';

const SalesAnalytics = () => {
    const { orders, orderItems, products: filteredProducts, loading, dataStatus } = useFilteredData();

    const { trendData, categoryData, brandData, deptData } = useMemo(() => {
        if (loading) return { trendData: [], categoryData: [], brandData: [], deptData: [] };

        // 1. Trend Data
        const trends = calculateProfitTrends(orders, orderItems, filteredProducts);

        // 2. Breakdown Data
        const catMap = {}, brandMap = {}, deptMap = {};
        const productMap = new Map();
        filteredProducts.forEach(p => productMap.set(p.product_id, p));

        orderItems.forEach(item => {
            if (item.is_returned) return;
            const p = productMap.get(item.product_id);
            if (!p) return;
            const amt = item.total_amount || 0;

            catMap[p.product_category || 'Unknown'] = (catMap[p.product_category || 'Unknown'] || 0) + amt;
            brandMap[p.product_brand || 'Unknown'] = (brandMap[p.product_brand || 'Unknown'] || 0) + amt;
            deptMap[p.product_department || 'Unknown'] = (deptMap[p.product_department || 'Unknown'] || 0) + amt;
        });

        const toArray = (m) => Object.entries(m)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);

        return {
            trendData: trends,
            categoryData: toArray(catMap),
            brandData: toArray(brandMap).slice(0, 10), // Top 10 brands
            deptData: toArray(deptMap)
        };
    }, [orders, orderItems, filteredProducts, loading]);

    const handleDownload = () => {
        const headers = ['Date,Revenue,Cost,Profit\n'];
        const rows = trendData.map(d => `${d.name},${d.Revenue},${d.Cost},${d.Profit}`);
        const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "sales_analytics.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading analytics...</div>;

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
            <header className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Sales & Revenue Analytics</h2>
                    <p className="text-slate-500">Deep dive into revenue, cost, and profit margins over time.</p>
                </div>
                <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">
                    <Download size={16} /> Export CSV
                </button>
            </header>

            {/* Profit vs Cost Area Chart */}
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Profit vs Cost Over Time</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="displayDate" />
                            <YAxis tickFormatter={(val) => `$${val / 1000}k`} />
                            <Tooltip formatter={(val) => `$${val.toLocaleString()}`} />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <Legend />
                            <Area type="monotone" dataKey="Profit" stroke="#10b981" fillOpacity={1} fill="url(#colorProfit)" />
                            <Area type="monotone" dataKey="Cost" stroke="#ef4444" fillOpacity={1} fill="url(#colorCost)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Monthly Revenue Trend */}
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Monthly Revenue Trend</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="displayDate" />
                            <YAxis tickFormatter={(val) => `$${val / 1000}k`} />
                            <Tooltip formatter={(val) => `$${val.toLocaleString()}`} />
                            <Legend />
                            <Line type="monotone" dataKey="Revenue" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Breakdown Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* By Category */}
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-500 uppercase mb-4">Revenue by Category</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categoryData}>
                                <Tooltip formatter={(val) => `$${val.toLocaleString()}`} />
                                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* By Brand */}
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-500 uppercase mb-4">Revenue by Brand (Top 10)</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={brandData} layout="vertical">
                                <Tooltip formatter={(val) => `$${val.toLocaleString()}`} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 10 }} />
                                <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* By Dept */}
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-500 uppercase mb-4">Revenue by Dept</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={deptData}>
                                <Tooltip formatter={(val) => `$${val.toLocaleString()}`} />
                                <Bar dataKey="value" fill="#ec4899" radius={[4, 4, 0, 0]} />
                                <XAxis dataKey="name" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesAnalytics;
