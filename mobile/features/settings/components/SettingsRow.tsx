import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SettingsRowProps {
  icon: string;
  label: string;
  onPress?: () => void;
  trailing?: React.ReactNode;
}

export default function SettingsRow({
  icon,
  label,
  onPress,
  trailing,
}: SettingsRowProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      className="flex-row items-center rounded-2xl border border-white/10 px-4 py-3.5 mb-2 ml-1"
      style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
    >
      <View
        className="w-10 h-10 rounded-full items-center justify-center mr-3"
        style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
      >
        <Text className="text-lg">{icon}</Text>
      </View>
      <Text className="text-white font-medium text-base flex-1">{label}</Text>
      {trailing ?? (
        <Ionicons name="chevron-forward" size={20} color="#64748b" />
      )}
    </TouchableOpacity>
  );
}
