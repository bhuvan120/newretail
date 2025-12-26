import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => {
    return useContext(DataContext);
};

export const DataProvider = ({ children }) => {
    const [data, setData] = useState({
        products: [],
        orders: [],
        returns: [],
        customers: [],
        orderItems: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                // Fetch all data in parallel
                const [productsRes, ordersRes, returnsRes, customersRes, orderItemsRes] = await Promise.all([
                    fetch('/vajra_products.json'),
                    fetch('/vajra_orders.json'),
                    fetch('/vajra_order_returns.json'),
                    fetch('/vajra_customers.json'),
                    fetch('/vajra_order_items.json')
                ]);

                if (!productsRes.ok || !ordersRes.ok || !returnsRes.ok || !customersRes.ok || !orderItemsRes.ok) {
                    throw new Error('Failed to load one or more datasets');
                }

                const products = await productsRes.json();
                const orders = await ordersRes.json();
                const returns = await returnsRes.json();
                const customers = await customersRes.json();
                const orderItems = await orderItemsRes.json();

                setData({
                    products,
                    orders,
                    returns,
                    customers,
                    orderItems
                });
            } catch (err) {
                console.error("Error loading data:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    return (
        <DataContext.Provider value={{ ...data, loading, error }}>
            {children}
        </DataContext.Provider>
    );
};
