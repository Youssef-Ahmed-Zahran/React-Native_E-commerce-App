import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import OrderCard from "../components/OrderCard";
import { useInfiniteOrders } from "../slice/orderSlice";

interface OrdersProps {
  onBack: () => void;
}

export default function Orders({ onBack }: OrdersProps) {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteOrders();
  const [refreshing, setRefreshing] = useState(false);

  const orders = data?.pages.flatMap((p) => p.orders) ?? [];

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

  const ListFooter = useCallback(
    () => (
      <View className="py-6 items-center">
        {isFetchingNextPage ? (
          <ActivityIndicator size="small" color="#7c3aed" />
        ) : !hasNextPage && orders.length > 0 ? (
          <View className="flex-row items-center gap-2">
            <Ionicons name="checkmark-circle" size={14} color="#475569" />
            <Text className="text-slate-600 text-sm">All orders loaded</Text>
          </View>
        ) : null}
      </View>
    ),
    [isFetchingNextPage, hasNextPage, orders.length],
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      {/* Decorative blob */}
      <View
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-[0.05]"
        style={{ backgroundColor: "#c084fc" }}
      />

      {/* Header */}
      <View className="flex-row justify-between items-center px-5 pt-5 pb-4">
        <View className="flex-row items-center gap-3">
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
              My Orders
            </Text>
            <Text className="text-slate-500 text-xs mt-0.5">
              {orders.length > 0 ? `${orders.length} order${orders.length !== 1 ? "s" : ""}` : "Track your purchases"}
            </Text>
          </View>
        </View>

        {/* Manual refresh button */}
        <TouchableOpacity
          onPress={onRefresh}
          disabled={refreshing}
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: "rgba(124,58,237,0.12)" }}
        >
          {refreshing ? (
            <ActivityIndicator size="small" color="#7c3aed" />
          ) : (
            <Ionicons name="refresh" size={20} color="#a78bfa" />
          )}
        </TouchableOpacity>
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
            {error?.message ?? "Failed to load orders."}
          </Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <OrderCard order={item} />}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8 }}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.4}
          ListFooterComponent={ListFooter}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#7c3aed"]}
              tintColor="#7c3aed"
            />
          }
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center mt-24 gap-4">
              <View
                className="w-20 h-20 rounded-3xl items-center justify-center"
                style={{ backgroundColor: "rgba(124,58,237,0.1)" }}
              >
                <Ionicons name="receipt-outline" size={36} color="#6d28d9" />
              </View>
              <Text className="text-white font-bold text-lg">No orders yet</Text>
              <Text className="text-slate-500 text-sm text-center px-8">
                Your order history will appear here once you make a purchase.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
