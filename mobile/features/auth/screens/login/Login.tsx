import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import LoginForm from "../../components/login-form/LoginForm";

export default function Login() {
  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <StatusBar barStyle="light-content" backgroundColor="#020617" />

      {/* ── Decorative background blobs ── */}
      <View
        className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-30"
        style={{ backgroundColor: "#7c3aed" }}
      />
      <View
        className="absolute top-40 -left-16 w-52 h-52 rounded-full opacity-20"
        style={{ backgroundColor: "#4f46e5" }}
      />
      <View
        className="absolute bottom-24 right-10 w-40 h-40 rounded-full opacity-15"
        style={{ backgroundColor: "#a855f7" }}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-6">
          {/* ── Hero Header ── */}
          <View className="pt-12 pb-10">
            {/* Logo badge */}
            <View
              className="w-16 h-16 rounded-2xl items-center justify-center mb-6"
              style={{ backgroundColor: "#7c3aed" }}
            >
              <Text className="text-white text-3xl">🛍️</Text>
            </View>

            <Text className="text-4xl font-bold text-white mb-2 tracking-tight">
              Welcome back
            </Text>
            <Text className="text-slate-400 text-base leading-relaxed">
              Sign in to continue shopping and track your orders.
            </Text>
          </View>

          {/* ── Glassmorphism card ── */}
          <View
            className="rounded-3xl border border-white/10 overflow-hidden"
            style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
          >
            <LoginForm />
          </View>

          {/* ── Divider ── */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-white/10" />
            <Text className="mx-4 text-slate-500 text-sm">
              or continue with
            </Text>
            <View className="flex-1 h-px bg-white/10" />
          </View>

          {/* ── Social Login Buttons ── */}
          <View className="flex-row gap-3">
            {["Google", "Apple"].map((provider) => (
              <TouchableOpacity
                key={provider}
                className="flex-1 flex-row items-center justify-center rounded-2xl border border-white/10 py-4"
                style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                activeOpacity={0.75}
              >
                <Text className="text-white font-semibold">
                  {provider === "Google" ? "🔵 " : "🍎 "}
                  {provider}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Footer ── */}
          <View className="flex-row justify-center items-center mt-8 mb-8">
            <Text className="text-slate-400 text-sm">
              Don't have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
              <Text className="text-violet-400 font-semibold text-sm">
                Sign up free
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
