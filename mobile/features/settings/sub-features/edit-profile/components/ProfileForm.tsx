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
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useUpdateProfile } from "../../edit-profile/slice/userSlice";
import { useCurrentUser } from "../../../../auth/slice/authSlice";
import {
  profileSchema,
  type ProfileFormData,
} from "../../../../../validation/profileSchema";

interface ProfileFormProps {
  onSuccess?: () => void;
}

const FIELDS = [
  {
    name: "name" as const,
    label: "Full Name",
    icon: "person-outline" as const,
    placeholder: "Your name",
    keyboardType: "default" as const,
    autoCapitalize: "words" as const,
  },
  {
    name: "email" as const,
    label: "Email Address",
    icon: "mail-outline" as const,
    placeholder: "you@example.com",
    keyboardType: "email-address" as const,
    autoCapitalize: "none" as const,
  },
  {
    name: "imageUrl" as const,
    label: "Avatar URL",
    icon: "image-outline" as const,
    placeholder: "https://example.com/avatar.jpg",
    keyboardType: "url" as const,
    autoCapitalize: "none" as const,
  },
];

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
    if (!user?._id) return;
    updateProfile(
      {
        userId: user._id,
        data: {
          name: data.name.trim(),
          email: data.email.trim(),
          imageUrl: data.imageUrl?.trim() || "",
        },
      },
      {
        onSuccess: () => {
          Alert.alert("Success", "Profile updated successfully.");
          onSuccess?.();
        },
        onError: (error) => {
          Alert.alert("Error", error.message);
        },
      },
    );
  };

  return (
    <ScrollView
      className="flex-1 px-5"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {FIELDS.map((field) => {
        const error = errors[field.name];
        return (
          <View key={field.name} className="mb-5">
            {/* Label */}
            <View className="flex-row items-center gap-1.5 mb-2">
              <Ionicons name={field.icon} size={14} color="#7c3aed" />
              <Text className="text-slate-400 text-sm font-semibold tracking-wide uppercase">
                {field.label}
              </Text>
            </View>

            {/* Input */}
            <Controller
              control={control}
              name={field.name}
              render={({ field: { onChange, onBlur, value } }) => (
                <View
                  className="rounded-2xl border flex-row items-center px-4"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.04)",
                    borderColor: error ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.08)",
                  }}
                >
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder={field.placeholder}
                    placeholderTextColor="#475569"
                    keyboardType={field.keyboardType}
                    autoCapitalize={field.autoCapitalize}
                    className="flex-1 text-white text-base py-4"
                  />
                </View>
              )}
            />

            {/* Error */}
            {error && (
              <View className="flex-row items-center gap-1 mt-1.5 ml-1">
                <Ionicons name="alert-circle-outline" size={12} color="#f87171" />
                <Text className="text-red-400 text-xs">{error.message}</Text>
              </View>
            )}
          </View>
        );
      })}

      {/* Save Button */}
      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        disabled={isPending}
        activeOpacity={0.8}
        className="rounded-2xl overflow-hidden mt-2"
      >
        <LinearGradient
          colors={["#8b5cf6", "#6d28d9"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ height: 56, flexDirection: "row", alignItems: "center", justifyContent: "center" }}
        >
          {isPending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="checkmark-circle-outline" size={20} color="white" />
              <Text style={{ color: "white", fontWeight: "700", fontSize: 16, marginLeft: 8 }}>Save Changes</Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
}
