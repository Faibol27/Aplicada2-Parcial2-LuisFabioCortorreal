import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    StyleSheet,
} from "react-native";
import { router } from "expo-router";
import { registrarUsuario } from "../services/api.services";

export default function RegistroScreen() {
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cargando, setCargando] = useState(false);

    const handleRegistro = async () => {
        if (!nombre.trim() || !email.trim() || !password.trim()) {
            Alert.alert(
                "Campos incompletos",
                "Completa nombre, correo y contraseña.",
            );
            return;
        }

        setCargando(true);
        try {
            const data = await registrarUsuario(nombre, email, password);
            Alert.alert(
                "¡Registro exitoso!",
                data.message ||
                `Cuenta creada para ${nombre} (${email}). Ya puedes iniciar sesión.`,
                [{ text: "Ir a Login", onPress: () => router.back() }],
            );
        } catch (error) {
            Alert.alert("Error al registrar", error.message);
        } finally {
            setCargando(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Crear Cuenta</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Nombre completo"
                    placeholderTextColor="#8E88A8"
                    value={nombre}
                    onChangeText={setNombre}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Correo electrónico"
                    placeholderTextColor="#8E88A8"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    placeholderTextColor="#8E88A8"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                {cargando ? (
                    <ActivityIndicator
                        size="large"
                        color="#FF2A85"
                        style={{ marginVertical: 15 }}
                    />
                ) : (
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={handleRegistro}
                    >
                        <Text style={styles.primaryButtonText}>Registrarme</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 24,
        paddingTop: 50,
    },
    content: {
        width: "100%",
        maxWidth: 400,
        alignItems: "center",
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#000000",
        textAlign: "center",
        marginBottom: 6,
    },
    input: {
        width: "100%",
        backgroundColor: "#181426",
        borderWidth: 1,
        borderColor: "#2D2645",
        borderRadius: 10,
        padding: 15,
        color: "#FFFFFF",
        fontSize: 16,
        marginBottom: 16,
        textAlign: "center",
    },
    primaryButton: {
        width: "100%",
        backgroundColor: "#FF2A85",
        padding: 16,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
    },
    primaryButtonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 16,
    },
});
