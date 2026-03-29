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
import { useInfiniteProducts } from "../../product/slice/productSlice";
import { useCurrentUser } from "../../auth/slice/authSlice";
import useDebounce from "../../../hooks/useDebouncing";
import { useFocusEffect } from "expo-router";
import { QUERY_KEYS } from "../../../lib/queryKeys";
import type { Product } from "../../../types/product.types";
import { useQueryClient } from "@tanstack/react-query";

export default function Home() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const queryClient = useQueryClient();
  const debouncedSearch = useDebounce(search, 500);

  const { data: user } = useCurrentUser();

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteProducts({
    search: debouncedSearch,
    category: selectedCategory,
    limit: 20,
  });

  const products: Product[] = data?.pages.flatMap((p) => p.products) ?? [];
  const discountedProducts = products.filter(
    (p) => p.discountPrice !== undefined && p.discountPrice < p.price,
  );

  // ── On focus: invalidate the infinite product list + categories ──────────
  // Products: target the exact infinite key to avoid trashing per-product caches.
  // Categories: staleTime is 0, so invalidating here forces an immediate
  // background-refetch — admin changes (renames, new/deleted categories) will
  // be visible as soon as the user opens or returns to the Home tab.
  useFocusEffect(
    useCallback(() => {
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.PRODUCTS, "infinite"],
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.CATEGORIES,
      });
    }, [queryClient]),
  );

  // ── Pull-to-refresh: only refetch products ────────────────────────────────
  // Categories have staleTime: 10 min — they self-refresh automatically;
  // there's no need to force-invalidate them on every manual pull.
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderProduct = useCallback(
    ({ item }: { item: Product }) => (
      <View style={{ width: "48%", marginBottom: 16 }}>
        <ProductCard product={item} />
      </View>
    ),
    [],
  );

  const ListHeader = useCallback(
    () => (
      <>
        {/* ── Categories ── */}
        <CategoryList
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* ── Hot Deals Banner ── */}
        {!isLoading && !error && discountedProducts.length > 0 && (
          <View className="mb-6">
            <View className="flex-row items-center justify-between px-5 mb-3">
              <Text className="text-white text-lg font-bold">🔥 Hot Deals</Text>
              <Text className="text-violet-400 text-sm font-semibold">
                See all
              </Text>
            </View>
            <FlatList
              horizontal
              data={discountedProducts}
              keyExtractor={(item) => `deal-${item._id}`}
              renderItem={({ item }) => <ProductCard product={item} />}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20 }}
              ItemSeparatorComponent={() => <View className="w-4" />}
            />
          </View>
        )}

        {/* ── Products Grid title ── */}
        <View className="px-5 mb-3">
          <Text className="text-white text-lg font-bold">
            {selectedCategory ? "Filtered Products" : "All Products"}
          </Text>
        </View>

        {/* Initial loading state */}
        {isLoading && !refreshing && (
          <View className="items-center justify-center py-10">
            <ActivityIndicator size="large" color="#7c3aed" />
          </View>
        )}

        {/* Error state */}
        {error && (
          <View className="items-center justify-center py-10 px-6">
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
        )}
      </>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedCategory, discountedProducts, isLoading, error, refreshing],
  );

  const ListFooter = useCallback(
    () => (
      <View className="py-6 items-center">
        {isFetchingNextPage ? (
          <ActivityIndicator size="small" color="#7c3aed" />
        ) : !hasNextPage && products.length > 0 ? (
          <Text className="text-slate-600 text-sm">
            All products loaded ✓
          </Text>
        ) : null}
      </View>
    ),
    [isFetchingNextPage, hasNextPage, products.length],
  );

  const ListEmpty = useCallback(
    () =>
      !isLoading && !error ? (
        <View className="items-center justify-center py-10 px-6">
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
      ) : null,
    [isLoading, error],
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
      <View className="px-5 pt-4 pb-4 flex-row items-center justify-between">
        <View>
          <Text className="text-slate-400 text-sm font-medium mb-1">
            Good morning, {user?.name ? user.name.split(" ")[0] : "Guest"} 👋
          </Text>
          <Text className="text-white text-3xl font-bold tracking-tight">
            Discover
          </Text>
        </View>

        {/* Manual refresh button for simulator */}
        <TouchableOpacity
          onPress={onRefresh}
          disabled={refreshing}
          className="items-center justify-center w-10 h-10 rounded-2xl"
          style={{ backgroundColor: "rgba(124,58,237,0.15)" }}
        >
          {refreshing ? (
            <ActivityIndicator size="small" color="#7c3aed" />
          ) : (
            <Text className="text-violet-400 text-xl">↻</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* ── Search Bar ── */}
      <View className="px-5 mb-5">
        <View
          className="flex-row items-center rounded-2xl px-4 border border-white/10"
          style={{
            backgroundColor: "rgba(255,255,255,0.05)",
            height: 52,
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
              className="text-slate-400 text-sm p-2"
              onPress={() => setSearch("")}
            >
              ✕
            </Text>
          )}
        </View>
      </View>

      {/* ── Main product FlatList (grid) ── */}
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={renderProduct}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          paddingHorizontal: 20,
        }}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        ListEmptyComponent={ListEmpty}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.4}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#7c3aed"
            colors={["#7c3aed"]}
          />
        }
        contentContainerStyle={{ paddingBottom: 8 }}
      />
    </SafeAreaView>
  );
}
