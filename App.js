import React, { useState, useMemo } from "react";
import { Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { useEvents } from "./app/hooks/useEvents"; 
import EventCard from "./app/componentes/EventCard"; 
import Busqueda from "./app/componentes/busqueda"; 

export default function App() {
  const { events, loading, error } = useEvents();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEvents = useMemo(() => {
    if (!searchTerm) {
      return events;
    }
    const lowerCaseSearch = searchTerm.toLowerCase();
    
    return events.filter(ev => 
      ev.name.toLowerCase().includes(lowerCaseSearch) ||
      ev.location.toLowerCase().includes(lowerCaseSearch) ||
      ev.category.toLowerCase().includes(lowerCaseSearch)
    );
  }, [events, searchTerm]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>
        TicketNow
      </Text>

      {/* 1. Componente de Búsqueda */}
      <Busqueda 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
      />

      {/* 2. Manejo de Estados */}
      {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}
      {error && <Text style={styles.errorText}>Error: {error}</Text>}

      {/* 3. Renderizado de Eventos */}
      {!loading && filteredEvents.length === 0 && (
        <Text style={styles.noEventsText}>
            {searchTerm 
                ? `No se encontraron eventos para "${searchTerm}".` 
                : "No hay eventos disponibles."
            }
        </Text>
      )}

      {filteredEvents.map(ev => (
        <EventCard key={ev._id} ev={ev} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: { 
        backgroundColor: "#f2f2f2", 
        padding: 15 
    },
    headerTitle: { 
        fontSize: 26, 
        fontWeight: "bold", 
        marginTop: 50, 
        marginBottom: 20 
    },
    errorText: { 
        color: "red", 
        textAlign: 'center',
        marginVertical: 20
    },
    noEventsText: {
        textAlign: 'center',
        color: '#666',
        marginVertical: 20
    },
    loader: {
        marginTop: 50
    }
});