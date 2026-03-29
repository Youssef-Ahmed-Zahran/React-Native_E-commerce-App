import React, { useState, useRef, useCallback } from "react";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { useProduct } from "../slice/productSlice";
import { QUERY_KEYS } from "../../../lib/queryKeys";
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
  const queryClient = useQueryClient();
  const { data: product, isLoading, error } = useProduct(productId);
  const { mutate: addToCart, isPending: isAdding } = useAddToCart();
  const insets = useSafeAreaInsets();

  // ── On focus: conditionally invalidate this product's cache ───────────────
  // We only invalidate if the cached entry is older than 30 s — this matches
  // the staleTime in useProduct and prevents a redundant fetch when the user
  // just navigated away and immediately back within the same session.
  useFocusEffect(
    useCallback(() => {
      const queryKey = QUERY_KEYS.PRODUCT(productId);
      const state = queryClient.getQueryState(queryKey);
      const updatedAt = state?.dataUpdatedAt ?? 0;
      const AGE_THRESHOLD_MS = 30 * 1000; // mirror of staleTime in useProduct

      if (Date.now() - updatedAt > AGE_THRESHOLD_MS) {
        // Cache is stale (or empty) — invalidate so React Query refetches
        queryClient.invalidateQueries({ queryKey });
      }
      // If data is fresh (< 30s old) we do nothing — the existing cached
      // product is displayed instantly without any network request
    }, [productId, queryClient])
  );

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
    <View className="flex-1 bg-slate-950">
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Image Carousel ── */}
        <View className="relative">
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
                style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH * 1.33 }}
                contentFit="cover"
                transition={300}
                cachePolicy="none"
              />
            ))}
          </ScrollView>

          {/* Pagination dots (Overlaid) */}
          {product.images.length > 1 && (
            <View className="absolute bottom-4 left-0 right-0 flex-row items-center justify-center gap-2">
              <View
                className="flex-row items-center justify-center gap-2 px-3 py-1.5 rounded-full"
                style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
              >
                {product.images.map((_, idx) => (
                  <View
                    key={idx}
                    className={`rounded-full ${
                      idx === activeImageIndex
                        ? "w-5 h-1.5 bg-white"
                        : "w-1.5 h-1.5 bg-white/40"
                    }`}
                  />
                ))}
              </View>
            </View>
          )}
        </View>

        {/* ── Product Info ── */}
        <View className="px-5 pt-6">
          {/* Category badge */}
          {product.category && (
            <View
              className="self-start rounded-full px-3 py-1 mb-4"
              style={{ backgroundColor: "rgba(124,58,237,0.15)" }}
            >
              <Text className="text-violet-400 text-xs font-bold uppercase tracking-widest">
                {typeof product.category === "object"
                  ? (product.category as any).name
                  : product.category}
              </Text>
            </View>
          )}

          {/* Name and Favorite */}
          <View className="flex-row items-start justify-between mb-3">
            <Text className="text-white text-3xl font-extrabold tracking-tight flex-1 mr-4">
              {product.name}
            </Text>
            <TouchableOpacity
              onPress={handleToggleFavorite}
              disabled={isWishlistPending}
              className="w-12 h-12 rounded-full items-center justify-center"
              style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
            >
              {isWishlistPending ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Ionicons
                  name={isFavorite ? "heart" : "heart-outline"}
                  size={26}
                  color={isFavorite ? "#ef4444" : "#ffffff"}
                />
              )}
            </TouchableOpacity>
          </View>

          {/* Rating & Review Count */}
          <View className="flex-row items-center gap-1.5 mb-6">
            <Ionicons name="star" size={18} color="#facc15" />
            <Text className="text-white font-bold text-base">
              {product.averageRating ? product.averageRating.toFixed(1) : "0.0"}
            </Text>
            <Text className="text-slate-400 text-base">
              ({product.totalReviews || 0} reviews)
            </Text>

            <View className="w-1 h-1 rounded-full bg-slate-600 mx-2" />
            {/* Stock indicator */}
            <View className="flex-row items-center gap-1.5">
              <View
                className={`w-2 h-2 rounded-full ${
                  product.stock > 0 ? "bg-emerald-500" : "bg-red-500"
                }`}
              />
              <Text
                className={`text-sm font-semibold ${
                  product.stock > 0 ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {product.stock > 0
                  ? `In Stock (${product.stock})`
                  : "Out of Stock"}
              </Text>
            </View>
          </View>

          {/* Description Card */}
          <View className="mb-8">
            <Text className="text-white text-lg font-bold mb-3">
              Description
            </Text>
            <Text className="text-slate-400 text-base leading-relaxed">
              {product.description}
            </Text>
          </View>

          {/* --- Product Reviews --- */}
          <ReviewSection productId={productId} />
        </View>
      </ScrollView>

      {/* ── Sticky Bottom Action Bar ── */}
      <View
        className="absolute bottom-0 left-0 right-0 border-t border-white/5 bg-slate-900/90"
        style={{
          paddingBottom: insets.bottom || 20,
          paddingTop: 16,
          paddingHorizontal: 20,
        }}
      >
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-slate-400 text-sm mb-0.5 font-medium">
              Total Price
            </Text>
            <View className="flex-row items-end gap-2">
              <Text className="text-white text-3xl font-bold">
                $
                {hasDiscount
                  ? product.discountPrice!.toFixed(2)
                  : product.price.toFixed(2)}
              </Text>
              {hasDiscount && (
                <Text className="text-slate-500 text-base font-medium line-through mb-1">
                  ${product.price.toFixed(2)}
                </Text>
              )}
            </View>
          </View>

          <TouchableOpacity
            onPress={handleAddToCart}
            disabled={isAdding || product.stock === 0}
            className="rounded-2xl overflow-hidden"
            activeOpacity={0.85}
          >
            <View
              className="flex-row items-center justify-center gap-2 px-8 h-14"
              style={{
                backgroundColor:
                  isAdding || product.stock === 0 ? "#4c1d95" : "#7c3aed",
              }}
            >
              {isAdding ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Ionicons name="cart" size={20} color="white" />
                  <Text className="text-white font-bold text-lg tracking-wide">
                    {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </Text>
                </>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
