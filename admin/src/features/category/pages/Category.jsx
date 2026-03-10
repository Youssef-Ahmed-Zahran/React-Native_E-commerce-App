import { useState } from 'react';
import { useCategories, useDeleteCategory } from '../slice/categorySlice';
import { Plus, Search, Edit2, Trash2, Folder, Image as ImageIcon, ChevronRight, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useDebounce } from '../../../hooks/useDebounce';

function Category() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const limit = 10;

  const debouncedSearch = useDebounce(search, 500); // 500ms debounce

  const navigate = useNavigate();
  // Pass the debouncedSearch instead of search to the query
  const { data, isLoading, isError, error } = useCategories({ page, limit, search: debouncedSearch });
  const deleteMutation = useDeleteCategory();

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  if (isError) {
    return (
      <div className="flex-1 p-8 pt-10 min-h-screen bg-slate-50/50 flex items-center justify-center">
        <div className="bg-red-50/80 backdrop-blur-sm text-red-600 p-8 rounded-2xl shadow-lg border border-red-100 flex flex-col items-center">
          <AlertCircle className="h-12 w-12 mb-4 text-red-500" />
          <h3 className="text-xl font-bold mb-2">Error Loading Categories</h3>
          <p>{error?.message || 'Something went wrong.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 pt-10 min-h-screen bg-slate-50/50">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 space-y-4 md:space-y-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-2 bg-indigo-600 rounded-full"></div>
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">Categories</h2>
          </div>
          <p className="text-slate-500 text-lg ml-4">Manage your product categories and collections.</p>
        </div>
        <div>
          <button
            onClick={() => navigate('/categories/create')}
            className="bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 text-white shadow-sm rounded-xl px-5 py-2.5 flex items-center gap-2 text-sm font-semibold transition-all transform hover:-translate-y-1 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Add Category
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
            placeholder="Search categories..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Categories Grid/Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-md overflow-hidden animate-in fade-in slide-in-from-bottom-12 delay-200 fill-mode-both">
        <div className="p-6 border-b border-slate-100 bg-white/50 backdrop-blur-sm flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-3 h-8 bg-indigo-500 rounded-full"></div>
            <h3 className="text-xl font-extrabold text-slate-900">All Categories</h3>
          </div>
          <div className="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
            Total: {isLoading ? '...' : data?.pagination?.total || 0}
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-xl bg-indigo-500/30 animate-pulse"></div>
              <Folder className="animate-spin h-10 w-10 text-indigo-600 relative z-10" />
            </div>
            <p className="text-slate-500 font-medium mt-4 animate-pulse tracking-wide">Loading categories...</p>
          </div>
        ) : !data?.categories?.length ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <div className="p-4 bg-slate-50 rounded-full mb-4">
              <Folder className="w-12 h-12 text-slate-300" />
            </div>
            <p className="font-medium text-lg text-slate-600">No categories found.</p>
            <p className="text-sm opacity-70 mt-1">Try adjusting your search or add a new category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
            {data.categories.map((category, index) => (
              <div
                key={category._id}
                className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-indigo-300 transition-all duration-300 transform hover:-translate-y-1"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="aspect-video w-full bg-slate-100 relative overflow-hidden flex items-center justify-center">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <ImageIcon className="w-12 h-12 text-slate-300" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Actions overlay */}
                  <div className="absolute bottom-4 right-4 flex gap-2 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                      onClick={() => navigate(`/categories/edit/${category._id}`)}
                      className="p-2 bg-white/90 backdrop-blur text-indigo-600 hover:text-indigo-800 hover:bg-white rounded-lg shadow-sm transition-colors"
                      title="Edit Category"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="p-2 bg-red-500/90 backdrop-blur text-white hover:bg-red-600 rounded-lg shadow-sm transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-5 flex items-center justify-between">
                  <h4 className="font-bold text-lg text-slate-900 truncate pr-4">{category.name}</h4>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors transform group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Details - if needed later can be fleshed out, standard structure follows */}
        {data?.pagination?.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
            <div className="text-sm text-slate-500 font-medium">
              Showing page <span className="font-bold text-slate-900">{page}</span> of <span className="font-bold text-slate-900">{data.pagination.totalPages}</span>
            </div>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-white hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>
              <button
                disabled={page === data.pagination.totalPages}
                onClick={() => setPage(p => p + 1)}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Category;
