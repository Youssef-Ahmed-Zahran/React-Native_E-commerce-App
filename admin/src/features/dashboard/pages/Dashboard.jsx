import { useDashboardStats } from '../slice/dashboardSlice';
import { Activity, CreditCard, DollarSign, Package, Users, TrendingUp, Calendar, ChevronRight, ArrowUpRight, BarChart3 } from 'lucide-react';

function Dashboard() {
  const { data: stats, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[70vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full blur-xl bg-indigo-500/30 animate-pulse"></div>
            <Activity className="animate-spin h-10 w-10 text-indigo-600 relative z-10" />
          </div>
          <p className="text-gray-500 font-medium animate-pulse tracking-wide">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full min-h-[70vh] animate-in fade-in zoom-in duration-300">
        <div className="bg-red-50/80 backdrop-blur-sm text-red-600 p-8 rounded-2xl shadow-lg border border-red-100 flex flex-col items-center max-w-md text-center transform transition-all hover:scale-105">
          <div className="p-4 bg-red-100 rounded-full mb-4">
            <Activity className="h-10 w-10 text-red-500 animate-pulse" />
          </div>
          <h3 className="text-xl font-bold mb-2">Failed to Load Data</h3>
          <p className="text-sm opacity-90">{error.message || 'An unexpected error occurred while fetching dashboard statistics.'}</p>
          <button className="mt-6 px-4 py-2 bg-white text-red-600 rounded-lg shadow-sm font-medium hover:bg-red-50 transition-colors border border-red-200">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="flex-1 p-8 pt-10 min-h-screen bg-slate-50/50">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 space-y-4 md:space-y-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-2 bg-indigo-600 rounded-full"></div>
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">Overview</h2>
          </div>
          <p className="text-slate-500 text-lg ml-4">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl px-5 py-2.5 flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95">
            <Calendar className="w-4 h-4 text-indigo-500" />
            Last 30 Days
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 text-white shadow-sm rounded-xl px-5 py-2.5 flex items-center gap-2 text-sm font-semibold transition-all transform hover:-translate-y-1 active:scale-95">
            <BarChart3 className="w-4 h-4" />
            Download Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 mb-10">
        {/* Total Revenue Card */}
        <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-300 group transform hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-8 delay-100 fill-mode-both">
          <div className="absolute top-0 right-0 p-4 opacity-5 transform translate-x-1/4 -translate-y-1/4 group-hover:scale-125 group-hover:opacity-10 transition-all duration-500 ease-out text-emerald-600">
            <DollarSign size={140} />
          </div>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

          <div className="p-7">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Total Revenue</h3>
              <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600 group-hover:bg-emerald-100 group-hover:rotate-12 transition-all duration-300">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-slate-900 tracking-tight pl-1">${stats.totalRevenue?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="mt-5 flex items-center text-sm font-semibold text-emerald-600 bg-emerald-50/50 py-1.5 px-3 rounded-lg w-fit">
              <TrendingUp className="w-4 h-4 mr-1.5" />
              <span>+14.5% from last month</span>
            </div>
          </div>
        </div>

        {/* Total Orders Card */}
        <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 group transform hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-8 delay-200 fill-mode-both">
          <div className="absolute top-0 right-0 p-4 opacity-5 transform translate-x-1/4 -translate-y-1/4 group-hover:scale-125 group-hover:opacity-10 transition-all duration-500 ease-out text-indigo-600">
            <CreditCard size={140} />
          </div>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-indigo-400 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

          <div className="p-7">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Total Orders</h3>
              <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600 group-hover:bg-indigo-100 group-hover:rotate-12 transition-all duration-300">
                <CreditCard className="h-6 w-6" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-slate-900 tracking-tight pl-1">{stats.totalOrders || 0}</span>
            </div>
            <div className="mt-5 flex items-center text-sm font-semibold text-indigo-600 bg-indigo-50/50 py-1.5 px-3 rounded-lg w-fit">
              <TrendingUp className="w-4 h-4 mr-1.5" />
              <span>+8.2% from last month</span>
            </div>
          </div>
        </div>

        {/* Products Card */}
        <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-orange-200 transition-all duration-300 group transform hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-8 delay-300 fill-mode-both">
          <div className="absolute top-0 right-0 p-4 opacity-5 transform translate-x-1/4 -translate-y-1/4 group-hover:scale-125 group-hover:opacity-10 transition-all duration-500 ease-out text-orange-600">
            <Package size={140} />
          </div>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-orange-400 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

          <div className="p-7">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Products</h3>
              <div className="p-2.5 bg-orange-50 rounded-xl text-orange-600 group-hover:bg-orange-100 group-hover:-rotate-12 transition-all duration-300">
                <Package className="h-6 w-6" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-slate-900 tracking-tight pl-1">{stats.totalProducts || 0}</span>
            </div>
            <div className="mt-5 flex items-center text-sm font-semibold text-slate-600 bg-slate-100 py-1.5 px-3 rounded-lg w-fit">
              <span>Active inventory</span>
            </div>
          </div>
        </div>

        {/* Customers Card */}
        <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 group transform hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-8 delay-500 fill-mode-both">
          <div className="absolute top-0 right-0 p-4 opacity-5 transform translate-x-1/4 -translate-y-1/4 group-hover:scale-125 group-hover:opacity-10 transition-all duration-500 ease-out text-blue-600">
            <Users size={140} />
          </div>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

          <div className="p-7">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Customers</h3>
              <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-100 group-hover:-rotate-12 transition-all duration-300">
                <Users className="h-6 w-6" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-slate-900 tracking-tight pl-1">{stats.totalCustomers || 0}</span>
            </div>
            <div className="mt-5 flex items-center text-sm font-semibold text-blue-600 bg-blue-50/50 py-1.5 px-3 rounded-lg w-fit">
              <TrendingUp className="w-4 h-4 mr-1.5" />
              <span>+24 new this week</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 grid-cols-1">
        {/* Recent Orders Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-12 delay-700 fill-mode-both">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-3 h-8 bg-indigo-500 rounded-full"></div>
              <h3 className="text-xl font-extrabold text-slate-900">Recent Transactions</h3>
            </div>
            <button className="text-sm font-bold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-3 py-1.5 rounded-lg flex items-center transition-colors group">
              View All
              <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="flex-1 overflow-x-auto">
            {!stats.recentOrders || stats.recentOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-16 text-slate-500">
                <div className="p-4 bg-slate-50 rounded-full mb-4">
                  <Package className="w-12 h-12 text-slate-300 transform -rotate-12" />
                </div>
                <p className="font-medium">No recent orders available.</p>
                <p className="text-sm opacity-70 mt-1">When customers place orders, they will appear here.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-xs uppercase tracking-widest text-slate-500 border-b border-slate-100">
                    <th className="px-6 py-5 font-bold">Order ID</th>
                    <th className="px-6 py-5 font-bold">Customer</th>
                    <th className="px-6 py-5 font-bold">Status</th>
                    <th className="px-6 py-5 font-bold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {stats.recentOrders.map((order, index) => {
                    const statusColors = {
                      pending: 'bg-yellow-50 text-yellow-700 border-yellow-200 ring-yellow-100',
                      processing: 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-100',
                      shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-indigo-100',
                      delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-100',
                      cancelled: 'bg-red-50 text-red-700 border-red-200 ring-red-100',
                      default: 'bg-slate-50 text-slate-700 border-slate-200 ring-slate-100'
                    };
                    const statusColor = statusColors[order.orderStatus?.toLowerCase()] || statusColors.default;

                    return (
                      <tr key={order._id} className="hover:bg-slate-50/80 transition-all duration-200 group cursor-pointer animate-in fade-in slide-in-from-right-4 fill-mode-both" style={{ animationDelay: `${800 + (index * 100)}ms` }}>
                        <td className="px-6 py-5 text-sm font-bold text-slate-900 flex items-center gap-2">
                          <span className="text-slate-400 font-normal">#</span>
                          {order.orderNumber || order._id.substring(0, 8)}
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{order.user?.name || 'Unknown User'}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{order.user?.email || 'No email provided'}</p>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ring-2 ring-transparent group-hover:ring-offset-1 transition-all ${statusColor} capitalize shadow-sm`}>
                            {order.orderStatus || 'Unknown'}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-sm font-extrabold text-slate-900 text-right flex items-center justify-end gap-2">
                          ${order.totalAmount?.toFixed(2) || '0.00'}
                          <ArrowUpRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 group-hover:text-indigo-500 transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>


      </div>
    </div>
  );
}

export default Dashboard;
