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
    <View className="mb-6 flex-col gap-3 pt-1">
      {/* Row 1 */}
      <View className="flex-row gap-3">
        <ActionCard
          icon="person"
          iconColor="#60a5fa"
          accentColor="rgba(96,165,250,0.15)"
          label="Edit Profile"
          onPress={onEditProfile}
        />
        <ActionCard
          icon="cube"
          iconColor="#c084fc"
          accentColor="rgba(192,132,252,0.15)"
          label="Orders"
          onPress={onOrders}
        />
      </View>

      {/* Row 2 */}
      <View className="flex-row gap-3">
        <ActionCard
          icon="location"
          iconColor="#34d399"
          accentColor="rgba(52,211,153,0.15)"
          label="Addresses"
          onPress={onAddresses}
        />
        <ActionCard
          icon="heart"
          iconColor="#f87171"
          accentColor="rgba(248,113,113,0.15)"
          label="Wishlist"
          onPress={onWishlist}
        />
      </View>
    </View>
  );
}
