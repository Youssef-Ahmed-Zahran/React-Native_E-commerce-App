import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SettingsRowProps {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  iconColor?: string;
  iconBgColor?: string;
  label: string;
  onPress?: () => void;
  trailing?: React.ReactNode;
}

export default function SettingsRow({
  icon,
  iconColor = "#94a3b8",
  iconBgColor = "rgba(148,163,184,0.1)",
  label,
  onPress,
  trailing,
}: SettingsRowProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      className="flex-row items-center rounded-2xl px-4 py-3.5 mb-2"
      style={{ backgroundColor: "rgba(255,255,255,0.03)" }}
    >
      <View
        className="w-10 h-10 rounded-xl items-center justify-center mr-4"
        style={{ backgroundColor: iconBgColor }}
      >
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <Text className="text-white font-semibold text-base flex-1 tracking-wide">{label}</Text>
      {trailing ?? (
        <Ionicons name="chevron-forward" size={20} color="#475569" />
      )}
    </TouchableOpacity>
  );
}
