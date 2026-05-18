import React, { useState, useMemo } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Filter, 
  TrendingUp,
  Target,
  CheckCircle2,
  AlertCircle 
} from 'lucide-react';

function AreaStatisticsTable({ data }) {
  const [sortConfig, setSortConfig] = useState({ key: 'area', direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterZero, setFilterZero] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);

  // Calculate progress for each area
  const processedData = useMemo(() => {
    if (!data) return [];
    
    return data.map(item => {
      const mainWeight = item.main_weight?.value || 0;
      const transportWeight = item.transport_weight?.value || 0;
      const erectedWeight = item.erected_weight?.value || 0;
      
      // Calculate progress percentages
      const transportProgress = mainWeight > 0 ? (transportWeight / mainWeight) * 100 : 0;
      const erectedProgress = mainWeight > 0 ? (erectedWeight / mainWeight) * 100 : 0;
      const overallProgress = mainWeight > 0 ? ((transportWeight + erectedWeight) / (mainWeight * 2)) * 100 : 0;
      
      return {
        ...item,
        _progress: {
          transport: Math.min(transportProgress, 100),
          erected: Math.min(erectedProgress, 100),
          overall: Math.min(overallProgress, 100)
        }
      };
    });
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="relative">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Filter className="w-10 h-10 text-gray-400" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <AlertCircle className="w-4 h-4 text-white" />
          </div>
        </div>
        <p className="text-gray-600 font-semibold text-lg mt-4">No area statistics available</p>
        <p className="text-gray-400 text-sm mt-1">Data will appear here once available</p>
      </div>
    );
  }

  const sortedData = [...processedData]
    .filter(item => {
      const matchesSearch = item.area.toLowerCase().includes(searchTerm.toLowerCase());
      const hasData = !filterZero || (
        item.main_weight?.value > 0 || 
        item.transport_weight?.value > 0 || 
        item.erected_weight?.value > 0
      );
      return matchesSearch && hasData;
    })
    .sort((a, b) => {
      if (sortConfig.key === 'area') {
        return sortConfig.direction === 'asc' 
          ? a.area.localeCompare(b.area)
          : b.area.localeCompare(a.area);
      }
      if (sortConfig.key === 'progress') {
        const aValue = a._progress?.overall || 0;
        const bValue = b._progress?.overall || 0;
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      const aValue = a[sortConfig.key]?.value || 0;
      const bValue = b[sortConfig.key]?.value || 0;
      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    });

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) return <ChevronDown className="w-4 h-4 text-gray-300" />;
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="w-4 h-4 text-blue-500" />
      : <ChevronDown className="w-4 h-4 text-blue-500" />;
  };

  // Progress Bar Component
  const ProgressBar = ({ value, color = 'blue', size = 'md' }) => {
    const getColorClasses = () => {
      if (value >= 80) return {
        bar: 'bg-gradient-to-r from-emerald-400 to-emerald-500',
        glow: 'shadow-emerald-500/50',
        text: 'text-emerald-600',
        bg: 'bg-emerald-100',
      };
      if (value >= 50) return {
        bar: 'bg-gradient-to-r from-blue-400 to-blue-500',
        glow: 'shadow-blue-500/50',
        text: 'text-blue-600',
        bg: 'bg-blue-100',
      };
      if (value >= 25) return {
        bar: 'bg-gradient-to-r from-amber-400 to-amber-500',
        glow: 'shadow-amber-500/50',
        text: 'text-amber-600',
        bg: 'bg-amber-100',
      };
      return {
        bar: 'bg-gradient-to-r from-red-400 to-red-500',
        glow: 'shadow-red-500/50',
        text: 'text-red-600',
        bg: 'bg-red-100',
      };
    };

    const colors = getColorClasses();
    const height = size === 'sm' ? 'h-1.5' : 'h-2';

    return (
      <div className="flex items-center space-x-3">
        <div className={`flex-1 ${height} bg-gray-100 rounded-full overflow-hidden relative`}>
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-20" 
               style={{
                 backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, currentColor 2px, currentColor 4px)'
               }} 
          />
          
          {/* Progress fill */}
          <div
            className={`
              ${height} rounded-full relative transition-all duration-1000 ease-out
              ${colors.bar} ${colors.glow}
              ${hoveredRow ? 'shadow-lg' : ''}
            `}
            style={{ 
              width: `${Math.min(value, 100)}%`,
              transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            
            {/* Pulse dot at the end */}
            {value > 0 && value < 100 && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-lg animate-pulse" />
            )}
            
            {/* Check mark at 100% */}
            {value >= 100 && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg flex items-center justify-center">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              </div>
            )}
          </div>
        </div>
        
        {/* Percentage text */}
        <span className={`text-xs font-bold min-w-[3rem] text-right ${colors.text}`}>
          {value.toFixed(1)}%
        </span>
      </div>
    );
  };

  // Mini Progress Bar for the combined view
  const CombinedProgressBar = ({ transport, erected }) => {
    return (
      <div className="">
        {/* <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Transport</span>
          <span className="text-[10px] font-bold text-blue-600">{transport.toFixed(1)}%</span>
        </div>
        <ProgressBar value={transport} color="blue" size="sm" />
        
        <div className="flex items-center justify-between mt-1">
          <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Erected</span>
          <span className="text-[10px] font-bold text-violet-600">{erected.toFixed(1)}%</span>
        </div>
        <ProgressBar value={erected} color="violet" size="sm" /> */}
        
        {/* Overall progress indicator */}
        <div className=" border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">Overall</span>
            <span className="text-[10px] font-bold text-gray-900">
              {(((transport + erected) / 2)).toFixed(1)}%
            </span>
          </div>
          <div className="mt-1 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-green-700 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min((transport + erected) / 2, 100)}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex items-center space-x-3">
        <div className="flex-1 relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search area..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 
                       rounded-xl text-sm focus:outline-none focus:ring-2 
                       focus:ring-blue-500 focus:border-transparent
                       transition-all duration-200
                       placeholder:text-gray-400"
          />
        </div>
        <button
          onClick={() => setFilterZero(!filterZero)}
          className={`
            px-4 py-2.5 rounded-xl text-sm font-medium
            transition-all duration-300 flex items-center space-x-2
            ${filterZero 
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 scale-105' 
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200 hover:scale-105'
            }
          `}
        >
          <Filter className="w-4 h-4" />
          <span>Active Areas</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-xl bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50">
                <th 
                  className="px-4 py-4 text-left cursor-pointer hover:bg-white/50 transition-all duration-200 group"
                  onClick={() => handleSort('area')}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-1 h-4 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Area
                    </span>
                    <SortIcon column="area" />
                  </div>
                </th>
                <th 
                  className="px-4 py-4 text-right cursor-pointer hover:bg-white/50 transition-all duration-200"
                  onClick={() => handleSort('main_weight')}
                >
                  <div className="flex items-center justify-end space-x-2">
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Main
                    </span>
                    <SortIcon column="main_weight" />
                  </div>
                </th>
                <th 
                  className="px-4 py-4 text-right cursor-pointer hover:bg-white/50 transition-all duration-200"
                  onClick={() => handleSort('transport_weight')}
                >
                  <div className="flex items-center justify-end space-x-2">
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Transport
                    </span>
                    <SortIcon column="transport_weight" />
                  </div>
                </th>
                <th 
                  className="px-4 py-4 text-right cursor-pointer hover:bg-white/50 transition-all duration-200"
                  onClick={() => handleSort('erected_weight')}
                >
                  <div className="flex items-center justify-end space-x-2">
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Erected
                    </span>
                    <SortIcon column="erected_weight" />
                  </div>
                </th>
                <th 
                  className="px-4 py-4 cursor-pointer hover:bg-white/50 transition-all duration-200"
                  onClick={() => handleSort('progress')}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Target className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Progress
                    </span>
                    <SortIcon column="progress" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sortedData.map((item, index) => (
                <tr 
                  key={item.area}
                  className={`
                    group transition-all duration-300
                    ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}
                    hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-violet-50/50
                    hover:shadow-lg hover:scale-[1.01] hover:z-10 relative
                  `}
                  onMouseEnter={() => setHoveredRow(item.area)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-3">
                      
                      <div>
                        <span className="text-xs text-gray-900 group-hover:text-blue-600 transition-colors">
                          {item.area}
                        </span>
                        {item._progress.overall >= 100 && (
                          <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                            DONE
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-4 py-4 text-right">
                    <div className="inline-flex items-baseline space-x-1">
                      <span className="text-xs text-gray-900 group-hover:text-gray-700 transition-colors">
                        {item.main_weight?.value?.toLocaleString() || '0'}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">
                        {item.main_weight?.unit || 'Kg'}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-4 py-4 text-right">
                    <div className="inline-flex items-baseline space-x-1">
                      <span className="text-xs font-semibold text-blue-600 group-hover:text-blue-700 transition-colors">
                        {item.transport_weight?.value?.toLocaleString() || '0'}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">
                        {item.transport_weight?.unit || 'Kg'}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-4 py-4 text-right">
                    <div className="inline-flex items-baseline space-x-1">
                      <span className="text-xs font-semibold text-violet-600 group-hover:text-violet-700 transition-colors">
                        {item.erected_weight?.value?.toLocaleString() || '0'}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">
                        {item.erected_weight?.unit || 'Kg'}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-4 py-4 min-w-[220px]">
                    <CombinedProgressBar 
                      transport={item._progress.transport} 
                      erected={item._progress.erected} 
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Empty state for filtered results */}
        {sortedData.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No matching areas found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Footer stats */}
      <div className="flex items-center justify-between text-xs text-gray-400 px-2">
        <span>
          Showing <span className="font-semibold text-gray-600">{sortedData.length}</span> of{' '}
          <span className="font-semibold text-gray-600">{data.length}</span> areas
        </span>
        
        {sortedData.length > 0 && (
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Complete: {sortedData.filter(d => d._progress.overall >= 100).length}</span>
            </span>
            <span className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>In Progress: {sortedData.filter(d => d._progress.overall > 0 && d._progress.overall < 100).length}</span>
            </span>
            <span className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-gray-300" />
              <span>Pending: {sortedData.filter(d => d._progress.overall === 0).length}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default AreaStatisticsTable;