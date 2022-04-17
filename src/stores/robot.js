import {defineStore} from 'pinia'
import localDb from '../local-db'
import {uid} from 'quasar'
import useUserStore from './user'


const websocketServerURL = process.env.WEBSOCKET_BASE
const WS_RECONNECT_INTERVAL = 1000

function checkPermissions() {
  const permissions = cordova.plugins.permissions
  const permissionList = [
    permissions.MODIFY_AUDIO_SETTINGS,
    permissions.RECORD_AUDIO,
  ]
  const successCallback = () => console.log('permissions success')
  const errorCallback = () => console.log('permissions error')

  permissions.requestPermissions(permissionList, successCallback, errorCallback)
}

export const useRobotStore = defineStore({
  id: 'robot',
  state: () => ({
    WS: null,
    isWSOpen: false,
    wsMsgQueue: [],
    sentCommands: {},
    robotRunning: false,
    robotIsOn: false,
    myPeerConnection: null,
    targetUsername: null,
    mediaConstraints: {
      audio: true,
      video: false,
    },
    callee: null,
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

        'webrtc_signal': response => this.handleWebRTCSignal(response),
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
      if (this.myPeerConnection)
        this.hangUpCall()

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

    //-------------------------------------------------------------------------------------------
    handleWebRTCSignal(response) {
      const signalType = response.data.type
      switch (signalType) {
        case 'offer':
          this.handleVideoOfferMsg(response)
          break
        case 'answer':
          this.handleVideoAnswerMsg(response)
          break
        case 'candidate':
          this.handleNewICECandidateMsg(response)
          break
        case 'hang-up':
          this.handleHangUpMsg()
          break
      }
    },

    invite(targetUser) {
      console.log('***************************************************************************')
      if (this.myPeerConnection) {
        alert('You can\'t start a call because you already have one open!')
      } else {
        this.targetUsername = targetUser.mobile
        this.callee = targetUser
        this.createPeerConnection()

        console.log('navigator.mediaDevices:', navigator.mediaDevices)
        checkPermissions()

        navigator.mediaDevices.getUserMedia(this.mediaConstraints)
          .then((localStream) => {
            console.log('got user media:', localStream)
            // document.getElementById('local_video').srcObject = localStream
            localStream.getTracks().forEach(track => {
              console.log('track of stream:', track)
              this.myPeerConnection.addTrack(track, localStream)
            })
          })
          .catch(this.handleGetUserMediaError)
      }
    },

    createPeerConnection() {
      this.myPeerConnection = new RTCPeerConnection({
        iceServers: [     // Information about ICE servers - Use your own!
          {
            // urls: 'stun:stun.stunprotocol.org',
            // urls: 'stun:stun.1.google.com:19302',
            urls: ['stun:stun.persia-atlas.com:3478', 'turn:turn.persia-atlas.com:3478'],
            // urls: ['stun:stun.persia-atlas.com:5349', 'turn:turn.persia-atlas.com:5349'],
            username: 'guest',
            credential: 'somepassword',
          },
        ],
      })

      this.myPeerConnection.onicecandidate = this.handleICECandidateEvent
      this.myPeerConnection.ontrack = this.handleTrackEvent
      this.myPeerConnection.onnegotiationneeded = this.handleNegotiationNeededEvent
      this.myPeerConnection.onremovetrack = this.handleRemoveTrackEvent
      this.myPeerConnection.oniceconnectionstatechange = this.handleICEConnectionStateChangeEvent
      this.myPeerConnection.onicegatheringstatechange = this.handleICEGatheringStateChangeEvent
      this.myPeerConnection.onsignalingstatechange = this.handleSignalingStateChangeEvent
    },

    handleICECandidateEvent(event) {
      console.log('handleICECandidateEvent | event:', event)
      if (event.candidate) {
        const payload = {
          type: 'candidate',
          target: this.targetUsername,
          candidate: event.candidate,
        }
        console.log('handleICECandidateEvent | payload:', payload)
        this.sendToWS({
          command: 3,
          payload: payload,
        })
      }
    },

    handleNewICECandidateMsg(response) {
      console.log('handleNewICECandidateMsg | data:', response.data)
      const candidate = new RTCIceCandidate(response.data.candidate)

      this.myPeerConnection.addIceCandidate(candidate)
        .catch(err => console.log('handleNewICECandidateMsg | error:', err))
    },

    handleTrackEvent(event) {
      console.log('handleTrackEvent | event:', event)
      document.getElementById('received_video').srcObject = event.streams[0]
      document.getElementById('hangup-button').disabled = false
    },

    handleNegotiationNeededEvent() {
      this.myPeerConnection.createOffer().then((offer) => {
        console.log('handleNegotiationNeededEvent | offer:', offer)
        return this.myPeerConnection.setLocalDescription(offer)
      })
        .then(() => {
          console.log('handleNegotiationNeededEvent | send offer')
          const userStore = useUserStore()
          this.sendToWS({
            command: 3,
            payload: {
              name: userStore.user,
              target: this.targetUsername,
              type: 'offer',
              sdp: this.myPeerConnection.localDescription,
            },
          })
        })
        .catch(err => console.log('handleNegotiationNeededEvent error:', err))
    },

    handleRemoveTrackEvent(event) {
      console.log('handleRemoveTrackEvent | event:', event)
      const stream = document.getElementById('received_video').srcObject
      const trackList = stream.getTracks()
      console.log('handleRemoveTrackEvent | trackList:', trackList)

      if (trackList.length === 0) {
        this.closeVideoCall()
      }
    },

    handleICEConnectionStateChangeEvent(event) {
      console.log('handleICEConnectionStateChangeEvent | event:', event)

      switch (this.myPeerConnection.iceConnectionState) {
        case 'closed':
        case 'failed':
          this.closeVideoCall()
          break
      }
    },

    handleICEGatheringStateChangeEvent(event) {
      console.log('handleICEGatheringStateChangeEvent | event:', event)
      console.log('handleICEGatheringStateChangeEvent | state:', this.myPeerConnection.iceGatheringState)
      // Our sample just logs information to console here,
      // but you can do whatever you need.
    },

    handleSignalingStateChangeEvent(event) {
      console.log('handleSignalingStateChangeEvent | event:', event)
      console.log('handleSignalingStateChangeEvent | signalingState:', this.myPeerConnection.signalingState)

      switch (this.myPeerConnection.signalingState) {
        case 'closed':
          this.closeVideoCall()
          break
      }
    },


    handleVideoOfferMsg(response) {
      console.log('***************************************************************************')
      console.log('HandleWebRTCOffer | response:', response)
      const data = response.data
      let localStream = null

      this.targetUsername = data.name
      this.createPeerConnection()

      const desc = new RTCSessionDescription(data.sdp)
      // const desc = new RTCSessionDescription(msg.offer)

      this.myPeerConnection.setRemoteDescription(desc).then(() => {
        return navigator.mediaDevices.getUserMedia(this.mediaConstraints)
      })
        .then((stream) => {
          console.log('handleVideoOfferMsg | got user stream:', stream)
          localStream = stream
          // document.getElementById('local_video').srcObject = localStream

          localStream.getTracks().forEach(track => {
            console.log('track of stream:', track)
            this.myPeerConnection.addTrack(track, localStream)
          })
        })
        .then(() => {
          console.log('handleVideoOfferMsg | creating answer')
          return this.myPeerConnection.createAnswer()
        })
        .then((answer) => {
          console.log('handleVideoOfferMsg | answer:', answer)
          return this.myPeerConnection.setLocalDescription(answer)
        })
        .then(() => {
          console.log('send answer (localDescription):', this.myPeerConnection.localDescription)
          const userStore = useUserStore()
          this.sendToWS({
            command: 3,
            payload: {
              type: 'answer',
              name: userStore.user,
              target: this.targetUsername,
              sdp: this.myPeerConnection.localDescription,
            },
          })
        })
        .catch(this.handleGetUserMediaError)
    },

    // handleAnswer(response) {
    //   this.myPeerConnection.setRemoteDescription(new RTCSessionDescription(response.data.answer))
    // },

    handleVideoAnswerMsg(response) {
      console.log('*** handleVideoAnswerMsg | data:', response.data)

      // Configure the remote description, which is the SDP payload
      // in our "answer" message.

      const desc = new RTCSessionDescription(response.data.sdp)
      this.myPeerConnection.setRemoteDescription(desc)
        .catch(err => console.log('handleVideoAnswerMsg error:', err))
    },

    hangUpCall() {
      console.log('hangUpCall')

      const userStore = useUserStore()
      this.sendToWS({
        command: 3,
        payload: {
          name: userStore.user,
          target: this.targetUsername,
          type: 'hang-up',
        },
      })

      this.closeVideoCall()
    },

    handleHangUpMsg(msg) {
      console.log('*** Received hang up notification from other peer')

      this.closeVideoCall()
    },

    handleGetUserMediaError(e) {
      console.log('error:', e.name, e.message)
      switch (e.name) {
        case 'NotFoundError':
          console.error('Unable to open your call because no camera and/or microphone were found.')
          break
        case 'SecurityError':
        case 'PermissionDeniedError':
          // Do nothing; this is the same as the user canceling the call.
          break
        default:
          alert('Error opening your camera and/or microphone: ' + e.message)
          break
      }

      this.closeVideoCall()
    },

    closeVideoCall() {
      console.log('closeVideoCall')
      console.log('closeVideoCall | myPeerConnection:', this.myPeerConnection)
      const remoteVideo = document.getElementById('received_video')
      // const localVideo = document.getElementById('local_video')

      if (this.myPeerConnection) {
        this.myPeerConnection.ontrack = null
        this.myPeerConnection.onremovetrack = null
        this.myPeerConnection.onremovestream = null
        this.myPeerConnection.onicecandidate = null
        this.myPeerConnection.oniceconnectionstatechange = null
        this.myPeerConnection.onsignalingstatechange = null
        this.myPeerConnection.onicegatheringstatechange = null
        this.myPeerConnection.onnegotiationneeded = null

        if (remoteVideo.srcObject) {
          remoteVideo.srcObject.getTracks().forEach(track => track.stop())
        }

        // if (localVideo.srcObject) {
        //   localVideo.srcObject.getTracks().forEach(track => track.stop())
        // }

        this.myPeerConnection.close()
        this.myPeerConnection = null
      }

      remoteVideo.removeAttribute('src')
      remoteVideo.removeAttribute('srcObject')
      // localVideo.removeAttribute('src')
      remoteVideo.removeAttribute('srcObject')

      document.getElementById('hangup-button').disabled = true
      this.targetUsername = null
    },
  },
})

export default useRobotStore


//stun:stun.persia-atlas.com:3478
//stun:stun.persia-atlas.com:5349

//turn:turn.persia-atlas.com:3478
//turn:turn.persia-atlas.com:5349
