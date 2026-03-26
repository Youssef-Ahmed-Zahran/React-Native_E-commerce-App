import { Stack } from "expo-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { Platform } from "react-native";
import "../global.css";
import { queryClient } from "../store/queryClient";

let Toaster: any = null;
if (Platform.OS === "web") {
  Toaster = require("react-hot-toast").Toaster;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }} />
      {Platform.OS === "web" && Toaster && <Toaster position="top-center" />}
    </QueryClientProvider>
  );
}
