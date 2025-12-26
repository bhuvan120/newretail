import { format, parseISO } from 'date-fns';

export const calculateRevenueByMonth = (orders) => {
    // Aggregate revenue by YYYY-MM
    const agg = {};
    orders.forEach(order => {
        if (!order.order_date || order.order_status === 'Cancelled') return;
        const monthKey = order.order_date.substring(0, 7); // "2023-11"
        agg[monthKey] = (agg[monthKey] || 0) + (order.order_total_amount || 0);
    });

    // Convert to array and sort
    return Object.keys(agg).map(key => ({
        name: key, // Keep YYYY-MM for sorting
        Revenue: parseFloat(agg[key].toFixed(2)),
        displayDate: format(parseISO(key + "-01"), "MMM yyyy")
    })).sort((a, b) => a.name.localeCompare(b.name));
};

export const calculateRevenueByCategory = (orderItems, products) => {
    // Map product_id to category
    const productMap = new Map();
    products.forEach(p => productMap.set(p.product_id, p.product_category));

    const agg = {};
    orderItems.forEach(item => {
        if (item.is_returned) return; // Exclude returns? Usually revenue includes it until returned, but let's exclude for 'Net Sales'
        const cat = productMap.get(item.product_id) || 'Unknown';
        agg[cat] = (agg[cat] || 0) + (item.total_amount || 0);
    });

    return Object.keys(agg)
        .map(key => ({ name: key, value: parseFloat(agg[key].toFixed(2)) }))
        .sort((a, b) => b.value - a.value);
};

export const calculateProfitTrends = (orders, orderItems, products) => {
    // This is complex. Profit = Revenue - Cost. Cost is in products.
    // We need to join orderItems with products to get cost per item.

    const productCostMap = new Map();
    products.forEach(p => productCostMap.set(p.product_id, p.cost_unit_price || 0));

    const agg = {}; // Key: YYYY-MM

    // We need date from Orders. Map OrderID -> Date
    const orderDateMap = new Map();
    orders.forEach(o => {
        if (o.order_date && o.order_status !== 'Cancelled') {
            orderDateMap.set(o.order_id, o.order_date.substring(0, 7));
        }
    });

    orderItems.forEach(item => {
        const dateKey = orderDateMap.get(item.order_id);
        if (!dateKey) return;
        if (item.is_returned) return;

        const cost = (productCostMap.get(item.product_id) || 0) * item.ordered_quantity;
        const revenue = item.total_amount || 0;
        const profit = revenue - cost;

        if (!agg[dateKey]) agg[dateKey] = { revenue: 0, cost: 0, profit: 0 };
        agg[dateKey].revenue += revenue;
        agg[dateKey].cost += cost;
        agg[dateKey].profit += profit;
    });

    return Object.keys(agg).map(key => ({
        name: key,
        displayDate: format(parseISO(key + "-01"), "MMM yyyy"),
        Revenue: parseFloat(agg[key].revenue.toFixed(2)),
        Cost: parseFloat(agg[key].cost.toFixed(2)),
        Profit: parseFloat(agg[key].profit.toFixed(2))
    })).sort((a, b) => a.name.localeCompare(b.name));
};

export const calculateTopProducts = (orderItems, products) => {
    const revenueMap = new Map();
    const profitMap = new Map();
    const productMap = new Map();

    // Init maps
    products.forEach(p => {
        productMap.set(p.product_id, p);
        revenueMap.set(p.product_id, 0);
        profitMap.set(p.product_id, 0);
    });

    orderItems.forEach(item => {
        if (item.is_returned) return;
        const p = productMap.get(item.product_id);
        if (!p) return;

        const rev = item.total_amount || 0;
        const cost = (p.cost_unit_price || 0) * item.ordered_quantity;
        const profit = rev - cost;

        revenueMap.set(item.product_id, (revenueMap.get(item.product_id) || 0) + rev);
        profitMap.set(item.product_id, (profitMap.get(item.product_id) || 0) + profit);
    });

    const revenueList = [];
    const profitList = [];

    products.forEach(p => {
        const rev = revenueMap.get(p.product_id) || 0;
        const profit = profitMap.get(p.product_id) || 0;
        const name = p.product_name;

        if (rev > 0) {
            revenueList.push({ name, value: rev, id: p.product_id });
        }
        if (profit !== 0) {
            profitList.push({ name, value: profit, id: p.product_id });
        }
    });

    return {
        byRevenue: revenueList.sort((a, b) => b.value - a.value).slice(0, 10),
        byProfit: profitList.sort((a, b) => b.value - a.value).slice(0, 10),
        lowestProfit: profitList.sort((a, b) => a.value - b.value).slice(0, 10)
    };
};

export const calculateCustomerSpending = (orders, customers) => {
    const spendingMap = new Map();
    const lastOrderMap = new Map();

    const customerMap = new Map();
    customers.forEach(c => customerMap.set(c.customer_id, c.customer_first_name + ' ' + c.customer_last_name));

    orders.forEach(o => {
        if (o.order_status === 'Cancelled') return;
        const cid = o.customer_id;
        const amount = o.order_total_amount || 0;
        const date = o.order_date;

        spendingMap.set(cid, (spendingMap.get(cid) || 0) + amount);

        const currentLast = lastOrderMap.get(cid);
        if (!currentLast || date > currentLast) {
            lastOrderMap.set(cid, date);
        }
    });

    return Array.from(spendingMap.entries()).map(([cid, total]) => ({
        id: cid,
        name: customerMap.get(cid) || `Customer ${cid}`,
        totalSpent: total,
        lastOrder: lastOrderMap.get(cid)
    })).sort((a, b) => b.totalSpent - a.totalSpent);
};

export const calculateProfitByCatDept = (orderItems, products) => {
    const map = {}; // "Cat|Dept" -> Profit

    const productMap = new Map();
    products.forEach(p => productMap.set(p.product_id, p));

    orderItems.forEach(item => {
        if (item.is_returned) return;
        const p = productMap.get(item.product_id);
        if (!p) return;

        const rev = item.total_amount || 0;
        const cost = (p.cost_unit_price || 0) * item.ordered_quantity;
        const profit = rev - cost;

        const key = `${p.product_category}|${p.product_department}`;
        map[key] = (map[key] || 0) + profit;
    });

    return Object.entries(map).map(([key, val]) => {
        const [cat, dept] = key.split('|');
        return { category: cat, department: dept, profit: val };
    });
};
