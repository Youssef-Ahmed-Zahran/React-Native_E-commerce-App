import { useState, useRef, useCallback } from "react";
import { useCustomers } from "../slice/customerSlice";
import { Search, User2, Mail, Calendar, AlertCircle, ArrowUpDown } from "lucide-react";
import { useDebounce } from "../../../hooks/useDebounce";

function Customers() {
  const [search, setSearch] = useState("");
  const limit = 15;

  const debouncedSearch = useDebounce(search, 500); // 500ms debounce

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCustomers({
    limit,
    search: debouncedSearch,
  });

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const observer = useRef();
  const lastCustomerElementRef = useCallback(
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

  const customers = data?.pages?.flatMap((page) => page.customers) || [];
  const totalCustomers = data?.pages?.[0]?.pagination?.total || 0;

  // Format date helper
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Generate random avatar background color based on name string
  const getAvatarColor = (name) => {
    const colors = [
      "bg-emerald-100 text-emerald-600",
      "bg-indigo-100 text-indigo-600",
      "bg-orange-100 text-orange-600",
      "bg-blue-100 text-blue-600",
      "bg-pink-100 text-pink-600",
      "bg-purple-100 text-purple-600",
    ];
    if (!name) return colors[0];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (isError) {
    return (
      <div className="flex-1 p-8 pt-10 min-h-screen bg-slate-50/50 flex items-center justify-center">
        <div className="bg-red-50/80 backdrop-blur-sm text-red-600 p-8 rounded-2xl shadow-lg border border-red-100 flex flex-col items-center">
          <AlertCircle className="h-12 w-12 mb-4 text-red-500" />
          <h3 className="text-xl font-bold mb-2">Error Loading Customers</h3>
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
              Customers
            </h2>
          </div>
          <p className="text-slate-500 text-lg ml-4">
            Manage your registered users and customers.
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
            placeholder="Search customers by name or email..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-md flex-1 flex flex-col min-h-0 animate-in fade-in slide-in-from-bottom-12 delay-200 fill-mode-both">
        <div className="p-6 border-b border-slate-100 bg-white/50 backdrop-blur-sm flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-3 h-8 bg-indigo-500 rounded-full"></div>
            <h3 className="text-xl font-extrabold text-slate-900">
              All Customers
            </h3>
          </div>
          <div className="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
            Total: {isLoading ? "..." : totalCustomers}
          </div>
        </div>

        {/* Table Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 flex-1">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-xl bg-indigo-500/30 animate-pulse"></div>
              <User2 className="animate-spin h-10 w-10 text-indigo-600 relative z-10" />
            </div>
            <p className="text-slate-500 font-medium mt-4 animate-pulse tracking-wide">
              Loading customers...
            </p>
          </div>
        ) : customers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 flex-1">
            <div className="p-4 bg-slate-50 rounded-full mb-4">
              <User2 className="w-12 h-12 text-slate-300" />
            </div>
            <p className="font-medium text-lg text-slate-600">
              No customers found.
            </p>
            <p className="text-sm opacity-70 mt-1">
              Try adjusting your search criteria.
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-auto rounded-b-2xl">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur shadow-sm">
                <tr className="text-xs uppercase tracking-widest text-slate-500 border-b border-slate-100">
                  <th className="px-6 py-5 font-bold">User</th>
                  <th className="px-6 py-5 font-bold w-1/3">Email</th>
                  <th className="px-6 py-5 font-bold cursor-pointer group hover:text-slate-700">
                    <div className="flex items-center gap-1">
                      Joined Date
                      <ArrowUpDown className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {customers.map((customer, index) => {
                  const avatarColor = getAvatarColor(customer.name);
                  const initial = customer.name
                    ? customer.name.charAt(0).toUpperCase()
                    : "?";
                  const isLastElement = index === customers.length - 1;

                  return (
                    <tr
                      key={customer._id}
                      ref={isLastElement ? lastCustomerElementRef : null}
                      className="hover:bg-slate-50/80 transition-all duration-200 group animate-in fade-in slide-in-from-right-4 fill-mode-both"
                      style={{ animationDelay: `${(index % 10) * 50}ms` }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex items-center justify-center w-10 h-10 rounded-full font-bold shadow-sm ${avatarColor}`}
                          >
                            {initial}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {customer.name || "Unknown"}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5 lowercase">
                              {customer.role || "User"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Mail className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                          <span className="text-sm font-medium">
                            {customer.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Calendar className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                          <span className="text-sm font-medium">
                            {formatDate(customer.createdAt)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {isFetchingNextPage && (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
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

export default Customers;
