import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Order } from "../../../../../types/order.types";

interface OrderCardProps {
  order: Order;
}

const STATUS_CONFIG: Record<string, { bg: string; text: string; icon: React.ComponentProps<typeof Ionicons>["name"] }> = {
  pending:    { bg: "rgba(250,204,21,0.12)",  text: "#facc15", icon: "time-outline" },
  processing: { bg: "rgba(59,130,246,0.12)",   text: "#3b82f6", icon: "refresh-outline" },
  shipped:    { bg: "rgba(168,85,247,0.12)",   text: "#a855f7", icon: "airplane-outline" },
  delivered:  { bg: "rgba(34,197,94,0.12)",    text: "#22c55e", icon: "checkmark-circle-outline" },
  cancelled:  { bg: "rgba(239,68,68,0.12)",    text: "#ef4444", icon: "close-circle-outline" },
};

export default function OrderCard({ order }: OrderCardProps) {
  const config = STATUS_CONFIG[order.orderStatus] ?? STATUS_CONFIG.pending;

  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <View
      className="rounded-3xl border border-white/[0.07] p-4 mb-3"
      style={{ backgroundColor: "rgba(255,255,255,0.03)" }}
    >
      {/* Top Row: Order Number + Status Badge */}
      <View className="flex-row justify-between items-center mb-3">
        <View>
          <Text className="text-slate-500 text-xs uppercase tracking-widest mb-0.5">
            Order
          </Text>
          <Text className="text-white font-extrabold text-lg tracking-wide">
            #{order.orderNumber}
          </Text>
        </View>
        <View
          className="flex-row items-center gap-1.5 rounded-full px-3 py-1.5"
          style={{ backgroundColor: config.bg }}
        >
          <Ionicons name={config.icon} size={13} color={config.text} />
          <Text
            style={{ color: config.text }}
            className="text-xs font-bold capitalize tracking-wide"
          >
            {order.orderStatus}
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View className="h-px bg-white/5 mb-3" />

      {/* Bottom Row: Date + Total */}
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center gap-1.5">
          <Ionicons name="calendar-outline" size={14} color="#475569" />
          <Text className="text-slate-500 text-sm">{formattedDate}</Text>
        </View>
        <Text className="text-white font-extrabold text-lg">
          ${order.totalAmount.toFixed(2)}
        </Text>
      </View>
    </View>
  );
}
