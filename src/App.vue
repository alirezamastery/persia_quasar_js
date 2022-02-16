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
import {computed, defineComponent, ref} from 'vue'
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
import localDb from './local-db'
import {useQuasar} from 'quasar'

const q = useQuasar()

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

const isDark = localDb.get('isDark')
q.dark.set(isDark)

// TODO: QAjaxBar plugin

</script>
