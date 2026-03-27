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
          <Text className="text-slate-600 text-sm">
            All addresses loaded ✓
          </Text>
        ) : null}
      </View>
    ),
    [hasMore, addresses.length],
  );

  if (showAddForm || editingAddress) {
    return (
      <SafeAreaView className="flex-1 bg-slate-950">
        <View className="flex-row items-center px-4 pt-4 pb-2">
          <TouchableOpacity
            onPress={() => {
              setShowAddForm(false);
              setEditingAddress(null);
            }}
            activeOpacity={0.7}
          >
            <Text className="text-violet-400 text-base">← Back</Text>
          </TouchableOpacity>
          <Text className="text-white font-bold text-lg ml-4">
            {editingAddress ? "Edit Address" : "Add Address"}
          </Text>
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
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-4 pb-2">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={onBack} activeOpacity={0.7}>
            <Text className="text-violet-400 text-base">← Back</Text>
          </TouchableOpacity>
          <Text className="text-white font-bold text-lg ml-4">
            My Addresses
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowAddForm(true)}
          activeOpacity={0.7}
        >
          <Text className="text-violet-400 font-semibold text-sm">+ Add</Text>
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
              className="rounded-2xl border border-white/10 p-4 mb-3 mx-4"
              style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
            >
              <View className="flex-row justify-between items-start">
                <View className="flex-1 mr-2">
                  <Text className="text-white font-semibold text-base">
                    {item.street}
                  </Text>
                  <Text className="text-slate-400 text-sm mt-1">
                    {item.city}, {item.state} {item.postalCode}
                  </Text>
                  <Text className="text-slate-500 text-sm">{item.country}</Text>
                  {item.isDefault && (
                    <View
                      className="self-start rounded-full px-2 py-0.5 mt-2"
                      style={{ backgroundColor: "rgba(34,197,94,0.15)" }}
                    >
                      <Text className="text-green-400 text-xs font-semibold">
                        Default
                      </Text>
                    </View>
                  )}
                </View>
                <View className="flex-row items-center gap-4">
                  <TouchableOpacity
                    onPress={() => setEditingAddress(item)}
                    disabled={isDeleting}
                    activeOpacity={0.7}
                  >
                    <Text className="text-violet-400 text-sm">Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => item._id && handleDelete(item._id)}
                    disabled={isDeleting}
                    activeOpacity={0.7}
                  >
                    <Text className="text-red-400 text-sm">Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          contentContainerStyle={{ paddingTop: 8 }}
          ListEmptyComponent={
            <View className="items-center justify-center mt-20">
              <Text className="text-slate-500 text-base">
                No addresses saved.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
