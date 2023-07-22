import request from '@/utils/request'

export function getCategoriesList(params) {
    return request({
        method: 'GET',
        url: '/categories',
        // params: params
    })
}