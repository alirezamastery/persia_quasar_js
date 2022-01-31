import {defineStore} from 'pinia'
import {useRouter} from 'vue-router'
import router from 'src/router'
import {axiosInstance} from 'src/boot/axios'

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
      this.user = user
    },
    Logout() {
      this.user = null
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      axiosInstance.defaults.headers['Authorization'] = ''
      void router.push({name: 'Login'})
    },
    SetProfile(payload) {
      this.profile = payload
    },
  },
})

export default useUserStore

