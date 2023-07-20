import axios from "axios";

const baseAxios = axios.create({
    baseURL: 'http://127.0.0.1:8888/api/private/v1',
    timeout: 5000,
})
// 配置请求拦截器 主要用于为请求头加一个Authorization字段
baseAxios.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})

// 配置响应拦截器 
baseAxios.interceptors.response.use(resp => {
    return resp.data
}, err => {
    console.log("errrrrrrrrrrrrrrr");
    return Promise.reject(err)
})
export default baseAxios