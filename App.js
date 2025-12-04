import React, { useEffect, useState } from "react";
import { Text, View, ScrollView, Image } from "react-native";
import { getEvents } from "./servicios/api";

export default function App() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getEvents()
      .then(setEvents)
      .catch(err => setError(err.toString()));
  }, []);

  return (
    <ScrollView style={{ backgroundColor: "#f2f2f2", padding: 15 }}>
      <Text style={{ fontSize: 26, fontWeight: "bold", marginTop: 50, marginBottom: 20 }}>
        TicketNow
      </Text>

      {error && <Text style={{ color: "red" }}>Error: {error}</Text>}

      {events.length === 0 && !error && (
        <Text>No hay eventos disponibles.</Text>
      )}

      {events.map(ev => (
        <View
          key={ev._id}
          style={{
            backgroundColor: "white",
            borderRadius: 12,
            padding: 15,
            marginBottom: 20,
            shadowColor: "#000",
            shadowOpacity: 0.15,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 3 },
            elevation: 4
          }}
        >
          {ev.image && (
            <Image
              source={{ uri: ev.image }}
              style={{
                width: "100%",
                height: 180,
                borderRadius: 10,
                marginBottom: 15
              }}
            />
          )}

          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            {ev.name}
          </Text>

          <Text style={{ color: "#555", marginTop: 4 }}>
              Categoría: {ev.category}
          </Text>

          <Text style={{ color: "#555" }}>
              {ev.location}
          </Text>

          <Text style={{ color: "#555", marginBottom: 10 }}>
              {new Date(ev.date).toLocaleDateString()}
          </Text>

          <Text style={{ fontWeight: "bold", marginTop: 10 }}>
               Tickets disponibles:
          </Text>

          {ev.tickets?.map((t, idx) => (
            <Text key={idx} style={{ marginLeft: 5 }}>
              - {t.type}: ${t.price.toLocaleString()} ({t.available} disponibles)
            </Text>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}
