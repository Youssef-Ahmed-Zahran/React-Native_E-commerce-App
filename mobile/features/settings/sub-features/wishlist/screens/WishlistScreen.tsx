import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WishlistItem from "../components/WishlistItem";
import { useWishlist } from "../slice/wishlistSlice";

interface WishlistProps {
  onBack: () => void;
}

export default function Wishlist({ onBack }: WishlistProps) {
  const { data: products, isLoading, isError, error } = useWishlist();

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
          data={products ?? []}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <WishlistItem product={item} />}
          contentContainerStyle={{ paddingTop: 8 }}
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
