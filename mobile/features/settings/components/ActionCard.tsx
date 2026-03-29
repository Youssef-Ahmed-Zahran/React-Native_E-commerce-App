import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

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
      style={{ flex: 1, borderRadius: 24, overflow: "hidden", minHeight: 110 }}
    >
      <LinearGradient
        colors={["rgba(255,255,255,0.07)", "rgba(255,255,255,0.02)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          flex: 1,
          padding: 16,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 24,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.07)",
        }}
      >
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 16,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12,
            backgroundColor: accentColor,
          }}
        >
          <Ionicons name={icon} size={22} color={iconColor} />
        </View>
        <Text style={{ color: "#e2e8f0", fontWeight: "700", fontSize: 13, textAlign: "center", letterSpacing: 0.3 }}>
          {label}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

