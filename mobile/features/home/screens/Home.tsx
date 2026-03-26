import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import CategoryList from "../components/CategoryList";
import ProductCard from "../components/ProductCard";
import { useProducts } from "../../product/slice/productSlice";
import useDebounce from "../../../hooks/useDebouncing";
import type { Product } from "../../../types/product.types";
import { useQueryClient } from "@tanstack/react-query";

export default function Home() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const queryClient = useQueryClient();
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, error } = useProducts({
    search: debouncedSearch,
    category: selectedCategory,
    limit: 20,
  });

  const products = data?.products ?? [];

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["products"] }),
      queryClient.invalidateQueries({ queryKey: ["categories"] }),
    ]);
    setRefreshing(false);
  }, [queryClient]);

  const renderProduct = useCallback(
    ({ item }: { item: Product }) => <ProductCard product={item} />,
    []
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <StatusBar barStyle="light-content" backgroundColor="#020617" />

      {/* ── Decorative blobs ── */}
      <View
        className="absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-20"
        style={{ backgroundColor: "#7c3aed" }}
      />
      <View
        className="absolute top-60 -left-20 w-48 h-48 rounded-full opacity-10"
        style={{ backgroundColor: "#4f46e5" }}
      />

      {/* ── Header ── */}
      <View className="px-5 pt-4 pb-2 flex-row items-center justify-between">
        <View>
          <Text className="text-white text-2xl font-bold tracking-tight">
            Discover
          </Text>
          <Text className="text-slate-400 text-sm mt-0.5">
            Find the best products for you
          </Text>
        </View>

        {/* Manual refresh button for simulator */}
        <TouchableOpacity
          onPress={onRefresh}
          disabled={refreshing}
          className="items-center justify-center w-9 h-9 rounded-xl"
          style={{ backgroundColor: "rgba(124,58,237,0.15)" }}
        >
          {refreshing ? (
            <ActivityIndicator size="small" color="#7c3aed" />
          ) : (
            <Text className="text-violet-400 text-lg">↻</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* ── Search Bar ── */}
      <View className="px-5 mb-4">
        <View
          className="flex-row items-center rounded-2xl px-4 border border-white/10"
          style={{
            backgroundColor: "rgba(255,255,255,0.05)",
            height: 48,
          }}
        >
          <Text className="text-slate-400 mr-3 text-lg">🔍</Text>
          <TextInput
            className="flex-1 text-white text-base"
            placeholder="Search products..."
            placeholderTextColor="#64748b"
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {search.length > 0 && (
            <Text
              className="text-slate-400 text-sm p-1"
              onPress={() => setSearch("")}
            >
              ✕
            </Text>
          )}
        </View>
      </View>

      {/* ── Categories ── */}
      <CategoryList
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* ── Products Grid ── */}
      {isLoading && !refreshing ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#7c3aed" />
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-6">
          <View
            className="w-20 h-20 rounded-3xl items-center justify-center mb-4"
            style={{ backgroundColor: "rgba(239,68,68,0.15)" }}
          >
            <Text className="text-4xl">⚠️</Text>
          </View>
          <Text className="text-red-400 text-center font-semibold mb-1">
            Something went wrong
          </Text>
          <Text className="text-slate-400 text-sm text-center mb-5">
            {error.message || "Failed to load products"}
          </Text>
          <TouchableOpacity
            onPress={onRefresh}
            className="px-6 py-3 rounded-2xl"
            style={{ backgroundColor: "rgba(124,58,237,0.2)" }}
          >
            <Text className="text-violet-400 font-semibold">Try again</Text>
          </TouchableOpacity>
        </View>
      ) : products.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <View
            className="w-20 h-20 rounded-3xl items-center justify-center mb-4"
            style={{ backgroundColor: "rgba(124,58,237,0.15)" }}
          >
            <Text className="text-4xl">📦</Text>
          </View>
          <Text className="text-white text-lg font-bold mb-1">
            No products found
          </Text>
          <Text className="text-slate-400 text-sm text-center">
            Try a different search or category
          </Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          renderItem={renderProduct}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: "space-between",
            paddingHorizontal: 20,
          }}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#7c3aed"
              colors={["#7c3aed"]}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}