import { SymbolView } from "expo-symbols";
import { Link, Tabs } from "expo-router";
import { Platform, Pressable } from "react-native";
import { Stack } from "expo-router";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { Header } from "expo-router/build/react-navigation/index.js";

export default function rootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="registro" options={{ title: "Crear Cuenta" }} />
      <Stack.Screen name="vehiculos" options={{ title: "Catalogo de vehiculos" }} />
      <Stack.Screen name="detalle" options={{ title: "Detalle de vehiculos" }} />
      <Stack.Screen name="compras" options={{ title: "Mis compras" }} />
    </Stack>
  );
}
