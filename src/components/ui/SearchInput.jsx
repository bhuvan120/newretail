import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';

const SearchInput = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isFocused, setIsFocused] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    const { products, loading } = useData();
    const navigate = useNavigate();
    const wrapperRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsFocused(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Debounced Search Logic
    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            if (query.trim().length > 0) {
                setIsSearching(true);

                // Simulate network delay for "real feel"
                // In real app, this filtering is instant if data is local

                const searchLower = query.toLowerCase();
                const filtered = products.filter(item =>
                    item.name.toLowerCase().includes(searchLower) ||
                    item.category.toLowerCase().includes(searchLower) ||
                    (item.brand && item.brand.toLowerCase().includes(searchLower))
                ).slice(0, 5); // Limit to 5 results

                setResults(filtered);
                setIsSearching(false);
            } else {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [query, products]);

    const handleSelect = (productId) => {
        // Navigate or Open Product Details
        // For now, let's navigate to the products card page but ideally specific product
        navigate('/productscard');
        setQuery('');
        setIsFocused(false);
    };

    return (
        <div ref={wrapperRef} className="relative w-full max-w-md hidden md:block group">
            <div className={`
                flex items-center px-4 py-2 bg-slate-100 rounded-full border transition-all duration-300
                ${isFocused ? 'bg-white border-blue-500 ring-4 ring-blue-500/10 shadow-lg' : 'border-transparent hover:bg-slate-200'}
            `}>
                <Search size={18} className={`text-slate-400 mr-3 ${isFocused ? 'text-blue-500' : ''}`} />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    placeholder="Search for products, brands..."
                    className="w-full bg-transparent border-none outline-none text-slate-700 placeholder:text-slate-400 text-sm"
                />
                {query && (
                    <button
                        onClick={() => { setQuery(''); setResults([]); }}
                        className="p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>

            {/* Dropdown Results */}
            {isFocused && query.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-2">
                        {loading ? (
                            <div className="flex items-center justify-center py-8 text-slate-400 gap-2">
                                <Loader2 size={18} className="animate-spin" />
                                <span className="text-sm">Searching...</span>
                            </div>
                        ) : results.length > 0 ? (
                            <>
                                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">Products</h3>
                                <ul>
                                    {results.map((product) => (
                                        <li key={product.id}>
                                            <button
                                                onClick={() => handleSelect(product.id)}
                                                className="w-full flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors text-left group/item"
                                            >
                                                <div className="h-10 w-10 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                                                    <img src={product.image} alt="" className="h-full w-full object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-slate-700 truncate group-hover/item:text-blue-600 transition-colors">
                                                        {product.name}
                                                    </p>
                                                    <p className="text-xs text-slate-500 truncate">
                                                        {product.category} • {product.price}
                                                    </p>
                                                </div>
                                                <ArrowRight size={16} className="text-slate-300 opacity-0 group-hover/item:opacity-100 -translate-x-2 group-hover/item:translate-x-0 transition-all" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                                <div className="border-t border-slate-100 mt-2 pt-2">
                                    <button className="w-full py-2 text-center text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                        View all {results.length} results
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-slate-500 text-sm">No results found for "{query}"</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchInput;
