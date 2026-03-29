import React, { useState } from "react";
import { View, ScrollView, Text, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileHeader from "../components/ProfileHeader";
import QuickActionGrid from "../components/QuickActionGrid";
import SettingsRow from "../components/SettingsRow";
import SignOutButton from "../components/SignOutButton";

// ── Sub-feature screens ──
import EditProfileScreen from "../sub-features/edit-profile/screens/EditProfile";
import OrdersScreen from "../sub-features/orders/screens/Orders";
import AddressesScreen from "../sub-features/addresses/screens/Addresses";
import WishlistScreen from "../sub-features/wishlist/screens/Wishlist";

type SubScreen = "edit-profile" | "orders" | "addresses" | "wishlist" | null;

export default function Settings() {
  const [activeScreen, setActiveScreen] = useState<SubScreen>(null);

  // ── Render sub-feature screens ──
  if (activeScreen === "edit-profile") {
    return <EditProfileScreen onBack={() => setActiveScreen(null)} />;
  }
  if (activeScreen === "orders") {
    return <OrdersScreen onBack={() => setActiveScreen(null)} />;
  }
  if (activeScreen === "addresses") {
    return <AddressesScreen onBack={() => setActiveScreen(null)} />;
  }
  if (activeScreen === "wishlist") {
    return <WishlistScreen onBack={() => setActiveScreen(null)} />;
  }

  // ── Main settings ──
  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <StatusBar barStyle="light-content" backgroundColor="#020617" />

      {/* ── Decorative Blob ── */}
      <View
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-[0.07]"
        style={{ backgroundColor: "#8b5cf6" }}
      />
      <View
        className="absolute top-24 -right-32 w-80 h-80 rounded-full opacity-[0.04]"
        style={{ backgroundColor: "#06b6d4" }}
      />

      <ScrollView
        className="flex-1 px-5 pt-4"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text className="text-white font-extrabold text-4xl mb-8 mt-2 tracking-tight">
          Settings
        </Text>

        {/* Section Header */}
        <View className="flex-row items-center mb-3 ml-1 mt-2">
          <View className="w-1.5 h-4 bg-violet-500 rounded-full mr-2" />
          <Text className="text-slate-400 font-bold text-xs tracking-[0.15em] uppercase">
            My Account
          </Text>
        </View>

        {/* Profile Card */}
        <ProfileHeader onPress={() => setActiveScreen("edit-profile")} />

        {/* Quick Actions Grid */}
        <QuickActionGrid
          onEditProfile={() => setActiveScreen("edit-profile")}
          onOrders={() => setActiveScreen("orders")}
          onAddresses={() => setActiveScreen("addresses")}
          onWishlist={() => setActiveScreen("wishlist")}
        />

        {/* Section Header */}
        <View className="flex-row items-center mb-3 ml-1 mt-6">
          <View className="w-1.5 h-4 bg-emerald-500 rounded-full mr-2" />
          <Text className="text-slate-400 font-bold text-xs tracking-[0.15em] uppercase">
            App Preferences
          </Text>
        </View>

        {/* Settings Rows */}
        <SettingsRow
          icon="notifications"
          iconColor="#3b82f6" // blue
          iconBgColor="rgba(59, 130, 246, 0.15)"
          label="Notifications"
        />
        <SettingsRow
          icon="lock-closed"
          iconColor="#f59e0b" // amber
          iconBgColor="rgba(245, 158, 11, 0.15)"
          label="Privacy"
        />
        <SettingsRow
          icon="color-palette"
          iconColor="#ec4899" // pink
          iconBgColor="rgba(236, 72, 153, 0.15)"
          label="Appearance"
        />

        {/* Sign Out */}
        <SignOutButton />

        {/* Bottom Spacer */}
        <View className="h-12" />
      </ScrollView>
    </SafeAreaView>
  );
}
