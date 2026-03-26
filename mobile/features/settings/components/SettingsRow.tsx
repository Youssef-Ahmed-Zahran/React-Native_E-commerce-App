import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

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
      className="flex-row items-center rounded-2xl border border-white/10 px-4 py-3.5 mb-2"
      style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
    >
      <Text className="text-lg mr-3">{icon}</Text>
      <Text className="text-white font-medium text-base flex-1">{label}</Text>
      {trailing ?? <Text className="text-slate-500 text-lg">›</Text>}
    </TouchableOpacity>
  );
}
