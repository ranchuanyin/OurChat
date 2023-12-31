import axios from "axios"
import {ElMessage} from "element-plus";


const defaultError = () => ElMessage.error('发生了一些错误，请联系管理员')
const defaultFailure = (message) => {
    ElMessage.warning(message)
}

function post(url, data, success, failure = defaultFailure, error = defaultError) {
    axios.post(url, data, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        withCredentials: true
    }).then(({data}) => {
        if (data.success)
            success(data, data.status)
        else
            failure(data, data.status)
    }).catch(error)
}

function postJson(url, data, success, failure = defaultFailure, error = defaultError) {
    axios.post(url, data, {
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true
    }).then(({data}) => {
        if (data.success)
            success(data, data.status)
        else
            failure(data, data.status)
    }).catch(error)
}

function postImage(url, data, success, failure = defaultFailure, error = defaultError) {
    axios.post(url, data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
    }).then(({data}) => {
        if (data.success)
            success(data, data.status)
        else
            failure(data, data.status)
    }).catch(error)
}

function get(url, success, failure = defaultFailure, error = defaultError) {
    axios.get(url, {
        withCredentials: true
    }).then(({data}) => {
        if (data.success)
            success(data, data.status)
        else
            failure(data, data.status)
    }).catch(error)
}

export {get, post, postJson}