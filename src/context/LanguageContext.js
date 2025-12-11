// src/context/LanguageContext.js
import React, {
  createContext,
  useContext,
  useState,
  useMemo,
} from "react";

// Diccionario con 5 idiomas: ES, EN, ZH, HI, AR
const dictionary = {
  // ======================= ESPAÑOL =======================
  es: {
    // ----- Menú inferior -----
    bottom_home: "Inicio",
    bottom_settings: "Ajustes",

    // ----- Home -----
    home_events_button: "Eventos",
    home_purchases_button: "Mis compras",
    home_search_placeholder: "Buscar eventos por nombre…",
    home_view_details: "Ver detalles",

      // Ajustes
  settings_title: "Ajustes",
  settings_dark_mode_label: "Modo oscuro",
  settings_dark_mode_desc: "Cambia entre modo claro y oscuro.",
  settings_language_label: "Idioma de la app",
  settings_subtitle: "Personaliza la apariencia y el idioma de TicketNow.",
  settings_language_help: "Elige el idioma en que prefieres ver la app.",
    // ----- Purchases -----
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

    // ----- Checkout -----
    checkout_title: "Checkout",
    checkout_summary_title: "Resumen de la reserva",
    checkout_status_label: "Estado",
    checkout_created_label: "Creada",
    checkout_valid_for_label: "Reserva válida por:",
    checkout_event_section_title: "Evento",
    checkout_tickets_section_title: "Entradas",
    checkout_total_label: "Total a pagar",
    checkout_buyer_title: "Datos del comprador",
    checkout_buyer_name_label: "Nombre y apellido",
    checkout_buyer_email_label: "Correo electrónico",
    checkout_buyer_note:
      "Usaremos este correo solo para enviarte el comprobante y las entradas.",
    checkout_button_confirm: "Confirmar compra",
    checkout_button_confirming: "Confirmando…",
    checkout_loading: "Cargando reserva…",
    checkout_not_found: "Reserva no encontrada.",
    checkout_expired_text:
      "La reserva expiró. Vuelve al listado de eventos y genera una nueva.",

    checkout_alert_success_title: "Compra confirmada",
    checkout_alert_success_body:
      "Te enviaremos las entradas al correo ingresado.",
    checkout_alert_error_title: "Error",
    checkout_alert_error_body_default:
      "No se pudo confirmar la compra.",
    checkout_alert_no_location_title: "Sin ubicación",
    checkout_alert_no_location_body:
      "Este evento no tiene una dirección configurada.",
    checkout_alert_openmaps_error_title: "Error",
    checkout_alert_openmaps_error_body:
      "No se pudo abrir Google Maps.",

    checkout_map_button: "Ver en el mapa",

    // ----- Event Detail -----
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

    event_detail_alert_select_one: "Selecciona al menos 1 entrada.",
    event_detail_alert_reservation_failed:
      "No se pudo crear la reserva.",

    event_detail_button_reserve: "Reservar entradas",
    event_detail_button_reserving: "Reservando…",
  },

  // ======================= INGLÉS =======================
  en: {
    bottom_home: "Home",
    bottom_settings: "Settings",

    home_events_button: "Events",
    home_purchases_button: "My purchases",
    home_search_placeholder: "Search events by name…",
    home_view_details: "View details",

   settings_title: "Settings",
  settings_dark_mode_label: "Dark mode",
  settings_dark_mode_desc: "Switch between light and dark mode.",
  settings_language_label: "App language",
  settings_subtitle: "Customize TicketNow’s appearance and language.",
  settings_language_help: "Choose the language you prefer for the app.",


    purchases_title: "My purchases",
    purchases_subtitle:
      "See the history of reservations and tickets made on this device.",
    purchases_loading: "Loading purchases…",
    purchases_empty: "You don't have any purchases on this device yet.",
    purchases_card_prefix: "Purchase",
    purchases_event_label: "Event:",
    purchases_status_label: "Status:",
    purchases_total_label: "Total:",

    checkout_title: "Checkout",
    checkout_summary_title: "Reservation summary",
    checkout_status_label: "Status",
    checkout_created_label: "Created",
    checkout_valid_for_label: "Reservation valid for:",
    checkout_event_section_title: "Event",
    checkout_tickets_section_title: "Tickets",
    checkout_total_label: "Total to pay",
    checkout_buyer_title: "Buyer information",
    checkout_buyer_name_label: "Full name",
    checkout_buyer_email_label: "Email",
    checkout_buyer_note:
      "We will only use this email to send you the receipt and tickets.",
    checkout_button_confirm: "Confirm purchase",
    checkout_button_confirming: "Confirming…",
    checkout_loading: "Loading reservation…",
    checkout_not_found: "Reservation not found.",
    checkout_expired_text:
      "The reservation has expired. Go back to the events list and create a new one.",

    checkout_alert_success_title: "Purchase confirmed",
    checkout_alert_success_body:
      "We will send the tickets to the email you entered.",
    checkout_alert_error_title: "Error",
    checkout_alert_error_body_default:
      "Could not confirm the purchase.",
    checkout_alert_no_location_title: "No location",
    checkout_alert_no_location_body:
      "This event does not have a configured address.",
    checkout_alert_openmaps_error_title: "Error",
    checkout_alert_openmaps_error_body:
      "Could not open Google Maps.",

    checkout_map_button: "View on map",

    event_detail_no_id: "No event ID received.",
    event_detail_not_found: "Event not found.",

    event_detail_description_title: "Description",
    event_detail_description_fallback:
      "This event does not have a description yet.",
    event_detail_select_tickets: "Select your tickets",
    event_detail_no_tickets:
      "This event has no ticket types configured.",

    event_detail_total_tickets: "Total tickets",
    event_detail_total_to_pay: "Total to pay",

    event_detail_alert_select_one: "Please select at least 1 ticket.",
    event_detail_alert_reservation_failed:
      "Could not create the reservation.",

    event_detail_button_reserve: "Reserve tickets",
    event_detail_button_reserving: "Reserving…",
  },

  // ======================= CHINO (简体中文) =======================
  zh: {
    bottom_home: "首页",
    bottom_settings: "设置",

    home_events_button: "活动",
    home_purchases_button: "我的订单",
    home_search_placeholder: "按名称搜索活动…",
    home_view_details: "查看详情",

    settings_title: "设置",
  settings_dark_mode_label: "深色模式",
  settings_dark_mode_desc: "在浅色和深色模式之间切换。",
  settings_language_label: "应用语言",
  settings_subtitle: "自定义 TicketNow 的外观和语言。",
  settings_language_help: "选择你希望在应用中看到的语言。",

    purchases_title: "我的订单",
    purchases_subtitle: "查看在此设备上完成的预订和门票记录。",
    purchases_loading: "正在加载订单…",
    purchases_empty: "此设备上还没有任何订单。",
    purchases_card_prefix: "订单",
    purchases_event_label: "活动：",
    purchases_status_label: "状态：",
    purchases_total_label: "总计：",

    checkout_title: "结账",
    checkout_summary_title: "预订摘要",
    checkout_status_label: "状态",
    checkout_created_label: "创建时间",
    checkout_valid_for_label: "预订有效期：",
    checkout_event_section_title: "活动",
    checkout_tickets_section_title: "门票",
    checkout_total_label: "应付总额",
    checkout_buyer_title: "购买者信息",
    checkout_buyer_name_label: "姓名",
    checkout_buyer_email_label: "电子邮箱",
    checkout_buyer_note:
      "我们只会使用此邮箱向你发送收据和门票。",
    checkout_button_confirm: "确认购买",
    checkout_button_confirming: "正在确认…",
    checkout_loading: "正在加载预订…",
    checkout_not_found: "未找到预订。",
    checkout_expired_text:
      "预订已过期。请返回活动列表并创建新的预订。",

    checkout_alert_success_title: "购买已确认",
    checkout_alert_success_body:
      "我们会将门票发送到你填写的邮箱。",
    checkout_alert_error_title: "错误",
    checkout_alert_error_body_default: "无法确认购买。",
    checkout_alert_no_location_title: "无位置信息",
    checkout_alert_no_location_body:
      "此活动没有配置地址。",
    checkout_alert_openmaps_error_title: "错误",
    checkout_alert_openmaps_error_body:
      "无法打开 Google 地图。",

    checkout_map_button: "在地图中查看",

    event_detail_no_id: "未收到活动 ID。",
    event_detail_not_found: "未找到该活动。",

    event_detail_description_title: "说明",
    event_detail_description_fallback:
      "此活动尚无说明。",
    event_detail_select_tickets: "选择你的门票",
    event_detail_no_tickets: "此活动还没有配置门票类型。",

    event_detail_total_tickets: "门票总数",
    event_detail_total_to_pay: "需支付总额",

    event_detail_alert_select_one: "请至少选择一张门票。",
    event_detail_alert_reservation_failed: "无法创建预订。",

    event_detail_button_reserve: "预订门票",
    event_detail_button_reserving: "正在预订…",
  },

  // ======================= HINDI (हिन्दी) =======================
  hi: {
    bottom_home: "होम",
    bottom_settings: "सेटिंग्स",

    home_events_button: "इवेंट",
    home_purchases_button: "मेरी खरीदें",
    home_search_placeholder: "नाम से इवेंट खोजें…",
    home_view_details: "विवरण देखें",

    settings_title: "सेटिंग्स",
  settings_dark_mode_label: "डार्क मोड",
  settings_dark_mode_desc: "लाइट और डार्क मोड के बीच बदलें।",
  settings_language_label: "ऐप की भाषा",
  settings_subtitle: "TicketNow की रूप-रंग और भाषा को अनुकूलित करें।",
  settings_language_help: "वह भाषा चुनें जिसमें आप ऐप देखना चाहते हैं।",


    purchases_title: "मेरी खरीदें",
    purchases_subtitle:
      "इस डिवाइस पर की गई बुकिंग और टिकटों का इतिहास देखें।",
    purchases_loading: "खरीदें लोड हो रही हैं…",
    purchases_empty:
      "इस डिवाइस पर अभी तक कोई खरीद दर्ज नहीं है।",
    purchases_card_prefix: "खरीद",
    purchases_event_label: "इवेंट:",
    purchases_status_label: "स्थिति:",
    purchases_total_label: "कुल:",

    checkout_title: "चेकआउट",
    checkout_summary_title: "आरक्षण सारांश",
    checkout_status_label: "स्थिति",
    checkout_created_label: "बनाया गया",
    checkout_valid_for_label: "आरक्षण मान्य है:",
    checkout_event_section_title: "इवेंट",
    checkout_tickets_section_title: "टिकट",
    checkout_total_label: "कुल भुगतान",
    checkout_buyer_title: "खरीदार की जानकारी",
    checkout_buyer_name_label: "पूरा नाम",
    checkout_buyer_email_label: "ईमेल",
    checkout_buyer_note:
      "हम इस ईमेल का उपयोग केवल रसीद और टिकट भेजने के लिए करेंगे।",
    checkout_button_confirm: "खरीद की पुष्टि करें",
    checkout_button_confirming: "पुष्टि हो रही है…",
    checkout_loading: "आरक्षण लोड हो रहा है…",
    checkout_not_found: "आरक्षण नहीं मिला।",
    checkout_expired_text:
      "आरक्षण की समय सीमा समाप्त हो गई है। इवेंट सूची पर वापस जाएँ और नया बनाएँ।",

    checkout_alert_success_title: "खरीद की पुष्टि हो गई",
    checkout_alert_success_body:
      "हम टिकट आपके दिए गए ईमेल पर भेजेंगे।",
    checkout_alert_error_title: "त्रुटि",
    checkout_alert_error_body_default:
      "खरीद की पुष्टि नहीं हो सकी।",
    checkout_alert_no_location_title: "स्थान उपलब्ध नहीं",
    checkout_alert_no_location_body:
      "इस इवेंट के लिए पता कॉन्फ़िगर नहीं किया गया है।",
    checkout_alert_openmaps_error_title: "त्रुटि",
    checkout_alert_openmaps_error_body:
      "Google Maps नहीं खोला जा सका।",

    checkout_map_button: "मैप में देखें",

    event_detail_no_id: "इवेंट ID प्राप्त नहीं हुआ।",
    event_detail_not_found: "इवेंट नहीं मिला।",

    event_detail_description_title: "विवरण",
    event_detail_description_fallback:
      "इस इवेंट के लिए अभी कोई विवरण उपलब्ध नहीं है।",
    event_detail_select_tickets: "अपने टिकट चुनें",
    event_detail_no_tickets:
      "इस इवेंट के लिए टिकट प्रकार कॉन्फ़िगर नहीं हैं।",

    event_detail_total_tickets: "कुल टिकट",
    event_detail_total_to_pay: "कुल भुगतान",

    event_detail_alert_select_one: "कम से कम 1 टिकट चुनें।",
    event_detail_alert_reservation_failed:
      "आरक्षण नहीं बनाया जा सका।",

    event_detail_button_reserve: "टिकट बुक करें",
    event_detail_button_reserving: "बुकिंग हो रही है…",
  },

  // ======================= ÁRABE (العربية) =======================
  ar: {
    bottom_home: "الرئيسية",
    bottom_settings: "الإعدادات",

    home_events_button: "الفعاليات",
    home_purchases_button: "مشترياتي",
    home_search_placeholder: "ابحث عن الفعاليات بالاسم…",
    home_view_details: "عرض التفاصيل",

     settings_title: "الإعدادات",
  settings_dark_mode_label: "الوضع الداكن",
  settings_dark_mode_desc: "التبديل بين الوضع الفاتح والداكن.",
  settings_language_label: "لغة التطبيق",
  settings_subtitle: "خصّص مظهر TicketNow ولغته.",
  settings_language_help: "اختر اللغة التي تفضّلها لعرض التطبيق.",


    purchases_title: "مشترياتي",
    purchases_subtitle:
      "استعرض سجل الحجوزات والتذاكر التي تمت على هذا الجهاز.",
    purchases_loading: "جارٍ تحميل المشتريات…",
    purchases_empty:
      "لا توجد أي مشتريات مسجلة على هذا الجهاز بعد.",
    purchases_card_prefix: "عملية شراء",
    purchases_event_label: "الفعالية:",
    purchases_status_label: "الحالة:",
    purchases_total_label: "الإجمالي:",

    checkout_title: "إتمام الشراء",
    checkout_summary_title: "ملخص الحجز",
    checkout_status_label: "الحالة",
    checkout_created_label: "تاريخ الإنشاء",
    checkout_valid_for_label: "الحجز صالح لمدة:",
    checkout_event_section_title: "الفعالية",
    checkout_tickets_section_title: "التذاكر",
    checkout_total_label: "الإجمالي المستحق",
    checkout_buyer_title: "بيانات المشتري",
    checkout_buyer_name_label: "الاسم الكامل",
    checkout_buyer_email_label: "البريد الإلكتروني",
    checkout_buyer_note:
      "سنستخدم هذا البريد فقط لإرسال الإيصال والتذاكر.",
    checkout_button_confirm: "تأكيد الشراء",
    checkout_button_confirming: "جارٍ التأكيد…",
    checkout_loading: "جارٍ تحميل الحجز…",
    checkout_not_found: "لم يتم العثور على الحجز.",
    checkout_expired_text:
      "انتهت صلاحية الحجز. عد إلى قائمة الفعاليات وأنشئ حجزاً جديداً.",

    checkout_alert_success_title: "تم تأكيد الشراء",
    checkout_alert_success_body:
      "سنرسل التذاكر إلى البريد الذي أدخلته.",
    checkout_alert_error_title: "خطأ",
    checkout_alert_error_body_default:
      "تعذر تأكيد عملية الشراء.",
    checkout_alert_no_location_title: "لا يوجد عنوان",
    checkout_alert_no_location_body:
      "لا تحتوي هذه الفعالية على عنوان مُحدد.",
    checkout_alert_openmaps_error_title: "خطأ",
    checkout_alert_openmaps_error_body:
      "تعذر فتح خرائط Google.",

    checkout_map_button: "عرض على الخريطة",

    event_detail_no_id: "لم يتم استلام معرّف الحدث.",
    event_detail_not_found: "لم يتم العثور على الحدث.",

    event_detail_description_title: "الوصف",
    event_detail_description_fallback:
      "لا يوجد وصف لهذا الحدث حتى الآن.",
    event_detail_select_tickets: "اختر تذاكرك",
    event_detail_no_tickets:
      "لا توجد أنواع تذاكر مُكوَّنة لهذا الحدث.",

    event_detail_total_tickets: "إجمالي التذاكر",
    event_detail_total_to_pay: "الإجمالي للدفع",

    event_detail_alert_select_one: "اختر تذكرة واحدة على الأقل.",
    event_detail_alert_reservation_failed:
      "تعذر إنشاء الحجز.",

    event_detail_button_reserve: "حجز التذاكر",
    event_detail_button_reserving: "جارٍ الحجز…",
  },
};

// -------- Contexto e hooks --------
const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  // idioma por defecto: español
  const [language, setLanguage] = useState("es");

  const value = useMemo(() => {
    const t = (key) => {
      const table = dictionary[language] || dictionary.es;
      // si no existe en el idioma actual, intenta en español y luego devuelve la clave
      return table[key] ?? dictionary.es[key] ?? key;
    };

    const changeLanguage = (langCode) => {
      if (dictionary[langCode]) {
        setLanguage(langCode);
      }
    };

    const availableLanguages = [
      { code: "es", label: "Español" },
      { code: "en", label: "English" },
      { code: "zh", label: "中文 (简体)" },
      { code: "hi", label: "हिन्दी" },
      { code: "ar", label: "العربية" },
    ];

    return { language, changeLanguage, t, availableLanguages };
  }, [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage debe usarse dentro de LanguageProvider");
  }
  return ctx;
}
