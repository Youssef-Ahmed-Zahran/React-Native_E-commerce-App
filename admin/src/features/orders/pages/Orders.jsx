import { useState, useRef, useCallback } from "react";
import { useOrders, useUpdateOrderStatus } from "../slice/orderSlice";
import { Search, Package, CheckCircle, Clock, Truck, XCircle, User2, Calendar, DollarSign, ArrowUpDown } from "lucide-react";
import { useDebounce } from "../../../hooks/useDebounce";

function Orders() {
  const [search, setSearch] = useState("");
  const limit = 15;

  const debouncedSearch = useDebounce(search, 500);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useOrders({
    limit,
    search: debouncedSearch,
  });

  const { mutate: updateStatus, isLoading: isUpdating } = useUpdateOrderStatus();

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleStatusChange = (orderId, newStatus) => {
    updateStatus({ orderId, status: newStatus });
  };

  const observer = useRef();
  const lastOrderElementRef = useCallback(
    (node) => {
      if (isLoading || isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  const orders = data?.pages?.flatMap((page) => page.orders) || [];
  const totalOrders = data?.pages?.[0]?.pagination?.total || 0;

  // Format date helper
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-amber-500" />;
      case "shipped":
        return <Truck className="w-4 h-4 text-blue-500" />;
      case "delivered":
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Package className="w-4 h-4 text-slate-500" />;
    }
  };

  const getStatusBadgeStyles = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "shipped":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "delivered":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  if (isError) {
    return (
      <div className="flex-1 p-8 pt-10 min-h-screen bg-slate-50/50 flex items-center justify-center">
        <div className="bg-red-50/80 backdrop-blur-sm text-red-600 p-8 rounded-2xl shadow-lg border border-red-100 flex flex-col items-center">
          <XCircle className="h-12 w-12 mb-4 text-red-500" />
          <h3 className="text-xl font-bold mb-2">Error Loading Orders</h3>
          <p>{error?.message || "Something went wrong."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 pt-10 min-h-screen bg-slate-50/50 flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 space-y-4 md:space-y-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-2 bg-indigo-600 rounded-full"></div>
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">
              Orders
            </h2>
          </div>
          <p className="text-slate-500 text-lg ml-4">
            Manage customer orders and track their delivery status.
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm mb-8 flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-8 delay-100 fill-mode-both">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-slate-700 placeholder:text-slate-400 font-medium"
            placeholder="Search orders by number, customer name or email..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-md flex-1 flex flex-col min-h-0 animate-in fade-in slide-in-from-bottom-12 delay-200 fill-mode-both">
        <div className="p-6 border-b border-slate-100 bg-white/50 backdrop-blur-sm flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-3 h-8 bg-indigo-500 rounded-full"></div>
            <h3 className="text-xl font-extrabold text-slate-900">
              All Orders
            </h3>
          </div>
          <div className="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
            Total: {isLoading ? "..." : totalOrders}
          </div>
        </div>

        {/* Table Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 flex-1">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-xl bg-indigo-500/30 animate-pulse"></div>
              <Package className="animate-spin h-10 w-10 text-indigo-600 relative z-10" />
            </div>
            <p className="text-slate-500 font-medium mt-4 animate-pulse tracking-wide">
              Loading orders...
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 flex-1">
            <div className="p-4 bg-slate-50 rounded-full mb-4">
              <Package className="w-12 h-12 text-slate-300" />
            </div>
            <p className="font-medium text-lg text-slate-600">
              No orders found.
            </p>
            <p className="text-sm opacity-70 mt-1">
              Try adjusting your search criteria.
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-auto rounded-b-2xl">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur shadow-sm">
                <tr className="text-xs uppercase tracking-widest text-slate-500 border-b border-slate-100">
                  <th className="px-6 py-5 font-bold">Order Number</th>
                  <th className="px-6 py-5 font-bold">Customer</th>
                  <th className="px-6 py-5 font-bold">Amount</th>
                  <th className="px-6 py-5 font-bold">Date</th>
                  <th className="px-6 py-5 font-bold">Status</th>
                  <th className="px-6 py-5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {orders.map((order, index) => {
                  const isLastElement = index === orders.length - 1;

                  return (
                    <tr
                      key={order._id}
                      ref={isLastElement ? lastOrderElementRef : null}
                      className="hover:bg-slate-50/80 transition-all duration-200 group animate-in fade-in slide-in-from-right-4 fill-mode-both"
                      style={{ animationDelay: `${(index % 10) * 50}ms` }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                            <Package className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-sm font-bold text-slate-900 block">
                              #{order.orderNumber || order._id.slice(-8).toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                            <User2 className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">
                              {order.user?.name || "Unknown"}
                            </p>
                            <p className="text-xs text-slate-500">
                              {order.user?.email || "No email"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                          <DollarSign className="w-4 h-4 text-emerald-500" />
                          {order.totalAmount?.toFixed(2) || "0.00"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Calendar className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                          <span className="text-sm font-medium">
                            {formatDate(order.createdAt)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadgeStyles(
                            order.orderStatus
                          )}`}
                        >
                          {getStatusIcon(order.orderStatus)}
                          <span className="capitalize">{order.orderStatus}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <select
                          className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2 outline-none font-medium cursor-pointer hover:border-indigo-300 transition-colors disabled:opacity-50"
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          disabled={isUpdating}
                        >
                          <option value="pending">Pending</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
                {isFetchingNextPage && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                      <div className="flex justify-center items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
