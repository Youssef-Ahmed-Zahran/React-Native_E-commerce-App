import React from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ActionCardProps {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  onPress: () => void;
  accentColor: string;
  iconColor: string;
}

export default function ActionCard({
  icon,
  label,
  onPress,
  accentColor,
  iconColor,
}: ActionCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-1 rounded-3xl border border-white/10 p-4 m-1.5 items-center justify-center"
      style={{ backgroundColor: "rgba(255,255,255,0.04)", minHeight: 110 }}
    >
      <View
        className="w-12 h-12 rounded-2xl items-center justify-center mb-3"
        style={{ backgroundColor: accentColor }}
      >
        <Ionicons name={icon} size={24} color={iconColor} />
      </View>
      <Text className="text-white font-semibold text-sm text-center">
        {label}
      </Text>
    </TouchableOpacity>
  );
}
