import React, { useMemo } from 'react';
import { useData } from '../context/DataContext';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts';
import { Clock, Truck, RotateCcw } from 'lucide-react';
import { differenceInDays, parseISO, format } from 'date-fns';

const Returns = () => {
    const { returns, loading, dataStatus } = useData();

    const analytics = useMemo(() => {
        if (loading) return null;

        let totalProcessingTime = 0;
        let totalPickupDelay = 0;
        const monthlyReturns = {};

        returns.forEach(ret => {
            // Refund Processing Time
            if (ret.refund_processed_date && ret.return_date) {
                const days = differenceInDays(parseISO(ret.refund_processed_date), parseISO(ret.return_date));
                totalProcessingTime += days;
            }

            // Pickup Delay
            if (ret.pickup_scheduled_date && ret.return_date) {
                const days = differenceInDays(parseISO(ret.pickup_scheduled_date), parseISO(ret.return_date));
                totalPickupDelay += days;
            }

            // Monthly Count
            if (ret.return_date) {
                const month = ret.return_date.substring(0, 7);
                monthlyReturns[month] = (monthlyReturns[month] || 0) + 1;
            }
        });

        const avgProcessingTime = totalProcessingTime / returns.length;
        const avgPickupDelay = totalPickupDelay / returns.length;

        const chartData = Object.keys(monthlyReturns)
            .sort()
            .map(date => ({
                name: format(parseISO(date + "-01"), "MMM yyyy"),
                Returns: monthlyReturns[date]
            }));

        return {
            avgProcessingTime,
            avgPickupDelay,
            chartData
        };
    }, [returns, loading]);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading returns analysis...</div>;

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
                <h2 className="text-2xl font-bold text-slate-900">Returns Analytics</h2>
                <p className="text-slate-500">Analyze return rates, processing times, and logistics efficiency.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-100 flex items-center gap-4">
                    <div className="p-3 bg-rose-50 rounded-lg text-rose-600">
                        <RotateCcw size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Total Returns</p>
                        <p className="text-2xl font-bold text-slate-900">{returns.length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-100 flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Avg Refund Time</p>
                        <p className="text-2xl font-bold text-slate-900">{analytics.avgProcessingTime.toFixed(1)} Days</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-100 flex items-center gap-4">
                    <div className="p-3 bg-orange-50 rounded-lg text-orange-600">
                        <Truck size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Avg Pickup Delay</p>
                        <p className="text-2xl font-bold text-slate-900">{analytics.avgPickupDelay.toFixed(1)} Days</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Returns Volume per Month</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analytics.chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="Returns" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Returns;
