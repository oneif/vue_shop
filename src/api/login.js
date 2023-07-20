import request from "@/utils/request";

export function login(params = {username, password}) {
    return request({
        method: 'POST',
        url: '/login',
        params
    })
}