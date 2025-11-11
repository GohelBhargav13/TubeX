import axios from "axios"

export const api = axios.create({
    baseURL:"http://51.20.98.141:8080/api/v1",
    headers:{ "Content-Type":"application/json" },
    withCredentials:true
})