import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, Check, X } from 'lucide-react';

const Products = () => {
    const { products, loading } = useData();
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({
        category: 'All',
        department: 'All',
        status: 'All'
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

            return matchesSearch && matchesCategory && matchesDept && matchesStatus;
        }).sort((a, b) => {
            if (a[sort.key] < b[sort.key]) return sort.direction === 'asc' ? -1 : 1;
            if (a[sort.key] > b[sort.key]) return sort.direction === 'asc' ? 1 : -1;
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

    if (loading) return <div className="p-8 text-center text-slate-500">Loading products...</div>;

    return (
        <div className="space-y-6 fade-in h-full flex flex-col">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Products</h2>
                    <p className="text-slate-500">{filteredProducts.length} items found</p>
                </div>
            </header>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap gap-4 items-center">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search products, brands..."
                        className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <select
                    className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    value={filters.category}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                <select
                    className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    value={filters.department}
                    onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                >
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>

                <select
                    className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                >
                    <option value="All">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-xl border border-slate-200 flex-1 overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-slate-700">Image</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('product_name')}>
                                    Product Name {sort.key === 'product_name' && <ArrowUpDown className="inline w-4 h-4 ml-1" />}
                                </th>
                                <th className="px-6 py-4 font-semibold text-slate-700 cursor-pointer" onClick={() => handleSort('product_category')}>
                                    Category
                                </th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Brand</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-right cursor-pointer" onClick={() => handleSort('selling_unit_price')}>
                                    Price
                                </th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-right cursor-pointer" onClick={() => handleSort('units_in_stock')}>
                                    Stock
                                </th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {paginatedProducts.map((product) => (
                                <tr key={product.product_id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                                            {product.product_image ? (
                                                <img src={product.product_image} alt="" className="h-full w-full object-cover" />
                                            ) : (
                                                <span className="text-slate-400 text-xs">IMG</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900">{product.product_name}</div>
                                        <div className="text-xs text-slate-400">ID: {product.product_id}</div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{product.product_category}</td>
                                    <td className="px-6 py-4 text-slate-600">{product.product_brand}</td>
                                    <td className="px-6 py-4 text-right font-medium text-slate-900">
                                        ${product.selling_unit_price.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className={`font-medium ${(product.units_in_stock || 0) < 10 ? 'text-amber-600' :
                                                (product.units_in_stock || 0) === 0 ? 'text-rose-600' : 'text-slate-900'
                                            }`}>
                                            {product.units_in_stock || 0}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {product.is_product_active ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                                <Check size={12} /> In Stock
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                                                <X size={12} /> Out of Stock
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="p-4 border-t border-slate-200 flex items-center justify-between">
                    <div className="text-sm text-slate-500">
                        Showing {(page - 1) * ITEMS_PER_PAGE + 1} to {Math.min(page * ITEMS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} entries
                    </div>
                    <div className="flex gap-2">
                        <button
                            className="p-2 border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-50"
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            className="p-2 border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-50"
                            disabled={page === totalPages}
                            onClick={() => setPage(p => p + 1)}
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;
