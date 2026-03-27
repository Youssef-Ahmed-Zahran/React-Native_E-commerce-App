import { Tabs } from "expo-router";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../../features/cart/slice/cartSlice";

function TabIcon({
  name,
  label,
  focused,
  badgeCount,
}: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  focused: boolean;
  badgeCount?: number;
}) {
  return (
    <View className="items-center justify-center pt-2" style={{ minWidth: 80 }}>
      <View>
        <Ionicons
          name={name}
          size={24}
          color={focused ? "#a78bfa" : "#64748b"}
        />
        {badgeCount !== undefined && badgeCount > 0 && (
          <View
            className="absolute -top-1 -right-2 rounded-full items-center justify-center border border-[#0f172a]"
            style={{ backgroundColor: "#ef4444", minWidth: 16, height: 16 }}
          >
            <Text
              className="text-white font-bold"
              style={{ fontSize: 9, lineHeight: 12, paddingHorizontal: 3 }}
            >
              {badgeCount > 99 ? "99+" : badgeCount}
            </Text>
          </View>
        )}
      </View>
      <Text
        className={`text-[10px] mt-1 font-semibold text-center ${
          focused ? "text-violet-400" : "text-slate-500"
        }`}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  const { data: cart } = useCart();
  const cartItemCount = cart?.items?.length || 0;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#0f172a",
          borderTopColor: "rgba(255,255,255,0.08)",
          borderTopWidth: 1,
          height: 70,
          paddingBottom: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name={focused ? "home" : "home-outline"}
              label="Home"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name={focused ? "cart" : "cart-outline"}
              label="Cart"
              focused={focused}
              badgeCount={cartItemCount}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name={focused ? "settings" : "settings-outline"}
              label="Settings"
              focused={focused}
            />
          ),
        }}
      />
      {/* Hide the product detail route from the tab bar */}
      <Tabs.Screen
        name="product/[id]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
