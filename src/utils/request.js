import axios from "axios"
import nProgress from "nprogress"
import "nprogress/nprogress.css"

const baseAxios = axios.create({
    baseURL: "http://127.0.0.1:8888/api/private/v1",
    timeout: 5000
})
// 配置请求拦截器 主要用于为请求头加一个Authorization字段
baseAxios.interceptors.request.use(config => {
    nProgress.start()
    config.headers.Authorization = window.sessionStorage.getItem("token")
    return config
})

// 配置响应拦截器
baseAxios.interceptors.response.use(resp => {
    nProgress.done()
    return resp.data
}, err => {
    return Promise.reject(err)
})
export default baseAxios
