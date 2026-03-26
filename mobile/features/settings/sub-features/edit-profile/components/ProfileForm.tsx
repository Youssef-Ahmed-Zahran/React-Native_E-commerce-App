import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateProfile } from "../../edit-profile/slice/userSlice";
import { useCurrentUser } from "../../../../auth/slice/authSlice";
import {
  profileSchema,
  type ProfileFormData,
} from "../../../../../validation/profileSchema";

interface ProfileFormProps {
  onSuccess?: () => void;
}

export default function ProfileForm({ onSuccess }: ProfileFormProps) {
  const { data: user } = useCurrentUser();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      imageUrl: user?.imageUrl ?? "",
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    updateProfile(
      {
        name: data.name.trim(),
        email: data.email.trim(),
        imageUrl: data.imageUrl?.trim() || "",
      },
      {
        onSuccess: () => {
          Alert.alert("Success", "Profile updated successfully.");
          onSuccess?.();
        },
        onError: (error) => {
          Alert.alert("Error", error.message);
        },
      }
    );
  };

  return (
    <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
      {/* Name */}
      <Text className="text-slate-400 text-sm mb-1 mt-4">Name</Text>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder="Your name"
            placeholderTextColor="#64748b"
            className="rounded-xl border border-white/10 px-4 py-3 text-white text-base mb-1"
            style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
          />
        )}
      />
      {errors.name && (
        <Text className="text-red-400 text-xs mb-3 ml-1">
          {errors.name.message}
        </Text>
      )}
      {!errors.name && <View className="mb-3" />}

      {/* Email */}
      <Text className="text-slate-400 text-sm mb-1">Email</Text>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder="you@example.com"
            placeholderTextColor="#64748b"
            keyboardType="email-address"
            autoCapitalize="none"
            className="rounded-xl border border-white/10 px-4 py-3 text-white text-base mb-1"
            style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
          />
        )}
      />
      {errors.email && (
        <Text className="text-red-400 text-xs mb-3 ml-1">
          {errors.email.message}
        </Text>
      )}
      {!errors.email && <View className="mb-3" />}

      {/* Avatar URL */}
      <Text className="text-slate-400 text-sm mb-1">Avatar URL</Text>
      <Controller
        control={control}
        name="imageUrl"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder="https://example.com/avatar.jpg"
            placeholderTextColor="#64748b"
            autoCapitalize="none"
            className="rounded-xl border border-white/10 px-4 py-3 text-white text-base mb-1"
            style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
          />
        )}
      />
      {errors.imageUrl && (
        <Text className="text-red-400 text-xs mb-5 ml-1">
          {errors.imageUrl.message}
        </Text>
      )}
      {!errors.imageUrl && <View className="mb-5" />}

      {/* Save Button */}
      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        disabled={isPending}
        activeOpacity={0.7}
        className="rounded-xl py-4 items-center"
        style={{ backgroundColor: "rgba(124,58,237,0.8)" }}
      >
        {isPending ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text className="text-white font-bold text-base">Save Changes</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
