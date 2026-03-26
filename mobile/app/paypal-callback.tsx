import { useEffect } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";

// REQUIRED: This tells Expo to dismiss the WebBrowser and return the
// redirect URL to the `openAuthSessionAsync` call that started it.
WebBrowser.maybeCompleteAuthSession();

/**
 * This route handles the PayPal deep link redirect (exp://...paypal-callback?status=...).
 * The actual payment result is processed by openAuthSessionAsync in CheckoutModal.
 * This page just shows a brief loading state.
 */
export default function PayPalCallback() {
  useEffect(() => {
    // Navigate back after a short delay
    const timer = setTimeout(() => {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/(tabs)");
      }
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0f172a",
      }}
    >
      <ActivityIndicator size="large" color="#7c3aed" />
      <Text style={{ color: "#94a3b8", marginTop: 12, fontSize: 14 }}>
        Completing payment...
      </Text>
    </View>
  );
}
