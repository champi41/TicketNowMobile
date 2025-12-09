import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function EventCard({ ev }) {
    
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <View style={styles.card}>
            {ev.image && (
                <Image
                    source={{ uri: ev.image }}
                    style={styles.image}
                />
            )}
            {/* ... Renderizado del Título, Categoría, Ubicación, Tickets ... */}
            <Text style={styles.title}>{ev.name}</Text>
            <Text style={styles.detail}>Categoría: {ev.category}</Text>
            <Text style={styles.detail}>{ev.location}</Text>
            <Text style={[styles.detail, { marginBottom: 10 }]}>{formatDate(ev.date)}</Text>
            <Text style={styles.ticketHeader}>Tickets disponibles:</Text>

            {ev.tickets?.map((t, idx) => (
                <Text key={idx} style={styles.ticketDetail}>
                    - {t.type}: ${t.price.toLocaleString()} ({t.available} disponibles)
                </Text>
            ))}
        </View>
    );
}
const styles = StyleSheet.create({
    card: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: 15,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 4
    },
    image: {
        width: "100%",
        height: 180,
        borderRadius: 10,
        marginBottom: 15
    },
    title: {
        fontSize: 20,
        fontWeight: "bold"
    },
    detail: {
        color: "#555",
        marginTop: 4
    },
    ticketHeader: {
        fontWeight: "bold",
        marginTop: 10
    },
    ticketDetail: {
        marginLeft: 5
    }
});