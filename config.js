// API base URL. Override in production by editing this file at deploy time,
// or by defining window.__HAUQUIMIA_API_URL__ before this script runs.
window.HAUQUIMIA_CONFIG = {
  apiBaseUrl:
    window.__HAUQUIMIA_API_URL__ ||
    (location.hostname === 'localhost' || location.hostname === '127.0.0.1'
      ? 'http://localhost:3001'
      : 'https://api.hauquimia.com.br'),
  whatsappNumber: '5531990621354',
};
