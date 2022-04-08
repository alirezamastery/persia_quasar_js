<template>
  <q-toggle
    v-model="robotRunning"
    unchecked-icon="power_settings_new"
    checked-icon="bolt"
    :label="$t('robot.robot')"
    size="xl"
    @update:model-value="updateRobotStatus"
  >
    <template v-slot:default v-if="updatingStatus">
      <q-circular-progress indeterminate/>
    </template>
  </q-toggle>
</template>

<script setup>
import {ref} from 'vue'
import useGeneralStore from 'src/stores/general'
import {axiosInstance} from '../../boot/axios'
import urls from 'src/urls'

const generalStore = useGeneralStore()

const robotRunning = ref(false)
const updatingStatus = ref(true)


function updateRobotStatus(event) {
  updatingStatus.value = true
  const data = {
    stop: !event,
  }
  console.log('date:' , data)
  axiosInstance.post(urls.robotStatus, data)
    .then(res => {
      console.log('updateRobotStatus | res', res)
      // notifyMessage('info', t('general.snack.saveSuccess'))
    })
    .catch(err => {
      console.log('updateRobotStatus | error', err.response?.data)
      robotRunning.value = !event
    })
    .finally(() => updatingStatus.value = false)
}

axiosInstance.get(urls.robotStatus)
  .then(res => {
    console.log('robot initial status:', res)
    robotRunning.value = res.data.running
    updatingStatus.value = false
  })
</script>

<style scoped>

</style>
