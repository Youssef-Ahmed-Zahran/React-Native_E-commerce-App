import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  useWishlist,
  useAddToWishlist,
  useRemoveFromWishlist,
} from "../../settings/sub-features/wishlist/slice/wishlistSlice";
import { useAddToCart } from "../../cart/slice/cartSlice";
import type { Product, ProductCardProps } from "../../../types/product.types";

const CARD_GAP = 12;
const HORIZONTAL_PADDING = 20;
const CARD_WIDTH =
  (Dimensions.get("window").width - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;

export default function ProductCard({ product }: ProductCardProps) {
  const { data: wishlist } = useWishlist();
  const { mutate: addToWishlist, isPending: isAdding } = useAddToWishlist();
  const { mutate: removeFromWishlist, isPending: isRemoving } =
    useRemoveFromWishlist();
  const { mutate: addToCart, isPending: isAddingToCart } = useAddToCart();

  const isFavorite = wishlist?.some((p) => p._id === product._id);
  const isPending = isAdding || isRemoving;

  const handleToggleFavorite = () => {
    if (isFavorite) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product._id);
    }
  };

  const handleAddToCart = () => {
    addToCart({ productId: product._id, quantity: 1 });
  };

  const hasDiscount =
    product.discountPrice !== undefined &&
    product.discountPrice < product.price;

  return (
    <TouchableOpacity
      onPress={() => router.push(`/(tabs)/product/${product._id}`)}
      className="rounded-2xl border border-white/10 overflow-hidden"
      style={{
        width: CARD_WIDTH,
        backgroundColor: "rgba(255,255,255,0.05)",
        marginBottom: CARD_GAP,
      }}
      activeOpacity={0.8}
    >
      {/* Product Image */}
      <Image
        source={{ uri: product.images?.[0] }}
        style={{ width: "100%", height: CARD_WIDTH * 1.1 }}
        contentFit="cover"
        transition={200}
      />

      {/* Discount badge */}
      {hasDiscount && (
        <View
          className="absolute top-2 left-2 rounded-full px-2 py-0.5"
          style={{ backgroundColor: "#ef4444" }}
        >
          <Text className="text-white text-[10px] font-bold">
            -
            {Math.round(
              ((product.price - product.discountPrice!) / product.price) * 100
            )}
            %
          </Text>
        </View>
      )}

      {/* Favorite Button */}
      <TouchableOpacity
        onPress={handleToggleFavorite}
        disabled={isPending}
        className="absolute top-2 right-2 w-8 h-8 rounded-full items-center justify-center"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        {isPending ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={18}
            color={isFavorite ? "#ef4444" : "#ffffff"}
          />
        )}
      </TouchableOpacity>

      {/* Info */}
      <View className="p-3">
        <Text
          className="text-white text-sm font-semibold mb-1"
          numberOfLines={2}
        >
          {product.name}
        </Text>

        {/* Rating */}
        <View className="flex-row items-center gap-1 mb-1.5">
          <Ionicons name="star" size={12} color="#facc15" />
          <Text className="text-slate-300 text-xs font-medium">
            {product.averageRating ? product.averageRating.toFixed(1) : "0.0"}
          </Text>
          <Text className="text-slate-500 text-[10px]">
            ({product.totalReviews || 0})
          </Text>
        </View>

        {/* Price & Add to Cart */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Text className="text-violet-400 font-bold text-base">
              $
              {hasDiscount
                ? product.discountPrice!.toFixed(2)
                : product.price.toFixed(2)}
            </Text>
            {hasDiscount && (
              <Text className="text-slate-500 text-xs line-through">
                ${product.price.toFixed(2)}
              </Text>
            )}
          </View>

          <TouchableOpacity
            onPress={handleAddToCart}
            disabled={isAddingToCart}
            className="w-8 h-8 rounded-full bg-violet-600 items-center justify-center"
          >
            {isAddingToCart ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="add" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}
