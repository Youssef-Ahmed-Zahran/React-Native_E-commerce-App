import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { useProduct } from "../slice/productSlice";
import { useAddToCart } from "../../cart/slice/cartSlice";
import { Ionicons } from "@expo/vector-icons";
import {
  useWishlist,
  useAddToWishlist,
  useRemoveFromWishlist,
} from "../../settings/sub-features/wishlist/slice/wishlistSlice";
import ReviewSection from "./ReviewSection";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

import { type ProductDetailsProps } from "../../../types/product.types";

export default function ProductDetails({ productId }: ProductDetailsProps) {
  const { data: product, isLoading, error } = useProduct(productId);
  const { mutate: addToCart, isPending: isAdding } = useAddToCart();

  const { data: wishlist } = useWishlist();
  const { mutate: addToWishlist, isPending: isAddingToWishlist } =
    useAddToWishlist();
  const { mutate: removeFromWishlist, isPending: isRemovingFromWishlist } =
    useRemoveFromWishlist();

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const isFavorite = wishlist?.some((p) => p._id === product?._id);
  const isWishlistPending = isAddingToWishlist || isRemovingFromWishlist;

  const handleToggleFavorite = () => {
    if (isFavorite) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveImageIndex(index);
  };

  const handleAddToCart = () => {
    addToCart(
      { productId, quantity: 1 },
      {
        onSuccess: () => Alert.alert("Success", "Added to cart!"),
        onError: (err: Error) => Alert.alert("Error", err.message),
      }
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-950">
        <ActivityIndicator size="large" color="#7c3aed" />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-950 px-6">
        <Text className="text-red-400 text-lg text-center">
          {error?.message || "Product not found"}
        </Text>
      </View>
    );
  }

  const hasDiscount =
    product.discountPrice !== undefined &&
    product.discountPrice < product.price;

  return (
    <ScrollView
      className="flex-1 bg-slate-950"
      showsVerticalScrollIndicator={false}
    >
      {/* ── Image Carousel ── */}
      <View>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {product.images.map((uri, idx) => (
            <Image
              key={idx}
              source={{ uri }}
              style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH * 1.1 }}
              contentFit="cover"
              transition={300}
            />
          ))}
        </ScrollView>

        {/* Pagination dots */}
        {product.images.length > 1 && (
          <View className="flex-row items-center justify-center gap-2 py-3">
            {product.images.map((_, idx) => (
              <View
                key={idx}
                className={`rounded-full ${idx === activeImageIndex
                    ? "w-6 h-2 bg-violet-500"
                    : "w-2 h-2 bg-white/30"
                  }`}
              />
            ))}
          </View>
        )}
      </View>

      {/* ── Product Info ── */}
      <View className="px-5 pt-4 pb-8">
        {/* Category badge */}
        {product.category && (
          <View
            className="self-start rounded-full px-3 py-1 mb-3"
            style={{ backgroundColor: "rgba(124,58,237,0.2)" }}
          >
            <Text className="text-violet-400 text-xs font-semibold uppercase tracking-wider">
              {typeof product.category === "object"
                ? (product.category as any).name
                : product.category}
            </Text>
          </View>
        )}

        {/* Name and Favorite */}
        <View className="flex-row items-start justify-between mb-2">
          <Text className="text-white text-2xl font-bold tracking-tight flex-1 mr-4">
            {product.name}
          </Text>
          <TouchableOpacity
            onPress={handleToggleFavorite}
            disabled={isWishlistPending}
            className="w-10 h-10 rounded-full items-center justify-center border border-white/10"
            style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
          >
            {isWishlistPending ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={22}
                color={isFavorite ? "#ef4444" : "#ffffff"}
              />
            )}
          </TouchableOpacity>
        </View>

        {/* Rating */}
        <View className="flex-row items-center gap-1 mb-4">
          <Ionicons name="star" size={16} color="#facc15" />
          <Text className="text-white font-semibold text-sm">
            {product.averageRating ? product.averageRating.toFixed(1) : "0.0"}
          </Text>
          <Text className="text-slate-400 text-sm">
            ({product.totalReviews || 0} reviews)
          </Text>
        </View>

        {/* Price */}
        <View className="flex-row items-end gap-3 mb-6">
          <Text className="text-white text-3xl font-bold">
            $
            {hasDiscount
              ? product.discountPrice!.toFixed(2)
              : product.price.toFixed(2)}
          </Text>
          {hasDiscount && (
            <Text className="text-slate-500 text-lg line-through mb-0.5">
              ${product.price.toFixed(2)}
            </Text>
          )}
        </View>

        {/* Description Card */}
        <View
          className="rounded-2xl border border-white/10 p-4 mb-6"
          style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
        >
          <Text className="text-slate-300 text-sm font-semibold uppercase tracking-wider mb-2">
            Description
          </Text>
          <Text className="text-slate-400 text-base leading-relaxed">
            {product.description}
          </Text>
        </View>

        {/* Stock */}
        <View className="flex-row items-center gap-2 mb-8">
          <View
            className={`w-2.5 h-2.5 rounded-full ${product.stock > 0 ? "bg-emerald-500" : "bg-red-500"
              }`}
          />
          <Text
            className={`text-sm font-medium ${product.stock > 0 ? "text-emerald-400" : "text-red-400"
              }`}
          >
            {product.stock > 0
              ? `In Stock (${product.stock} available)`
              : "Out of Stock"}
          </Text>
        </View>

        {/* Add to Cart Button */}
        <TouchableOpacity
          onPress={handleAddToCart}
          disabled={isAdding || product.stock === 0}
          className="rounded-2xl overflow-hidden"
          style={{ height: 58 }}
          activeOpacity={0.85}
        >
          <View
            className="flex-1 flex-row items-center justify-center gap-2"
            style={{
              backgroundColor:
                isAdding || product.stock === 0 ? "#4c1d95" : "#7c3aed",
            }}
          >
            {isAdding ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Text className="text-white text-xl">🛒</Text>
                <Text className="text-white font-bold text-lg tracking-wide">
                  {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </Text>
              </>
            )}
          </View>
        </TouchableOpacity>

        {/* --- Product Reviews --- */}
        <ReviewSection productId={productId} />
      </View>
    </ScrollView>
  );
}
