import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface ActionCardProps {
  icon: string;
  label: string;
  onPress: () => void;
}

export default function ActionCard({ icon, label, onPress }: ActionCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-1 rounded-2xl border border-white/10 p-4 m-1 items-center justify-center"
      style={{ backgroundColor: "rgba(255,255,255,0.05)", minHeight: 100 }}
    >
      <Text className="text-3xl mb-2">{icon}</Text>
      <Text className="text-white font-semibold text-sm text-center">
        {label}
      </Text>
      <Text className="text-slate-500 text-xs mt-1">›</Text>
    </TouchableOpacity>
  );
}
