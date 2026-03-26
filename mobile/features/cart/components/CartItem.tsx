import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
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

  return (
    <View
      className="flex-row rounded-2xl border border-white/10 p-3 mb-3"
      style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
    >
      {/* ── Image ── */}
      <Image
        source={{ uri: imageUri }}
        style={{ width: 90, height: 90, borderRadius: 14 }}
        contentFit="cover"
        transition={200}
      />

      {/* ── Details ── */}
      <View className="flex-1 ml-3 justify-between">
        {/* Top Row: Name + Remove */}
        <View className="flex-row justify-between items-start">
          <Text
            className="text-white font-semibold text-base flex-1 mr-2"
            numberOfLines={2}
          >
            {product.name}
          </Text>
          <TouchableOpacity
            onPress={handleRemove}
            disabled={isBusy}
            className="w-7 h-7 rounded-full items-center justify-center"
            style={{ backgroundColor: "rgba(239,68,68,0.15)" }}
            activeOpacity={0.7}
          >
            {isRemoving ? (
              <ActivityIndicator size="small" color="#f87171" />
            ) : (
              <Text className="text-red-400 text-xs">🗑</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Price */}
        <Text className="text-slate-400 text-sm mt-1">
          ${item.price.toFixed(2)}
        </Text>

        {/* Bottom Row: Quantity Controls + Line Total */}
        <View className="flex-row items-center justify-between mt-2">
          {/* Quantity */}
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={handleDecrease}
              disabled={isBusy || item.quantity <= 1}
              className="w-8 h-8 rounded-lg items-center justify-center border border-white/10"
              style={{
                backgroundColor:
                  item.quantity <= 1
                    ? "rgba(255,255,255,0.03)"
                    : "rgba(255,255,255,0.08)",
              }}
              activeOpacity={0.7}
            >
              <Text
                className={`text-base font-bold ${
                  item.quantity <= 1 ? "text-slate-600" : "text-white"
                }`}
              >
                −
              </Text>
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
              className="w-8 h-8 rounded-lg items-center justify-center border border-violet-500/30"
              style={{
                backgroundColor:
                  item.quantity >= product.stock
                    ? "rgba(124,58,237,0.1)"
                    : "rgba(124,58,237,0.2)",
              }}
              activeOpacity={0.7}
            >
              <Text
                className={`text-base font-bold ${
                  item.quantity >= product.stock
                    ? "text-violet-800"
                    : "text-violet-400"
                }`}
              >
                +
              </Text>
            </TouchableOpacity>
          </View>

          {/* Line Total */}
          <Text className="text-white font-bold text-base">
            ${lineTotal.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
}
