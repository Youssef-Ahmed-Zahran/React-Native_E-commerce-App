import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  TextInput,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
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
  const [promoCode, setPromoCode] = useState("");

  // Compute order totals
  const { subtotal, taxAmount, totalAmount } = useMemo(() => {
    if (!cart?.items?.length) {
      return { subtotal: 0, taxAmount: 0, totalAmount: 0 };
    }
    const sub = cart.items.reduce(
      (sum: number, item: CartItemType) => sum + item.price * item.quantity,
      0,
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
        <StatusBar barStyle="light-content" backgroundColor="#020617" />
        <View
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20"
          style={{ backgroundColor: "#7c3aed" }}
        />
        <View
          className="w-32 h-32 rounded-full items-center justify-center mb-6"
          style={{ backgroundColor: "rgba(124,58,237,0.15)" }}
        >
          <Ionicons name="cart-outline" size={64} color="#a78bfa" />
        </View>
        <Text className="text-white text-2xl font-bold mb-2">
          Your cart is empty
        </Text>
        <Text className="text-slate-400 text-base text-center mb-8 px-4">
          Looks like you haven't added anything yet. Discover our latest
          products!
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)")}
          className="rounded-2xl overflow-hidden"
          style={{ height: 56, width: 200 }}
          activeOpacity={0.85}
        >
          <View className="flex-1 flex-row items-center justify-center gap-2 bg-violet-600">
            <Ionicons name="search" size={20} color="#fff" />
            <Text className="text-white font-bold text-lg">Start Shopping</Text>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <StatusBar barStyle="light-content" backgroundColor="#020617" />

      {/* ── Decorative blobs ── */}
      <View
        className="absolute -top-32 -right-32 w-80 h-80 rounded-full opacity-20"
        style={{ backgroundColor: "#7c3aed" }}
      />

      {/* ── Header ── */}
      <View className="px-5 pt-4 pb-4">
        <Text className="text-white text-3xl font-bold tracking-tight">
          My Cart
        </Text>
        <Text className="text-slate-400 text-sm mt-1 font-medium">
          {cart!.items.length} {cart!.items.length === 1 ? "item" : "items"} ·
          Est. delivery 3–5 days
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
            {/* ── Promo Code ── */}
            <View className="flex-row items-center mt-4 mb-2">
              <View
                className="flex-1 flex-row items-center rounded-2xl border border-white/10 px-4 mr-2"
                style={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  height: 52,
                }}
              >
                <Ionicons name="ticket-outline" size={20} color="#94a3b8" />
                <TextInput
                  className="flex-1 text-white text-base ml-3"
                  placeholder="Enter promo code"
                  placeholderTextColor="#64748b"
                  value={promoCode}
                  onChangeText={setPromoCode}
                  autoCapitalize="characters"
                />
              </View>
              <TouchableOpacity
                className="rounded-2xl items-center justify-center px-5"
                style={{ backgroundColor: "#7c3aed", height: 52 }}
                activeOpacity={0.8}
              >
                <Text className="text-white font-bold">Apply</Text>
              </TouchableOpacity>
            </View>

            {/* ── Order Summary ── */}
            <View
              className="rounded-3xl border border-white/10 p-5 mt-4"
              style={{ backgroundColor: "rgba(255,255,255,0.03)" }}
            >
              <Text className="text-white font-bold text-lg mb-4">
                Order Summary
              </Text>

              <SummaryRow label="Subtotal" value={subtotal} />
              <SummaryRow label="Shipping" value={SHIPPING_COST} />
              <SummaryRow label="Tax (8%)" value={taxAmount} />

              <View className="border-t border-white/10 mt-4 pt-4">
                <SummaryRow label="Total Amount" value={totalAmount} bold />
              </View>
            </View>

            {/* ── Checkout Button ── */}
            <TouchableOpacity
              onPress={() => setCheckoutVisible(true)}
              className="rounded-2xl overflow-hidden mt-6 mb-8"
              style={{ height: 60 }}
              activeOpacity={0.85}
            >
              <View className="flex-1 flex-row items-center justify-center gap-2 bg-violet-600">
                <Ionicons name="card" size={24} color="#fff" />
                <Text className="text-white font-bold text-xl tracking-wide">
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
    <View className="flex-row justify-between items-center py-1.5">
      <Text
        className={`text-sm ${bold ? "text-white font-bold text-lg" : "text-slate-400 font-medium"}`}
      >
        {label}
      </Text>
      <Text
        className={`text-sm ${bold ? "text-violet-400 font-bold text-xl" : "text-slate-200 font-medium"}`}
      >
        ${value.toFixed(2)}
      </Text>
    </View>
  );
}
