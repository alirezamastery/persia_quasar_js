import {defineStore} from 'pinia'
import {useRouter} from 'vue-router'
import {routerInstance} from 'src/router'
import {axiosInstance} from 'src/boot/axios'
import localDb from 'src/local-db'
import {broadcastInstance} from '../boot/broadcast'

const storeID = 'user'

export const useUserStore = defineStore({
  id: storeID,
  state: () => ({
    user: null,
    profile: {
      first_name: null,
      last_name: null,
      avatar: null,
    },
  }),
  getters: {
    isAuthenticated() {
      return !!this.user
    },
  },
  actions: {
    Login(user) {
      console.log('user', user)
      localDb.set('user', user)
      this.user = user
    },
    Logout() {
      this.user = null
      localDb.clearAll()
      axiosInstance.defaults.headers['Authorization'] = ''
      routerInstance.push({name: 'Login'})
      broadcastInstance.sendBroadcastMessage('LOGOUT', {})
    },
    SetProfile(payload) {
      this.profile = payload
      for (const [key, value] of Object.entries(payload)) {
        console.log(key, value)
        let val = value
        if (key === 'avatar' && value !== null)
          val = process.env.SERVER_BASE_URL + value
        this.profile[key] = val
      }
    },
  },
})

export default useUserStore

