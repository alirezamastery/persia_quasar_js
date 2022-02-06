import {boot} from 'quasar/wrappers'


// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files

export const broadcastInstance = {
  broadcastChannel: new BroadcastChannel('persia_atlas'),
  broadcastCallbacks: {},

  addBroadcastCallback(type, callback) {
    this.broadcastCallbacks[type] = callback
  },
  sendBroadcastMessage(type, payload = {}) {
    this.broadcastChannel.postMessage({type, payload})
  },
  setup() {
    this.broadcastChannel.onmessage = event => {
      if (event.data && event.data.type) {
        let callback = this.broadcastCallbacks[event.data.type]
        if (callback && typeof callback === 'function')
          callback(event.data.payload)
        else
          console.log('RECEIVED AN UNKNOWN BROADCAST MESSAGE')
      }
    }
  },
}

broadcastInstance.setup()

export default boot(({app}) => {
  app.config.globalProperties.$broadcast = broadcastInstance
})
