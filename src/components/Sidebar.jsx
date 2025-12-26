import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    ShoppingBag,
    ShoppingCart,
    Users,
    DollarSign,
    RotateCcw,
    FileText,
    Settings,
    LogOut
} from 'lucide-react';

const Sidebar = () => {
    const navigate = useNavigate();

    const navItems = [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
        { name: 'Sales Analytics', path: '/admin/analytics', icon: DollarSign },
        { name: 'Products', path: '/admin/products', icon: ShoppingBag },
        { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
        { name: 'Customers', path: '/admin/customers', icon: Users },
        { name: 'Revenue', path: '/admin/revenue', icon: DollarSign },
        { name: 'Returns', path: '/admin/returns', icon: RotateCcw },
        { name: 'Reports', path: '/admin/reports', icon: FileText },
        { name: 'Settings', path: '/admin/settings', icon: Settings },
    ];

    const handleLogout = () => {
        // Implement logout logic here
        navigate('/login');
    };

    return (
        <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col fixed left-0 top-0 bottom-0 z-50 shadow-2xl overflow-y-auto">
            {/* Header */}
            <div className="h-20 flex items-center px-8 border-b border-slate-800">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Admin Panel
                </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.exact}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group font-medium ${isActive
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 translate-x-1'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white hover:translate-x-1'
                            }`
                        }
                    >
                        <item.icon size={20} className={({ isActive }) =>
                            isActive ? 'text-white' : 'text-slate-500 group-hover:text-white transition-colors'
                        } />
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Footer / Logout */}
            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-400 hover:bg-rose-900/20 hover:text-rose-400 transition-all duration-200 group"
                >
                    <LogOut size={20} className="group-hover:rotate-180 transition-transform duration-300" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
