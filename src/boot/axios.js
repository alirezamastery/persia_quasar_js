import {boot} from 'quasar/wrappers'
import axios from 'axios'
import {useGeneralStore} from 'src/stores/general'
import urls from 'src/urls'
import localDb from 'src/local-db'
import {useRouter} from 'vue-router'
import {notifyAxiosError} from 'src/composables/notif'
import {routerInstance} from 'src/router'
import useUserStore from '../stores/user'
import useWebsocketStore from '../stores/websocket'

function getCookie(name) {
  let cookieValue = null
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';')
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim()
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
        break
      }
    }
  }
  return cookieValue
}

const csrfToken = getCookie('csrftoken')

const baseURL = process.env.API_BASE
console.log('baseURL', baseURL)

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 0,
  headers: {
    Authorization: localDb.get('access_token')
      ? `Bearer ${String(localDb.get('access_token'))}`
      : null,
    'Content-Type': 'application/json',
    accept: 'application/json',
    'X-CSRFToken': csrfToken,
  },
})

axiosInstance.interceptors.request.use(
  function (config) {
    const generalStore = useGeneralStore()
    generalStore.IncrementHttpRequestQueue()
    return config
  },
)


axiosInstance.interceptors.response.use(
  function (response) {
    const generalStore = useGeneralStore()
    generalStore.DecrementHttpRequestQueue()
    // console.log('intercept' , response)
    return response
  },
  async function (error) {
    const generalStore = useGeneralStore()
    const userStore = useUserStore()

    generalStore.DecrementHttpRequestQueue()

    const originalRequest = error.config
    console.log('in axiosInstance | BEGINNING | error: ', error)

    console.log('config baseURL:' , error.config.baseURL)


    if (!error.response || typeof error.response === 'undefined') {
      console.log('axios error.response is undefined', error)
      notifyAxiosError(error)
      return Promise.reject(error)
    }
    else {
      console.log('in axiosInstance | BEGINNING | error.response.data: ', error.response.data)
      console.log('in axiosInstance | BEGINNING | error.response.status: ', error.response.status)
      if (error.response.status !== 403) {
        notifyAxiosError(error)
      }
    }

    if (
      error.response.status === 401 &&
      originalRequest.url === urls.refreshToken
    ) {
      userStore.Logout()
      return Promise.reject(error)
    }

    if (
      error.response.status === 403
      && originalRequest.url === urls.refreshToken
    ) {
      userStore.Logout()
      return Promise.reject(error)
    }

    if (
      error.response.status === 403
      //&& error.response.data.code === 'token_not_valid'
      //&& error.response.statusText === 'Unauthorized'
    ) {
      const refreshToken = localDb.get('refresh_token')

      if (refreshToken) {
        console.log(`response.status was ${error.response.status} so we will use refreshToken: `, refreshToken)
        const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]))

        const now = Date.now()
        // exp date in token is expressed in seconds, while now() returns milliseconds:
        if (tokenParts.exp * 1000 > now) {
          return axiosInstance
            .post(urls.refreshToken, {refresh: refreshToken})
            .then((response) => {
              localDb.set('access_token', response.data.access)
              localDb.set('refresh_token', response.data.refresh)

              axiosInstance.defaults.headers['Authorization'] = 'Bearer ' + response.data.access
              originalRequest.headers['Authorization'] = 'Bearer ' + response.data.access

              const wsStore = useWebsocketStore()
              wsStore.HandleTokenUpdate()

              return axiosInstance(originalRequest)
            })
            .catch(async (err) => {
              console.log('error in refresh token part: ', err)
              userStore.Logout()
            })
        } else {
          console.log('Refresh token is expired', tokenParts, now)
          userStore.Logout()
        }
      } else {
        console.log('in axiosInstance: Refresh token not available. refreshToken is: ', refreshToken)
        userStore.Logout()
      }
    }

    // specific error handling done elsewhere
    return Promise.reject(error)
  },
)


export default boot(({app}) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axiosInstance
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$apiClient = axiosInstance
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export {axiosInstance}
