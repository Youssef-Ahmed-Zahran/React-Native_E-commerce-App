import { Redirect } from "expo-router";

export default function Index() {
  // Redirect to tabs (home) by default
  // Replace this with auth check logic later
  return <Redirect href="/(tabs)" />;
}
