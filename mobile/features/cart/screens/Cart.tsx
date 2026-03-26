import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import { useCart } from "../slice/cartSlice";
import CartItem from "../components/CartItem";
import CheckoutModal from "../components/CheckoutModal";
import type { CartItem as CartItemType } from "../../../types/cart.types";
import type { Product } from "../../../types/product.types";

const SHIPPING_COST = 5.0;
const TAX_RATE = 0.08; // 8 %

export default function Cart() {
  const { data: cart, isLoading, error } = useCart();
  const [checkoutVisible, setCheckoutVisible] = useState(false);

  // Compute order totals
  const { subtotal, taxAmount, totalAmount } = useMemo(() => {
    if (!cart?.items?.length) {
      return { subtotal: 0, taxAmount: 0, totalAmount: 0 };
    }
    const sub = cart.items.reduce(
      (sum: number, item: CartItemType) => sum + item.price * item.quantity,
      0
    );
    const tax = sub * TAX_RATE;
    return {
      subtotal: sub,
      taxAmount: tax,
      totalAmount: sub + SHIPPING_COST + tax,
    };
  }, [cart?.items]);

  const hasItems = cart?.items && cart.items.length > 0;

  // ── Loading ──
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-950 items-center justify-center">
        <ActivityIndicator size="large" color="#7c3aed" />
      </SafeAreaView>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-slate-950 items-center justify-center px-6">
        <Text className="text-red-400 text-lg text-center">
          {error.message || "Failed to load cart"}
        </Text>
      </SafeAreaView>
    );
  }

  // ── Empty Cart ──
  if (!hasItems) {
    return (
      <SafeAreaView className="flex-1 bg-slate-950 items-center justify-center px-6">
        <Text className="text-5xl mb-4">🛒</Text>
        <Text className="text-white text-xl font-bold mb-2">
          Your cart is empty
        </Text>
        <Text className="text-slate-400 text-sm text-center mb-6">
          Browse our collection and add items you love!
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)")}
          className="rounded-2xl overflow-hidden"
          style={{ height: 50, width: 180 }}
          activeOpacity={0.85}
        >
          <View className="flex-1 items-center justify-center bg-violet-600 rounded-2xl">
            <Text className="text-white font-bold text-base">Shop Now</Text>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      {/* ── Header ── */}
      <View className="px-5 pt-4 pb-2">
        <Text className="text-white text-2xl font-bold tracking-tight">
          My Cart
        </Text>
        <Text className="text-slate-400 text-sm mt-1">
          {cart!.items.length} {cart!.items.length === 1 ? "item" : "items"}
        </Text>
      </View>

      {/* ── Cart Items ── */}
      <FlatList
        data={cart!.items}
        keyExtractor={(item: CartItemType) => {
          const product = item.product as Product;
          return product._id || String(item._id);
        }}
        renderItem={({ item }) => <CartItem item={item} />}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <>
            {/* ── Order Summary ── */}
            <View
              className="rounded-2xl border border-white/10 p-4 mt-2"
              style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
            >
              <Text className="text-white font-bold text-lg mb-3">
                Order Summary
              </Text>

              <SummaryRow label="Subtotal" value={subtotal} />
              <SummaryRow label="Shipping" value={SHIPPING_COST} />
              <SummaryRow label="Tax (8%)" value={taxAmount} />

              <View className="border-t border-white/10 mt-3 pt-3">
                <SummaryRow label="Total" value={totalAmount} bold />
              </View>
            </View>

            {/* ── Checkout Button ── */}
            <TouchableOpacity
              onPress={() => setCheckoutVisible(true)}
              className="rounded-2xl overflow-hidden mt-4 mb-6"
              style={{ height: 58 }}
              activeOpacity={0.85}
            >
              <View className="flex-1 flex-row items-center justify-center gap-2 bg-violet-600">
                <Text className="text-white text-xl">💳</Text>
                <Text className="text-white font-bold text-lg tracking-wide">
                  Checkout
                </Text>
              </View>
            </TouchableOpacity>
          </>
        }
      />

      {/* ── Checkout Modal ── */}
      <CheckoutModal
        visible={checkoutVisible}
        onClose={() => setCheckoutVisible(false)}
        subtotal={subtotal}
        shippingCost={SHIPPING_COST}
        taxAmount={taxAmount}
        totalAmount={totalAmount}
      />
    </SafeAreaView>
  );
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function SummaryRow({
  label,
  value,
  bold,
}: {
  label: string;
  value: number;
  bold?: boolean;
}) {
  return (
    <View className="flex-row justify-between items-center py-1">
      <Text
        className={`text-sm ${bold ? "text-white font-bold text-base" : "text-slate-400"}`}
      >
        {label}
      </Text>
      <Text
        className={`text-sm ${bold ? "text-white font-bold text-base" : "text-slate-300"}`}
      >
        ${value.toFixed(2)}
      </Text>
    </View>
  );
}
