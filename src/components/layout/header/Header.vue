<template>

  <q-header
    :class="q.dark.isActive ? 'bg-grey-10 text-white' : 'bg-white text-black'"
    elevated
    :height-hint="56"
    class="flex items-center"
  >

    <CallRequest/>

    <q-toolbar>
      <q-btn
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        @click="toggleLeftDrawer"
      />

      <q-toolbar-title v-if="q.screen.gt.sm">
        {{ $t('general.siteHeader') }}
      </q-toolbar-title>

      <q-space/>
      <RobotStatus/>
      <q-space v-if="q.screen.gt.sm"/>
      <q-space/>

      <q-btn-group rounded unelevated>
        <ThemeToggle/>
        <q-btn
          v-if="isAuthenticated"
          color="red"
          @click="$router.push({name: 'Logout'})"
          icon="power_settings_new"
          flat
        >
        </q-btn>
      </q-btn-group>

    </q-toolbar>
  </q-header>
</template>

<script setup>
import {computed, ref} from 'vue'
import {useRouter} from 'vue-router'
import {useQuasar} from 'quasar'
import useUserStore from 'src/stores/user'
import {sidebarOpen, generalState} from 'src/components/layout/composables'
import ThemeToggle from './ThemeToggle.vue'
import RobotStatus from './RobotStatus.vue'
import CallRequest from './CallRequest'


const q = useQuasar()

const userStore = useUserStore()
const router = useRouter()

const isAuthenticated = computed(() => userStore.isAuthenticated)

function toggleLeftDrawer() {
  generalState.sideOpen = !generalState.sideOpen
}
</script>

<style scoped>

</style>
