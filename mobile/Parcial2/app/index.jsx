import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { obtenerToken, login } from "../services/api.services";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [verificando, setVerificando] = useState(false);

  useEffect(() => {
    const revisarSesion = async () => {
      const token = await obtenerToken();
      if (token) {
        router.replace("/vehiculos");
      } else {
        setVerificando(false);
      }
    };
    revisarSesion();
  }, []);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Campos vacios, todos los campos son obligatorios");
      return;
    }
    setCargando(true);
    try {
      await login(email, password);
      router.replace("/vehiculos");
    } catch (error) {
      Alert.alert("Error de acceso");
    } finally {
      setCargando(false);
    }
  };

  if (verificando) return <ActivityIndicator />;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.brandTitle}>VICE CITY MOTORS</Text>

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
          <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
            <Text style={styles.primaryButtonText}>Iniciar Sesión</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push("/registro")}
        >
          <Text style={styles.secondaryButtonText}>
            ¿No tienes cuenta? Crear usuario
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    backgroundColor: "#0D0B14",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 50,
    paddingTop: 80,
  },
  content: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  brandTitle: {
    fontSize: 38,
    fontWeight: "900",
    color: "#FF2A85",
    textAlign: "center",
    letterSpacing: 3,
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
    marginTop: 8,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  secondaryButton: {
    marginTop: 20,
    padding: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#00E5FF",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
});
