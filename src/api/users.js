import request from '@/utils/request'

export function getUserLists(params){
    return request({
        method:'GET',
        url:'/users',
        params: params
    })
}
export function changeUserState(uid,type){
    return request({
        method:'PUT',
        url:`/users/${uid}/state/${type}`
    })
}
export function addUser(params){
    return request({
        method:'POST',
        url:'/users',
        data: params
    })
}
export function getUserById(id){
    return request({
        method:'GET',
        url:`/users/${id}`
    })
}
export function editUser(id,params){
    return request({
        method:'PUT',
        url:`/users/${id}`,
        data:params
    })
}
export function deleteUserById(id){
    return request({
        method:'DELETE',
        url:`/users/${id}`,
    })
}