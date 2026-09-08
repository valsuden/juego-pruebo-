// =============================================================================
// CONFIGURACIÓN GLOBAL
// =============================================================================

const CONFIG = {
    // 1. URLs de las 3 APIs (Google Apps Script Deployments)
    API_URL: "https://script.google.com/macros/s/AKfycbw77UBbMpDOm939suu_AbseJ2jENBNtBJ8qPNUTQmcq8HsVlbJ-E6TXyU0jJ3Qo06M/exec",
    CODES_API_URL: "https://script.google.com/macros/s/AKfycbxLIusqw2MWtlD5W8GlLC5xfSF-gMRHor1_jFA094bVHI2NVZC9VCBjmdRptb-LMcA1/exec",
    NOTES_API_URL: "https://script.google.com/macros/s/AKfycbzvzZttlodHJ1VB67GvBoH4fsZhHF01ee1n2HJjiXao8-0MXrZMo4SvA4sfxzGIe3FE/exec",

    // Tiempos de Sincronización
    SYNC_INTERVAL: 30000, // 30 segundos (Polling inteligente para Notas y Códigos)

    SECURITY_SALT_COINS: "ArcaneMastery2026_X",
    SECURITY_SALT_STORAGE: "tom_secure_salt_2026_X",
    SECURITY_SALT_API: "trialsofmastery2025",

    ADMIN_PASSWORD_HASH: "92115aa11c4ebbd8547544c0d18015d06f5787e79e89936805cb110403725f7e"
};
// =============================================================================
// MODO DE PRUEBAS DEL DOCENTE
// true  = monedas llenas al abrir la tienda + todas las runas disponibles
// false = juego normal (SIEMPRE dejarlo en false antes de subir los archivos)
// =============================================================================
const TEST_MODE = false;
window.TEST_MODE = TEST_MODE;
window.CONFIG = CONFIG;
console.log("⚙️ Configuración global cargada.");
