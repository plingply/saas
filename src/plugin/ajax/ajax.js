import axios from 'axios';
import _alert from "../alert/index"
let Promise = require('es6-promise').Promise;

const Axios = axios.create({
    baseURL: $config.baseURL,
    timeout: 5000,
    withCredentials: true, //带上 cookie
})

//添加一个请求拦截器
Axios.interceptors.request.use(config => {
    //POST传参序列化
    if (config.method === 'post') {
        config.hideError = config.data ? config.data.hideError : false
        // 数据序列化成表单
        if (config.data && config.data.data) {
            const formData = new FormData()
            Object.keys(config.data.data).forEach(key => formData.append(key, config.data.data[key]))
            config.data = formData
        }
    }

    if (config.method === 'put' || config.method == 'delete') {
        let url = ''
        for (let key in config.data) {
            url += key + '=' + config.data[key] + '&'
        }
        url = url.slice(0, url.length - 1)
        config.data = url
    }

    if (config.method === 'get' && config.url.indexOf('/api/') != -1 && config.data) {
        let url = '?'
        for (let key in config.data) {
            url += key + '=' + config.data[key] + '&'
        }
        url = url.slice(0, url.length - 1)
        config.url += url
    }
    return config
}, error => {
    return Promise.reject(error)
})

//添加一个返回拦截器
Axios.interceptors.response.use(res => {
    const { data } = res
    if (data.code == '1') {
        return data
    } else {
        //处理错误
        _alert.alert({
            type: 'warning',
            msg: data.msg
        });
    }

    return data
}, error => {
    return Promise.reject(error)
})

export default Axios