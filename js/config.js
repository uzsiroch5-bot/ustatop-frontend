const BACKEND_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:5000' 
    : 'https://ustatop-flkg.onrender.com';

const API_URL = `${BACKEND_URL}/api`;

// Export for modules if needed, or just stay global for simple HTML includes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BACKEND_URL, API_URL };
}
