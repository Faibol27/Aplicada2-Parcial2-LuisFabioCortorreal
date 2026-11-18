import AsyncStorage from "./../node_modules/@react-native-async-storage/async-storage/lib/module/AsyncStorage";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const TOKEN_KEY = "tokenUsuario";

export async function request(
  path,
  { method = "GET", body, auth, headers = {} } = {},
) {
  const token = auth ? await obtenerToken() : null;

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.Error ||
        data?.error ||
        data?.message ||
        `Error de servidor ${response.status}`,
    );
  }
  return data;
}

// Token
export const guardarToken = async (token) => {
  try {
    return await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error("Error al guardar el token", error);
  }
};

export const obtenerToken = async () => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error("Error al obtener el token", error);
  }
};

export const eliminarToken = async () => {
  try {
    return await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error("Error al eliminar el token", error);
  }
};

// Usuario
export async function registrarUsuario(nombre, email, password) {
  const data = await request("/auth/registro", {
    method: "POST",
    body: { nombre, email, password },
  });
  return data;
}

export async function login(email, password) {
  const data = await request("/auth/login", {
    method: "POST",
    body: { email, password },
  });
  if (data.token) {
    await guardarToken(data.token);
  }
  return data;
}

// Vehiculos
export async function obtenerVehiculos(soloDisponible = false) {
  const filtro = soloDisponible ? "/vehiculos?estado=disponible" : "/vehiculos";

  const data = await request(filtro, { auth: true });
  return Array.isArray(data) ? data : data.data || data.vehiculos || [];
}

export async function obtenerVehiculosPorId(id) {
  const data = await request(`/vehiculos/${id}`, { auth: true });
  return data.data || data.vehiculo || data;
}

// Ventas
export async function comprarVehiculo(vehiculoId) {
  const data = await request("/ventas", {
    method: "POST",
    auth: true,
    body: {
      vehiculoId: Number(vehiculoId),
      metodoPago: "efectivo",
    },
  });
}

export async function obtenerMisCompras() {
  const data = await request("/ventas", { auth: true });
  return Array.isArray(data) ? data : data;
}
