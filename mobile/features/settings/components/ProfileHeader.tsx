import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useCurrentUser } from "../../auth/slice/authSlice";

interface ProfileHeaderProps {
  onPress?: () => void;
}

export default function ProfileHeader({ onPress }: ProfileHeaderProps) {
  const { data: user } = useCurrentUser();

  const avatarUri = user?.imageUrl || "";
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress}
      className="flex-row items-center rounded-3xl border border-white/10 p-4 mb-5"
      style={{ backgroundColor: "rgba(255,255,255,0.03)" }}
    >
      {/* Avatar with Vibrant Gradient Ring */}
      <View>
        <LinearGradient
          colors={["#ec4899", "#8b5cf6", "#3b82f6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-full items-center justify-center"
          style={{ width: 72, height: 72 }}
        >
          {avatarUri ? (
            <Image
              source={{ uri: avatarUri }}
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                borderWidth: 3,
                borderColor: "#020617", // Matches the very dark slate background
              }}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View
              className="items-center justify-center rounded-full"
              style={{
                width: 64,
                height: 64,
                backgroundColor: "#1e1b4b", // Dark indigo
                borderWidth: 3,
                borderColor: "#020617",
              }}
            >
              <Text className="text-violet-300 font-bold text-2xl">
                {initials}
              </Text>
            </View>
          )}
        </LinearGradient>
      </View>

      {/* Name & Email & Status */}
      <View className="ml-4 flex-1 justify-center">
        <Text
          className="text-white font-extrabold text-2xl tracking-tight"
          numberOfLines={1}
        >
          {user?.name ?? "Guest"}
        </Text>
        <Text className="text-slate-400 text-sm mt-0.5 mb-2 font-medium">
          {user?.email ?? ""}
        </Text>
        <View className="flex-row items-center gap-1.5">
          <View className="w-2 h-2 rounded-full bg-emerald-400 shadow shadow-emerald-400/50" />
          <Text className="text-emerald-400 font-bold text-xs uppercase tracking-widest">
            Active
          </Text>
        </View>
      </View>

      {/* Right chevron for interactivity indication */}
      {onPress && (
        <View className="ml-2 w-8 h-8 rounded-full items-center justify-center bg-white/5">
          <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
        </View>
      )}
    </TouchableOpacity>
  );
}
