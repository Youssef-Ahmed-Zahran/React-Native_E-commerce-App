import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useUpdateCartItem, useRemoveFromCart } from "../slice/cartSlice";
import type {
  CartItem as CartItemType,
  CartItemProps,
} from "../../../types/cart.types";
import type { Product } from "../../../types/product.types";

export default function CartItem({ item }: CartItemProps) {
  const { mutate: updateQuantity, isPending: isUpdating } = useUpdateCartItem();
  const { mutate: removeItem, isPending: isRemoving } = useRemoveFromCart();

  // The product is populated from the API
  const product = item.product as Product;
  const productId = product._id;
  const imageUri = product.images?.[0] || "";
  const lineTotal = item.price * item.quantity;

  const handleIncrease = () => {
    if (item.quantity < product.stock) {
      updateQuantity({ productId, quantity: item.quantity + 1 });
    }
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity({ productId, quantity: item.quantity - 1 });
    }
  };

  const handleRemove = () => {
    removeItem(productId);
  };

  const isBusy = isUpdating || isRemoving;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <View
      className="flex-row rounded-2xl border border-white/10 p-3 mb-4"
      style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
    >
      {/* ── Image ── */}
      <Image
        source={{ uri: imageUri }}
        style={{ width: 100, height: 100, borderRadius: 14 }}
        contentFit="cover"
        transition={200}
      />

      {/* ── Details ── */}
      <View className="flex-1 ml-4 justify-between">
        <View>
          {/* Top Row: Name + Remove */}
          <View className="flex-row justify-between items-start">
            <Text
              className="text-white font-bold text-base flex-1 mr-2"
              numberOfLines={2}
            >
              {product.name}
            </Text>
            <TouchableOpacity
              onPress={handleRemove}
              disabled={isBusy}
              className="w-8 h-8 rounded-full items-center justify-center ml-1"
              style={{ backgroundColor: "rgba(239,68,68,0.15)" }}
              activeOpacity={0.7}
            >
              {isRemoving ? (
                <ActivityIndicator size="small" color="#f87171" />
              ) : (
                <Ionicons name="trash-outline" size={16} color="#f87171" />
              )}
            </TouchableOpacity>
          </View>

          {/* Price */}
          <Text className="text-violet-400 font-semibold text-sm mt-1">
            ${item.price.toFixed(2)}
          </Text>

          {/* Stock Status */}
          {product.stock === 0 ? (
            <Text className="text-red-500 text-xs mt-1 font-bold">
              Out of Stock
            </Text>
          ) : isLowStock && (
            <Text className="text-orange-400 text-xs mt-1">
              Only {product.stock} left
            </Text>
          )}
        </View>

        {/* Bottom Row: Quantity Controls + Line Total */}
        <View className="flex-row items-center justify-between mt-2">
          {/* Quantity */}
          <View className="flex-row items-center gap-1">
            <TouchableOpacity
              onPress={handleDecrease}
              disabled={isBusy || item.quantity <= 1}
              className="w-8 h-8 rounded-xl items-center justify-center border border-white/10"
              style={{
                backgroundColor:
                  item.quantity <= 1
                    ? "rgba(255,255,255,0.02)"
                    : "rgba(255,255,255,0.08)",
              }}
              activeOpacity={0.7}
            >
              <Ionicons
                name="remove"
                size={16}
                color={item.quantity <= 1 ? "#475569" : "#f8fafc"}
              />
            </TouchableOpacity>

            <View className="w-8 items-center">
              {isUpdating ? (
                <ActivityIndicator size="small" color="#7c3aed" />
              ) : (
                <Text className="text-white font-bold text-base">
                  {item.quantity}
                </Text>
              )}
            </View>

            <TouchableOpacity
              onPress={handleIncrease}
              disabled={isBusy || item.quantity >= product.stock}
              className="w-8 h-8 rounded-xl items-center justify-center border border-violet-500/30"
              style={{
                backgroundColor:
                  item.quantity >= product.stock
                    ? "rgba(124,58,237,0.1)"
                    : "rgba(124,58,237,0.3)",
              }}
              activeOpacity={0.7}
            >
              <Ionicons
                name="add"
                size={16}
                color={item.quantity >= product.stock ? "#6d28d9" : "#a78bfa"}
              />
            </TouchableOpacity>
          </View>

          {/* Line Total */}
          <Text className="text-white font-bold text-lg">
            ${lineTotal.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
}
