import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

function StatCard({ 
  title, 
  value, 
  unit = '', 
  icon: Icon, 
  trend = null, 
  color = 'blue',
  subtitle = null,
  loading = false 
}) {
  const colorVariants = {
    blue: {
      bg: 'bg-gradient-to-br from-blue-500 to-blue-600',
      light: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-200',
      shadow: 'shadow-blue-500/25',
      icon: 'text-blue-500',
    },
    emerald: {
      bg: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
      light: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-emerald-200',
      shadow: 'shadow-emerald-500/25',
      icon: 'text-emerald-500',
    },
    violet: {
      bg: 'bg-gradient-to-br from-violet-500 to-violet-600',
      light: 'bg-violet-50',
      text: 'text-violet-600',
      border: 'border-violet-200',
      shadow: 'shadow-violet-500/25',
      icon: 'text-violet-500',
    },
    amber: {
      bg: 'bg-gradient-to-br from-amber-500 to-amber-600',
      light: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-200',
      shadow: 'shadow-amber-500/25',
      icon: 'text-amber-500',
    },
    rose: {
      bg: 'bg-gradient-to-br from-rose-500 to-rose-600',
      light: 'bg-rose-50',
      text: 'text-rose-600',
      border: 'border-rose-200',
      shadow: 'shadow-rose-500/25',
      icon: 'text-rose-500',
    },
    cyan: {
      bg: 'bg-gradient-to-br from-cyan-500 to-cyan-600',
      light: 'bg-cyan-50',
      text: 'text-cyan-600',
      border: 'border-cyan-200',
      shadow: 'shadow-cyan-500/25',
      icon: 'text-cyan-500',
    },
  };

  const colors = colorVariants[color] || colorVariants.blue;

  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-emerald-500" />;
    if (trend < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  if (loading) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-lg p-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="h-8 bg-gray-200 rounded w-32" />
          </div>
          <div className="h-12 w-12 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className={`
      group relative overflow-hidden rounded-2xl bg-white border border-gray-100
      shadow-lg hover:shadow-2xl transition-all duration-500
      hover:scale-[1.02] hover:-translate-y-1
      ${colors.shadow}
    `}>
      {/* Background gradient on hover */}
      <div className={`
        absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500
        ${colors.bg}
      `} />

      {/* Decorative circles */}
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-gray-100 to-transparent rounded-full opacity-50" />
      <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-tr from-gray-100 to-transparent rounded-full opacity-50" />

      <div className="relative p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-500 tracking-wide uppercase">
              {title}
            </p>
            <div className="mt-2 flex items-baseline space-x-1">
              <p className="text-3xl font-bold text-gray-900 tracking-tight">
                {value}
              </p>
              {unit && (
                <p className="text-sm font-medium text-gray-500">
                  {unit}
                </p>
              )}
            </div>
            {subtitle && (
              <p className="mt-1 text-xs text-gray-400">{subtitle}</p>
            )}
          </div>
          
          {Icon && (
            <div className={`
              flex-shrink-0 p-3 rounded-xl ${colors.light}
              group-hover:scale-110 transition-transform duration-500
            `}>
              <Icon className={`w-6 h-6 ${colors.icon}`} />
            </div>
          )}
        </div>

        {trend !== null && (
          <div className="mt-3 flex items-center space-x-1">
            {getTrendIcon()}
            <span className={`
              text-xs font-semibold
              ${trend > 0 ? 'text-emerald-600' : trend < 0 ? 'text-red-600' : 'text-gray-400'}
            `}>
              {Math.abs(trend)}%
          </span>
            <span className="text-xs text-gray-400">vs last period</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default StatCard;