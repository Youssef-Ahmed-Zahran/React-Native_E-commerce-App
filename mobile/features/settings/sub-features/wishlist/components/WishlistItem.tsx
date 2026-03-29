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
  const hasDiscount =
    product.discountPrice !== undefined && product.discountPrice < product.price;
  const displayPrice = hasDiscount ? product.discountPrice! : product.price;

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
      className="flex-row rounded-3xl border border-white/[0.07] p-3 mb-3 mx-4"
      style={{ backgroundColor: "rgba(255,255,255,0.03)" }}
    >
      {/* Image */}
      <Image
        source={{ uri: imageUri }}
        style={{ width: 90, height: 90, borderRadius: 16 }}
        contentFit="cover"
        transition={200}
      />

      {/* Details */}
      <View className="flex-1 ml-3 justify-between py-0.5">
        {/* Name + Remove */}
        <View className="flex-row justify-between items-start">
          <Text
            className="text-white font-bold text-base flex-1 mr-2 leading-snug"
            numberOfLines={2}
          >
            {product.name}
          </Text>
          <TouchableOpacity
            onPress={handleRemove}
            disabled={isRemoving || isAddingToCart}
            activeOpacity={0.7}
            className="w-8 h-8 rounded-full items-center justify-center"
            style={{ backgroundColor: "rgba(239,68,68,0.12)" }}
          >
            {isRemoving ? (
              <ActivityIndicator size="small" color="#f87171" />
            ) : (
              <Ionicons name="close" size={16} color="#f87171" />
            )}
          </TouchableOpacity>
        </View>

        {/* Price Row + Add to Cart */}
        <View className="flex-row items-center justify-between mt-3">
          <View>
            <Text className="text-violet-400 font-extrabold text-lg">
              ${displayPrice.toFixed(2)}
            </Text>
            {hasDiscount && (
              <Text className="text-slate-600 text-xs line-through -mt-0.5">
                ${product.price.toFixed(2)}
              </Text>
            )}
          </View>

          <TouchableOpacity
            onPress={handleAddToCart}
            disabled={isAddingToCart || product.stock === 0}
            activeOpacity={0.7}
            className="rounded-2xl px-4 py-2 flex-row items-center gap-1.5"
            style={{
              backgroundColor:
                product.stock === 0
                  ? "rgba(124,58,237,0.08)"
                  : "rgba(124,58,237,0.2)",
              opacity: product.stock === 0 ? 0.5 : 1,
            }}
          >
            {isAddingToCart ? (
              <ActivityIndicator size="small" color="#a78bfa" />
            ) : product.stock === 0 ? (
              <Text className="text-violet-400 font-semibold text-xs">
                Out of Stock
              </Text>
            ) : (
              <>
                <Ionicons name="cart-outline" size={15} color="#a78bfa" />
                <Text className="text-violet-400 font-bold text-xs">
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
