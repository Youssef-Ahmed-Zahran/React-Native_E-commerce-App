import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegisterUser } from "../../slice/authSlice";
import {
  registerSchema,
  type RegisterFormData,
} from "../../../../validation/registerSchema";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: register, isPending } = useRegisterUser();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const password = watch("password");

  const onSubmit = (data: RegisterFormData) => {
    register(
      { name: data.name.trim(), email: data.email.trim().toLowerCase(), password: data.password },
      {
        onSuccess: () => {
          router.replace("/");
        },
        onError: (error: Error) => {
          Alert.alert("Registration Failed", error.message);
        },
      }
    );
  };

  const Field = ({
    label,
    icon,
    name,
    error,
    placeholder,
    keyboardType = "default",
    secureTextEntry = false,
    autoCapitalize = "sentences",
    rightElement,
  }: {
    label: string;
    icon: string;
    name: keyof RegisterFormData;
    error?: string;
    placeholder: string;
    keyboardType?: "default" | "email-address";
    secureTextEntry?: boolean;
    autoCapitalize?: "none" | "sentences";
    rightElement?: React.ReactNode;
  }) => (
    <View className="mb-4">
      <Text className="text-sm font-semibold text-slate-300 mb-2 tracking-wide uppercase">
        {label}
      </Text>
      <View
        className={`flex-row items-center rounded-2xl px-4 border ${
          error ? "border-red-500 bg-red-500/10" : "border-white/10 bg-white/8"
        }`}
        style={{ height: 56 }}
      >
        <Text className="text-slate-400 mr-3 text-lg">{icon}</Text>
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="flex-1 text-white text-base"
              placeholder={placeholder}
              placeholderTextColor="#64748b"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType={keyboardType}
              secureTextEntry={secureTextEntry}
              autoCapitalize={autoCapitalize}
              autoCorrect={false}
            />
          )}
        />
        {rightElement}
      </View>
      {error && <Text className="text-red-400 text-xs mt-1 ml-1">{error}</Text>}
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="px-6 pt-4 pb-6">
        <Field
          label="Full Name"
          icon="👤"
          name="name"
          error={errors.name?.message}
          placeholder="John Doe"
        />

        <Field
          label="Email"
          icon="✉️"
          name="email"
          error={errors.email?.message}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Field
          label="Password"
          icon="🔒"
          name="password"
          error={errors.password?.message}
          placeholder="••••••••"
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          rightElement={
            <TouchableOpacity
              onPress={() => setShowPassword((v) => !v)}
              className="p-1"
            >
              <Text className="text-slate-400 text-sm">
                {showPassword ? "Hide" : "Show"}
              </Text>
            </TouchableOpacity>
          }
        />

        <Field
          label="Confirm Password"
          icon="🔐"
          name="confirmPassword"
          error={errors.confirmPassword?.message}
          placeholder="••••••••"
          secureTextEntry={!showPassword}
          autoCapitalize="none"
        />

        {/* ── Password strength indicator ── */}
        {password.length > 0 && (
          <View className="mb-6 -mt-2">
            <View className="flex-row gap-1 mb-1">
              {[1, 2, 3, 4].map((n) => (
                <View
                  key={n}
                  className="flex-1 rounded-full h-1"
                  style={{
                    backgroundColor:
                      password.length >= n * 3
                        ? n <= 1
                          ? "#ef4444"
                          : n <= 2
                            ? "#f97316"
                            : n <= 3
                              ? "#eab308"
                              : "#22c55e"
                        : "#334155",
                  }}
                />
              ))}
            </View>
            <Text className="text-xs text-slate-500">
              {password.length < 4
                ? "Very weak"
                : password.length < 7
                  ? "Weak"
                  : password.length < 10
                    ? "Good"
                    : "Strong"}{" "}
              password
            </Text>
          </View>
        )}

        {/* ── Submit Button ── */}
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={isPending}
          className="rounded-2xl overflow-hidden"
          style={{ height: 58 }}
          activeOpacity={0.85}
        >
          <View
            className="flex-1 items-center justify-center"
            style={{
              backgroundColor: isPending ? "#4c1d95" : "#7c3aed",
            }}
          >
            {isPending ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text className="text-white font-bold text-lg tracking-wide">
                Create Account →
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
