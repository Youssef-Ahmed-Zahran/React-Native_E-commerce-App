import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import ProductDetails from "../components/ProductDetails";

export default function Product() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-slate-950">
      <ProductDetails productId={id!} />

      {/* ── Floating Back Button ── */}
      <View
        className="absolute left-4 z-50 shadow-md"
        style={{ top: insets.top + 10 }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-11 h-11 rounded-full items-center justify-center"
          style={{ backgroundColor: "rgba(15, 23, 42, 0.6)" }} // semi-transparent slate-900
          activeOpacity={0.8}
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
