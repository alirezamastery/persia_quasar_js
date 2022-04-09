import {defineStore} from 'pinia'
import localDb from '../local-db'
import {uid} from 'quasar'


const websocketServerURL = process.env.WEBSOCKET_BASE
const WS_RECONNECT_INTERVAL = 1000


export const useRobotStore = defineStore({
  id: 'robot',
  state: () => ({
    WS: null,
    isWSOpen: false,
    wsMsgQueue: [],
    sentCommands: {},
    robotRunning: false,
    robotIsOn: false,
  }),
  getters: {},
  actions: {
    openWS() {
      this.WS = null
      const accessToken = localDb.get('access_token')
      this.WS = new WebSocket(websocketServerURL, [accessToken])
      this.setupWS()
    },
    setupWS() {
      console.log('ws setup')
      const MESSAGE_HANDLERS = {
        'fetch_response': response => this.HandleFetch(response),
        'robot_status': response => this.HandleRobotStatus(response),
        'robot_stopped': response => this.HandleRobotStop(response),
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
        this.openWS()
      }
    },

    HandleLogout() {
      this.WS.onclose = function () {
        console.log('ws close after logout')
      }
      this.WS.close()
    },

    HandleWSIsOpen() {
      this.isWSOpen = true

      this.SendCommandToWS({
        'command': 1,
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

    HandleFetch(response) {
      console.log('HandleFetch | response:', response)
      const data = response['data']
      this.robotRunning = data['robot_running']
      this.robotIsOn = data['robot_is_on']
    },

    HandleRobotStatus(response) {
      console.log('HandleRobotStatus | response:', response)
      this.robotRunning = response['data']['robot_running']
    },

    HandleRobotStop(response) {
      console.log('HandleRobotStop | response:', response)
      this.robotIsOn = response['data']['robot_is_on']
    },
  },
})

export default useRobotStore
