<template>
  <q-toggle
    :model-value="robotIsOn"
    unchecked-icon="power_settings_new"
    checked-icon="bolt"
    size="xl"
    @update:model-value="updateRobotStatus"
  >
  </q-toggle>
  <q-spinner-gears size="lg" v-if="robotRunning" color="teal"/>
  <GearsMotionless v-else/>
</template>

<script setup>
import {ref, computed, watch} from 'vue'
import useWebsocketStore from 'src/stores/websocket'
import useRobotStore from 'src/stores/robot'
import GearsMotionless from 'src/components/static/GearsMotionless.vue'

const wsStore = useWebsocketStore()
const robotStore = useRobotStore()

const updatingStatus = ref(false)
const robotRunning = computed(() => robotStore.robotRunning)
const robotIsOn = computed(() => robotStore.robotIsOn)

function updateRobotStatus(event) {
  console.log('event:', event)
  wsStore.SendCommandToWS({
    command: 2,
    payload: {
      stop: !event,
    },
  })
}

</script>

<style scoped>

</style>
