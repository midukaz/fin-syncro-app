const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/api', // Substitua pela URL da sua API
  });
  
  export default axiosInstance;