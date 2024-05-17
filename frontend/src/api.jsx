import axios from "axios"

const tokens = JSON.parse(localStorage.getItem('authTokens'));
const accessToken = tokens ? tokens.access : null

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Authorization': accessToken ? `Bearer ${accessToken}` : null
    }
});

export default api;
