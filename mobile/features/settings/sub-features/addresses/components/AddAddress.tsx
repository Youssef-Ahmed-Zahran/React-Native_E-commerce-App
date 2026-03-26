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
          onError: (error) => {
            Alert.alert("Error", error.message);
          },
        }
      );
    } else {
      addAddress(payload, {
        onSuccess: () => {
          Alert.alert("Success", "Address added successfully.");
          onSuccess?.();
        },
        onError: (error) => {
          Alert.alert("Error", error.message);
        },
      });
    }
  };

  const inputStyle =
    "rounded-xl border border-white/10 px-4 py-3 text-white text-base mb-1";

  return (
    <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
      <Text className="text-slate-400 text-sm mb-1 mt-4">Street *</Text>
      <Controller
        control={control}
        name="street"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder="123 Main St"
            placeholderTextColor="#64748b"
            className={inputStyle}
            style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
          />
        )}
      />
      {errors.street && (
        <Text className="text-red-400 text-xs mb-3 ml-1">
          {errors.street.message}
        </Text>
      )}
      {!errors.street && <View className="mb-3" />}

      <Text className="text-slate-400 text-sm mb-1">City *</Text>
      <Controller
        control={control}
        name="city"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder="New York"
            placeholderTextColor="#64748b"
            className={inputStyle}
            style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
          />
        )}
      />
      {errors.city && (
        <Text className="text-red-400 text-xs mb-3 ml-1">
          {errors.city.message}
        </Text>
      )}
      {!errors.city && <View className="mb-3" />}

      <Text className="text-slate-400 text-sm mb-1">State</Text>
      <Controller
        control={control}
        name="state"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder="NY"
            placeholderTextColor="#64748b"
            className={inputStyle}
            style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
          />
        )}
      />
      <View className="mb-3" />

      <Text className="text-slate-400 text-sm mb-1">Postal Code *</Text>
      <Controller
        control={control}
        name="postalCode"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder="10001"
            placeholderTextColor="#64748b"
            keyboardType="number-pad"
            className={inputStyle}
            style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
          />
        )}
      />
      {errors.postalCode && (
        <Text className="text-red-400 text-xs mb-3 ml-1">
          {errors.postalCode.message}
        </Text>
      )}
      {!errors.postalCode && <View className="mb-3" />}

      <Text className="text-slate-400 text-sm mb-1">Country *</Text>
      <Controller
        control={control}
        name="country"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder="United States"
            placeholderTextColor="#64748b"
            className={inputStyle}
            style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
          />
        )}
      />
      {errors.country && (
        <Text className="text-red-400 text-xs mb-3 ml-1">
          {errors.country.message}
        </Text>
      )}
      {!errors.country && <View className="mb-3" />}

      {/* Default Toggle */}
      <Controller
        control={control}
        name="isDefault"
        render={({ field: { onChange, value } }) => (
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-white text-base">Set as default address</Text>
            <Switch
              value={value}
              onValueChange={onChange}
              trackColor={{ false: "#334155", true: "rgba(124,58,237,0.5)" }}
              thumbColor={value ? "#7c3aed" : "#94a3b8"}
            />
          </View>
        )}
      />

      {/* Submit Button */}
      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        disabled={isPending}
        activeOpacity={0.7}
        className="rounded-xl py-4 items-center mb-8"
        style={{ backgroundColor: "rgba(124,58,237,0.8)" }}
      >
        {isPending ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text className="text-white font-bold text-base">
            {initialData ? "Update Address" : "Add Address"}
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
