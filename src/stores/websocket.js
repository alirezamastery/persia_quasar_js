import {defineStore} from 'pinia'
import localDb from '../local-db'
import {uid, Notify} from 'quasar'
import useUserStore from './user'
import useRobotStore from './robot'
import useWebRTCStore from './webrtc'

const websocketServerURL = process.env.WEBSOCKET_BASE
const WS_RECONNECT_INTERVAL = 1000


export const useWebsocketStore = defineStore({
  id: 'websocket',
  state: () => ({
    WS: null,
    isWSOpen: false,
    wsMsgQueue: [],
    sentCommands: {},
  }),
  getters: {},
  actions: {
    openWS() {
      const accessToken = localDb.get('access_token')
      this.WS = new WebSocket(websocketServerURL, [accessToken])
      this.setupWS()
    },
    setupWS() {
      console.log('ws setup')

      const robotStore = useRobotStore()
      const webrtcStore = useWebRTCStore()

      const MESSAGE_HANDLERS = {
        'error': response => console.error(response.data),
        'fetch_response': response => robotStore.HandleFetch(response),
        'robot_status': response => robotStore.HandleRobotStatus(response),
        'robot_stopped': response => robotStore.HandleRobotStop(response),
        'webrtc_signal': response => webrtcStore.handleWebRTCSignal(response),
      }

      this.WS.onopen = async () => {
        console.log('%cws opened', 'color: green;')
        this.HandleWSIsOpen()
      }

      this.WS.onerror = err => {
        console.error('Socket encountered error: ', err)
      }

      this.WS.onmessage = ev => {
        const response = JSON.parse(ev.data)
        const msgType = response.type
        const msgData = response.data
        const reqKey = response.req_key
        console.info('%c onmessage - type:', 'color: yellow;', msgType, reqKey)
        console.info('%c onmessage - data:', 'color: yellow;', msgData)

        // If the response was not for a command sent from this device, do nothing
        const passThroughMsgTypes = ['robot_stopped']
        if (
          !!reqKey
          && !passThroughMsgTypes.includes(msgType)
          && !this.sentCommands.hasOwnProperty(reqKey)
        ) {
          console.warn('no sent command with this req key')
          return
        }

        MESSAGE_HANDLERS[msgType](response)
      }

      this.WS.onclose = ev => {
        console.log(`ws close | reason: ${ev.reason} | code: ${ev.code}`)
        this.$reset()
        setTimeout(() => {
            this.openWS()
          },
          WS_RECONNECT_INTERVAL,
        )
      }
    },

    HandleTokenUpdate() {
      const accessToken = localDb.get('access_token')
      console.log('Token Updated', accessToken)
      if (accessToken) {
        if (this.WS) {
          this.HandleLogout()
        }
        this.openWS()
      }
    },

    HandleLogout() {
      const webrtcStore = useWebRTCStore()
      if (webrtcStore.myPeerConnection)
        webrtcStore.hangUpCall()

      if (this.WS) {
        this.WS.onclose = function () {
          console.log('ws close after logout')
        }
        this.WS.close()
      }
      this.$reset()
    },

    HandleWSIsOpen() {
      this.isWSOpen = true

      this.SendCommandToWS({
        command: 1, // robot data fetch command
      })

      const queueCopy = []
      for (const msg of this.wsMsgQueue) {
        queueCopy.push(msg)
      }
      for (const msg of queueCopy) {
        this.sendToWS(msg)
        const index = this.wsMsgQueue.indexOf(msg)
        this.wsMsgQueue.splice(index, 1)
      }
    },

    SendCommandToWS(payload) {
      if (this.isWSOpen)
        this.sendToWS(payload)
      else
        this.wsMsgQueue.push(payload)
    },

    sendToWS(request) {
      request['req_key'] = uid()
      this.WS.send(JSON.stringify(request))
      this.sentCommands[request['req_key']] = request['payload']
    },

  },
})

export default useWebsocketStore
