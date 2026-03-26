import React from "react";
import { View } from "react-native";
import ActionCard from "./ActionCard";

interface QuickActionGridProps {
  onEditProfile: () => void;
  onOrders: () => void;
  onAddresses: () => void;
  onWishlist: () => void;
}

export default function QuickActionGrid({
  onEditProfile,
  onOrders,
  onAddresses,
  onWishlist,
}: QuickActionGridProps) {
  return (
    <View className="mb-4">
      {/* Row 1 */}
      <View className="flex-row">
        <ActionCard icon="👤" label="Edit Profile" onPress={onEditProfile} />
        <ActionCard icon="📦" label="Orders" onPress={onOrders} />
      </View>

      {/* Row 2 */}
      <View className="flex-row">
        <ActionCard icon="📍" label="Addresses" onPress={onAddresses} />
        <ActionCard icon="❤️" label="Wishlist" onPress={onWishlist} />
      </View>
    </View>
  );
}
