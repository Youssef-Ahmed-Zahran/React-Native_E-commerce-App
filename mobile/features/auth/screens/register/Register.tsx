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
import RegisterForm from "../../components/register-form/RegisterForm";

export default function Register() {
  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <StatusBar barStyle="light-content" backgroundColor="#020617" />

      {/* ── Decorative background blobs ── */}
      <View
        className="absolute -top-16 -left-16 w-64 h-64 rounded-full opacity-25"
        style={{ backgroundColor: "#7c3aed" }}
      />
      <View
        className="absolute top-60 -right-10 w-48 h-48 rounded-full opacity-20"
        style={{ backgroundColor: "#4f46e5" }}
      />
      <View
        className="absolute bottom-20 left-8 w-36 h-36 rounded-full opacity-15"
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
          <View className="pt-10 pb-8">
            {/* Back button */}
            <TouchableOpacity
              onPress={() => router.back()}
              className="flex-row items-center mb-6 self-start"
            >
              <Text className="text-violet-400 text-base mr-1">←</Text>
              <Text className="text-violet-400 text-sm font-medium">
                Back to sign in
              </Text>
            </TouchableOpacity>

            {/* Logo badge */}
            <View
              className="w-16 h-16 rounded-2xl items-center justify-center mb-5"
              style={{ backgroundColor: "#7c3aed" }}
            >
              <Text className="text-white text-3xl">🛒</Text>
            </View>

            <Text className="text-4xl font-bold text-white mb-2 tracking-tight">
              Create account
            </Text>
            <Text className="text-slate-400 text-base leading-relaxed">
              Join thousands of shoppers. Setup takes less than a minute.
            </Text>

            {/* ── Feature pills ── */}
            <View className="flex-row mt-4 gap-2 flex-wrap">
              {["Free shipping", "Easy returns", "24/7 support"].map((feat) => (
                <View
                  key={feat}
                  className="rounded-full px-3 py-1 border border-violet-500/30"
                  style={{ backgroundColor: "rgba(124,58,237,0.15)" }}
                >
                  <Text className="text-violet-300 text-xs font-medium">
                    ✓ {feat}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* ── Glassmorphism card ── */}
          <View
            className="rounded-3xl border border-white/10 overflow-hidden"
            style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
          >
            <RegisterForm />
          </View>

          {/* ── Footer ── */}
          <View className="flex-row justify-center items-center mt-6">
            <Text className="text-slate-400 text-sm">
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
              <Text className="text-violet-400 font-semibold text-sm">
                Sign in
              </Text>
            </TouchableOpacity>
          </View>

          {/* ── Terms ── */}
          <Text className="text-center text-slate-600 text-xs mt-4 mb-8 px-4 leading-5">
            By creating an account you agree to our{" "}
            <Text className="text-slate-400">Terms of Service</Text> and{" "}
            <Text className="text-slate-400">Privacy Policy</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
