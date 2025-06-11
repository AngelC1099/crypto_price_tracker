import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack initialRouteName="screens/home" screenOptions={{headerShown: false}} />;
}
