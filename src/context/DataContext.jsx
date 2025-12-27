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
    const [dataStatus, setDataStatus] = useState('idle'); // 'idle' | 'loading_initial' | 'initial_loaded' | 'loading_full' | 'fully_loaded'
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setDataStatus('loading_initial');

                // 1. FAST INITIAL LOAD (Truncated Data)
                try {
                    const [pS, oS, rS, cS, iS] = await Promise.all([
                        fetch('/vajra_products_small.json'),
                        fetch('/vajra_orders_small.json'),
                        fetch('/vajra_order_returns_small.json'),
                        fetch('/vajra_customers_small.json'),
                        fetch('/vajra_order_items_small.json')
                    ]);

                    if (pS.ok && oS.ok && rS.ok && cS.ok && iS.ok) {
                        const [productsSmall, ordersSmall, returnsSmall, customersSmall, orderItemsSmall] = await Promise.all([
                            pS.json(), oS.json(), rS.json(), cS.json(), iS.json()
                        ]);

                        setData({
                            products: productsSmall,
                            orders: ordersSmall,
                            returns: returnsSmall,
                            customers: customersSmall,
                            orderItems: orderItemsSmall
                        });
                        setLoading(false);
                        setDataStatus('initial_loaded');
                    }
                } catch (smallErr) {
                    console.warn("Fast load failed", smallErr);
                }

                // 2. BACKGROUND FULL LOAD
                setDataStatus('loading_full');
                const [productsRes, ordersRes, returnsRes, customersRes, orderItemsRes] = await Promise.all([
                    fetch('/vajra_products.json'),
                    fetch('/vajra_orders.json'),
                    fetch('/vajra_order_returns.json'),
                    fetch('/vajra_customers.json'),
                    fetch('/vajra_order_items.json')
                ]);

                if (!productsRes.ok || !ordersRes.ok || !returnsRes.ok || !customersRes.ok || !orderItemsRes.ok) {
                    throw new Error('Failed to load full datasets');
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
                setDataStatus('fully_loaded');

            } catch (err) {
                console.error("Error loading data:", err);
                setError(err.message);
                setLoading(false);
            }
        };

        loadData();
    }, []);

    return (
        <DataContext.Provider value={{ ...data, loading, dataStatus, error }}>
            {children}
        </DataContext.Provider>
    );
};
