// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screens
import HomeScreen from "./src/screens/HomeScreen";
import EventDetailScreen from "./src/screens/EventDetailScreen";
import CheckoutScreen from "./src/screens/CheckoutScreen";
import PurchasesScreen from "./src/screens/PurchasesScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTitle: "TicketNow",
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Eventos" }}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
