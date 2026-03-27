import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useRemoveFromWishlist } from "../slice/wishlistSlice";
import { useAddToCart } from "../../../../cart/slice/cartSlice";
import type { Product } from "../../../../../types/product.types";

interface WishlistItemProps {
  product: Product;
}

export default function WishlistItem({ product }: WishlistItemProps) {
  const { mutate: removeFromWishlist, isPending: isRemoving } =
    useRemoveFromWishlist();
  const { mutate: addToCart, isPending: isAddingToCart } = useAddToCart();

  if (!product || product.price === undefined) {
    return null;
  }

  const imageUri = product.images?.[0] ?? "";

  const handleRemove = () => {
    removeFromWishlist(product._id);
  };

  const handleAddToCart = () => {
    addToCart(
      { productId: product._id, quantity: 1 },
      {
        onSuccess: () => {
          Alert.alert("Success", "Added to your cart");
        },
      },
    );
  };

  return (
    <View
      className="flex-row rounded-2xl border border-white/10 p-3 mb-3 mx-4"
      style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
    >
      {/* Image */}
      <Image
        source={{ uri: imageUri }}
        style={{ width: 80, height: 80, borderRadius: 14 }}
        contentFit="cover"
        transition={200}
      />

      {/* Details */}
      <View className="flex-1 ml-3 justify-between">
        <View className="flex-row justify-between items-start">
          <Text
            className="text-white font-semibold text-base flex-1 mr-2"
            numberOfLines={2}
          >
            {product.name}
          </Text>
          <TouchableOpacity
            onPress={handleRemove}
            disabled={isRemoving || isAddingToCart}
            activeOpacity={0.7}
            className="w-7 h-7 rounded-full items-center justify-center"
            style={{ backgroundColor: "rgba(239,68,68,0.15)" }}
          >
            {isRemoving ? (
              <ActivityIndicator size="small" color="#f87171" />
            ) : (
              <Text className="text-red-400 text-xs">✕</Text>
            )}
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center justify-between mt-2">
          <Text className="text-violet-400 font-bold text-base">
            ${product.price.toFixed(2)}
          </Text>
          <TouchableOpacity
            onPress={handleAddToCart}
            disabled={isAddingToCart || product.stock === 0}
            activeOpacity={0.7}
            className="rounded-xl px-3 py-1.5 flex-row items-center border border-violet-500/30"
            style={{ 
              backgroundColor: product.stock === 0 ? "rgba(124,58,237,0.1)" : "rgba(124,58,237,0.2)",
              opacity: product.stock === 0 ? 0.5 : 1
            }}
          >
            {isAddingToCart ? (
              <ActivityIndicator size="small" color="#a78bfa" />
            ) : product.stock === 0 ? (
              <Text className="text-violet-400 font-semibold text-xs mx-1">
                Out of Stock
              </Text>
            ) : (
              <>
                <Ionicons name="cart" size={14} color="#a78bfa" />
                <Text className="text-violet-400 font-semibold text-xs ml-1">
                  Add to Cart
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
