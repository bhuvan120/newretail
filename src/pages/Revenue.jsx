import React, { useMemo } from 'react';
import { useFilteredData } from '../hooks/useFilteredData';
import { calculateTopProducts, calculateProfitByCatDept } from '../utils/analyticsUtils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const Revenue = () => {
    const { orderItems, filteredProducts, loading, dataStatus } = useFilteredData();

    const { topRevenue, topProfit, lowestProfit, heatMapData } = useMemo(() => {
        if (loading) return { topRevenue: [], topProfit: [], lowestProfit: [], heatMapData: [] };
        const tops = calculateTopProducts(orderItems, filteredProducts);
        const heat = calculateProfitByCatDept(orderItems, filteredProducts);
        return {
            topRevenue: tops.byRevenue,
            topProfit: tops.byProfit,
            lowestProfit: tops.lowestProfit,
            heatMapData: heat
        };
    }, [orderItems, filteredProducts, loading]);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading revenue intelligence...</div>;

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
            <header>
                <h2 className="text-2xl font-bold text-slate-900">Revenue & Profit Insights</h2>
                <p className="text-slate-500">Identify top performers and underperforming assets.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top 10 by Revenue */}
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Top 10 Products by Revenue</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topRevenue} layout="vertical" margin={{ left: 20 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 11 }} />
                                <Tooltip formatter={(val) => `$${val.toLocaleString()}`} />
                                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top 10 by Profit */}
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Top 10 Products by Profit</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topProfit} layout="vertical" margin={{ left: 20 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 11 }} />
                                <Tooltip formatter={(val) => `$${val.toLocaleString()}`} />
                                <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Lowest Performing */}
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Lowest Profit Generators</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={lowestProfit} layout="vertical" margin={{ left: 20 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 11 }} />
                                <Tooltip formatter={(val) => `$${val.toLocaleString()}`} />
                                <Bar dataKey="value" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Profit Heatmap (Simplified as List) */}
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm overflow-y-auto max-h-96">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Profit by Category & Dept</h3>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="p-2">Category</th>
                                <th className="p-2">Department</th>
                                <th className="p-2 text-right">Profit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {heatMapData.sort((a, b) => b.profit - a.profit).map((d, i) => (
                                <tr key={i} className="border-b border-slate-50">
                                    <td className="p-2 font-medium">{d.category}</td>
                                    <td className="p-2 text-slate-500">{d.department}</td>
                                    <td className={`p-2 text-right font-bold ${d.profit > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        ${d.profit.toLocaleString()}
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

export default Revenue;
