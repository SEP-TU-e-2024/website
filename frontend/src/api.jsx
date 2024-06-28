import axios from "axios"

// Function to get the access token from localStorage
export const getAccessToken = () => {
    const tokens = JSON.parse(localStorage.getItem('authTokens'));
    return tokens ? tokens.access : null;
};

// Create an axios instance
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// Add a request interceptor to include the Authorization header
api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
