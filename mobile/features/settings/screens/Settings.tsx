import React, { useState } from "react";
import { View, ScrollView, Text } from "react-native";
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
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#0f0f0f" }}>
      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text className="text-white font-bold text-2xl mb-4">Settings</Text>

        {/* Profile Card */}
        <ProfileHeader />

        {/* Quick Actions Grid */}
        <QuickActionGrid
          onEditProfile={() => setActiveScreen("edit-profile")}
          onOrders={() => setActiveScreen("orders")}
          onAddresses={() => setActiveScreen("addresses")}
          onWishlist={() => setActiveScreen("wishlist")}
        />

        {/* Settings Rows */}
        <SettingsRow icon="🔔" label="Notifications" />
        <SettingsRow icon="🔒" label="Privacy" />

        {/* Sign Out */}
        <SignOutButton />

        {/* Bottom Spacer */}
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
