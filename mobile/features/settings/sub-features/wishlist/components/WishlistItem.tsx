import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import { useRemoveFromWishlist } from "../slice/wishlistSlice";
import type { Product } from "../../../../../types/product.types";

interface WishlistItemProps {
  product: Product;
}

export default function WishlistItem({ product }: WishlistItemProps) {
  const { mutate: removeFromWishlist, isPending } = useRemoveFromWishlist();

  if (!product || product.price === undefined) {
    return null;
  }

  const imageUri = product.images?.[0] ?? "";

  const handleRemove = () => {
    removeFromWishlist(product._id);
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
            disabled={isPending}
            activeOpacity={0.7}
            className="w-7 h-7 rounded-full items-center justify-center"
            style={{ backgroundColor: "rgba(239,68,68,0.15)" }}
          >
            {isPending ? (
              <ActivityIndicator size="small" color="#f87171" />
            ) : (
              <Text className="text-red-400 text-xs">✕</Text>
            )}
          </TouchableOpacity>
        </View>

        <Text className="text-violet-400 font-bold text-base mt-1">
          ${product.price.toFixed(2)}
        </Text>
      </View>
    </View>
  );
}
