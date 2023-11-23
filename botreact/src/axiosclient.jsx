import axios from "axios"
console.log(process.env);
const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL
    // baseURL:"http://192.168.237.14:8000/quiz"
})
export default axiosClient