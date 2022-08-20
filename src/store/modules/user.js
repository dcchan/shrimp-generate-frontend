import { publicUserLogin, persionalUserInfo } from '@/api/generate'
import { getToken, setToken, removeToken } from '@/utils/auth'
import defAva from '@/assets/images/profile.jpg'
import {ElMessage} from "element-plus";

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
        const username = userInfo.username.trim()
        const password = userInfo.password
        // const code = userInfo.code
        // const uuid = userInfo.uuid
        return new Promise((resolve, reject) => {
          publicUserLogin({username, password}).then(res => {
            if (res.code !== 1) {
              ElMessage({message: res.msg, type: 'error'});
              reject(res.error);
            } else {
              this.token = res.data.token;
              setToken(this.token);
              resolve();
            }
          }).catch(error => {
            reject(error)
          })
        })
      },
      // 获取用户信息
      getInfo() {
        return new Promise((resolve, reject) => {
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
