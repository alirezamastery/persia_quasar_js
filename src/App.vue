<template>
  <q-layout view="lHh Lpr lFf">

    <q-linear-progress
      v-show="hasHttpRequestWaiting"
      indeterminate
      stripe
      class="fixed z-top"
      color="red"
      :animation-speed="500"
    />

    <Header v-if="showAppLayout"/>

    <Sidebar v-if="showAppLayout"/>

    <q-page-container>

      <Banners/>

      <router-view/>

    </q-page-container>
  </q-layout>
</template>

<script setup>
import {computed, defineComponent, ref, onMounted} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import useUserStore from 'src/stores/user'
import useGeneralStore from 'src/stores/general'
import {axiosInstance} from 'boot/axios'
import Header from 'src/components/layout/Header.vue'
import Sidebar from 'src/components/layout/Sidebar.vue'
import Banners from 'src/components/layout/Banners.vue'
import urls from 'src/urls'
import {notifyErrors} from './composables/notif'
import {broadcastInstance} from './boot/broadcast'

import {getAuth, signInAnonymously} from 'firebase/auth'
import {getMessaging, onMessage, getToken} from 'firebase/messaging'
import {messaging} from '../firebase-2'

const userStore = useUserStore()
const generalStore = useGeneralStore()

const router = useRouter()
const route = useRoute()

const hasHttpRequestWaiting = computed(() => generalStore.hasHttpRequestWaiting)

const isAuthenticated = computed(() => userStore.isAuthenticated)

const showAppLayout = computed(() => {
  const noAuthRoutes = ['404', 'Login', 'justRain']
  return isAuthenticated.value && !noAuthRoutes.includes(String(route.name))
})

broadcastInstance.addBroadcastCallback('LOGOUT', () => {
  userStore.Logout()
})

// TODO: QAjaxBar plugin

async function authenticate() {
  await signInAnonymously(getAuth())
  await activate()
}

async function activate() {
  const token = await getToken(messaging, {
    vapidKey: process.env.VUE_APP_VAPID_KEY,
  })
  console.log('firebase token:', token)

  if (token) {
    console.log('firebase token:', token)
  } else {
    // request permission
  }
}

onMounted(async () => {
  const messaging = getMessaging()
  await authenticate()
  onMessage(messaging, (payload) => {
    console.log('firebase message when alive:', payload)
  })
})

// getToken(messaging, { vapidKey: process.env.VUE_APP_VAPID_KEY })
//   .then((currentToken) => {
//     console.log('****************************', currentToken)
//   if (currentToken) {
//     // Send the token to your server and update the UI if necessary
//     // ...
//   } else {
//     // Show permission request UI
//     console.log('No registration token available. Request permission to generate one.');
//     // ...
//   }
// }).catch((err) => {
//   console.log('An error occurred while retrieving token. ', err);
//   // ...
// });

</script>
