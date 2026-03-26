import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { useCategories } from "../../product/slice/categorySlice";
import type { Category, CategoryListProps } from "../../../types/home.types";

export default function CategoryList({
  selectedCategory,
  onSelectCategory,
}: CategoryListProps) {
  const { data, isLoading } = useCategories();
  const categories = data?.categories ?? [];

  const renderCategory = ({ item }: { item: Category }) => {
    const isSelected = selectedCategory === item._id;

    return (
      <TouchableOpacity
        onPress={() => onSelectCategory(isSelected ? "" : item._id)}
        className={`mr-3 rounded-2xl border px-4 py-3 flex-row items-center gap-2 ${
          isSelected ? "border-violet-500" : "border-white/10"
        }`}
        style={{
          backgroundColor: isSelected
            ? "rgba(124,58,237,0.2)"
            : "rgba(255,255,255,0.05)",
        }}
        activeOpacity={0.7}
      >
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            style={{ width: 24, height: 24, borderRadius: 6 }}
            contentFit="cover"
          />
        ) : (
          <View
            className="w-6 h-6 rounded-md items-center justify-center"
            style={{ backgroundColor: "rgba(124,58,237,0.3)" }}
          >
            <Text className="text-xs">📦</Text>
          </View>
        )}
        <Text
          className={`text-sm font-semibold ${
            isSelected ? "text-violet-400" : "text-slate-300"
          }`}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View className="py-4 items-center">
        <ActivityIndicator size="small" color="#7c3aed" />
      </View>
    );
  }

  return (
    <View className="mb-4">
      <Text className="text-white text-lg font-bold px-5 mb-3">Categories</Text>
      <FlatList
        horizontal
        data={categories}
        keyExtractor={(item) => item._id}
        renderItem={renderCategory}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        ListHeaderComponent={
          <TouchableOpacity
            onPress={() => onSelectCategory("")}
            className={`mr-3 rounded-2xl border px-4 py-3 items-center justify-center ${
              !selectedCategory ? "border-violet-500" : "border-white/10"
            }`}
            style={{
              backgroundColor: !selectedCategory
                ? "rgba(124,58,237,0.2)"
                : "rgba(255,255,255,0.05)",
            }}
            activeOpacity={0.7}
          >
            <Text
              className={`text-sm font-semibold ${
                !selectedCategory ? "text-violet-400" : "text-slate-300"
              }`}
            >
              All
            </Text>
          </TouchableOpacity>
        }
      />
    </View>
  );
}
