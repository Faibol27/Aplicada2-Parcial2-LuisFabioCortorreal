import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    ScrollView,
    StyleSheet,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { obtenerVehiculosPorId, comprarVehiculo } from "../services/api.services";

export default function DetalleVehiculoScreen() {
    const { id } = useLocalSearchParams();
    const [vehiculo, setVehiculo] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [comprando, setComprando] = useState(false);

    useEffect(() => {
        const cargarDetalle = async () => {
            try {
                const data = await obtenerVehiculosPorId(id);
                setVehiculo(data);
            } catch (error) {
                Alert.alert("Error", error.message);
            } finally {
                setCargando(false);
            }
        };
        if (id) cargarDetalle();
    }, [id]);

    if (cargando) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#FF2A85" />
            </View>
        );
    }

    if (!vehiculo) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.emptyText}>No se encontró el vehículo.</Text>
            </View>
        );
    }

    const estaDisponible = String(vehiculo.estado).toLowerCase() === "disponible";

    const ejecutarCompra = async () => {
        setComprando(true);
        try {
            const data = await comprarVehiculo(vehiculo.id);
            Alert.alert(
                '¡Compra exitosa!',
                data?.message || `Has adquirido el ${vehiculo.marca} ${vehiculo.modelo}.`,
                [{ text: 'Ver mis compras', onPress: () => router.replace('/compras') }]
            );
        } catch (error) {
            Alert.alert('Error en la compra', error?.message || 'Ocurrió un error inesperado.');
        } finally {
            setComprando(false);
        }
    };

    const confirmarCompra = () => {
        Alert.alert(
            "Confirmar Compra",
            `¿Deseas comprar el ${vehiculo.marca} ${vehiculo.modelo} (${vehiculo.anio}) por $${Number(vehiculo.precio).toLocaleString()} mediante transferencia?`,
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Confirmar", onPress: ejecutarCompra },
            ],
        );
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
                <Text style={styles.carTitle}>
                    {vehiculo.marca} {vehiculo.modelo}
                </Text>

                <View
                    style={[
                        styles.badge,
                        estaDisponible ? styles.badgeAvailable : styles.badgeSold,
                    ]}
                >
                    <Text style={styles.badgeText}>{vehiculo.estado}</Text>
                </View>

                <Text style={styles.carInfo}>Año: {vehiculo.anio}</Text>

                <Text style={styles.carPrice}>
                    ${Number(vehiculo.precio).toLocaleString()}
                </Text>

                <Text style={styles.paymentNote}>Método de pago: Transferencia</Text>

                {estaDisponible ? (
                    comprando ? (
                        <ActivityIndicator
                            size="large"
                            color="#FF2A85"
                            style={{ marginTop: 16 }}
                        />
                    ) : (
                        <TouchableOpacity
                            style={styles.buyButton}
                            onPress={confirmarCompra}
                        >
                            <Text style={styles.buyButtonText}>Comprar Vehículo</Text>
                        </TouchableOpacity>
                    )
                ) : (
                    <View style={styles.unavailableBox}>
                        <Text style={styles.unavailableText}>
                            Este vehículo ya fue vendido y no está disponible.
                        </Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    centerContainer: {
        flex: 1,
        backgroundColor: "#fefeff",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    container: {
        flexGrow: 1,
        backgroundColor: "#ffffff",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 48,
        paddingBottom: 32,
    },
    card: {
        width: "100%",
        maxWidth: 420,
        backgroundColor: "#000000",
        borderRadius: 16,
        padding: 22,
        borderWidth: 1,
        alignItems: "center",
    },
    carTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#FFFFFF",
        textAlign: "center",
        marginBottom: 10,
    },
    badge: {
        paddingHorizontal: 14,
        paddingVertical: 5,
        borderRadius: 14,
        marginBottom: 14,
    },
    badgeAvailable: {
        backgroundColor: "rgba(0, 229, 255, 0.18)",
    },
    badgeSold: {
        backgroundColor: "rgba(255, 42, 133, 0.2)",
    },
    badgeText: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "bold",
        textTransform: "uppercase",
    },
    carInfo: {
        color: "#A09AB8",
        fontSize: 16,
        textAlign: "center",
        marginBottom: 8,
    },
    carPrice: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#00E5FF",
        textAlign: "center",
        marginVertical: 10,
    },
    paymentNote: {
        color: "#A09AB8",
        fontSize: 13,
        textAlign: "center",
        marginBottom: 22,
    },
    buyButton: {
        width: "100%",
        backgroundColor: "#FF2A85",
        paddingVertical: 16,
        borderRadius: 10,
        alignItems: "center",
    },
    buyButtonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 16,
    },
    unavailableBox: {
        width: "100%",
        backgroundColor: "#251E3A",
        padding: 14,
        borderRadius: 10,
        alignItems: "center",
    },
    unavailableText: {
        color: "#FF2A85",
        fontWeight: "600",
        fontSize: 14,
        textAlign: "center",
    },
    emptyText: {
        color: "#A09AB8",
        fontSize: 16,
        textAlign: "center",
    },
});
