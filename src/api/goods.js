import request from "@/utils/request"

export function getGoodsList (params) {
    return request({
        method: "get",
        url: "/goods",
        params
    })
}
export function deleteGoodById (id) {
    return request({
        method: "delete",
        url: "/goods/" + id
    })
}
export function addGood (data) {
    return request({
        method: "post",
        url: "/goods",
        data
    })
}
