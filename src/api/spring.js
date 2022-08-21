import request from '@/utils/request'

// 3. 接口代码3
export function apisCodeV3(params) {
    return request({ url: '/spring/apis/code/v3', method: 'get', params });
}
