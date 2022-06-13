import {defineStore} from 'pinia'
import {routerInstance} from 'src/router'
import {axiosInstance} from 'src/boot/axios'
import localDb from 'src/local-db'
import {broadcastInstance} from '../boot/broadcast'
import useWebsocketStore from './websocket'
import useRobotStore from './robot'
import useWebRTCStore from './webrtc'

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
      if (this.user) return true
      else {
        const user = localDb.get('user')
        if (user !== undefined) {
          this.user = user
          return true
        }
        return false
      }
    },
  },
  actions: {
    Login(user) {
      this.user = user
      localDb.set('user', user)
      const wsStore = useWebsocketStore()
      wsStore.HandleTokenUpdate()
    },
    Logout() {
      this.user = null
      localDb.clearAll()
      delete axiosInstance.defaults.headers['Authorization']
      broadcastInstance.sendBroadcastMessage('LOGOUT', {})
      const wsStore = useWebsocketStore()
      wsStore.HandleLogout()
      const robotStore = useRobotStore()
      robotStore.$reset()
      const webrtcStore = useWebRTCStore()
      webrtcStore.$reset()
      this.$reset()
      routerInstance.push({name: 'Login'})
    },
    SetProfile(payload) {
      this.profile = payload
      for (const [key, value] of Object.entries(payload)) {
        let val = value
        if (key === 'avatar' && value !== null)
          val = process.env.SERVER_BASE_URL + value
        this.profile[key] = val
      }
    },
  },
})

export default useUserStore

