import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.CREATORAPI, // Define your base URL
    timeout: 5000, // Set a timeout (5 seconds)
    headers: {
        'Content-Type': 'application/json', // Default content type for requests
    },
});



export default axiosInstance;