import axios from "axios";


const API = axios.create({
    baseURL: "http://localhost:5000/api"
});

//Attach token automatically 
API.interceptors.request.use((req) =>{
    const token = localStorage.getItem("token");
    console.log("TOKEN:", token);
    if(token){
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;