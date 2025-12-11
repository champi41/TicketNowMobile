// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./src/screens/HomeScreen";
import EventDetailScreen from "./src/screens/EventDetailScreen";
import CheckoutScreen from "./src/screens/CheckoutScreen";
import PurchasesScreen from "./src/screens/PurchasesScreen";
import SettingsScreen from "./src/screens/SettingsScreen";

import { ThemeProvider } from "./src/context/ThemeContext";
import { LanguageProvider } from "./src/context/LanguageContext"; // 👈 importar proveedor de idioma

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>   {/* 👈 aquí envolvemos todo con el idioma */}
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerTitleAlign: "center",
            }}
          >
            {/* Home SIN encabezado nativo */}
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="EventDetail"
              component={EventDetailScreen}
              options={{ title: "Detalle del evento" }}
            />

            <Stack.Screen
              name="Checkout"
              component={CheckoutScreen}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="Purchases"
              component={PurchasesScreen}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </LanguageProvider>
    </ThemeProvider>
  );
}
