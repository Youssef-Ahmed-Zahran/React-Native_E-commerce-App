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
import { useLoginUser } from "../../slice/authSlice";
import {
  loginSchema,
  type LoginFormData,
} from "../../../../validation/loginSchema";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending } = useLoginUser();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: LoginFormData) => {
    login(
      { email: data.email.trim().toLowerCase(), password: data.password },
      {
        onSuccess: () => {
          router.replace("/");
        },
        onError: (error: Error) => {
          Alert.alert("Login Failed", error.message);
        },
      }
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="px-6 pt-4 pb-6">
        {/* ── Email ── */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-slate-300 mb-2 tracking-wide uppercase">
            Email
          </Text>
          <View
            className={`flex-row items-center rounded-2xl px-4 border ${
              errors.email
                ? "border-red-500 bg-red-500/10"
                : "border-white/10 bg-white/8"
            }`}
            style={{ height: 56 }}
          >
            <Text className="text-slate-400 mr-3 text-lg">✉️</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="flex-1 text-white text-base"
                  placeholder="you@example.com"
                  placeholderTextColor="#64748b"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              )}
            />
          </View>
          {errors.email && (
            <Text className="text-red-400 text-xs mt-1 ml-1">
              {errors.email.message}
            </Text>
          )}
        </View>

        {/* ── Password ── */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-slate-300 mb-2 tracking-wide uppercase">
            Password
          </Text>
          <View
            className={`flex-row items-center rounded-2xl px-4 border ${
              errors.password
                ? "border-red-500 bg-red-500/10"
                : "border-white/10 bg-white/8"
            }`}
            style={{ height: 56 }}
          >
            <Text className="text-slate-400 mr-3 text-lg">🔒</Text>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="flex-1 text-white text-base"
                  placeholder="••••••••"
                  placeholderTextColor="#64748b"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
              )}
            />
            <TouchableOpacity
              onPress={() => setShowPassword((v) => !v)}
              className="p-1"
            >
              <Text className="text-slate-400 text-sm">
                {showPassword ? "Hide" : "Show"}
              </Text>
            </TouchableOpacity>
          </View>
          {errors.password && (
            <Text className="text-red-400 text-xs mt-1 ml-1">
              {errors.password.message}
            </Text>
          )}
        </View>

        {/* ── Forgot Password ── */}
        <TouchableOpacity className="self-end -mt-3 mb-8">
          <Text className="text-violet-400 text-sm font-medium">
            Forgot password?
          </Text>
        </TouchableOpacity>

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
                Sign In →
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
