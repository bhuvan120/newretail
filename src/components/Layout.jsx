import React from 'react';
import Sidebar from './Sidebar';
import GlobalFilters from './GlobalFilters';

const Layout = ({ children }) => {
    return (
        <div className="flex bg-slate-50 min-h-screen font-sans antialiased text-slate-900 relative">
            {/* Sidebar Component - Fixed Position */}
            <Sidebar />

            {/* Main Content Area - Margined to accommodate Sidebar */}
            <main className="flex-1 ml-64 min-h-screen transition-all duration-300">
                <div className="p-8 max-w-7xl mx-auto space-y-8">
                    {/* Global Filters Section */}
                    <div className="fade-in">
                        <GlobalFilters />
                    </div>

                    {/* Page Content */}
                    <div className="fade-in delay-100">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Layout;
