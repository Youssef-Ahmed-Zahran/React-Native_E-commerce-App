import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileForm from "../components/ProfileForm";

interface EditProfileProps {
  onBack: () => void;
}

export default function EditProfile({ onBack }: EditProfileProps) {
  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#0f0f0f" }}>
      {/* Header */}
      <View className="flex-row items-center px-4 pt-4 pb-2">
        <TouchableOpacity onPress={onBack} activeOpacity={0.7}>
          <Text className="text-violet-400 text-base">← Back</Text>
        </TouchableOpacity>
        <Text className="text-white font-bold text-lg ml-4">Edit Profile</Text>
      </View>

      {/* Form */}
      <ProfileForm onSuccess={onBack} />
    </SafeAreaView>
  );
}
