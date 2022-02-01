<template>
  <q-header
    :class="q.dark.isActive ? 'bg-grey-10 text-white' : 'bg-grey-3 text-black'"
  >
    <q-toolbar>
      <q-btn
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        @click="toggleLeftDrawer"
      />

      <q-toolbar-title>
        {{ $t('general.siteHeader') }}
      </q-toolbar-title>

      <ThemeToggle/>

      <q-btn
        v-if="isAuthenticated"
        color="red"
        @click="handleLogout"
      >
        {{ $t('general.routes.logout') }}
      </q-btn>
    </q-toolbar>
  </q-header>
</template>

<script>
import {computed, ref} from 'vue'
import {useRouter} from 'vue-router'
import {useQuasar} from 'quasar'
import useUserStore from 'src/stores/user'
import useGeneralStore from 'src/stores/general'
import {sidebarOpen, generalState} from 'src/components/layout/composables'
import ThemeToggle from './ThemeToggle.vue'

export default {
  name: 'Header',
  components: {
    ThemeToggle,
  },
  setup() {
    const q = useQuasar()

    const userStore = useUserStore()
    const router = useRouter()

    const isAuthenticated = computed(() => userStore.isAuthenticated)

    function toggleLeftDrawer() {
      generalState.sideOpen = !generalState.sideOpen
    }

    function handleLogout() {
      void userStore.Logout()
    }

    return {
      sidebarOpen,
      toggleLeftDrawer,
      isAuthenticated,
      handleLogout,
      q,
    }
  },
}
</script>

<style scoped>

</style>
