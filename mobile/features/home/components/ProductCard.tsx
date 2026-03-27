import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
  Animated,
} from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  useWishlist,
  useAddToWishlist,
  useRemoveFromWishlist,
} from "../../settings/sub-features/wishlist/slice/wishlistSlice";
import { useAddToCart } from "../../cart/slice/cartSlice";
import type { ProductCardProps } from "../../../types/product.types";

const CARD_GAP = 12;
const HORIZONTAL_PADDING = 20;
const CARD_WIDTH =
  (Dimensions.get("window").width - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;

export default function ProductCard({ product }: ProductCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const { data: wishlist } = useWishlist();
  const { mutate: addToWishlist, isPending: isAdding } = useAddToWishlist();
  const { mutate: removeFromWishlist, isPending: isRemoving } =
    useRemoveFromWishlist();
  const { mutate: addToCart, isPending: isAddingToCart } = useAddToCart();

  const isFavorite = wishlist?.some((p) => p._id === product._id);
  const isPending = isAdding || isRemoving;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleToggleFavorite = () => {
    if (isFavorite) {
      removeFromWishlist(product._id, {
        onSuccess: () =>
          Alert.alert("Wishlist", `"${product.name}" removed from wishlist.`),
        onError: () =>
          Alert.alert(
            "Error",
            "Failed to remove from wishlist. Please try again.",
          ),
      });
    } else {
      addToWishlist(product._id, {
        onSuccess: () =>
          Alert.alert("Wishlist", `"${product.name}" added to wishlist! ❤️`),
        onError: () =>
          Alert.alert("Error", "Failed to add to wishlist. Please try again."),
      });
    }
  };

  const handleAddToCart = () => {
    addToCart(
      { productId: product._id, quantity: 1 },
      {
        onSuccess: () =>
          Alert.alert("Cart", `"${product.name}" added to cart! 🛒`),
        onError: () =>
          Alert.alert("Error", "Failed to add to cart. Please try again."),
      },
    );
  };

  const hasDiscount =
    product.discountPrice !== undefined &&
    product.discountPrice < product.price;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => router.push(`/(tabs)/product/${product._id}`)}
        className="rounded-2xl border border-white/10 overflow-hidden"
        style={{
          width: CARD_WIDTH,
          backgroundColor: "rgba(255,255,255,0.05)",
        }}
        activeOpacity={0.9}
      >
        {/* Product Image */}
        <View>
          <Image
            source={{ uri: product.images?.[0] }}
            style={{ width: "100%", height: CARD_WIDTH * 1.1 }}
            contentFit="cover"
            transition={200}
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.6)"]}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: "40%",
            }}
          />
        </View>

        {/* Discount badge */}
        {hasDiscount && (
          <View
            className="absolute top-2 left-2 rounded-full px-2 py-0.5"
            style={{ backgroundColor: "#ef4444" }}
          >
            <Text className="text-white text-[10px] font-bold tracking-wider">
              -
              {Math.round(
                ((product.price - product.discountPrice!) / product.price) *
                  100,
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
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
        >
          {isPending ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={16}
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
          <View className="flex-row items-center gap-1 mb-1">
            <Ionicons name="star" size={12} color="#facc15" />
            <Text className="text-slate-300 text-xs font-medium">
              {product.averageRating ? product.averageRating.toFixed(1) : "0.0"}
            </Text>
            <Text className="text-slate-500 text-[10px]">
              ({product.totalReviews || 0})
            </Text>
          </View>

          {/* Stock Status */}
          {product.stock === 0 ? (
            <Text className="text-red-500 text-[10px] font-bold mb-1.5">
              Out of Stock
            </Text>
          ) : product.stock > 0 && product.stock <= 5 ? (
            <Text className="text-orange-400 text-[10px] font-medium mb-1.5">
              Only {product.stock} left in stock
            </Text>
          ) : null}

          {/* Price & Add to Cart */}
          <View className="flex-row items-center justify-between mt-1">
            <View className="flex-row items-center gap-2">
              <Text className="text-violet-400 font-bold text-base">
                $
                {hasDiscount
                  ? product.discountPrice!.toFixed(2)
                  : product.price.toFixed(2)}
              </Text>
              {hasDiscount && (
                <Text className="text-slate-500 text-[10px] line-through">
                  ${product.price.toFixed(2)}
                </Text>
              )}
            </View>

            <TouchableOpacity
              onPress={handleAddToCart}
              disabled={isAddingToCart || product.stock === 0}
              className={`w-8 h-8 rounded-xl items-center justify-center ${
                product.stock === 0 ? "bg-violet-600/50" : "bg-violet-600"
              }`}
            >
              {isAddingToCart ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons 
                  name="add" 
                  size={20} 
                  color={product.stock === 0 ? "rgba(255,255,255,0.5)" : "#fff"} 
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
