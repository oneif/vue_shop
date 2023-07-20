import request from "@/utils/request";

export function getMenusList() {
    return request({
        method:'GET',
        url:'/menus'
    })
}