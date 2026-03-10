import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUpdateProduct, useProducts } from "../slice/productSlice";
import { useCategories } from "../../category/slice/categorySlice";
import {
  Upload,
  X,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Edit2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "../../../validation/product";

function UpdateProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useProducts({ limit: 100 });
  const { data: categoryData, isLoading: categoriesLoading } = useCategories({
    limit: 100,
  });
  const updateMutation = useUpdateProduct();

  const [images, setImages] = useState([]); // new base64 strings
  const [imagePreviews, setImagePreviews] = useState([]); // existing or new

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
  });

  // Pre-fill form from fetched data
  useEffect(() => {
    if (data?.products) {
      const product = data.products.find((p) => p._id === id);
      if (product) {
        reset({
          name: product.name || "",
          description: product.description || "",
          price: product.price?.toString() || "",
          stock: product.stock?.toString() || "",
          category: product.category?._id || product.category || "",
        });
        setImagePreviews(product.images || []);
      }
    }
  }, [data, id, reset]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        alert("Please select image files only");
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      setImagePreviews((prev) => [...prev, previewUrl]);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    if (imagePreviews[index]?.startsWith("blob:")) {
      setImages((prev) => {
        const blobIndices = imagePreviews.reduce((acc, p, i) => {
          if (p.startsWith("blob:")) acc.push(i);
          return acc;
        }, []);
        const blobPos = blobIndices.indexOf(index);
        if (blobPos !== -1) return prev.filter((_, i) => i !== blobPos);
        return prev;
      });
    }
  };

  const onSubmit = (formData) => {
    const payload = {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      stock: formData.stock,
      category: formData.category,
    };

    // Combine existing URLs and new base64 images
    const existingUrls = imagePreviews.filter(
      (img) => typeof img === "string" && img.startsWith("http")
    );
    payload.images = [...existingUrls, ...images];

    updateMutation.mutate(
      { id, productData: payload },
      {
        onSuccess: () => {
          navigate(-1);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-8 pt-10 min-h-screen bg-slate-50/50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!data?.products?.find((p) => p._id === id)) {
    return (
      <div className="flex-1 p-8 pt-10 min-h-screen bg-slate-50/50 flex items-center justify-center">
        <div className="bg-red-50/80 backdrop-blur-sm text-red-600 p-8 rounded-2xl shadow-lg border border-red-100 flex flex-col items-center">
          <AlertCircle className="h-12 w-12 mb-4 text-red-500" />
          <h3 className="text-xl font-bold mb-2">Product Not Found</h3>
          <p>The product you are trying to edit does not exist.</p>
          <button
            onClick={() => navigate("/products")}
            className="mt-6 px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 font-medium"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 pt-10 min-h-screen bg-slate-50/50">
      <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
            type="button"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Edit Product
            </h2>
            <p className="text-slate-500 mt-1">
              Update details for this product.
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} className="p-8">
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
                  {...register("name")}
                  placeholder="e.g. Wireless Headphones..."
                  className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-slate-700 font-medium ${
                    errors.name ? "border-red-500" : "border-slate-200"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
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
                  {...register("description")}
                  placeholder="Product description..."
                  className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-slate-700 font-medium resize-none ${
                    errors.description ? "border-red-500" : "border-slate-200"
                  }`}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
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
                    step="0.01"
                    {...register("price")}
                    placeholder="0.00"
                    className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-slate-700 font-medium ${
                      errors.price ? "border-red-500" : "border-slate-200"
                    }`}
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.price.message}
                    </p>
                  )}
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
                    {...register("stock")}
                    placeholder="0"
                    className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-slate-700 font-medium ${
                      errors.stock ? "border-red-500" : "border-slate-200"
                    }`}
                  />
                  {errors.stock && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.stock.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-bold text-slate-700 mb-2"
                >
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  {...register("category")}
                  disabled={categoriesLoading}
                  className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-slate-700 font-medium disabled:opacity-60 cursor-pointer ${
                    errors.category ? "border-red-500" : "border-slate-200"
                  }`}
                >
                  <option value="">
                    {categoriesLoading
                      ? "Loading categories..."
                      : "Select a category"}
                  </option>
                  {categoryData?.categories?.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.category.message}
                  </p>
                )}
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Product Images
                </label>

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
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
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
                    <Edit2 className="w-7 h-7 text-indigo-500" />
                  </div>
                  <p className="text-sm font-semibold text-slate-600">
                    Click to add more images
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
                disabled={updateMutation.isPending}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 text-white font-semibold rounded-xl transition-all active:scale-95 disabled:opacity-70 disabled:pointer-events-none flex items-center gap-2"
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateProduct;
