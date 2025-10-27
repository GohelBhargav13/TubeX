import axios from "axios"

export const api = axios.create({
    baseURL:"https://tubex-ee5q.onrender.com/api/v1",
    headers:{ "Content-Type":"application/json" },
    withCredentials:true
})