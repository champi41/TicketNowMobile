// src/context/LanguageContext.js
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LanguageContext = createContext();

// Diccionario de traducciones
const TRANSLATIONS = {
  es: {
    bottom_home: "Inicio",
    bottom_settings: "Ajustes",
    // --- Ajustes ---
    settings_title: "Ajustes",
    settings_subtitle:
      "Personaliza la apariencia y el idioma de TicketNow.",
    settings_appearance: "Apariencia",
    settings_dark_mode: "Modo oscuro",
    settings_dark_mode_desc: "Cambia entre modo claro y oscuro.",
    settings_language_section: "Idioma",
    settings_language_label: "Idioma de la app",
    settings_language_desc: "Selecciona entre Español e Inglés.",
     // --- Event Detail ---
    event_detail_no_id: "No se recibió el ID del evento.",
    event_detail_not_found: "No se encontró el evento.",
    event_detail_description_title: "Descripción",
    event_detail_description_fallback:
      "Este evento aún no tiene descripción.",
    event_detail_select_tickets: "Selecciona tus entradas",
    event_detail_no_tickets:
      "Este evento no tiene tipos de entradas configurados.",
    event_detail_total_tickets: "Total entradas",
    event_detail_total_to_pay: "Total a pagar",
    event_detail_button_reserve: "Reservar entradas",
    event_detail_button_reserving: "Reservando...",
    event_detail_alert_select_one: "Selecciona al menos 1 entrada.",
    event_detail_alert_reservation_failed:
      "No se pudo crear la reserva.",

    // --- Checkout ---
    checkout_title: "Checkout",
    checkout_loading: "Cargando reserva…",
    checkout_not_found: "Reserva no encontrada.",
    checkout_summary_title: "Resumen de la reserva",
    checkout_status_label: "Estado:",
    checkout_created_label: "Creada:",
    checkout_valid_for_label: "Reserva válida por:",
    checkout_expired_text:
      "La reserva expiró. Vuelve al listado de eventos y genera una nueva.",
    checkout_event_section_title: "Evento",
    checkout_tickets_section_title: "Entradas",
    checkout_total_label: "Total a pagar",
    checkout_buyer_title: "Datos del comprador",
    checkout_buyer_name_label: "Nombre y apellido",
    checkout_buyer_email_label: "Correo electrónico",
    checkout_buyer_note:
      "Usaremos este correo solo para enviarte el comprobante y las entradas. Revisa también tu carpeta de spam.",
    checkout_map_button: "Ver en el mapa",
    checkout_button_confirm: "Confirmar compra",
    checkout_button_confirming: "Confirmando…",
    checkout_alert_no_location_title: "Sin ubicación",
    checkout_alert_no_location_body:
      "Este evento no tiene una dirección configurada.",
    checkout_alert_openmaps_error_title: "Error",
    checkout_alert_openmaps_error_body:
      "No se pudo abrir Google Maps.",
    checkout_alert_success_title: "Compra confirmada",
    checkout_alert_success_body:
      "Te enviaremos las entradas al correo ingresado.",
    checkout_alert_error_title: "Error",
    checkout_alert_error_body_default:
      "No se pudo confirmar la compra.",

    // --- Purchases ---
    purchases_title: "Mis compras",
    purchases_subtitle:
      "Revisa el historial de tus reservas y entradas realizadas en este dispositivo.",
    purchases_loading: "Cargando compras…",
    purchases_empty:
      "Aún no tienes compras registradas en este dispositivo.",
    purchases_card_prefix: "Compra",
    purchases_event_label: "Evento:",
    purchases_status_label: "Estado:",
    purchases_total_label: "Total:",
    // --- Home ---
    home_events_button: "Eventos",
    home_purchases_button: "Compras",
    home_search_placeholder: "Buscar evento...",
    home_view_details: "Ver detalles del evento",

    // --- Historial de compras ---
    purchases_title: "Mis compras",
    purchases_subtitle:
      "Revisa el historial de tus reservas y entradas realizadas en este dispositivo.",

    
  },
  
  en: {
     bottom_home: "Home",
    bottom_settings: "Settings",
    // --- Settings ---
    settings_title: "Settings",
    settings_subtitle:
      "Customize TicketNow appearance and language.",
    settings_appearance: "Appearance",
    settings_dark_mode: "Dark mode",
    settings_dark_mode_desc: "Switch between light and dark mode.",
    settings_language_section: "Language",
    settings_language_label: "App language",
    settings_language_desc: "Select between Spanish and English.",
     // --- Event Detail ---
    event_detail_no_id: "No event ID was provided.",
    event_detail_not_found: "Event not found.",
    event_detail_description_title: "Description",
    event_detail_description_fallback:
      "This event does not have a description yet.",
    event_detail_select_tickets: "Select your tickets",
    event_detail_no_tickets:
      "This event has no ticket types configured.",
    event_detail_total_tickets: "Total tickets",
    event_detail_total_to_pay: "Total to pay",
    event_detail_button_reserve: "Reserve tickets",
    event_detail_button_reserving: "Reserving...",
    event_detail_alert_select_one: "Select at least one ticket.",
    event_detail_alert_reservation_failed:
      "Could not create the reservation.",

    // --- Checkout ---
    checkout_title: "Checkout",
    checkout_loading: "Loading reservation…",
    checkout_not_found: "Reservation not found.",
    checkout_summary_title: "Reservation summary",
    checkout_status_label: "Status:",
    checkout_created_label: "Created:",
    checkout_valid_for_label: "Reservation valid for:",
    checkout_expired_text:
      "The reservation has expired. Go back to the events list and create a new one.",
    checkout_event_section_title: "Event",
    checkout_tickets_section_title: "Tickets",
    checkout_total_label: "Total to pay",
    checkout_buyer_title: "Buyer details",
    checkout_buyer_name_label: "Full name",
    checkout_buyer_email_label: "Email",
    checkout_buyer_note:
      "We'll use this email only to send you your receipt and tickets. Also check your spam folder.",
    checkout_map_button: "View on map",
    checkout_button_confirm: "Confirm purchase",
    checkout_button_confirming: "Confirming…",
    checkout_alert_no_location_title: "No location",
    checkout_alert_no_location_body:
      "This event has no configured address.",
    checkout_alert_openmaps_error_title: "Error",
    checkout_alert_openmaps_error_body:
      "Could not open Google Maps.",
    checkout_alert_success_title: "Purchase confirmed",
    checkout_alert_success_body:
      "We'll send the tickets to the email you provided.",
    checkout_alert_error_title: "Error",
    checkout_alert_error_body_default:
      "Could not confirm the purchase.",

    // --- Purchases ---
    purchases_title: "My purchases",
    purchases_subtitle:
      "Check the history of your bookings and tickets on this device.",
    purchases_loading: "Loading purchases…",
    purchases_empty:
      "You don't have any purchases registered on this device yet.",
    purchases_card_prefix: "Purchase",
    purchases_event_label: "Event:",
    purchases_status_label: "Status:",
    purchases_total_label: "Total:",

    // --- Home ---
    home_events_button: "Events",
    home_purchases_button: "Purchases",
    home_search_placeholder: "Search event...",
    home_view_details: "View event details",

    // --- Purchases history ---
    purchases_title: "My purchases",
    purchases_subtitle:
      "Check the history of your bookings and tickets on this device.",
  },
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("es");

  // Cargar idioma guardado al iniciar la app
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem("app_language");
        if (saved === "es" || saved === "en") {
          setLanguage(saved);
        }
      } catch (e) {
        console.error("Error leyendo app_language", e);
      }
    })();
  }, []);

  // Guardar idioma cuando cambie
  useEffect(() => {
    AsyncStorage.setItem("app_language", language).catch(() => {});
  }, [language]);

  // Función de traducción
  const t = (key) => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.es;
    // devuelve primero del idioma actual, si no existe, del español, y si no, la clave
    return dict[key] || TRANSLATIONS.es[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error(
      "useLanguage debe usarse dentro de LanguageProvider"
    );
  }
  return ctx;
}
