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

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerTitleAlign: "center", // centramos los títulos de las otras pantallas
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
            options={{ title: "Checkout" }}
          />

          <Stack.Screen
            name="Purchases"
            component={PurchasesScreen}
            options={{ title: "Mis compras" }}
          />

          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ title: "Configuración" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
