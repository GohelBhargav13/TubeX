import axios from "axios"

export const api = axios.create({
    baseURL:"http://13.51.106.105:8080/api/v1",
    headers:{ "Content-Type":"application/json" },
    withCredentials:true
})