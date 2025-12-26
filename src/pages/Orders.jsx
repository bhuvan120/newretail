import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { format, parseISO } from 'date-fns';

const Orders = () => {
    const { orders, loading } = useData();
    const [page, setPage] = useState(1);
    const LIMIT = 20;

    if (loading) return <div className="p-8 text-center text-slate-500">Loading orders...</div>;

    // Sort by recent
    const sortedOrders = [...orders].sort((a, b) => (a.order_date > b.order_date ? -1 : 1));
    const paginated = sortedOrders.slice((page - 1) * LIMIT, page * LIMIT);

    return (
        <div className="space-y-6 fade-in pb-10">
            <header>
                <h2 className="text-2xl font-bold text-slate-900">Orders</h2>
                <p className="text-slate-500">{orders.length} total orders found.</p>
            </header>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-slate-700">Order ID</th>
                            <th className="px-6 py-4 font-semibold text-slate-700">Date</th>
                            <th className="px-6 py-4 font-semibold text-slate-700">Customer ID</th>
                            <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {paginated.map((o) => (
                            <tr key={o.order_id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 text-slate-900 font-medium font-mono">{o.order_id}</td>
                                <td className="px-6 py-4 text-slate-600">
                                    {o.order_date ? format(parseISO(o.order_date), 'MMM dd, yyyy') : '-'}
                                </td>
                                <td className="px-6 py-4 text-slate-500">{o.customer_id}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${o.order_status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                                            o.order_status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                                o.order_status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-amber-100 text-amber-700'
                                        }`}>
                                        {o.order_status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right font-medium text-slate-900">
                                    ${o.order_total_amount.toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="p-4 border-t border-slate-200 flex justify-between">
                    <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
                    <span>Page {page}</span>
                    <button disabled={paginated.length < LIMIT} onClick={() => setPage(p => p + 1)} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
                </div>
            </div>
        </div>
    );
};

export default Orders;
