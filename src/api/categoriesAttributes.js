import request from "@/utils/request"

export function getCategoryAttributes (id, params) {
    return request({
        url: `/categories/${id}/attributes`,
        method: "get",
        params
    })
}
export function addAttribute (id, params) {
    return request({
        url: `/categories/${id}/attributes`,
        method: "post",
        data: params
    })
}
export function editAttribute (obj) {
    return request({
        url: `/categories/${obj.cat_id}/attributes/${obj.attr_id}`,
        method: "put",
        data: { attr_name: obj.attr_name, attr_sel: obj.attr_sel, attr_vals: obj.attr_vals }
    })
}
export function deleteAttribute (catId, attrId) {
    return request({
        url: `/categories/${catId}/attributes/${catId}`,
        method: "delete"
    })
}
