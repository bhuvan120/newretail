import { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useFilters } from '../context/FilterContext';

export const useFilteredData = () => {
    const { products, orders, returns, orderItems, loading } = useData();
    const { filters } = useFilters();

    return useMemo(() => {
        if (loading) return {
            products: [], orders: [], returns: [], orderItems: [],
            filteredOrders: [], filteredItems: [], loading: true
        };

        // 1. FILTER PRODUCTS
        const filteredProducts = products.filter(p => {
            const matchesCat = filters.category === 'All' || p.product_category === filters.category;
            const matchesBrand = filters.brand === 'All' || p.product_brand === filters.brand;
            const matchesDept = filters.department === 'All' || p.product_department === filters.department;
            return matchesCat && matchesBrand && matchesDept;
        });

        const filteredProductIds = new Set(filteredProducts.map(p => p.product_id));

        // 2. FILTER ORDERS
        // Note: Filtering orders purely by Date here. 
        // If we want to filter orders that Contain a specific category, it's harder 
        // because we'd need to check if ANY item in order matches category.
        // For DASHBOARD purposes, usually date filter applies to orders. 
        // Product filters (Category/Brand) apply to SALES VOLUME (Items).

        const filteredOrders = orders.filter(o => {
            if (o.order_status === 'Cancelled') return false;

            // Date Filter
            if (filters.startDate && o.order_date < filters.startDate) return false;
            if (filters.endDate && o.order_date > filters.endDate) return false;

            return true;
        });

        const validOrderIds = new Set(filteredOrders.map(o => o.order_id));

        // 3. FILTER ITEMS
        const filteredItems = orderItems.filter(item => {
            return validOrderIds.has(item.order_id) && filteredProductIds.has(item.product_id);
        });

        return {
            products: filteredProducts,
            orders: filteredOrders,
            returns, // We could filter returns by date too if needed
            orderItems: filteredItems,
            loading: false
        };
    }, [products, orders, returns, orderItems, filters, loading]);
};
