// app/screens/EventDetailScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, Alert, Button } from 'react-native';
import { getEventDetails } from '../../servicios/api'; 
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EventDetailScreen({ route }) {
    // 1. Obtener el eventId pasado desde la pantalla Home (en el 'navigate')
    const { eventId } = route.params; 
    
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    // Función para formatear la fecha a un formato legible
    const formatDate = (isoDate) => {
        try {
            const date = new Date(isoDate);
            return date.toLocaleDateString('es-ES', { 
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
            });
        } catch (e) {
            return "Fecha y hora no disponibles";
        }
    };

    // 2. Hook para cargar los datos del evento
    useEffect(() => {
        const loadEvent = async () => {
            try {
                const data = await getEventDetails(eventId);
                setEvent(data);
            } catch (error) {
                console.error("Error al cargar detalle:", error);
                Alert.alert("Error", "No se pudo cargar el detalle del evento.");
            } finally {
                setLoading(false);
            }
        };

        loadEvent();
    }, [eventId]); // Se ejecuta solo cuando el eventId cambie

    // --- Manejo de Estados de Carga y Error ---
    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }
    
    if (!event) {
        return (
            <View style={styles.center}>
                <Text>No se pudo encontrar el evento.</Text>
            </View>
        );
    }
    
    // --- Renderizado del Evento ---
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container}>
                <Image source={{ uri: event.image }} style={styles.image} resizeMode="cover" />
                
                <View style={styles.content}>
                    <Text style={styles.title}>{event.name}</Text>
                    
                    <Text style={styles.category}>{event.category.toUpperCase()}</Text>
                    
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>📍 Ubicación:</Text>
                        <Text style={styles.detailValue}>{event.location}</Text>
                    </View>
                    
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>🗓️ Fecha y Hora:</Text>
                        <Text style={styles.detailValue}>{formatDate(event.date)}</Text>
                    </View>
                    
                    {/* Sección de Tickets */}
                    <Text style={styles.subTitle}>Tickets Disponibles</Text>
                    
                    {event.tickets && event.tickets.length > 0 ? (
                        event.tickets.map(t => (
                            <View key={t.type} style={styles.ticketRow}>
                                <View style={styles.ticketInfo}>
                                    <Text style={styles.ticketType}>{t.type}</Text>
                                    <Text style={styles.ticketAvailable}>({t.available} disponibles)</Text>
                                </View>
                                <Text style={styles.ticketPrice}>
                                    ${t.price.toLocaleString('es-ES')}
                                </Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noTickets}>No hay tickets a la venta en este momento.</Text>
                    )}
                    
                    {/* 🚨 Aquí iría el componente de selección de cantidad y el botón de Reserva 🚨 */}
                </View>
            </ScrollView>
            
            {/* Botón de Reserva (temporalmente un placeholder) */}
            <View style={styles.fixedButtonContainer}>
                <Button 
                    title="Reservar Tickets" 
                    onPress={() => Alert.alert("Reserva", "Lógica de reserva por implementar.")}
                    color="#007AFF"
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fff' },
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    image: { width: '100%', height: 280 },
    content: { padding: 20, paddingBottom: 100 }, // Aumenta el padding bottom para dejar espacio al botón fijo
    title: { fontSize: 32, fontWeight: 'bold', marginBottom: 5, color: '#333' },
    category: { fontSize: 14, color: '#007AFF', fontWeight: '600', marginBottom: 15 },
    
    detailRow: { flexDirection: 'row', marginBottom: 8 },
    detailLabel: { fontSize: 16, fontWeight: 'bold', marginRight: 5, color: '#555' },
    detailValue: { fontSize: 16, color: '#333' },
    
    subTitle: { fontSize: 22, fontWeight: 'bold', marginTop: 25, marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 5 },
    
    ticketRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    ticketInfo: { flexDirection: 'column' },
    ticketType: { fontWeight: 'bold', fontSize: 16 },
    ticketAvailable: { fontSize: 12, color: '#888' },
    ticketPrice: { color: 'green', fontWeight: 'bold', fontSize: 18 },
    noTickets: { fontStyle: 'italic', color: '#999' },

    fixedButtonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 15,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 5,
    }
});