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
        className={`mr-3 rounded-[20px] border pr-5 pl-2 py-2 flex-row items-center gap-2 ${
          isSelected ? "border-violet-500" : "border-white/10"
        }`}
        style={{
          backgroundColor: isSelected
            ? "rgba(124,58,237,0.2)"
            : "rgba(255,255,255,0.05)",
        }}
        activeOpacity={0.7}
      >
        <View
          className="w-8 h-8 rounded-full items-center justify-center overflow-hidden"
          style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
        >
          {item.image ? (
            <Image
              source={{ uri: item.image }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <Text className="text-xs">📂</Text>
          )}
        </View>

        <Text
          className={`text-sm font-bold ${
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
