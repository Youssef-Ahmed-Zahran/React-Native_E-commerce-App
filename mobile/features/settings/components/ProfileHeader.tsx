import React from "react";
import { View, Text } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useCurrentUser } from "../../auth/slice/authSlice";

export default function ProfileHeader() {
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
    <View
      className="flex-row items-center rounded-3xl border border-white/10 p-4 mb-4"
      style={{ backgroundColor: "rgba(255,255,255,0.03)" }}
    >
      {/* Avatar with Gradient Ring */}
      <View>
        <LinearGradient
          colors={["#c084fc", "#7c3aed"]}
          className="rounded-full items-center justify-center"
          style={{ width: 68, height: 68 }}
        >
          {avatarUri ? (
            <Image
              source={{ uri: avatarUri }}
              style={{
                width: 62,
                height: 62,
                borderRadius: 31,
                borderWidth: 2,
                borderColor: "#0f0f0f",
              }}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View
              className="items-center justify-center rounded-full"
              style={{
                width: 62,
                height: 62,
                backgroundColor: "#1e1b4b",
                borderWidth: 2,
                borderColor: "#0f0f0f",
              }}
            >
              <Text className="text-violet-300 font-bold text-xl">
                {initials}
              </Text>
            </View>
          )}
        </LinearGradient>
      </View>

      {/* Name & Email & Status */}
      <View className="ml-4 flex-1">
        <Text className="text-white font-bold text-xl">
          {user?.name ?? "Guest"}
        </Text>
        <Text className="text-slate-400 text-sm mt-0.5 mb-2">
          {user?.email ?? ""}
        </Text>
        <View
          className="self-start rounded-full px-2 py-0.5"
          style={{ backgroundColor: "rgba(34,197,94,0.15)" }}
        >
          <Text className="text-emerald-400 font-bold text-[10px] tracking-widest uppercase">
            Active
          </Text>
        </View>
      </View>
    </View>
  );
}
