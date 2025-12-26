import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const MetricCard = ({ title, value, prefix, subtitle, icon: Icon, color, bgColor, isCurrency = true }) => {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col gap-4">
                <div className={`w-12 h-12 rounded-lg ${bgColor || 'bg-slate-50'} flex items-center justify-center`}>
                    {Icon && <Icon className={color || 'text-slate-600'} size={24} />}
                </div>

                <div>
                    <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
                    <div className="text-2xl font-bold text-slate-900 mb-1">
                        {prefix}{isCurrency && typeof value === 'number'
                            ? value.toLocaleString()
                            : value}
                    </div>
                    {subtitle && <p className="text-slate-400 text-xs">{subtitle}</p>}
                </div>
            </div>
        </div>
    );
};

export default MetricCard;
