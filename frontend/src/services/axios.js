import axios from "axios"

const API_BASE = import.meta.env.DEV
  ? "http://localhost:8080/api/v1"
  : "https://tubex-m576.onrender.com/api/v1";

export const api = axios.create({
    baseURL:API_BASE,
    headers:{"Content-Type":"application/json"},
    timeout:60000,
    withCredentials:true
})