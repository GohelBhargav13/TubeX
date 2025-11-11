import axios from "axios"

export const api = axios.create({
    baseURL:"https://tubex-m576.onrender.com:8080/api/v1",
    headers:{ "Content-Type":"application/json" },
    withCredentials:true
})