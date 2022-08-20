import request from '@/utils/request'

// 登录方法
export function publicUserLogin(data) {
    return request({url: '/public/user/login', method: 'post', data});
}

export function persionalUserInfo() {
    return request({url: '/persional/user/info', method: 'get'});
}

// 数据源
export function databasePage(params) {
    return request({url: '/database/page', method: 'get', params});
}
export function databaseInfo(params) {
    return request({url: '/database/info', method: 'get', params});
}
export function databaseSave(data) {
    return request({url: '/database/save', method: 'post', data});
}
export function databaseRemove(data) {
    return request({url: '/database/remove', method: 'post', data});
}
