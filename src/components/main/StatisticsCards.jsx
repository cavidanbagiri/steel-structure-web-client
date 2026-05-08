// components/StatisticsCards.jsx
import React from 'react';

const StatisticsCards = ({ statistics }) => {
    // Handle if statistics is null or undefined
    if (!statistics) return null;
    
    const stats = [
        { label: 'Total Records', value: statistics.total_records, icon: '📊', color: 'bg-blue-500' },
        { label: 'Total Quantity', value: statistics.total_qty?.toLocaleString(), icon: '🔢', color: 'bg-green-500' },
        { label: 'Total Weight', value: statistics.total_weight?.toLocaleString(), icon: '⚖️', color: 'bg-yellow-500' },
        { label: 'Unique Items', value: statistics.unique_items, icon: '📦', color: 'bg-purple-500' }
    ];
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center">
                        <div className={`${stat.color} rounded-lg p-3 text-white text-2xl`}>
                            {stat.icon}
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-800">
                                {stat.value !== undefined && stat.value !== null ? stat.value : 0}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatisticsCards;