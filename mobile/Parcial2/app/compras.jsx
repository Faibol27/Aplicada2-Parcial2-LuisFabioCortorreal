import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { obtenerMisCompras } from '../services/api.services';

export default function MisComprasScreen() {
    const [compras, setCompras] = useState([]);
    const [cargando, setCargando] = useState(true);

    const cargarCompras = async () => {
        setCargando(true);
        try {
            const respuesta = await obtenerMisCompras();
            const lista = Array.isArray(respuesta)
                ? respuesta
                : respuesta.data || respuesta.ventas || [];
            setCompras(lista);
        } catch (error) {
            Alert.alert('Error al cargar compras', error.message);
        } finally {
            setCargando(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            cargarCompras();
        }, [])
    );

    const renderCompra = ({ item }) => {
        const nombreVehiculo = item.vehiculo
            ? `${item.vehiculo.marca} ${item.vehiculo.modelo} (${item.vehiculo.anio})`
            : `Vehículo #${item.vehiculoId}`;

        const fecha = item.fecha || item.createdAt;
        const monto = item.monto ?? item.total ?? item.precio ?? item.vehiculo?.precio ?? 0;

        return (
            <View style={styles.card}>
                <Text style={styles.carTitle}>{nombreVehiculo}</Text>

                <Text style={styles.infoText}>
                    Fecha: {fecha ? new Date(fecha).toLocaleDateString() : 'N/A'}
                </Text>

                {item.metodoPago ? (
                    <Text style={styles.infoText}>Método: {item.metodoPago}</Text>
                ) : null}

                <Text style={styles.amountText}>
                    Monto: ${Number(monto).toLocaleString()}
                </Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.headerTitle}>Historial de Compras</Text>


                {cargando ? (
                    <ActivityIndicator size="large" color="#FF2A85" style={{ marginTop: 40 }} />
                ) : (
                    <FlatList
                        data={compras}
                        keyExtractor={(item) => String(item.id || Math.random())}
                        renderItem={renderCompra}
                        style={{ width: '100%' }}
                        contentContainerStyle={{ paddingBottom: 32 }}
                        ListEmptyComponent={
                            <Text style={styles.emptyText}>Aún no tienes compras registradas.</Text>
                        }
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 80,
    },
    content: {
        flex: 1,
        width: '100%',
        maxWidth: 450,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 4,
    },
    reloadButtonText: {
        color: '#00E5FF',
        fontSize: 13,
        fontWeight: '600',
    },
    card: {
        width: '100%',
        backgroundColor: '#181426',
        borderRadius: 12,
        padding: 18,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#2D2645',
        alignItems: 'center',
    },
    carTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 8,
    },
    infoText: {
        color: '#A09AB8',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 4,
    },
    amountText: {
        fontSize: 19,
        fontWeight: 'bold',
        color: '#00E5FF',
        textAlign: 'center',
        marginTop: 8,
    },
    emptyText: {
        color: '#A09AB8',
        textAlign: 'center',
        marginTop: 40,
        fontSize: 16,
    },
});