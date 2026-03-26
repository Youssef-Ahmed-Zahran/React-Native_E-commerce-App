import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUpdateCategory, useCategories } from "../slice/categorySlice";
import {
  Upload,
  X,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Edit2,
} from "lucide-react";

function UpdateCategory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useCategories({ limit: 100 });
  const updateMutation = useUpdateCategory();

  const [name, setName] = useState("");
  const [image, setImage] = useState(null); // Will hold base64 if changed
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (data?.pages) {
      const category = data.pages.flatMap(page => page.categories).find((c) => c._id === id);
      if (category) {
        setName(category.name || "");
        setImagePreview(category.image || "");
      }
    }
  }, [data, id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      // Convert to base64 for backend
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Only send the image if it was modified (i.e. we have base64)
    // Otherwise the backend controller retains the existing one
    const payload = { name };
    if (image) {
      payload.image = image;
    }

    updateMutation.mutate(
      { id, categoryData: payload },
      {
        onSuccess: () => {
          navigate(-1); // go back
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

  if (!data?.pages?.flatMap(page => page.categories).find((c) => c._id === id)) {
    return (
      <div className="flex-1 p-8 pt-10 min-h-screen bg-slate-50/50 flex items-center justify-center">
        <div className="bg-red-50/80 backdrop-blur-sm text-red-600 p-8 rounded-2xl shadow-lg border border-red-100 flex flex-col items-center">
          <AlertCircle className="h-12 w-12 mb-4 text-red-500" />
          <h3 className="text-xl font-bold mb-2">Category Not Found</h3>
          <p>The category you are trying to edit does not exist.</p>
          <button
            onClick={() => navigate("/categories")}
            className="mt-6 px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 font-medium"
          >
            Back to Categories
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
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Edit Category
            </h2>
            <p className="text-slate-500 mt-1">
              Update details for this category.
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-8">
              {/* Name Input */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-bold text-slate-700 mb-2"
                >
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Electronics, Clothing..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-slate-700 font-medium"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Category Image
                </label>

                {!imagePreview ? (
                  <label className="border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-50/50 hover:border-indigo-300 transition-all group bg-slate-50/50">
                    <div className="p-4 bg-white rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8 text-indigo-500" />
                    </div>
                    <p className="text-sm font-semibold text-slate-600">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      PNG, JPG, WEBP up to 5MB
                    </p>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                ) : (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 aspect-video max-w-md flex items-center justify-center group">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <label className="p-3 bg-white hover:bg-slate-100 text-indigo-600 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-all cursor-pointer">
                        <Edit2 className="w-5 h-5" />
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={removeImage}
                        className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-all"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
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
                disabled={updateMutation.isPending || !name.trim()}
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

export default UpdateCategory;
