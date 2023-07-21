import request from '@/utils/request'

export function getRightsList(){
    return request({
        method:'GET',
        url:'/rights/list'
    })
}
export function getRightsTree(){
    return request({
        method:'GET',
        url:'/rights/tree'
    })
}