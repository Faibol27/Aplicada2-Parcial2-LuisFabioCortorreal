import React, { useState, useCallback } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    StyleSheet,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { obtenerVehiculos, eliminarToken } from "../services/api.services";

export default function VehiculosScreen() {
    const [vehiculos, setVehiculos] = useState([]);
    const [soloDisponibles, setSoloDisponibles] = useState(false);
    const [cargando, setCargando] = useState(true);

    const cargarVehiculos = async (filtrar = soloDisponibles) => {
        setCargando(true);
        try {
            const lista = await obtenerVehiculos(filtrar);
            setVehiculos(lista);
        } catch (error) {
            Alert.alert("Error", error.message);
        } finally {
            setCargando(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            cargarVehiculos(soloDisponibles);
        }, [soloDisponibles]),
    );

    const handleCerrarSesion = async () => {
        await eliminarToken();
        router.replace("/");
    };

    const renderVehiculo = ({ item }) => {
        const esDisponible = String(item.estado).toLowerCase() === "disponible";

        return (
            <TouchableOpacity
                style={styles.card}
                activeOpacity={0.8}
                onPress={() =>
                    router.push({
                        pathname: "/detalle",
                        params: { id: item.id },
                    })
                }
            >
                <Text style={styles.carTitle}>
                    {item.marca} {item.modelo}
                </Text>

                <View
                    style={[
                        styles.badge,
                        esDisponible ? styles.badgeAvailable : styles.badgeSold,
                    ]}
                >
                    <Text style={styles.badgeText}>{item.estado}</Text>
                </View>

                <Text style={styles.carYear}>Año: {item.anio}</Text>
                <Text style={styles.carPrice}>
                    ${Number(item.precio).toLocaleString()}
                </Text>
                <Text style={styles.detailLink}>Ver detalle →</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.topBar}>
                    <TouchableOpacity
                        style={[styles.actionBtn, styles.comprasBtn]}
                        onPress={() => router.push("/compras")}
                    >
                        <Text style={styles.actionBtnText}>Mis Compras</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionBtn, styles.logoutBtn]}
                        onPress={handleCerrarSesion}
                    >
                        <Text style={styles.logoutBtnText}>Cerrar Sesión</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={[
                        styles.filterButton,
                        soloDisponibles && styles.filterButtonActive,
                    ]}
                    onPress={() => setSoloDisponibles(!soloDisponibles)}
                >
                    <Text style={styles.filterButtonText}>
                        {soloDisponibles
                            ? "✓ Mostrando solo disponibles (Ver todos)"
                            : "Filtrar: Solo disponibles"}
                    </Text>
                </TouchableOpacity>

                {cargando ? (
                    <ActivityIndicator
                        size="large"
                        color="#FF2A85"
                        style={{ marginTop: 60 }}
                    />
                ) : (
                    <FlatList
                        data={vehiculos}
                        keyExtractor={(item) => String(item.id)}
                        renderItem={renderVehiculo}
                        style={{ width: "100%" }}
                        contentContainerStyle={{ paddingBottom: 32 }}
                        ListEmptyComponent={
                            <Text style={styles.emptyText}>
                                No hay vehículos para mostrar.
                            </Text>
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
        backgroundColor: "#fcfcfc",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingTop: 100,
    },
    content: {
        flex: 1,
        width: "100%",
        maxWidth: 450,
        alignItems: "center",
    },
    topBar: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
        marginBottom: 12,
    },
    actionBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    comprasBtn: {
        backgroundColor: "#020303",
    },
    actionBtnText: {
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: 14,
    },
    logoutBtn: {
        backgroundColor: "#000000",
        borderWidth: 1,
    },
    logoutBtnText: {
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: 14,
    },
    filterButton: {
        width: "100%",
        backgroundColor: "#181426",
        borderWidth: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 16,
    },
    filterButtonActive: {
        backgroundColor: "#000000",
    },
    filterButtonText: {
        color: "#FFFFFF",
        fontWeight: "600",
        fontSize: 14,
        textAlign: "center",
    },
    card: {
        width: "100%",
        backgroundColor: "#000000",
        borderRadius: 12,
        padding: 18,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: "#2D2645",
        alignItems: "center",
    },
    carTitle: {
        fontSize: 19,
        fontWeight: "bold",
        color: "#FFFFFF",
        textAlign: "center",
        marginBottom: 6,
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 8,
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
    carYear: {
        color: "#A09AB8",
        fontSize: 14,
        marginBottom: 6,
        textAlign: "center",
    },
    carPrice: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#00E5FF",
        marginBottom: 10,
        textAlign: "center",
    },
    detailLink: {
        color: "#FF2A85",
        fontWeight: "600",
        fontSize: 14,
        textAlign: "center",
    },
    emptyText: {
        color: "#A09AB8",
        textAlign: "center",
        marginTop: 50,
        fontSize: 16,
    },
});
