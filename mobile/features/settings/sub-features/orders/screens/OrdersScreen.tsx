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
import OrderCard from "../components/OrderCard";
import { useOrders } from "../slice/orderSlice";

interface OrdersProps {
  onBack: () => void;
}

export default function Orders({ onBack }: OrdersProps) {
  const { data, isLoading, isError, error, refetch } = useOrders();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 pt-4 pb-2">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={onBack} activeOpacity={0.7}>
            <Text className="text-violet-400 text-base">← Back</Text>
          </TouchableOpacity>
          <Text className="text-white font-bold text-lg ml-4">My Orders</Text>
        </View>

        {/* Manual refresh button */}
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

      {/* Content */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#7c3aed" />
        </View>
      ) : isError ? (
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-red-400 text-center">
            {error?.message ?? "Failed to load orders."}
          </Text>
        </View>
      ) : (
        <FlatList
          data={data?.orders ?? []}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <OrderCard order={item} />}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#7c3aed"]}
              tintColor="#7c3aed"
            />
          }
          ListEmptyComponent={
            <View className="items-center justify-center mt-20">
              <Text className="text-slate-500 text-base">No orders yet.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
