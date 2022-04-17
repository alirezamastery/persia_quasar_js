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
import {computed} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import useUserStore from 'src/stores/user'
import useGeneralStore from 'src/stores/general'
import useWebSocketStore from 'src/stores/robot'
import Header from 'src/components/layout/header/Header.vue'
import Sidebar from 'src/components/layout/Sidebar.vue'
import Banners from 'src/components/layout/Banners.vue'
import {broadcastInstance} from './boot/broadcast'
import localDb from './local-db'
import {useQuasar} from 'quasar'

const q = useQuasar()

const userStore = useUserStore()
const generalStore = useGeneralStore()
const wsStore = useWebSocketStore()

const router = useRouter()
const route = useRoute()

const hasHttpRequestWaiting = computed(() => generalStore.hasHttpRequestWaiting)

const isAuthenticated = computed(() => userStore.isAuthenticated)

const showAppLayout = computed(() => {
  const noAuthRoutes = ['404', 'Login', 'justRain']
  return isAuthenticated.value && !noAuthRoutes.includes(String(route.name))
})

if (userStore.isAuthenticated) {
  wsStore.openWS()
}

broadcastInstance.addBroadcastCallback('LOGOUT', () => {
  userStore.Logout()
  wsStore.HandleLogout()
})

let isDark = localDb.get('isDark')
if (isDark === undefined) {
  localDb.set('isDark', true)
  isDark = true
}
q.dark.set(isDark)

if (q.platform.is.android) {
  document.addEventListener('deviceready', OneSignalInit, false)

  function OneSignalInit() {
    // Uncomment to set OneSignal device logging to VERBOSE
    window.plugins.OneSignal.setLogLevel(6, 0)

    // NOTE: Update the setAppId value below with your OneSignal AppId.
    window.plugins.OneSignal.setAppId('10181441-6308-414b-9d4d-2e13dd58cee5')
    window.plugins.OneSignal.setNotificationOpenedHandler(function (jsonData) {
      console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData))
    })

    // iOS - Prompts the user for notification permissions.
    //    * Since this shows a generic native prompt, we recommend instead using an In-App Message to prompt for notification permission (See step 6) to better communicate to your users what notifications they will get.
    window.plugins.OneSignal.promptForPushNotificationsWithUserResponse(function (accepted) {
      console.log('User accepted notifications: ' + accepted)
    })
  }

}

// TODO: QAjaxBar plugin

</script>
