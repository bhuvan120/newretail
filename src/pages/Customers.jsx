import React, { useMemo, useState } from 'react';
import { useData } from '../context/DataContext';
import { calculateCustomerSpending } from '../utils/analyticsUtils';
import { Search, MapPin } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const Customers = () => {
    const { orders, customers, loading, dataStatus } = useData(); // Use raw data for global list
    const [search, setSearch] = useState('');

    const customerData = useMemo(() => {
        if (loading) return [];
        return calculateCustomerSpending(orders, customers);
    }, [orders, customers, loading]);

    const filtered = customerData.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.id.toString().includes(search)
    );

    if (loading) return <div className="p-8 text-center text-slate-500">Loading customer profiles...</div>;

    return (
        <div className="space-y-6 fade-in pb-10">
            {/* Loading Indicator for Full Data */}
            {(dataStatus === 'initial_loaded' || dataStatus === 'loading_full') && (
                <div className="bg-blue-50 border border-blue-100 text-blue-700 px-4 py-3 rounded-xl flex items-center justify-between animate-pulse">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="font-medium text-sm">Showing preview data. Loading full history in background...</span>
                    </div>
                </div>
            )}
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Customers</h2>
                    <p className="text-slate-500">Total {customers.length} registered customers.</p>
                </div>
            </header>

            <div className="bg-white p-4 rounded-xl border border-slate-200">
                <div className="relative w-64 mb-4">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search customers..."
                        className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-slate-700">Customer</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">ID</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Last Order</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-right">Total Spent</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filtered.slice(0, 50).map((c) => (
                                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900">{c.name}</div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-400 font-mono text-xs">
                                        {c.id}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {c.lastOrder ? format(parseISO(c.lastOrder), 'MMM dd, yyyy') : 'Never'}
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium text-emerald-600">
                                        ${c.totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p className="p-4 text-xs text-slate-400 text-center">Showing top 50 matches</p>
                </div>
            </div>
        </div>
    );
};

export default Customers;
