import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProductById } from "../slice/productSlice";
import {
    ArrowLeft,
    Edit2,
    Package,
    Tag,
    DollarSign,
    Archive,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Image as ImageIcon,
} from "lucide-react";

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: product, isLoading, isError, error } = useProductById(id);
    const [activeImg, setActiveImg] = useState(0);

    if (isLoading) {
        return (
            <div className="flex-1 p-8 pt-10 min-h-screen bg-slate-50/50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="absolute inset-0 rounded-full blur-xl bg-indigo-500/30 animate-pulse" />
                        <Package className="animate-spin h-10 w-10 text-indigo-600 relative z-10" />
                    </div>
                    <p className="text-slate-500 font-medium animate-pulse tracking-wide">
                        Loading product...
                    </p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex-1 p-8 pt-10 min-h-screen bg-slate-50/50 flex items-center justify-center">
                <div className="bg-red-50/80 text-red-600 p-8 rounded-2xl shadow-lg border border-red-100 flex flex-col items-center">
                    <AlertCircle className="h-12 w-12 mb-4 text-red-500" />
                    <h3 className="text-xl font-bold mb-2">Error Loading Product</h3>
                    <p>{error?.message || "Something went wrong."}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-6 px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const images = product?.images ?? [];
    const hasImages = images.length > 0;

    const prevImage = () =>
        setActiveImg((i) => (i === 0 ? images.length - 1 : i - 1));
    const nextImage = () =>
        setActiveImg((i) => (i === images.length - 1 ? 0 : i + 1));

    const stockColor =
        product.stock === 0
            ? "bg-red-50 text-red-600 border-red-100"
            : product.stock <= 10
                ? "bg-amber-50 text-amber-600 border-amber-100"
                : "bg-emerald-50 text-emerald-700 border-emerald-100";

    return (
        <div className="flex-1 p-8 pt-10 min-h-screen bg-slate-50/50">
            <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </button>
                    <div className="flex-1">
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                            Product Details
                        </h2>
                        <p className="text-slate-500 mt-1">View full product information</p>
                    </div>
                    <button
                        onClick={() => navigate(`/products/edit/${product._id}`)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 text-white font-semibold rounded-xl transition-all active:scale-95"
                    >
                        <Edit2 className="w-4 h-4" />
                        Edit Product
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* ─── Image Gallery ──────────────────────────────────── */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="relative bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden aspect-square">
                            {hasImages ? (
                                <>
                                    <img
                                        key={activeImg}
                                        src={images[activeImg]}
                                        alt={`${product.name} – image ${activeImg + 1}`}
                                        className="w-full h-full object-cover animate-in fade-in duration-300"
                                    />
                                    {images.length > 1 && (
                                        <>
                                            {/* Prev / Next buttons */}
                                            <button
                                                onClick={prevImage}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full shadow-lg transition-all hover:scale-110"
                                            >
                                                <ChevronLeft className="w-5 h-5 text-slate-700" />
                                            </button>
                                            <button
                                                onClick={nextImage}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full shadow-lg transition-all hover:scale-110"
                                            >
                                                <ChevronRight className="w-5 h-5 text-slate-700" />
                                            </button>
                                            {/* Dot indicators */}
                                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                                                {images.map((_, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => setActiveImg(i)}
                                                        className={`w-2 h-2 rounded-full transition-all ${i === activeImg
                                                                ? "bg-indigo-600 w-5"
                                                                : "bg-white/70 hover:bg-white"
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                                    <ImageIcon className="w-16 h-16 mb-3" />
                                    <p className="text-sm font-medium text-slate-400">
                                        No images available
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Strip */}
                        {images.length > 1 && (
                            <div className="grid grid-cols-5 gap-2">
                                {images.map((src, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImg(i)}
                                        className={`rounded-xl overflow-hidden aspect-square border-2 transition-all ${i === activeImg
                                                ? "border-indigo-500 shadow-md shadow-indigo-200"
                                                : "border-slate-200 hover:border-indigo-300 opacity-70 hover:opacity-100"
                                            }`}
                                    >
                                        <img
                                            src={src}
                                            alt={`Thumbnail ${i + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Image count badge */}
                        <p className="text-center text-xs text-slate-400 font-medium">
                            {hasImages
                                ? `${images.length} image${images.length > 1 ? "s" : ""}`
                                : "No images"}
                        </p>
                    </div>

                    {/* ─── Product Info ────────────────────────────────────── */}
                    <div className="space-y-6">
                        {/* Name & Category */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 p-6">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-lg mb-3">
                                <Tag className="w-3 h-3" />
                                {product.category?.name || "Uncategorized"}
                            </span>
                            <h1 className="text-2xl font-extrabold text-slate-900 leading-tight">
                                {product.name}
                            </h1>
                            {product.description && (
                                <p className="text-slate-500 mt-3 text-sm leading-relaxed">
                                    {product.description}
                                </p>
                            )}
                        </div>

                        {/* Price & Stock */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 p-5 flex flex-col gap-1">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    Price
                                </p>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <DollarSign className="w-5 h-5 text-emerald-500" />
                                    <span className="text-2xl font-extrabold text-slate-900">
                                        {Number(product.price).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 p-5 flex flex-col gap-1">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    Stock
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <Archive className="w-5 h-5 text-slate-400" />
                                    <span className="text-2xl font-extrabold text-slate-900">
                                        {product.stock}
                                    </span>
                                </div>
                                <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold border w-fit mt-1 ${stockColor}`}
                                >
                                    {product.stock === 0
                                        ? "Out of Stock"
                                        : product.stock <= 10
                                            ? "Low Stock"
                                            : "In Stock"}
                                </span>
                            </div>
                        </div>

                        {/* Meta */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 p-6 space-y-3">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                                Product Meta
                            </h3>
                            <div className="divide-y divide-slate-50">
                                <div className="flex justify-between py-2.5">
                                    <span className="text-sm text-slate-500 font-medium">ID</span>
                                    <span className="text-sm font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg truncate max-w-[180px]">
                                        {product._id}
                                    </span>
                                </div>
                                <div className="flex justify-between py-2.5">
                                    <span className="text-sm text-slate-500 font-medium">
                                        Created
                                    </span>
                                    <span className="text-sm text-slate-700 font-semibold">
                                        {product.createdAt
                                            ? new Date(product.createdAt).toLocaleDateString(
                                                "en-US",
                                                {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                }
                                            )
                                            : "—"}
                                    </span>
                                </div>
                                <div className="flex justify-between py-2.5">
                                    <span className="text-sm text-slate-500 font-medium">
                                        Updated
                                    </span>
                                    <span className="text-sm text-slate-700 font-semibold">
                                        {product.updatedAt
                                            ? new Date(product.updatedAt).toLocaleDateString(
                                                "en-US",
                                                {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                }
                                            )
                                            : "—"}
                                    </span>
                                </div>
                                <div className="flex justify-between py-2.5">
                                    <span className="text-sm text-slate-500 font-medium">
                                        Images
                                    </span>
                                    <span className="text-sm text-slate-700 font-semibold">
                                        {images.length}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;
