import React from "react";
import { View, TouchableOpacity, Text, SafeAreaView } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import ProductDetails from "../components/ProductDetails";

export default function Product() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      {/* ── Back Button ── */}
      <View className="px-4 py-3">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full items-center justify-center border border-white/10"
          style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
          activeOpacity={0.7}
        >
          <Text className="text-white text-lg">←</Text>
        </TouchableOpacity>
      </View>

      <ProductDetails productId={id!} />
    </SafeAreaView>
  );
}
