import React, { useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
          <Text className="text-slate-600 text-sm">
            All wishlist items loaded ✓
          </Text>
        ) : null}
      </View>
    ),
    [isFetchingNextPage, hasNextPage, products.length],
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      {/* Header */}
      <View className="flex-row items-center px-4 pt-4 pb-2">
        <TouchableOpacity onPress={onBack} activeOpacity={0.7}>
          <Text className="text-violet-400 text-base">← Back</Text>
        </TouchableOpacity>
        <Text className="text-white font-bold text-lg ml-4">My Wishlist</Text>
      </View>

      {/* Content */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#7c3aed" />
        </View>
      ) : isError ? (
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-red-400 text-center">
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
            <View className="items-center justify-center mt-20">
              <Text className="text-slate-500 text-base">
                Your wishlist is empty.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
