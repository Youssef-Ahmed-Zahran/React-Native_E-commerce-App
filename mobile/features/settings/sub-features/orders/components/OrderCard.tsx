import React from "react";
import { View, Text } from "react-native";
import type { Order } from "../../../../../types/order.types";

interface OrderCardProps {
  order: Order;
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending: { bg: "rgba(250,204,21,0.15)", text: "#facc15" },
  processing: { bg: "rgba(59,130,246,0.15)", text: "#3b82f6" },
  shipped: { bg: "rgba(168,85,247,0.15)", text: "#a855f7" },
  delivered: { bg: "rgba(34,197,94,0.15)", text: "#22c55e" },
  cancelled: { bg: "rgba(239,68,68,0.15)", text: "#ef4444" },
};

export default function OrderCard({ order }: OrderCardProps) {
  const colors = STATUS_COLORS[order.orderStatus] ?? STATUS_COLORS.pending;

  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <View
      className="rounded-2xl border border-white/10 p-4 mb-3"
      style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
    >
      {/* Top Row: Order Number + Status */}
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-white font-bold text-base">
          #{order.orderNumber}
        </Text>
        <View
          className="rounded-full px-3 py-1"
          style={{ backgroundColor: colors.bg }}
        >
          <Text
            style={{ color: colors.text }}
            className="text-xs font-semibold capitalize"
          >
            {order.orderStatus}
          </Text>
        </View>
      </View>

      {/* Bottom Row: Date + Total */}
      <View className="flex-row justify-between items-center">
        <Text className="text-slate-400 text-sm">{formattedDate}</Text>
        <Text className="text-white font-bold text-base">
          ${order.totalAmount.toFixed(2)}
        </Text>
      </View>
    </View>
  );
}
