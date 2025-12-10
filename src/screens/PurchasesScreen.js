// src/screens/PurchasesScreen.js
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getPurchase } from "../api/purchases";
import { useThemeSettings } from "../context/ThemeContext";
import BottomMenu from "../components/BottomMenu";

function formatoCLP(n) {
  const num = Number(n || 0);
  try {
    return "$" + num.toLocaleString("es-CL") + " CLP";
  } catch {
    return "$" + num.toString() + " CLP";
  }
}

export default function PurchasesScreen() {
  const { isDark: esOscuro } = useThemeSettings();

  const [ids, setIds] = useState([]);
  const [compras, setCompras] = useState([]);
  const [cargando, setCargando] = useState(true);

  const fondo = esOscuro ? "#020617" : "#F5F3FF";
  const tarjeta = esOscuro ? "#0F172A" : "#FFFFFF";
  const borde = esOscuro ? "#1F2937" : "#E5E7EB";
  const textoPrincipal = esOscuro ? "#F9FAFB" : "#111827";
  const textoSecundario = esOscuro ? "#9CA3AF" : "#4B5563";

  // Cargar IDs guardados
  useEffect(() => {
    const cargarIds = async () => {
      try {
        const saved = await AsyncStorage.getItem("purchase_ids");
        const arr = saved ? JSON.parse(saved) : [];
        setIds(Array.isArray(arr) ? arr : []);
      } catch (e) {
        console.error("Error leyendo purchase_ids", e);
        setIds([]);
      }
    };
    cargarIds();
  }, []);

  // Cargar detalles de compras
  useEffect(() => {
    if (!ids.length) {
      setCompras([]);
      setCargando(false);
      return;
    }

    let cancelado = false;

    const cargarCompras = async () => {
      try {
        setCargando(true);
        const resultados = await Promise.all(
          ids.map(async (id) => {
            try {
              const p = await getPurchase(id);
              return p;
            } catch (e) {
              console.error("Error cargando compra", id, e);
              return null;
            }
          })
        );
        if (!cancelado) {
          setCompras(resultados.filter(Boolean));
        }
      } finally {
        if (!cancelado) setCargando(false);
      }
    };

    cargarCompras();
    return () => {
      cancelado = true;
    };
  }, [ids]);

  return (
    <SafeAreaView
      style={[estilos.contenedor, { backgroundColor: fondo }]}
    >
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={estilos.scrollContenido}>
          <Text style={[estilos.titulo, { color: textoPrincipal }]}>
            Historial de compras
          </Text>

          {cargando && (
            <View style={estilos.centro}>
              <ActivityIndicator size="large" color="#A855F7" />
              <Text
                style={[
                  estilos.textoSecundario,
                  { color: textoSecundario },
                ]}
              >
                Cargando compras…
              </Text>
            </View>
          )}

          {!cargando && !ids.length && (
            <Text
              style={[
                estilos.textoSecundario,
                { color: textoSecundario, marginTop: 16 },
              ]}
            >
              Aún no tienes compras registradas en este dispositivo.
            </Text>
          )}

          {!cargando &&
            compras.map((p) => {
              const id = p._id || p.id || "—";

              // Evento asociado (si viene en la compra)
              const nombreEvento =
                p.event?.name || p.event_name || "Evento sin nombre";

              let fechaCompra = "";
              if (p.created_at) {
                try {
                  fechaCompra = new Date(p.created_at).toLocaleString(
                    "es-CL",
                    {
                      dateStyle: "short",
                      timeStyle: "short",
                    }
                  );
                } catch {
                  fechaCompra = p.created_at;
                }
              }

              const estado = p.status || "CONFIRMED";
              let etiquetaEstado = estado;
              if (estado === "PENDING") etiquetaEstado = "Pendiente";
              if (estado === "CONFIRMED") etiquetaEstado = "Confirmada";

              const total =
                p.total_price ??
                (Array.isArray(p.items)
                  ? p.items.reduce(
                      (acc, it) => acc + Number(it.subtotal || 0),
                      0
                    )
                  : 0);

              const tickets = Array.isArray(p.tickets)
                ? p.tickets
                : Array.isArray(p.items)
                ? p.items
                : [];

              return (
                <View
                  key={id}
                  style={[
                    estilos.tarjeta,
                    { backgroundColor: tarjeta, borderColor: borde },
                  ]}
                >
                  <Text
                    style={[
                      estilos.subtitulo,
                      { color: textoPrincipal },
                    ]}
                  >
                    Compra #{p.nro_compra || id}
                  </Text>

                  <Text
                    style={[
                      estilos.textoSecundario,
                      { color: textoSecundario },
                    ]}
                  >
                    Evento:{" "}
                    <Text
                      style={{
                        fontWeight: "600",
                        color: textoPrincipal,
                      }}
                    >
                      {nombreEvento}
                    </Text>
                  </Text>

                  {fechaCompra ? (
                    <Text
                      style={[
                        estilos.textoSecundario,
                        { color: textoSecundario },
                      ]}
                    >
                      Fecha compra: {fechaCompra}
                    </Text>
                  ) : null}

                  <Text
                    style={[
                      estilos.textoSecundario,
                      { color: textoSecundario },
                    ]}
                  >
                    Estado:{" "}
                    <Text
                      style={{
                        fontWeight: "600",
                        color: textoPrincipal,
                      }}
                    >
                      {etiquetaEstado}
                    </Text>
                  </Text>

                  <Text
                    style={[
                      estilos.textoTotal,
                      { color: textoPrincipal },
                    ]}
                  >
                    Total: {formatoCLP(total)}
                  </Text>

                  {tickets.length > 0 && (
                    <View style={{ marginTop: 8 }}>
                      <Text
                        style={[
                          estilos.textoSecundario,
                          {
                            color: textoSecundario,
                            marginBottom: 4,
                          },
                        ]}
                      >
                        Entradas:
                      </Text>
                      {tickets.map((t, idx) => (
                        <Text
                          key={t.code || `${id}-${idx}`}
                          style={[
                            estilos.textoEntrada,
                            { color: textoSecundario },
                          ]}
                        >
                          {t.type || t.ticket_type || "Entrada"} —{" "}
                          {t.code && (
                            <Text style={{ fontWeight: "600" }}>
                              Código: {t.code}
                            </Text>
                          )}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
              );
            })}
        </ScrollView>
      </View>

      <BottomMenu active="home" />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1 },
  scrollContenido: {
    padding: 16,
    paddingBottom: 24,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },
  centro: {
    marginTop: 24,
    alignItems: "center",
  },
  textoSecundario: {
    fontSize: 14,
  },
  tarjeta: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  textoTotal: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: "700",
  },
  textoEntrada: {
    fontSize: 13,
  },
});
