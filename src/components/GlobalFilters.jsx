import React, { useMemo } from 'react';
import { useFilters } from '../context/FilterContext';
import { useData } from '../context/DataContext';
import { Filter, Calendar, X } from 'lucide-react';

const GlobalFilters = () => {
    const { filters, updateFilter, clearFilters } = useFilters();
    const { products } = useData();

    // Derive unique values for dropdowns from actual product data
    const uniqueValues = useMemo(() => {
        if (!products.length) return { categories: [], brands: [], departments: [] };

        const cats = new Set();
        const brands = new Set();
        const depts = new Set();

        products.forEach(p => {
            if (p.product_category) cats.add(p.product_category);
            if (p.product_brand) brands.add(p.product_brand);
            if (p.product_department) depts.add(p.product_department);
        });

        return {
            categories: Array.from(cats).sort(),
            brands: Array.from(brands).sort(),
            departments: Array.from(depts).sort()
        };
    }, [products]);

    const hasActiveFilters = Object.values(filters).some(val => val !== 'All' && val !== '');

    const Select = ({ label, value, onChange, options, disabled }) => (
        <div className="flex-1 min-w-[140px]">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all hover:border-slate-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
                style={{ backgroundImage: 'none' }} // Remove default arrow if needed, but standard select is fine
            >
                <option value="All">{label}: All</option>
                {options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
        </div>
    );

    return (
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm mb-8">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-slate-800 font-semibold">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <Filter size={18} />
                    </div>
                    <span>Global Filters</span>
                </div>

                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="text-xs font-medium text-rose-500 hover:bg-rose-50 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
                    >
                        <X size={12} /> Clear Filters
                    </button>
                )}
            </div>

            <div className="flex flex-wrap items-center gap-4">
                {/* Date Inputs */}
                <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                    <div className="relative">
                        <input
                            type="date"
                            value={filters.startDate}
                            onChange={(e) => updateFilter('startDate', e.target.value)}
                            className="pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm text-slate-600 focus:outline-none focus:border-blue-500 w-36"
                        />
                        <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                    <span className="text-slate-400">-</span>
                    <div className="relative">
                        <input
                            type="date"
                            value={filters.endDate}
                            onChange={(e) => updateFilter('endDate', e.target.value)}
                            className="pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm text-slate-600 focus:outline-none focus:border-blue-500 w-36"
                        />
                        <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                </div>

                <div className="h-8 w-px bg-slate-200 hidden md:block"></div>

                {/* Dropdowns */}
                <div className="flex flex-1 gap-3 overflow-x-auto pb-1 md:pb-0">
                    <Select
                        label="Category"
                        value={filters.category}
                        options={uniqueValues.categories}
                        onChange={(val) => updateFilter('category', val)}
                    />
                    <Select
                        label="Brand"
                        value={filters.brand}
                        options={uniqueValues.brands}
                        onChange={(val) => updateFilter('brand', val)}
                    />
                    <Select
                        label="Dept"
                        value={filters.department}
                        options={uniqueValues.departments}
                        onChange={(val) => updateFilter('department', val)}
                    />
                </div>
            </div>
        </div>
    );
};

export default GlobalFilters;
