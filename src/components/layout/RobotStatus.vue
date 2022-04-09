<template>
  <q-toggle
    v-model="robotIsOn"
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
import useRobotStore from 'src/stores/robot'
import GearsMotionless from '../static/GearsMotionless.vue'

const robotStore = useRobotStore()

const robotIsOn = ref(false)
const updatingStatus = ref(false)
const robotRunning = computed(() => robotStore.robotRunning)

watch(() => robotStore.robotIsOn, (newVal) => {
  robotIsOn.value = newVal
  updatingStatus.value = false
})

function updateRobotStatus(event) {
  console.log('event:', event)
  updatingStatus.value = true
  robotStore.SendCommandToWS({
    'command': 2,
    'payload': {
      'stop': !event,
    },
  })
}

</script>

<style scoped>

</style>
