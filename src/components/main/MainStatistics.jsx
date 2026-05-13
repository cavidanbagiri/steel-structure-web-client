import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Weight, 
  Truck, 
  Building2, 
  BarChart3, 
  TrendingUp,
  Activity,
  RefreshCw,
  Zap,
  Layers
} from 'lucide-react';
import { fetchMainDataProjectStatistics, clearStatisticState } from '../../stores/statistic_slice';
import StatCard from '../common/StatCard';
import AreaStatisticsTable from './AreaStatisticsTable';
import MessageBox from '../../layouts/MessageBox';

function MainStatistics() {
  const dispatch = useDispatch();
  const { data, loading, error, success } = useSelector((state) => state.statistic);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const scrollRef = useRef(null);

  useEffect(() => {
    dispatch(fetchMainDataProjectStatistics());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setMessage(error);
      setMessageType('error');
      dispatch(clearStatisticState());
    }
    if (success) {
      setMessage('Statistics loaded successfully');
      setMessageType('success');
      dispatch(clearStatisticState());
    }
  }, [error, success, dispatch]);

  const handleRefresh = () => {
    dispatch(fetchMainDataProjectStatistics());
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'areas', label: 'Area Details', icon: Layers },
  ];

  return (
    <>
      {/* MessageBox for notifications */}
      <MessageBox
        msg={message}
        cond={messageType}
        onClose={() => {
          setMessage(null);
          setMessageType(null);
        }}
        autoClose={true}
        duration={2000}
      />

      <div style={{fontFamily:'Roboto'}} className="flex flex-col w-[50vw] min-w-[500px] max-w-[800px] h-screen bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden mx-2">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-6 py-8">
          {/* Decorative background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-violet-500/20 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl" />
          </div>

          <div className="relative">
            <div className="flex items-center justify-between">
              <div style={{fontFamily:'IBM Plex Sans'}}>
                <h1 className="text-3xl font-semibold text-white tracking-tight flex items-center space-x-3">
                  <BarChart3 className="w-8 h-8 text-blue-400" />
                  <span>Main Statistics</span>
                </h1>
                <p className="mt-1 text-gray-400 text-sm">
                  Project weight tracking dashboard
                </p>
              </div>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className={`
                  p-2.5 rounded-xl bg-white/10 hover:bg-white/20 
                  transition-all duration-200 backdrop-blur-sm
                  ${loading ? 'animate-spin' : 'hover:scale-110 hover:rotate-180'}
                `}
              >
                <RefreshCw className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Quick Stats */}
            {data && (
              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                  <div className="flex items-center space-x-2">
                    <Weight className="w-4 h-4 text-blue-300" />
                    <span className="text-xs text-gray-300">Main</span>
                  </div>
                  <p className="mt-1 text-lg font-semibold text-white">
                    {data.mte_weight_statistics?.main_weight?.value?.toLocaleString() || '0'}
                    <span className="text-xs text-gray-400 ml-1">
                      {data.mte_weight_statistics?.main_weight?.unit || 'Ton'}
                    </span>
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                  <div className="flex items-center space-x-2">
                    <Truck className="w-4 h-4 text-emerald-300" />
                    <span className="text-xs text-gray-300">Transport</span>
                  </div>
                  <p className="mt-1 text-lg font-semibold text-white">
                    {data.mte_weight_statistics?.transport_weight?.value?.toLocaleString() || '0'}
                    <span className="text-xs text-gray-400 ml-1">
                      {data.mte_weight_statistics?.transport_weight?.unit || 'Ton'}
                    </span>
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-violet-300" />
                    <span className="text-xs text-gray-300">Erected</span>
                  </div>
                  <p className="mt-1 text-lg font-semibold text-white">
                    {data.mte_weight_statistics?.erected_weight?.value?.toLocaleString() || '0'}
                    <span className="text-xs text-gray-400 ml-1">
                      {data.mte_weight_statistics?.erected_weight?.unit || 'Ton'}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-6">
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center space-x-2 px-4 py-3 text-sm font-medium
                  transition-all duration-200 relative
                  ${activeTab === tab.id 
                    ? 'text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                <TabIcon className="w-4 h-4" />
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {loading && !data ? (
            // Loading skeleton
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-32 bg-gray-100 rounded-2xl" />
                </div>
              ))}
            </div>
          ) : data ? (
            <>
              {activeTab === 'overview' && (
                <div className="space-y-4 animate-fadeIn">
                  <StatCard
                    title="Main Weight"
                    value={data.mte_weight_statistics?.main_weight?.value?.toLocaleString() || '0'}
                    unit={data.mte_weight_statistics?.main_weight?.unit || 'Ton'}
                    icon={Weight}
                    color="blue"
                  />
                  <StatCard
                    title="Transport Weight"
                    value={data.mte_weight_statistics?.transport_weight?.value?.toLocaleString() || '0'}
                    unit={data.mte_weight_statistics?.transport_weight?.unit || 'Ton'}
                    icon={Truck}
                    color="emerald"
                  />
                  <StatCard
                    title="Erected Weight"
                    value={data.mte_weight_statistics?.erected_weight?.value?.toLocaleString() || '0'}
                    unit={data.mte_weight_statistics?.erected_weight?.unit || 'Ton'}
                    icon={Building2}
                    color="violet"
                  />
                  <StatCard
                    title="Total Areas"
                    value={data.area_column_statistics?.length || 0}
                    icon={Zap}
                    color="amber"
                  />
                </div>
              )}

              {activeTab === 'areas' && (
                <div className="animate-fadeIn">
                  <AreaStatisticsTable data={data.area_column_statistics} />
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <BarChart3 className="w-16 h-16 mb-4 opacity-20" />
              <p className="font-medium">No statistics available</p>
              <p className="text-sm mt-1">Click refresh to load data</p>
            </div>
          )}
        </div>
      </div>

      
    </>
  );
}

export default MainStatistics;