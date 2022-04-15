<template>
  <div class="q-ma-md q-pa-sm">

    <div class="row q-col-gutter-sm" v-if="!callConnected">
      <div
        v-for="user in users.filter(u => u.mobile !== userMobile)"
        :key="user"
        class="col-xs-12 col-sm-6 col-md-4 col-lg-2 col-xl-2"
      >
        <q-btn
          color="green"
          size="lg"
          class="full-width"
          @click="inviteToCall(user)"
        >
          <q-icon name="call"/>
          {{ user.profile.first_name }} {{ user.mobile }}
        </q-btn>
      </div>
    </div>

    <div v-if="callConnected" class="fit" id="camera-container">
      <div>
        <img :src="callee.profile.avatar" alt=""/>
      </div>
      <audio id="received_video" autoplay></audio>
      <q-btn
        id="hangup-button"
        @click="hangUpCall"
        color="red"
      >
        <q-icon name="phone_disabled"/>
      </q-btn>
    </div>

    <!--    <div class="flexChild" id="camera-container">-->
    <!--      <div class="camera-box">-->
    <!--        <video id="local_video" autoplay muted></video>-->
    <!--        <video id="received_video" autoplay></video>-->
    <!--        <q-btn-->
    <!--          v-show="callConnected"-->
    <!--          id="hangup-button"-->
    <!--          @click="hangUpCall"-->
    <!--          color="red"-->
    <!--        >-->
    <!--          <q-icon name="phone_disabled"/>-->
    <!--        </q-btn>-->
    <!--      </div>-->
    <!--    </div>-->

  </div>
</template>

<script setup>
import {ref, computed} from 'vue'
import adapter from 'webrtc-adapter'
import useRobotStore from 'src/stores/robot'
import {axiosInstance} from '../../../boot/axios'
import urls from '../../../urls'
import useUserStore from '../../../stores/user'
import AutoComplete from '../../../components/AutoComplete'

const robotStore = useRobotStore()
const userStore = useUserStore()

const users = ref([])

const userMobile = computed(() => userStore.user)
const callConnected = computed(() => robotStore.myPeerConnection !== null)
const callee = computed(() => robotStore.callee)


console.log('adapter.browserDetails.browser:', adapter.browserDetails.browser)

function inviteToCall(targetUser) {
  console.log('targetUser:', targetUser)
  robotStore.invite(targetUser)
}

function hangUpCall() {
  robotStore.hangUpCall()
}

axiosInstance.get(urls.users)
  .then(res => {
    console.log('res: ', res.data.items)
    users.value = res.data.items
  })

</script>

<style scoped>
.container {
  display: grid;
  min-width: 1250px;
  height: 100%;
  grid-template-areas: "infobox infobox infobox"
  "userlistbox chatbox camerabox"
  "empty-container chat-controls chat-controls";
  grid-template-columns: 10em 1fr 500px;
  grid-template-rows: 16em 1fr 5em;
  grid-gap: 1rem;
}

.infobox {
  grid-area: infobox;
  overflow: auto;
}

.userlistbox {
  grid-area: userlistbox;
  border: 1px solid black;
  margin: 0;
  padding: 1px;
  list-style: none;
  line-height: 1.1;
  overflow-y: auto;
  overflow-x: hidden;
}

.userlistbox li {
  cursor: pointer;
  padding: 1px;
}

.chatbox {
  grid-area: chatbox;
  border: 1px solid black;
  margin: 0;
  overflow-y: scroll;
  padding: 1px;
  padding: 0.1rem 0.5rem;
}

.camerabox {
  grid-area: camerabox;
  width: 500px;
  height: 375px;
  border: 1px solid black;
  vertical-align: top;
  display: block;
  position: relative;
  overflow: auto;
}

#received_video {
  width: 700px;
  height: 500px;
  /*position: absolute;*/
}

/* The small "preview" view of your camera */
#local_video {
  width: 120px;
  height: 90px;
  /*position: absolute;*/
  top: 1rem;
  left: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.75);
  box-shadow: 0 0 4px black;
}

.empty-container {
  grid-area: empty-container;
}

.chat-controls {
  grid-area: chat-controls;
  width: 100%;
  height: 100%;
}
</style>
