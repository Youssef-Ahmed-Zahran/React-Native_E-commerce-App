import React from "react";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useLogoutUser } from "../../auth/slice/authSlice";

export default function SignOutButton() {
  const router = useRouter();
  const { mutate: logout, isPending } = useLogoutUser();

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => {
          logout(undefined, {
            onSuccess: () => {
              router.replace("/(auth)/login");
            },
          });
        },
      },
    ]);
  };

  return (
    <TouchableOpacity
      onPress={handleSignOut}
      disabled={isPending}
      activeOpacity={0.7}
      className="rounded-2xl border border-red-500/20 py-4 mt-8 flex-row items-center justify-center gap-2"
      style={{ backgroundColor: "rgba(153,27,27,0.15)" }} // Dark red hue
    >
      {isPending ? (
        <ActivityIndicator size="small" color="#f87171" />
      ) : (
        <>
          <Ionicons name="log-out-outline" size={20} color="#f87171" />
          <Text className="text-red-400 font-bold text-base tracking-wide">
            Sign Out
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}
