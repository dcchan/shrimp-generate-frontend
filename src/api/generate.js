import request from '@/utils/request';

// 5.4 任务-删除
export function taskRemove(data) {
    return request({ url: '/generate/task/remove', method: 'post', data });
}
// 5.1 任务-分页
export function taskPage(params) {
    return request({ url: '/generate/task/page', method: 'get', params });
}
// 5.2 任务-详情
export function taskInfo(params) {
    return request({ url: '/generate/task/info', method: 'get', params });
}
// 5.3 任务-保存
export function taskSave(data) {
    return request({ url: '/generate/task/save', method: 'post', data });
}
// null
export function genLogPage(params) {
    return request({ url: '/generate/gen/log/page', method: 'get', params });
}
// 3.2 模板-详情
export function templateInfo(params) {
    return request({ url: '/generate/template/info', method: 'get', params });
}
// 3.3 模板-保存
export function templateSave(data) {
    return request({ url: '/generate/template/save', method: 'post', data });
}
// 3.4 模板-删除
export function templateRemove(data) {
    return request({ url: '/generate/template/remove', method: 'post', data });
}
// 3.1 模板-分页
export function templatePage(data) {
    return request({ url: '/generate/template/page', method: 'post', data });
}
// 4.1 项目-分页
export function projectPage(params) {
    return request({ url: '/generate/project/page', method: 'get', params });
}
// 4.2 项目-详情
export function projectInfo(params) {
    return request({ url: '/generate/project/info', method: 'get', params });
}
// 4.3 项目-保存
export function projectSave(data) {
    return request({ url: '/generate/project/save', method: 'post', data });
}
// 4.4 项目-删除
export function projectRemove(data) {
    return request({ url: '/generate/project/remove', method: 'post', data });
}
// 1.0 login-图片验证码
export function publicCaptchaPicture(params) {
    return request({ url: '/generate/public/captcha/picture', method: 'get', params });
}
// 1.1 login-使用临时token登录
export function publicUserTokenLogin(params) {
    return request({ url: '/generate/public/user/token/login', method: 'get', params });
}
// 1.3 login-注册
export function publicUserRegister(data) {
    return request({ url: '/generate/public/user/register', method: 'post', data });
}
// 1.2 login-登录
export function publicUserLogin(data) {
    return request({ url: '/generate/public/user/login', method: 'post', data });
}
// 1.3 login-用户基本信息
export function persionalUserInfo(params) {
    return request({ url: '/generate/persional/user/info', method: 'get', params });
}
// 2.2 数据库-保存
export function databaseSave(data) {
    return request({ url: '/generate/database/save', method: 'post', data });
}
// 2.3 数据库-删除
export function databaseRemove(data) {
    return request({ url: '/generate/database/remove', method: 'post', data });
}
// 2.0 数据库-分页
export function databasePage(params) {
    return request({ url: '/generate/database/page', method: 'get', params });
}
// 2.1 数据库-详情
export function databaseInfo(params) {
    return request({ url: '/generate/database/info', method: 'get', params });
}
export function databaseList(params) {
    return request({ url: '/generate/database/list', method: 'get', params });
}
// 2.4 数据库-连接测试
export function databaseTest(data) {
    return request({ url: '/generate/database/test', method: 'post', data });
}
// 2.5 数据库-数据库表列表
export function databaseTables(params) {
    return request({ url: '/generate/database/tables', method: 'get', params });
}
// 2.6 数据库-数据表字段列表
export function databaseTableColumns(params) {
    return request({ url: '/generate/database/table/columns', method: 'get', params });
}
// 2.7 数据库-数据字段检测
export function databaseColumnChek(params) {
    return request({ url: '/generate/database/column/check', method: 'get', params });
}
// 6.1 变量-分页
export function variablesPage(params) {
    return request({ url: '/generate/variables/page', method: 'get', params });
}
// 6.2 变量-详情
export function variablesInfo(params) {
    return request({ url: '/generate/variables/info', method: 'get', params });
}
// 6.3 变量-保存
export function variablesSave(data) {
    return request({ url: '/generate/variables/save', method: 'post', data });
}
// 6.4 变量-删除
export function variablesRemove(data) {
    return request({ url: '/generate/variables/remove', method: 'post', data });
}
// null
export function casLoginLogPage(params) {
    return request({ url: '/generate/cas/login/log/page', method: 'get', params });
}
// null
export function casLoginLogLoginLogPage(params) {
    return request({ url: '/generate/cas/login/log/loginLogPage', method: 'get', params });
}
