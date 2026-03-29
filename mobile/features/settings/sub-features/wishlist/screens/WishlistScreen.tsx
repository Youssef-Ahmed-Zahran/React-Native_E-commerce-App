import React, { useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import WishlistItem from "../components/WishlistItem";
import { useInfiniteWishlist } from "../slice/wishlistSlice";

interface WishlistProps {
  onBack: () => void;
}

export default function Wishlist({ onBack }: WishlistProps) {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteWishlist();

  const products = data?.pages.flatMap((p) => p.products) ?? [];

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const ListFooter = useCallback(
    () => (
      <View className="py-6 items-center">
        {isFetchingNextPage ? (
          <ActivityIndicator size="small" color="#7c3aed" />
        ) : !hasNextPage && products.length > 0 ? (
          <View className="flex-row items-center gap-2">
            <Ionicons name="checkmark-circle" size={14} color="#475569" />
            <Text className="text-slate-600 text-sm">All items loaded</Text>
          </View>
        ) : null}
      </View>
    ),
    [isFetchingNextPage, hasNextPage, products.length],
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      {/* Decorative blob */}
      <View
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-[0.05]"
        style={{ backgroundColor: "#f87171" }}
      />

      {/* Header */}
      <View className="flex-row items-center px-5 pt-5 pb-4 gap-3">
        <TouchableOpacity
          onPress={onBack}
          activeOpacity={0.7}
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
        >
          <Ionicons name="chevron-back" size={22} color="#a78bfa" />
        </TouchableOpacity>
        <View>
          <Text className="text-white font-extrabold text-2xl tracking-tight">
            My Wishlist
          </Text>
          <Text className="text-slate-500 text-xs mt-0.5">
            {products.length > 0 ? `${products.length} saved item${products.length !== 1 ? "s" : ""}` : "Items you love"}
          </Text>
        </View>
      </View>

      {/* Content */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#7c3aed" />
        </View>
      ) : isError ? (
        <View className="flex-1 items-center justify-center px-8 gap-3">
          <Ionicons name="cloud-offline-outline" size={48} color="#475569" />
          <Text className="text-slate-400 text-center text-base">
            {error?.message ?? "Failed to load wishlist."}
          </Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <WishlistItem product={item} />}
          contentContainerStyle={{ paddingTop: 8 }}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.4}
          ListFooterComponent={ListFooter}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center mt-24 gap-4">
              <View
                className="w-20 h-20 rounded-3xl items-center justify-center"
                style={{ backgroundColor: "rgba(248,113,113,0.1)" }}
              >
                <Ionicons name="heart-outline" size={36} color="#9f1239" />
              </View>
              <Text className="text-white font-bold text-lg">
                Your wishlist is empty
              </Text>
              <Text className="text-slate-500 text-sm text-center px-8">
                Save products you love and find them here when you're ready to
                buy.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
