import { useState, useRef, useCallback } from "react";
import { useProducts, useDeleteProduct } from "../slice/productSlice";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Package,
  Image as ImageIcon,
  ChevronRight,
  AlertCircle,
  Tag,
  DollarSign,
  Archive,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../../../hooks/useDebounce";

function Products() {
  const [search, setSearch] = useState("");
  const limit = 15;

  const debouncedSearch = useDebounce(search, 500); // 500ms debounce

  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProducts({
    limit,
    search: debouncedSearch,
  });

  const deleteMutation = useDeleteProduct();

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const observer = useRef();
  const lastProductElementRef = useCallback(
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

  const products = data?.pages?.flatMap((page) => page.products) || [];
  const totalProducts = data?.pages?.[0]?.pagination?.total || 0;

  if (isError) {
    return (
      <div className="flex-1 p-8 pt-10 min-h-screen bg-slate-50/50 flex items-center justify-center">
        <div className="bg-red-50/80 backdrop-blur-sm text-red-600 p-8 rounded-2xl shadow-lg border border-red-100 flex flex-col items-center">
          <AlertCircle className="h-12 w-12 mb-4 text-red-500" />
          <h3 className="text-xl font-bold mb-2">Error Loading Products</h3>
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
              Products
            </h2>
          </div>
          <p className="text-slate-500 text-lg ml-4">
            Manage your store's products and inventory.
          </p>
        </div>
        <div>
          <button
            onClick={() => navigate("/products/create")}
            className="bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 text-white shadow-sm rounded-xl px-5 py-2.5 flex items-center gap-2 text-sm font-semibold transition-all transform hover:-translate-y-1 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
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
            placeholder="Search products..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-md flex-1 flex flex-col min-h-0 animate-in fade-in slide-in-from-bottom-12 delay-200 fill-mode-both">
        <div className="p-6 border-b border-slate-100 bg-white/50 backdrop-blur-sm flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-3 h-8 bg-indigo-500 rounded-full"></div>
            <h3 className="text-xl font-extrabold text-slate-900">
              All Products
            </h3>
          </div>
          <div className="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
            Total: {isLoading ? "..." : totalProducts}
          </div>
        </div>

        {isLoading && products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 flex-1">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-xl bg-indigo-500/30 animate-pulse"></div>
              <Package className="animate-spin h-10 w-10 text-indigo-600 relative z-10" />
            </div>
            <p className="text-slate-500 font-medium mt-4 animate-pulse tracking-wide">
              Loading products...
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 flex-1">
            <div className="p-4 bg-slate-50 rounded-full mb-4">
              <Package className="w-12 h-12 text-slate-300" />
            </div>
            <p className="font-medium text-lg text-slate-600">
              No products found.
            </p>
            <p className="text-sm opacity-70 mt-1">
              Try adjusting your search or add a new product.
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-auto rounded-b-2xl">
            <table className="w-full">
              <thead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur shadow-sm">
                <tr className="border-b border-slate-100">
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 relative">
                {products.map((product, index) => {
                  const isLastElement = index === products.length - 1;

                  return (
                    <tr
                      key={product._id}
                      ref={isLastElement ? lastProductElementRef : null}
                      className="hover:bg-slate-50/70 transition-colors group"
                      style={{ animationDelay: `${(index % 10) * 40}ms` }}
                    >
                      {/* Product */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center flex-shrink-0 border border-slate-200">
                            {product.images?.[0] ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-slate-300" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm truncate max-w-[200px]">
                              {product.name}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[200px]">
                              {product.description || "No description"}
                            </p>
                          </div>
                        </div>
                      </td>
                      {/* Category */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-lg">
                          <Tag className="w-3 h-3" />
                          {product.category?.name || "Uncategorized"}
                        </span>
                      </td>
                      {/* Price */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-sm font-bold text-slate-800">
                          <DollarSign className="w-4 h-4 text-emerald-500" />
                          {Number(product.price).toFixed(2)}
                        </span>
                      </td>
                      {/* Stock */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${product.stock === 0
                              ? "bg-red-50 text-red-600"
                              : product.stock <= 10
                                ? "bg-amber-50 text-amber-600"
                                : "bg-emerald-50 text-emerald-700"
                            }`}
                        >
                          <Archive className="w-3 h-3" />
                          {product.stock === 0
                            ? "Out of Stock"
                            : `${product.stock} in stock`}
                        </span>
                      </td>
                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() =>
                              navigate(`/products/edit/${product._id}`)
                            }
                            className="p-2 bg-slate-100 hover:bg-indigo-100 text-slate-500 hover:text-indigo-600 rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="p-2 bg-slate-100 hover:bg-red-100 text-slate-500 hover:text-red-600 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/products/${product._id}`)
                            }
                            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 rounded-lg transition-colors"
                            title="View Product"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {isFetchingNextPage && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
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

export default Products;
