import React from "react";
import { View, Text } from "react-native";
import { Image } from "expo-image";
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
      className="flex-row items-center rounded-2xl border border-white/10 p-4 mb-4"
      style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
    >
      {/* Avatar */}
      {avatarUri ? (
        <Image
          source={{ uri: avatarUri }}
          style={{ width: 60, height: 60, borderRadius: 30 }}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <View
          className="items-center justify-center rounded-full"
          style={{
            width: 60,
            height: 60,
            backgroundColor: "rgba(124,58,237,0.3)",
          }}
        >
          <Text className="text-violet-300 font-bold text-xl">{initials}</Text>
        </View>
      )}

      {/* Name & Email */}
      <View className="ml-4 flex-1">
        <Text className="text-white font-bold text-lg">
          {user?.name ?? "Guest"}
        </Text>
        <Text className="text-slate-400 text-sm mt-0.5">
          {user?.email ?? ""}
        </Text>
      </View>
    </View>
  );
}
