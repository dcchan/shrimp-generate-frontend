import {publicSsoLogin} from '@/api/sso'
import {getToken, removeToken, setToken} from '@/utils/auth'
import {ElMessage} from "element-plus";
import {Base64} from "js-base64";

const useUserStore = defineStore(
  'user',
  {
    state: () => ({
      token: getToken(),
      name: '',
      avatar: '',
      roles: [],
      permissions: []
    }),
    actions: {
      // 登录
      login(userInfo) {
        userInfo.username = userInfo.username.trim()
        return new Promise((resolve, reject) => {
          publicSsoLogin(userInfo).then(res => {
            if (res.code !== 1) {
              // 接口请求失败
              ElMessage({message: res.msg, type: 'error'});
              reject(res.error);
            } else {
              // 接口请求成功，内部异常
              const status = res.data.status;
              if (status !== 0) {
                ElMessage({message: res.data.msg, type: 'error'});
                reject(res.msg);
              } else {
                this.token = res.data.token;
                setToken(this.token);
                resolve(res);
              }
            }
          }).catch(error => {
            reject(error)
          })
        })
      },
      // 获取用户信息
      getInfo() {
        return new Promise((resolve, reject) => {
          const token = getToken();
          if (!token) {
            reject('token不存在！')
            return;
          }
          const tokenArr = token.split(".");
          if (token.indexOf(".") === -1 || tokenArr.length !== 3) {
            reject('token不正确！')
            return;
          }
          const payload = tokenArr[1];
          let userInfo = Base64.decode(payload);
          userInfo = JSON.parse(userInfo)
          this.name = userInfo.nickname
          this.avatar = userInfo.avatar;
          this.roles = ['ROLE_DEFAULT']
          resolve(userInfo)
          /*
          persionalUserInfo().then(res => {
            const user = res.data
            const avatar = (user.avatar === "" || user.avatar == null) ? defAva : import.meta.env.VITE_APP_BASE_API + user.avatar;
            if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
              this.roles = res.roles
              this.permissions = res.permissions
            } else {
              this.roles = ['ROLE_DEFAULT']
            }
            this.name = user.username
            this.avatar = avatar;
            resolve(res)
          }).catch(error => {
            reject(error)
          })
          */
        })
      },
      // 退出系统
      logOut() {
        return new Promise((resolve, reject) => {
          this.token = ''
          this.roles = []
          this.permissions = []
          removeToken()
          localStorage.clear();
          resolve()
          /*
          logout(this.token).then(() => {
            this.token = ''
            this.roles = []
            this.permissions = []
            removeToken()
            localStorage.clear();
            resolve()
          }).catch(error => {
            reject(error)
          })
          */
        })
      }
    }
  })

export default useUserStore
