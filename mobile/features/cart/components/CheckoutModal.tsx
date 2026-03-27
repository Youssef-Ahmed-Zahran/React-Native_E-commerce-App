import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { router } from "expo-router";
import Constants from "expo-constants";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { Ionicons } from "@expo/vector-icons";
import Modal from "../../../components/Modal";
import { useCreateOrder } from "../../settings/sub-features/orders/slice/orderSlice";
import { useClearCart } from "../slice/cartSlice";
import { useCurrentUser } from "../../auth/slice/authSlice";
import { CheckoutModalProps, SummaryRowProps } from "../../../types/cart.types";

export default function CheckoutModal({
  visible,
  onClose,
  subtotal,
  shippingCost,
  taxAmount,
  totalAmount,
}: CheckoutModalProps) {
  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const { mutate: createOrder, isPending: isCreating } = useCreateOrder();
  const { mutate: clearCart } = useClearCart();

  const [step, setStep] = useState<"shipping" | "paypal">("shipping");
  const [isPayPalLoading, setIsPayPalLoading] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const defaultAddress =
    user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0];

  const isShippingValid = !!defaultAddress;

  // ── Get the API host dynamically ──
  const getApiHost = () => {
    if (__DEV__) {
      const hostUri = Constants?.expoConfig?.hostUri;
      if (hostUri) {
        return hostUri.split(":")[0];
      }
      return Platform.OS === "android" ? "10.0.2.2" : "localhost";
    }
    return "192.168.1.3";
  };

  const apiUrl = `http://${getApiHost()}:8080`;

  // ── Handle PayPal approval → create backend order ──
  const handlePayPalApproval = useCallback(
    (orderID: string) => {
      if (!defaultAddress) return;
      createOrder(
        {
          shippingAddress: {
            fullName: user?.name || "Customer",
            street: defaultAddress.street,
            city: defaultAddress.city,
            state: defaultAddress.state || undefined,
            zipCode: defaultAddress.postalCode,
            country: defaultAddress.country,
            phoneNumber: "0000000000",
          },
          paymentMethod: "PayPal",
          shippingCost,
          taxAmount,
        },
        {
          onSuccess: () => {
            resetAndClose();
            if (Platform.OS === "web") {
              // Web Alerts might not block or handle onPress perfectly
              Alert.alert(
                "Order Placed! 🎉",
                `Your order has been placed successfully.\nPayPal Transaction: ${orderID}`,
              );
              router.push("/(tabs)/settings");
            } else {
              Alert.alert(
                "Order Placed! 🎉",
                `Your order has been placed successfully.\nPayPal Transaction: ${orderID}`,
                [
                  {
                    text: "OK",
                    onPress: () => router.push("/(tabs)/settings"),
                  },
                ],
              );
            }
          },
          onError: (err: Error) => {
            Alert.alert("Order Error", err.message);
          },
        },
      );
    },
    [user?.name, defaultAddress, shippingCost, taxAmount],
  );

  const resetAndClose = () => {
    setStep("shipping");
    setIsPayPalLoading(false);
    onClose();
  };

  // ── Native: Open PayPal checkout in System Browser (Safari/Chrome) ──
  const handleNativePayPal = async () => {
    if (!isShippingValid) {
      Alert.alert(
        "Error",
        "Please add a default shipping address in your Settings first.",
      );
      return;
    }

    setIsPayPalLoading(true);

    // Create the full deep link URL that PayPal will redirect back to
    const redirectUrl = Linking.createURL("paypal-callback");

    const checkoutUrl = `${apiUrl}/api/v1/checkout/paypal?total=${totalAmount.toFixed(2)}&redirectUrl=${encodeURIComponent(redirectUrl)}`;

    try {
      const result = await WebBrowser.openAuthSessionAsync(
        checkoutUrl,
        redirectUrl,
      );

      if (result.type === "success" && result.url) {
        const url = result.url;

        // Parse status and orderID from the redirect URL
        const params = url.includes("?")
          ? new URLSearchParams(url.split("?").slice(1).join("?"))
          : new URLSearchParams("");

        const status = params.get("status");
        const orderID = params.get("orderID");

        if (status === "success" && orderID) {
          handlePayPalApproval(orderID);
        } else if (status === "cancel") {
          Alert.alert("Cancelled", "Payment was cancelled.");
        } else if (status === "error") {
          Alert.alert("Payment Error", "Something went wrong with PayPal.");
        }
      } else if (result.type === "cancel") {
        // User closed the browser manually
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "Could not open PayPal. Make sure your backend is running.",
      );
    } finally {
      setIsPayPalLoading(false);
    }
  };

  // ── Web: Listen for postMessage from iframe ──
  useEffect(() => {
    if (Platform.OS !== "web" || step !== "paypal") return;

    const handler = (event: MessageEvent) => {
      try {
        const raw =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;

        // Handle deep-link style messages from the updated backend
        if (typeof raw === "string") {
          if (raw.includes("paypal-success")) {
            const params = new URLSearchParams(raw.split("?")[1] || "");
            handlePayPalApproval(params.get("orderID") || "unknown");
          } else if (raw.includes("paypal-cancel")) {
            Alert.alert("Cancelled", "Payment was cancelled.");
            setStep("shipping");
          } else if (raw.includes("paypal-error")) {
            Alert.alert("Payment Error", "Something went wrong with PayPal.");
          }
        }
      } catch {
        // ignore non-JSON messages
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [step, handlePayPalApproval]);

  // ── Web: Render PayPal in iframe ──
  const paypalCheckoutUrl = `${apiUrl}/api/v1/checkout/paypal?total=${totalAmount.toFixed(2)}&returnScheme=web`;

  const renderWebPayPalView = () => (
    <View style={{ height: 380 }}>
      {isCreating && (
        <View
          className="absolute inset-0 z-10 items-center justify-center"
          style={{ backgroundColor: "rgba(15,23,42,0.85)" }}
        >
          <ActivityIndicator size="large" color="#7c3aed" />
          <Text className="text-white mt-3 font-semibold">
            Creating your order...
          </Text>
        </View>
      )}
      <iframe
        ref={iframeRef as any}
        src={paypalCheckoutUrl}
        style={{
          width: "100%",
          height: 340,
          border: "none",
          borderRadius: 12,
          backgroundColor: "#0f172a",
        }}
        allow="payment"
      />
      <TouchableOpacity
        onPress={() => setStep("shipping")}
        className="mt-3 mb-2 self-center"
        activeOpacity={0.7}
      >
        <Text className="text-violet-400 text-sm font-semibold">
          ← Back to Shipping
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      visible={visible}
      onClose={resetAndClose}
      title={step === "shipping" ? "Shipping Details" : "Pay with PayPal"}
    >
      {step === "shipping" ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* ── Shipping Address ── */}
          {isUserLoading ? (
            <ActivityIndicator size="small" color="#7c3aed" className="my-6" />
          ) : defaultAddress ? (
            <View className="mb-6 mt-2">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-white text-lg font-bold">
                  Shipping Details
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    onClose();
                    router.push("/(tabs)/settings");
                  }}
                  activeOpacity={0.7}
                >
                  <Text className="text-violet-400 font-semibold text-sm">
                    Change
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                className="rounded-3xl border flex-row items-start p-4"
                style={{
                  backgroundColor: "rgba(124,58,237,0.05)",
                  borderColor: "rgba(124,58,237,0.2)",
                  shadowColor: "#7c3aed",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 12,
                }}
              >
                <View
                  className="w-12 h-12 rounded-2xl items-center justify-center mr-4 mt-0.5"
                  style={{ backgroundColor: "rgba(124,58,237,0.15)" }}
                >
                  <Ionicons name="location" size={24} color="#a78bfa" />
                </View>
                <View className="flex-1 justify-center">
                  <Text className="text-white font-bold text-lg mb-1 tracking-tight">
                    {user?.name || "Customer"}
                  </Text>
                  <Text className="text-slate-300 text-base leading-6">
                    {defaultAddress.street}
                  </Text>
                  <Text className="text-slate-300 text-base leading-6">
                    {defaultAddress.city}, {defaultAddress.state}{" "}
                    {defaultAddress.postalCode}
                  </Text>
                  <Text className="text-violet-300 text-sm font-bold tracking-widest uppercase mt-2">
                    {defaultAddress.country}
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <View className="mb-6 mt-4 items-center">
              <View
                className="w-16 h-16 rounded-full items-center justify-center mb-4"
                style={{ backgroundColor: "rgba(239,68,68,0.1)" }}
              >
                <Ionicons name="location-outline" size={32} color="#f87171" />
              </View>
              <Text className="text-slate-300 text-center mb-5 text-base px-4">
                You don't have a default shipping address set.
              </Text>
              <TouchableOpacity
                onPress={() => {
                  onClose();
                  router.push("/(tabs)/settings");
                }}
                className="px-6 py-3 rounded-2xl"
                style={{ backgroundColor: "rgba(124,58,237,0.2)" }}
                activeOpacity={0.8}
              >
                <Text className="text-violet-400 font-bold text-base">
                  Go to Settings
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ── Order Summary (recap) ── */}
          <View
            className="rounded-3xl border border-white/10 p-5 mt-2 mb-4"
            style={{ backgroundColor: "rgba(255,255,255,0.03)" }}
          >
            <SummaryRow label="Subtotal" value={subtotal} />
            <SummaryRow label="Shipping" value={shippingCost} />
            <SummaryRow label="Tax (8%)" value={taxAmount} />
            <View className="border-t border-white/10 mt-4 pt-4">
              <SummaryRow label="Total Amount" value={totalAmount} bold />
            </View>
          </View>

          {/* ── Proceed Button ── */}
          <TouchableOpacity
            onPress={
              Platform.OS === "web" ? handleProceedToPayPal : handleNativePayPal
            }
            disabled={!isShippingValid || isPayPalLoading}
            className="rounded-2xl overflow-hidden mt-2 mb-4"
            style={{ height: 54 }}
            activeOpacity={0.85}
          >
            <View
              className="flex-1 flex-row items-center justify-center gap-2"
              style={{
                backgroundColor:
                  isShippingValid && !isPayPalLoading ? "#7c3aed" : "#4c1d95",
              }}
            >
              {isPayPalLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="card" size={24} color="#fff" />
              )}
              <Text className="text-white font-bold text-base tracking-wide">
                {isPayPalLoading ? "Opening PayPal..." : "Proceed to PayPal"}
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        // Web only uses the iframe view
        renderWebPayPalView()
      )}

      {/* ── Native: Creating order overlay ── */}
      {isCreating && Platform.OS !== "web" && (
        <View
          className="absolute inset-0 z-50 items-center justify-center"
          style={{ backgroundColor: "rgba(15,23,42,0.9)", borderRadius: 24 }}
        >
          <ActivityIndicator size="large" color="#7c3aed" />
          <Text className="text-white mt-3 font-semibold">
            Creating your order...
          </Text>
        </View>
      )}
    </Modal>
  );

  function handleProceedToPayPal() {
    if (!isShippingValid) {
      Alert.alert(
        "Error",
        "Please add a default shipping address in your Settings first.",
      );
      return;
    }
    setStep("paypal");
  }
}

// ─── Helper Components ────────────────────────────────────────────────────────

function SummaryRow({ label, value, bold }: SummaryRowProps) {
  return (
    <View className="flex-row justify-between items-center py-1.5">
      <Text
        className={`text-sm ${bold ? "text-white font-bold text-lg" : "text-slate-400 font-medium"}`}
      >
        {label}
      </Text>
      <Text
        className={`text-sm ${bold ? "text-violet-400 font-bold text-xl" : "text-slate-200 font-medium"}`}
      >
        ${value.toFixed(2)}
      </Text>
    </View>
  );
}
