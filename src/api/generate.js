import request from '@/utils/request'

// 登录方法
export function publicUserLogin(data) {
    return request({url: '/public/user/login', method: 'post', data: data});
}


