<template>
  <div class="row flex-center" style="min-height: inherit">
    <q-card class="q-pa-sm q-ma-md" style="max-width: 400px">
      <q-card-section>
        <div class="text-h5">{{ $t('general.Q.logout') }}</div>
      </q-card-section>
      <q-card-section>
        <div class="row">
          <q-btn color="red" @click="logout">{{ $t('general.yes') }}</q-btn>
          <q-space/>
          <q-btn color="primary" @click="goBack">{{ $t('general.no') }}</q-btn>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import {useRouter} from 'vue-router'
import useUserStore from '../../stores/user'
import useWebsocketStore from '../../stores/websocket'

const router = useRouter()
const userStore = useUserStore()
const wsStore = useWebsocketStore()

function goBack() {
  router.go(-1)
}

function logout(){
  userStore.Logout()
}
</script>
