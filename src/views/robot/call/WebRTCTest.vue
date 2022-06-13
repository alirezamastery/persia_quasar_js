<template>
  <div class="q-ma-md q-pa-sm">

    <div class="row">

      <q-list
        v-show="!callConnected"
        class="col-xs-12 col-sm-8 col-md-6 col-lg-3"
        bordered
      >
        <q-item-label header>{{ $t('general.users') }}</q-item-label>
        <template
          v-for="(user, i) in users.filter(u => u.mobile !== userMobile)"
          :key="user.id"
        >
          <q-item>
            <q-item-section avatar>
              <q-avatar>
                <img :src="user.profile.avatar" alt="">
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1">
                {{ user.profile.first_name }} {{ user.profile.last_name }}
              </q-item-label>
              <q-item-label caption lines="1">
                {{ user.mobile }}
              </q-item-label>
            </q-item-section>

            <q-item-section side top>
              <q-btn
                color="green"
                icon="call"
                :disable="wsStore.hasCallInvite"
                @click="inviteToCall(user)"
              />
            </q-item-section>
          </q-item>

          <q-separator v-if="i > 0" inset="item"/>
        </template>
      </q-list>

      <div
        v-if="callConnected"
        class="col-xs-10 col-sm-8 col-md-5 col-lg-3"
        id="camera-container"
      >
        <div>
          <q-img :src="callee.profile.avatar" alt=""/>
        </div>
        <audio id="received_video" autoplay></audio>
        <q-btn
          id="hangup-button"
          @click="hangUpCall"
          color="red"
          class="full-width"
        >
          <q-icon name="phone_disabled"/>
        </q-btn>
      </div>

    </div>
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

</template>

<script setup>
import {ref, computed} from 'vue'
import adapter from 'webrtc-adapter'
import useWebsocketStore from 'src/stores/websocket'
import {axiosInstance} from 'src/boot/axios'
import urls from 'src/urls'
import useUserStore from 'src/stores/user'
import {useQuasar} from 'quasar'

const q = useQuasar()

const wsStore = useWebsocketStore()
const userStore = useUserStore()

const users = ref([])

const userMobile = computed(() => userStore.user)
const callConnected = computed(() => wsStore.myPeerConnection !== null)
const callee = computed(() => wsStore.callee)


console.log('adapter.browserDetails.browser:', adapter.browserDetails.browser)

function inviteToCall(targetUser) {
  console.log('targetUser:', targetUser)
  wsStore.inviteToCall(targetUser)
}

function hangUpCall() {
  wsStore.hangUpCall()
}

axiosInstance.get(urls.users)
  .then(res => {
    console.log('res: ', res.data.items)
    users.value = res.data.items
  })

</script>

<style scoped>

</style>
