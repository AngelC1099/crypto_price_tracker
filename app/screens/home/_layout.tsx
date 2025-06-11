import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ title: 'Crypto tracker', headerTitleAlign: 'center' }} />
  );
}
