import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useCurrentUser } from "../../../../auth/slice/authSlice";
import { useDeleteAddress } from "../../edit-profile/slice/userSlice";
import AddAddress from "../components/AddAddress";
import type { Address } from "../../../../../types/user.types";

const PAGE_SIZE = 5;

interface AddressesProps {
  onBack: () => void;
}

export default function Addresses({ onBack }: AddressesProps) {
  const { data: user, isLoading } = useCurrentUser();
  const { mutate: deleteAddress, isPending: isDeleting } = useDeleteAddress();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const addresses = user?.addresses ?? [];
  const visibleAddresses = addresses.slice(0, visibleCount);
  const hasMore = visibleCount < addresses.length;

  const handleDelete = (addressId: string) => {
    if (Platform.OS === "web") {
      if (window.confirm("Delete Address?\nAre you sure?")) {
        deleteAddress(addressId);
      }
    } else {
      Alert.alert("Delete Address", "Are you sure?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteAddress(addressId),
        },
      ]);
    }
  };

  const handleEndReached = useCallback(() => {
    if (hasMore) {
      setVisibleCount((c) => Math.min(c + PAGE_SIZE, addresses.length));
    }
  }, [hasMore, addresses.length]);

  const ListFooter = useCallback(
    () => (
      <View className="py-6 items-center">
        {hasMore ? (
          <ActivityIndicator size="small" color="#7c3aed" />
        ) : addresses.length > PAGE_SIZE ? (
          <View className="flex-row items-center gap-2">
            <Ionicons name="checkmark-circle" size={14} color="#475569" />
            <Text className="text-slate-600 text-sm">All addresses loaded</Text>
          </View>
        ) : null}
      </View>
    ),
    [hasMore, addresses.length],
  );

  // ── Add/Edit form view ──
  if (showAddForm || editingAddress) {
    return (
      <SafeAreaView className="flex-1 bg-slate-950">
        <View className="flex-row items-center px-5 pt-5 pb-4 gap-3">
          <TouchableOpacity
            onPress={() => {
              setShowAddForm(false);
              setEditingAddress(null);
            }}
            activeOpacity={0.7}
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
          >
            <Ionicons name="chevron-back" size={22} color="#a78bfa" />
          </TouchableOpacity>
          <View>
            <Text className="text-white font-extrabold text-2xl tracking-tight">
              {editingAddress ? "Edit Address" : "Add Address"}
            </Text>
            <Text className="text-slate-500 text-xs mt-0.5">
              {editingAddress ? "Update your delivery address" : "Add a new delivery address"}
            </Text>
          </View>
        </View>
        <AddAddress
          initialData={editingAddress}
          onSuccess={() => {
            setShowAddForm(false);
            setEditingAddress(null);
          }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      {/* Decorative blob */}
      <View
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-[0.05]"
        style={{ backgroundColor: "#34d399" }}
      />

      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-5 pb-4">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            onPress={onBack}
            activeOpacity={0.7}
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
          >
            <Ionicons name="chevron-back" size={22} color="#a78bfa" />
          </TouchableOpacity>
          <View>
            <Text className="text-white font-extrabold text-2xl tracking-tight">
              My Addresses
            </Text>
            <Text className="text-slate-500 text-xs mt-0.5">
              {addresses.length > 0 ? `${addresses.length} saved address${addresses.length !== 1 ? "es" : ""}` : "Manage your delivery locations"}
            </Text>
          </View>
        </View>

        {/* Add Button */}
        <TouchableOpacity
          onPress={() => setShowAddForm(true)}
          activeOpacity={0.7}
          className="flex-row items-center gap-1.5 rounded-2xl px-3 py-2"
          style={{ backgroundColor: "rgba(124,58,237,0.15)" }}
        >
          <Ionicons name="add" size={18} color="#a78bfa" />
          <Text className="text-violet-400 font-bold text-sm">Add</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#7c3aed" />
        </View>
      ) : (
        <FlatList
          data={visibleAddresses}
          keyExtractor={(item: Address) => item._id ?? item.street}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.4}
          ListFooterComponent={ListFooter}
          renderItem={({ item }: { item: Address }) => (
            <View
              className="rounded-3xl border border-white/[0.07] p-4 mb-3 mx-4"
              style={{ backgroundColor: "rgba(255,255,255,0.03)" }}
            >
              <View className="flex-row justify-between items-start">
                {/* Icon + Address text */}
                <View className="flex-row items-start gap-3 flex-1 mr-3">
                  <View
                    className="w-9 h-9 rounded-xl items-center justify-center mt-0.5"
                    style={{ backgroundColor: "rgba(52,211,153,0.1)" }}
                  >
                    <Ionicons name="location-outline" size={18} color="#34d399" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-bold text-base leading-snug">
                      {item.street}
                    </Text>
                    <Text className="text-slate-400 text-sm mt-0.5">
                      {item.city}, {item.state} {item.postalCode}
                    </Text>
                    <Text className="text-slate-500 text-sm">{item.country}</Text>
                    {item.isDefault && (
                      <View className="flex-row items-center gap-1 mt-1.5">
                        <View className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <Text className="text-emerald-400 text-xs font-bold uppercase tracking-widest">
                          Default
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Actions */}
                <View className="flex-col items-end gap-2">
                  <TouchableOpacity
                    onPress={() => setEditingAddress(item)}
                    disabled={isDeleting}
                    activeOpacity={0.7}
                    className="w-8 h-8 rounded-full items-center justify-center"
                    style={{ backgroundColor: "rgba(96,165,250,0.12)" }}
                  >
                    <Ionicons name="pencil-outline" size={15} color="#60a5fa" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => item._id && handleDelete(item._id)}
                    disabled={isDeleting}
                    activeOpacity={0.7}
                    className="w-8 h-8 rounded-full items-center justify-center"
                    style={{ backgroundColor: "rgba(239,68,68,0.12)" }}
                  >
                    <Ionicons name="trash-outline" size={15} color="#f87171" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          contentContainerStyle={{ paddingTop: 8 }}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center mt-24 gap-4">
              <View
                className="w-20 h-20 rounded-3xl items-center justify-center"
                style={{ backgroundColor: "rgba(52,211,153,0.1)" }}
              >
                <Ionicons name="location-outline" size={36} color="#065f46" />
              </View>
              <Text className="text-white font-bold text-lg">
                No addresses saved
              </Text>
              <Text className="text-slate-500 text-sm text-center px-8">
                Add a delivery address to make checkout faster and easier.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
