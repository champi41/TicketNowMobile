// App.js (MODIFICADO para usar FlatList y Paginación Infinita)

import React, { useState, useMemo } from "react";
import { 
    Text, 
    FlatList, // Usaremos FlatList en lugar de ScrollView
    StyleSheet, 
    ActivityIndicator, 
    View // Necesario para el Footer
} from "react-native";

import { useEvents } from "./app/hooks/useEvents"; 
import EventCard from "./app/componentes/EventCard"; 
import Busqueda from "./app/componentes/busqueda"; 

export default function App() {
    // Traemos la nueva función y estado del hook
    const { events, loading, error, isFetchingMore, fetchNextPage } = useEvents(); 
    const [searchTerm, setSearchTerm] = useState("");

    // ... (Lógica de filtrado con useMemo se mantiene igual)
    const filteredEvents = useMemo(() => {
        const currentEvents = events ?? [];
        if (!searchTerm) {
            return currentEvents;
        }
        return currentEvents.filter(ev => 
            // Usamos 'currentEvents' en lugar de 'events'
            ev.name.toLowerCase().includes(lowerCaseSearch) ||
            ev.location.toLowerCase().includes(lowerCaseSearch) ||
            ev.category.toLowerCase().includes(lowerCaseSearch)
        );
    }, [events, searchTerm]);
    
    // Renderizado del Footer (indicador de carga al final)
    const renderFooter = () => {
        if (!isFetchingMore) return null;
        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color="#0000ff" />
                <Text style={{ marginLeft: 10 }}>Cargando más eventos...</Text>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.centerScreen]}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Cargando eventos iniciales...</Text>
            </View>
        );
    }
    
    return (
        <FlatList
            data={filteredEvents}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <EventCard ev={item} />}
            contentContainerStyle={styles.contentContainer}
            
            // PROPIEDADES CLAVE PARA LA PAGINACIÓN INFINITA:
            onEndReached={fetchNextPage} // Función que llama a la siguiente página
            onEndReachedThreshold={0.5} // Cargar cuando el scroll llega al 50% del fondo

            // Renderiza el componente que aparecerá al final de la lista (el indicador de carga)
            ListFooterComponent={renderFooter} 
            
            // Renderiza los componentes que aparecen antes de la lista (Header)
            ListHeaderComponent={() => (
                <View>
                    <Text style={styles.headerTitle}>TicketNow</Text>
                    <Busqueda searchTerm={searchTerm} onSearchChange={setSearchTerm} />
                    {error && <Text style={styles.errorText}>Error: {error}</Text>}
                    
                    {!loading && filteredEvents.length === 0 && (
                        <Text style={styles.noEventsText}>
                            {searchTerm 
                                ? `No se encontraron eventos para "${searchTerm}".` 
                                : "No hay eventos disponibles."
                            }
                        </Text>
                    )}
                </View>
            )}
        />
    );
}

const styles = StyleSheet.create({
    contentContainer: { 
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
    centerScreen: { // Estilos para centrar el loading inicial
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerLoader: { // Estilos para el indicador de carga al final
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
    }
});