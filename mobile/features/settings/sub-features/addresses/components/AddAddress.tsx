import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  useAddAddress,
  useUpdateAddress,
} from "../../edit-profile/slice/userSlice";
import {
  addressSchema,
  type AddressFormData,
} from "../../../../../validation/addressSchema";
import type { Address } from "../../../../../types/user.types";

interface AddAddressProps {
  onSuccess?: () => void;
  initialData?: Address | null;
}

const FIELDS = [
  {
    name: "street" as const,
    label: "Street Address",
    icon: "home-outline" as const,
    placeholder: "123 Main St",
    keyboardType: "default" as const,
    required: true,
  },
  {
    name: "city" as const,
    label: "City",
    icon: "business-outline" as const,
    placeholder: "New York",
    keyboardType: "default" as const,
    required: true,
  },
  {
    name: "state" as const,
    label: "State / Province",
    icon: "map-outline" as const,
    placeholder: "NY",
    keyboardType: "default" as const,
    required: false,
  },
  {
    name: "postalCode" as const,
    label: "Postal Code",
    icon: "mail-outline" as const,
    placeholder: "10001",
    keyboardType: "number-pad" as const,
    required: true,
  },
  {
    name: "country" as const,
    label: "Country",
    icon: "globe-outline" as const,
    placeholder: "United States",
    keyboardType: "default" as const,
    required: true,
  },
];

export default function AddAddress({
  onSuccess,
  initialData,
}: AddAddressProps) {
  const { mutate: addAddress, isPending: isAdding } = useAddAddress();
  const { mutate: updateAddress, isPending: isUpdating } = useUpdateAddress();
  const isPending = isAdding || isUpdating;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street: initialData?.street || "",
      city: initialData?.city || "",
      state: initialData?.state || "",
      postalCode: initialData?.postalCode || "",
      country: initialData?.country || "",
      isDefault: initialData?.isDefault || false,
    },
  });

  const onSubmit = (data: AddressFormData) => {
    const payload = {
      street: data.street.trim(),
      city: data.city.trim(),
      state: data.state?.trim() || "",
      postalCode: data.postalCode.trim(),
      country: data.country.trim(),
      isDefault: data.isDefault,
    };

    if (initialData?._id) {
      updateAddress(
        { addressId: initialData._id, data: payload },
        {
          onSuccess: () => {
            Alert.alert("Success", "Address updated successfully.");
            onSuccess?.();
          },
          onError: (error: Error) => {
            Alert.alert("Error", error.message);
          },
        },
      );
    } else {
      addAddress(payload, {
        onSuccess: () => {
          Alert.alert("Success", "Address added successfully.");
          onSuccess?.();
        },
        onError: (error: Error) => {
          Alert.alert("Error", error.message);
        },
      });
    }
  };

  return (
    <ScrollView
      className="flex-1 px-5"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {FIELDS.map((field) => {
        const error = errors[field.name as keyof typeof errors];
        return (
          <View key={field.name} className="mb-5">
            {/* Label */}
            <View className="flex-row items-center gap-1.5 mb-2">
              <Ionicons name={field.icon} size={14} color="#7c3aed" />
              <Text className="text-slate-400 text-sm font-semibold tracking-wide uppercase">
                {field.label}
                {field.required && (
                  <Text className="text-violet-500"> *</Text>
                )}
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
                    borderColor: error
                      ? "rgba(239,68,68,0.5)"
                      : "rgba(255,255,255,0.08)",
                  }}
                >
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder={field.placeholder}
                    placeholderTextColor="#475569"
                    keyboardType={field.keyboardType}
                    className="flex-1 text-white text-base py-4"
                  />
                </View>
              )}
            />

            {/* Error */}
            {error && (
              <View className="flex-row items-center gap-1 mt-1.5 ml-1">
                <Ionicons name="alert-circle-outline" size={12} color="#f87171" />
                <Text className="text-red-400 text-xs">
                  {(error as { message?: string }).message}
                </Text>
              </View>
            )}
          </View>
        );
      })}

      {/* Default Toggle */}
      <Controller
        control={control}
        name="isDefault"
        render={({ field: { onChange, value } }) => (
          <View
            className="flex-row items-center justify-between rounded-2xl px-4 py-3.5 mb-6"
            style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
          >
            <View className="flex-row items-center gap-3">
              <View
                className="w-9 h-9 rounded-xl items-center justify-center"
                style={{ backgroundColor: "rgba(124,58,237,0.15)" }}
              >
                <Ionicons name="star-outline" size={18} color="#a78bfa" />
              </View>
              <View>
                <Text className="text-white font-semibold text-base">
                  Default address
                </Text>
                <Text className="text-slate-500 text-xs mt-0.5">
                  Use for checkout by default
                </Text>
              </View>
            </View>
            <Switch
              value={value}
              onValueChange={onChange}
              trackColor={{ false: "#1e293b", true: "rgba(124,58,237,0.6)" }}
              thumbColor={value ? "#7c3aed" : "#475569"}
            />
          </View>
        )}
      />

      {/* Submit Button */}
      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        disabled={isPending}
        activeOpacity={0.8}
        className="rounded-2xl overflow-hidden"
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
              <Ionicons
                name={
                  initialData ? "checkmark-circle-outline" : "add-circle-outline"
                }
                size={20}
                color="white"
              />
              <Text style={{ color: "white", fontWeight: "700", fontSize: 16, marginLeft: 8 }}>
                {initialData ? "Update Address" : "Add Address"}
              </Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
}
