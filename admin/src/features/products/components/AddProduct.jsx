import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateProduct } from "../slice/productSlice";
import { useCategories } from "../../category/slice/categorySlice";
import {
  Upload,
  X,
  ArrowLeft,
  Loader2,
  Image as ImageIcon,
  Plus,
} from "lucide-react";

function AddProduct() {
  const navigate = useNavigate();
  const createMutation = useCreateProduct();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");

  const { data: categoryData, isLoading: categoriesLoading } = useCategories({ limit: 100 });
  const [images, setImages] = useState([]); // base64 strings
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        alert("Please select image files only");
        return;
      }

      // Preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreviews((prev) => [...prev, previewUrl]);

      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !price) return;

    createMutation.mutate(
      {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        category,
        images,
      },
      {
        onSuccess: () => {
          navigate("/products");
        },
      }
    );
  };

  return (
    <div className="flex-1 p-8 pt-10 min-h-screen bg-slate-50/50">
      <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Add Product
            </h2>
            <p className="text-slate-500 mt-1">
              Create a new product for your store.
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-bold text-slate-700 mb-2"
                >
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Wireless Headphones..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-slate-700 font-medium"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-bold text-slate-700 mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Product description..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-slate-700 font-medium resize-none"
                />
              </div>

              {/* Price & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-bold text-slate-700 mb-2"
                  >
                    Price ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="price"
                    required
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-slate-700 font-medium"
                  />
                </div>
                <div>
                  <label
                    htmlFor="stock"
                    className="block text-sm font-bold text-slate-700 mb-2"
                  >
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    id="stock"
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-slate-700 font-medium"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-bold text-slate-700 mb-2"
                >
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={categoriesLoading}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-slate-700 font-medium disabled:opacity-60 cursor-pointer"
                >
                  <option value="">
                    {categoriesLoading ? "Loading categories..." : "Select a category"}
                  </option>
                  {categoryData?.categories?.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Product Images
                </label>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {imagePreviews.map((preview, index) => (
                      <div
                        key={index}
                        className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 aspect-square group"
                      >
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-all"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <label className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-50/50 hover:border-indigo-300 transition-all group bg-slate-50/50">
                  <div className="p-4 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                    <Upload className="w-7 h-7 text-indigo-500" />
                  </div>
                  <p className="text-sm font-semibold text-slate-600">
                    Click to upload images
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    PNG, JPG, WEBP up to 5MB each
                  </p>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                disabled={createMutation.isPending}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending || !name.trim() || !price}
                className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 text-white font-semibold rounded-xl transition-all active:scale-95 disabled:opacity-70 disabled:pointer-events-none flex items-center gap-2"
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Add Product
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
