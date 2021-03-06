import {defineStore} from 'pinia'

const storeID = 'general'


export const useGeneralStore = defineStore({
  id: storeID,
  state: () => ({
    httpRequestQueue: 0,
    sidebarOpen: false,
    banners: [],
    pendingBanners: [],
    snackbars: [],
    snackbar: null,
    locale: 'fa',
    vuetifyRTL: true,
    tableFilterResetSignal: false,
  }),
  getters: {
    hasHttpRequestWaiting() {
      return this.httpRequestQueue > 0
    },
  },
  actions: {
    IncrementHttpRequestQueue() {
      this.httpRequestQueue++
    },
    DecrementHttpRequestQueue() {
      this.httpRequestQueue--
      if (this.httpRequestQueue < 0)
        this.httpRequestQueue = 0
    },
    ClearHttpRequestQueue() {
      this.httpRequestQueue = 0
    },
    AddPendingBanner(payload) {
      this.pendingBanners.push(payload)
    },
    ClearPendingBanners() {
      this.pendingBanners = []
    },
    AddBanner(banner) {
      this.banners.push(banner)
    },
    DeleteBanner(banner) {
      const index = this.banners.findIndex(item => item.key === banner.key)
      if (index > -1)
        this.banners.splice(index, 1)
    },
    ClearBanners() {
      this.banners = []
    },
    ResetTableFilter() {
      this.tableFilterResetSignal = !this.tableFilterResetSignal
      console.log('this.tableFilterResetSignal', this.tableFilterResetSignal)
    },
  },
})

export default useGeneralStore
