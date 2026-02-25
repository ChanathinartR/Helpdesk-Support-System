import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api', // URL ของ Backend
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// เราสามารถใส่ Interceptor เพื่อดักจับ Error ส่วนกลางได้ที่นี่
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API Error:", error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default axiosInstance;