import axios from 'axios';   // Import axios to make API calls

// Create an Axios instance with a base URL
const api = axios.create({
  baseURL: 'http://localhost:8000/api/',  // Every request will start with this URL
});

// Add a request interceptor (runs before every API request)
api.interceptors.request.use(config => {

    const token = localStorage.getItem('ACCESS_TOKEN');  
    // Get the saved login token from localStorage

    if (token) {
        config.headers.Authorization = `Token ${token}`;  
        // If token exists → attach it in the request header
        // This tells the backend which user is making the request
    }

    return config;  // Continue the request normally

}, error => {
    return Promise.reject(error); // If something goes wrong, show the error
});

export default api;   // Export this API instance so other files can use it
