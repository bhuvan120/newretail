import React, { createContext, useContext, useState } from 'react';

const FilterContext = createContext();

export const useFilters = () => {
    return useContext(FilterContext);
};

export const FilterProvider = ({ children }) => {
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        category: 'All',
        brand: 'All',
        department: 'All'
    });

    const updateFilter = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({
            startDate: '',
            endDate: '',
            category: 'All',
            brand: 'All',
            department: 'All'
        });
    };

    return (
        <FilterContext.Provider value={{ filters, updateFilter, clearFilters }}>
            {children}
        </FilterContext.Provider>
    );
};
