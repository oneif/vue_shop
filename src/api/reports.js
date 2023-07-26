import request from "@/utils/request"

export function getReports () {
    return request({
        method: "get",
        url: "/reports/type/1"
    })
}
