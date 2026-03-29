import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import ProfileForm from "../components/ProfileForm";

interface EditProfileProps {
  onBack: () => void;
}

export default function EditProfile({ onBack }: EditProfileProps) {
  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      {/* Decorative blob */}
      <View
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-[0.06]"
        style={{ backgroundColor: "#8b5cf6" }}
      />

      {/* Header */}
      <View className="flex-row items-center px-5 pt-5 pb-4">
        <TouchableOpacity
          onPress={onBack}
          activeOpacity={0.7}
          className="w-10 h-10 rounded-full items-center justify-center mr-3"
          style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
        >
          <Ionicons name="chevron-back" size={22} color="#a78bfa" />
        </TouchableOpacity>
        <View>
          <Text className="text-white font-extrabold text-2xl tracking-tight">
            Edit Profile
          </Text>
          <Text className="text-slate-500 text-xs mt-0.5">
            Update your personal information
          </Text>
        </View>
      </View>

      {/* Form */}
      <ProfileForm onSuccess={onBack} />
    </SafeAreaView>
  );
}
