import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useCart } from '../context/CartContext';
import { Search, ShoppingBag, Tag, Star, Check, Filter, ArrowRight } from 'lucide-react';

const Products = () => {
  const { products, loading } = useData();
  const { addToCart } = useCart();

  // Filters State
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [department, setDepartment] = useState("All");
  const [sortBy, setSortBy] = useState("relevance"); // New
  const [priceRange, setPriceRange] = useState("All"); // New
  const [selectedBrand, setSelectedBrand] = useState("All"); // New

  // UI State
  const [addedItems, setAddedItems] = useState({});
  const [imageLoadErrors, setImageLoadErrors] = useState({});

  // Limit to 500 items from different categories (Round-Robin)
  const limitedProducts = useMemo(() => {
    if (!products.length) return [];

    // Group by category
    const groups = products.reduce((acc, product) => {
      const cat = product.product_category || 'Other';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(product);
      return acc;
    }, {});

    const result = [];
    const categoryNames = Object.keys(groups);
    let maxItems = 0;

    // Find max items in any single category to determine loop count
    categoryNames.forEach(cat => {
      if (groups[cat].length > maxItems) maxItems = groups[cat].length;
    });

    // Interleave products from each category
    for (let i = 0; i < maxItems; i++) {
      for (const cat of categoryNames) {
        if (result.length >= 500) break;
        if (groups[cat][i]) {
          result.push(groups[cat][i]);
        }
      }
      if (result.length >= 500) break;
    }

    return result;
  }, [products]);

  // Derived Data
  const categories = ['All', ...new Set(limitedProducts.map(p => p.product_category))].sort();
  const departments = ['All', ...new Set(limitedProducts.map(p => p.product_department))].sort();
  const brands = ['All', ...new Set(limitedProducts.map(p => p.product_brand))].sort(); // New

  const filteredProducts = limitedProducts.filter((p) => {
    const matchesSearch =
      p.product_name.toLowerCase().includes(search.toLowerCase()) ||
      p.product_brand.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = category === "All" || p.product_category === category;
    const matchesDepartment = department === "All" || p.product_department === department;
    const matchesBrand = selectedBrand === "All" || p.product_brand === selectedBrand; // New

    // Price Filtering Logic
    let matchesPrice = true;
    const price = p.selling_unit_price;
    if (priceRange === "All") matchesPrice = true;
    else if (priceRange === "under-25") matchesPrice = price < 25;
    else if (priceRange === "25-50") matchesPrice = price >= 25 && price <= 50;
    else if (priceRange === "50-100") matchesPrice = price > 50 && price <= 100;
    else if (priceRange === "over-100") matchesPrice = price > 100;

    return matchesSearch && matchesCategory && matchesDepartment && matchesBrand && matchesPrice;
  }).sort((a, b) => { // Sorting Logic
    if (sortBy === "price-asc") return a.selling_unit_price - b.selling_unit_price;
    if (sortBy === "price-desc") return b.selling_unit_price - a.selling_unit_price;
    if (sortBy === "name-asc") return a.product_name.localeCompare(b.product_name);
    return 0; // Default relevance (original order)
  });

  const handleAddToCart = (e, product) => {
    e.stopPropagation(); // Prevent card click
    addToCart({
      id: product.product_id,
      name: product.product_name,
      price: `$${product.selling_unit_price}`,
      image: product.product_image || ImageFallback(product),
      brand: product.product_brand
    });

    setAddedItems(prev => ({ ...prev, [product.product_id]: true }));
    setTimeout(() => {
      setAddedItems(prev => {
        const next = { ...prev };
        delete next[product.product_id];
        return next;
      });
    }, 2000);
  };


  const ImageFallback = (product) => {
    // Ensure images show people/models wearing the items
    const id = product.product_id;
    const cat = (product.product_category || "").toLowerCase();
    const dept = (product.product_department || "").toLowerCase();

    let keyword = "fashion,model";

    // Try to match category first with person-centric keywords
    if (cat.includes("cap") || cat.includes("hat")) keyword = "model,wearing,hat";
    else if (cat.includes("swim") || cat.includes("beach")) keyword = "model,swimwear";
    else if (dept.includes("women") || cat.includes("women") || cat.includes("dress")) keyword = "model,dress";
    else if (dept.includes("men") || cat.includes("men") || cat.includes("shirt")) keyword = "model,men,fashion";
    else {
      // If no match, round-robin/random selection from the allowed list based on ID
      const allowed = ["model,wearing,hat", "model,men,fashion", "model,swimwear", "model,dress"];
      // Simple hash of string ID to index
      const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
      keyword = allowed[hash % allowed.length];
    }

    return `https://loremflickr.com/400/533/${keyword}?lock=${id}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
          <p className="text-slate-500 font-medium animate-pulse">Curating collections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-100 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            The Collection
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-light">
            Explore our thoughtfully curated selection of premium essentials.
            Designed for quality, crafted for style.
          </p>
        </div>
      </div>

      {/* Sticky Filters Bar */}
      <div className="sticky top-20 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">

            {/* Search Pill */}
            <div className="relative w-full md:w-96 group">
              <input
                type="text"
                className="w-full pl-11 pr-4 py-2.5 bg-slate-100/50 hover:bg-slate-100 focus:bg-white border-none rounded-full text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-sm"
                placeholder="Search by name, brand..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-slate-600 transition-colors" size={18} />
            </div>

            {/* Filters Group */}
            <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-100/50 rounded-full text-sm font-medium text-slate-600 border border-transparent hover:border-slate-200 transition-all cursor-pointer whitespace-nowrap">
                <Filter size={16} />
                <span>Filters:</span>
              </div>

              {/* Sort By Select */}
              <div className="relative group">
                <select
                  className="appearance-none bg-white pl-4 pr-8 py-2 rounded-full border border-slate-200 text-sm font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-all shadow-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="relevance">Sort: Relevance</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                </select>
              </div>

              {/* Price Range Select */}
              <div className="relative group">
                <select
                  className="appearance-none bg-white pl-4 pr-8 py-2 rounded-full border border-slate-200 text-sm font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-all shadow-sm"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                >
                  <option value="All">All Prices</option>
                  <option value="under-25">Under $25</option>
                  <option value="25-50">$25 - $50</option>
                  <option value="50-100">$50 - $100</option>
                  <option value="over-100">Over $100</option>
                </select>
              </div>

              {/* Brand Select */}
              <div className="relative group">
                <select
                  className="appearance-none bg-white pl-4 pr-8 py-2 rounded-full border border-slate-200 text-sm font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-all shadow-sm"
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                >
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand === 'All' ? 'All Brands' : brand}</option>
                  ))}
                </select>
              </div>

              {/* Category Select */}
              <div className="relative group">
                <select
                  className="appearance-none bg-white pl-4 pr-10 py-2 rounded-full border border-slate-200 text-sm font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-all shadow-sm"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
                  ))}
                </select>
                <Tag className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
              </div>

              {/* Department Select */}
              <div className="relative group">
                <select
                  className="appearance-none bg-white pl-4 pr-10 py-2 rounded-full border border-slate-200 text-sm font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-all shadow-sm"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept === 'All' ? 'All Departments' : dept}</option>
                  ))}
                </select>
                <ShoppingBag className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Results Count */}
        <div className="mb-8 flex items-center justify-between">
          <p className="text-slate-500 text-sm font-medium">
            Showing <span className="text-slate-900 font-bold">{filteredProducts.length}</span> premium items
          </p>
        </div>

        {/* Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            {filteredProducts.map((product) => (
              <div
                key={product.product_id}
                className="group relative bg-white rounded-2xl p-4 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 ease-out border border-slate-100/60 hover:border-slate-200"
              >
                {/* Image Area */}
                <div className="aspect-[3/4] relative overflow-hidden rounded-2xl bg-slate-100 mb-5 shadow-inner">
                  <img
                    src={imageLoadErrors[product.product_id]
                      ? ImageFallback(product)
                      : (product.product_image || ImageFallback(product))
                    }
                    alt={product.product_name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out will-change-transform"
                    onError={() => setImageLoadErrors(prev => ({ ...prev, [product.product_id]: true }))}
                  />

                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75">
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      disabled={addedItems[product.product_id]}
                      className={`
                                                w-full py-3 rounded-xl font-semibold shadow-lg backdrop-blur-md transition-all duration-300 flex items-center justify-center gap-2
                                                ${addedItems[product.product_id]
                          ? 'bg-green-500 text-white'
                          : 'bg-white/90 hover:bg-white text-slate-900 hover:scale-[1.02]'
                        }
                                            `}
                    >
                      {addedItems[product.product_id] ? (
                        <><Check size={18} /> Added to Cart</>
                      ) : (
                        <><ShoppingBag size={18} /> Quick Add</>
                      )}
                    </button>
                  </div>

                  {/* Rating Badge */}
                  {product.product_rating && (
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm border border-slate-100">
                      <Star size={12} className="text-amber-400 fill-amber-400" />
                      <span className="text-xs font-bold text-slate-800">{product.product_rating}</span>
                    </div>
                  )}
                </div>

                {/* Content Area */}
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-xs font-bold tracking-wider text-blue-600 uppercase bg-blue-50 px-2 py-1 rounded-md">
                      {product.product_brand}
                    </div>
                    <span className="text-lg font-bold text-slate-900 tracking-tight">
                      ${product.selling_unit_price}
                    </span>
                  </div>

                  <h3
                    className="text-base font-semibold text-slate-800 leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2"
                    title={product.product_name}
                  >
                    {product.product_name}
                  </h3>

                  <div className="flex items-center justify-between text-xs text-slate-400 font-medium pt-3 border-t border-slate-50 mt-4">
                    <span className='flex items-center gap-1'>
                      {product.product_department}
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300 flex items-center text-slate-300 group-hover:text-blue-500">
                      Details <ArrowRight size={12} className="ml-1" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="bg-slate-50 p-6 rounded-full mb-6">
              <Search size={48} className="text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No matches found</h3>
            <p className="text-slate-500 max-w-md text-center">
              We couldn't find any products matching your filters.
              Try searching for something else or clear the filters.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setCategory('All');
                setDepartment('All');
                setSortBy('relevance');
                setPriceRange('All');
                setSelectedBrand('All');
              }}
              className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
