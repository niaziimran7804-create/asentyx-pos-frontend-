/**
 * API Configuration
 *
 * Direct connection to local backend server
 * Make sure your backend is running on http://localhost:7000
 *
 * For production, update baseUrl to your production API endpoint
 */
const resolveBaseUrl = () => {
    // In dev (served on localhost) use the Angular proxy (`/api`) so CORS isn't required locally.
    try {
        if (typeof window !== 'undefined') {
            const host = window.location.hostname;
            if (host === 'localhost' || host === '127.0.0.1') {
                return '/api';
            }
        }
    }
    catch (e) {
        // ignore
    }
    // In production, point to the production API domain (Vercel frontend -> backend on asentyx.com:5000)
    return 'http://ec2-51-20-41-144.eu-north-1.compute.amazonaws.com:5000/api';
};
export const API_CONFIG = {
    baseUrl: resolveBaseUrl()
};
//# sourceMappingURL=api.config.js.map