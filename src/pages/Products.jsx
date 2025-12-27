import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Search, ArrowUpDown, ChevronLeft, ChevronRight, Check, X, DollarSign, Percent } from 'lucide-react';

const Products = () => {
    const { products, loading, dataStatus } = useData();
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({
        category: 'All',
        department: 'All',
        status: 'All',
        minPrice: '',
        maxPrice: '',
        minMargin: '',
        maxMargin: ''
    });
    const [sort, setSort] = useState({ key: 'product_id', direction: 'asc' });

    const ITEMS_PER_PAGE = 20;

    // Extract unique options for filters
    const categories = useMemo(() => {
        if (!products.length) return [];
        return ['All', ...new Set(products.map(p => p.product_category))].sort();
    }, [products]);

    const departments = useMemo(() => {
        if (!products.length) return [];
        return ['All', ...new Set(products.map(p => p.product_department))].sort();
    }, [products]);

    // Filter and Sort Data
    const filteredProducts = useMemo(() => {
        if (!products.length) return [];

        return products.filter(product => {
            const matchesSearch = product.product_name.toLowerCase().includes(search.toLowerCase()) ||
                product.product_brand.toLowerCase().includes(search.toLowerCase());

            const matchesCategory = filters.category === 'All' || product.product_category === filters.category;
            const matchesDept = filters.department === 'All' || product.product_department === filters.department;

            const matchesStatus = filters.status === 'All' ||
                (filters.status === 'Active' ? product.is_product_active : !product.is_product_active);

            // Price Range
            const price = product.selling_unit_price;
            const minP = filters.minPrice ? parseFloat(filters.minPrice) : 0;
            const maxP = filters.maxPrice ? parseFloat(filters.maxPrice) : Infinity;
            const matchesPrice = price >= minP && price <= maxP;

            // Margin Range
            const margin = product.product_margin_percent * 100; // Convert 0.5 to 50
            const minM = filters.minMargin ? parseFloat(filters.minMargin) : 0;
            const maxM = filters.maxMargin ? parseFloat(filters.maxMargin) : 100;
            const matchesMargin = margin >= minM && margin <= maxM;


            return matchesSearch && matchesCategory && matchesDept && matchesStatus && matchesPrice && matchesMargin;
        }).sort((a, b) => {
            let valA = a[sort.key];
            let valB = b[sort.key];

            // Handle string vs number sorting if needed, mostly numbers here
            if (typeof valA === 'string') valA = valA.toLowerCase();
            if (typeof valB === 'string') valB = valB.toLowerCase();

            if (valA < valB) return sort.direction === 'asc' ? -1 : 1;
            if (valA > valB) return sort.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [products, search, filters, sort]);

    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = filteredProducts.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    const handleSort = (key) => {
        setSort(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPage(1); // Reset to first page on filter change
    };

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="space-y-6 fade-in h-full flex flex-col">
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
                    <h2 className="text-2xl font-bold text-slate-900">Products Inventory</h2>
                    <p className="text-slate-500">{filteredProducts.length} items found</p>
                </div>
            </header>

            {/* Filters Bar */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                {/* Top Row: Search & Dropdowns */}
                <div className="flex flex-wrap gap-4">
                    <div className="relative flex-1 min-w-[240px]">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, brand..."
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        />
                    </div>

                    <select
                        className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        value={filters.category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                    >
                        {categories.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
                    </select>

                    <select
                        className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        value={filters.department}
                        onChange={(e) => handleFilterChange('department', e.target.value)}
                    >
                        {departments.map(d => <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>)}
                    </select>

                    <select
                        className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                        <option value="All">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>

                {/* Bottom Row: Range Inputs */}
                <div className="flex flex-wrap gap-6 pt-2 border-t border-slate-100">
                    {/* Price Range */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-700 flex items-center gap-1">
                            <DollarSign size={14} /> Price:
                        </span>
                        <input
                            type="number" placeholder="Min" className="w-20 px-2 py-1 border border-slate-200 rounded text-sm"
                            value={filters.minPrice} onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                        />
                        <span className="text-slate-400">-</span>
                        <input
                            type="number" placeholder="Max" className="w-20 px-2 py-1 border border-slate-200 rounded text-sm"
                            value={filters.maxPrice} onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                        />
                    </div>

                    {/* Margin Range */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-700 flex items-center gap-1">
                            <Percent size={14} /> Margin %:
                        </span>
                        <input
                            type="number" placeholder="0" className="w-16 px-2 py-1 border border-slate-200 rounded text-sm"
                            value={filters.minMargin} onChange={(e) => handleFilterChange('minMargin', e.target.value)}
                        />
                        <span className="text-slate-400">-</span>
                        <input
                            type="number" placeholder="100" className="w-16 px-2 py-1 border border-slate-200 rounded text-sm"
                            value={filters.maxMargin} onChange={(e) => handleFilterChange('maxMargin', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-xl border border-slate-200 flex-1 overflow-hidden flex flex-col shadow-sm">
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 sticky top-0 bg-slate-50 z-10">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Product</th>
                                <th className="px-6 py-4 font-semibold cursor-pointer hover:text-blue-600" onClick={() => handleSort('product_category')}>
                                    Category {sort.key === 'product_category' && <ArrowUpDown className="inline w-3 h-3" />}
                                </th>
                                <th className="px-6 py-4 font-semibold cursor-pointer hover:text-blue-600" onClick={() => handleSort('product_brand')}>
                                    Brand {sort.key === 'product_brand' && <ArrowUpDown className="inline w-3 h-3" />}
                                </th>
                                <th className="px-6 py-4 font-semibold text-right cursor-pointer hover:text-blue-600" onClick={() => handleSort('cost_unit_price')}>
                                    Cost
                                </th>
                                <th className="px-6 py-4 font-semibold text-right cursor-pointer hover:text-blue-600" onClick={() => handleSort('selling_unit_price')}>
                                    Price {sort.key === 'selling_unit_price' && <ArrowUpDown className="inline w-3 h-3" />}
                                </th>
                                <th className="px-6 py-4 font-semibold text-right cursor-pointer hover:text-blue-600" onClick={() => handleSort('product_margin')}>
                                    Margin ($)
                                </th>
                                <th className="px-6 py-4 font-semibold text-right cursor-pointer hover:text-blue-600" onClick={() => handleSort('product_margin_percent')}>
                                    Margin (%)
                                </th>
                                <th className="px-6 py-4 font-semibold text-right cursor-pointer hover:text-blue-600" onClick={() => handleSort('units_in_stock')}>
                                    Stock
                                </th>
                                <th className="px-6 py-4 font-semibold text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {paginatedProducts.map((product) => (
                                <tr key={product.product_id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-200">
                                                <img
                                                    src={product.product_image || "https://placehold.co/100"}
                                                    alt=""
                                                    className="h-full w-full object-cover"
                                                    onError={(e) => e.target.src = "https://placehold.co/100?text=IMG"}
                                                />
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-900 line-clamp-1 w-48" title={product.product_name}>{product.product_name}</div>
                                                <div className="text-xs text-slate-400">ID: {product.product_id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 text-slate-600">{product.product_category}</td>
                                    <td className="px-6 py-3 text-slate-600">{product.product_brand}</td>
                                    <td className="px-6 py-3 text-right text-slate-500">
                                        ${(product.cost_unit_price || 0).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-3 text-right font-medium text-slate-900">
                                        ${product.selling_unit_price.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-3 text-right text-emerald-600 font-medium">
                                        +${(product.product_margin || 0).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-3 text-right">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${product.product_margin_percent > 0.5 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                            {((product.product_margin_percent || 0) * 100).toFixed(0)}%
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-right font-medium">
                                        {product.units_in_stock}
                                    </td>
                                    <td className="px-6 py-3 text-center">
                                        {product.is_product_active ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                                Inactive
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
                    <div className="text-sm text-slate-500">
                        Showing {(page - 1) * ITEMS_PER_PAGE + 1} to {Math.min(page * ITEMS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} entries
                    </div>
                    <div className="flex gap-2">
                        <button
                            className="p-2 border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-white transition-colors"
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            className="p-2 border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-white transition-colors"
                            disabled={page === totalPages}
                            onClick={() => setPage(p => p + 1)}
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;
