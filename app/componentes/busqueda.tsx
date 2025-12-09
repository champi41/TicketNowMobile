import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

export default function Busqueda({ searchTerm, onSearchChange }) {
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Busca eventos..."
                value={searchTerm}
                onChangeText={onSearchChange}
                placeholderTextColor="#888"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ddd'
    },
    input: {
        flex: 1,
        height: 40,
        fontSize: 16,
        color: '#333',
    },
});