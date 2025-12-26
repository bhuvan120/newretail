import React from 'react';

const Reports = () => {
    return (
        <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Reports Center</h2>
            <p className="text-slate-500 mb-8">Export detailed data sets for external analysis.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {['Sales Report', 'Inventory Report', 'Customer Activity', 'Refund Analysis'].map((r) => (
                    <div key={r} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-blue-500 cursor-pointer transition-colors">
                        <h3 className="font-bold text-slate-800 mb-2">{r}</h3>
                        <p className="text-sm text-slate-500 mb-4">Daily updated CSV export.</p>
                        <button className="text-blue-600 font-medium text-sm hover:underline">Download CSV</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Reports;
