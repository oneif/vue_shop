import request from '@/utils/request'

export function getRolesList(){
    return request({
        method:'GET',
        url:'/roles'
    })
}
export function removeRightById(roleId,rightId){
    return request({
        method:'DELETE',
        url:`/roles/${roleId}/rights/${rightId}`
    })
}
export function addRightById(roleId,params){
    return request({
        method:'POST',
        url:`/roles/${roleId}/rights`,
        data:params
    })
}