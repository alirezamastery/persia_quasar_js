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
import useWebSocketStore from 'src/stores/robot'
import GearsMotionless from '../../static/GearsMotionless.vue'

const wsStore = useWebSocketStore()

const updatingStatus = ref(false)
const robotRunning = computed(() => wsStore.robotRunning)
const robotIsOn = computed(() => wsStore.robotIsOn)

function updateRobotStatus(event) {
  console.log('event:', event)
  wsStore.SendCommandToWS({
    'command': 2,
    'payload': {
      'stop': !event,
    },
  })
}

</script>

<style scoped>

</style>
