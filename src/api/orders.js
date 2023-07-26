import request from "@/utils/request"

export function getOrders (params) {
    return request({
        method: "get",
        url: "/orders",
        params
    })
}
