import request from '@/utils/request'

export function publicCaptchaPicture(params) {
    return request({ url: '/sso/public/captcha/picture', method: 'get', params });
}
export function publicSsoLogin(data) {
    return request({ url: '/sso/public/sso/login', method: 'post', data });
}
export function publicSsoLogout() {
    return request({ url: '/sso/public/sso/logout', method: 'get'});
}
