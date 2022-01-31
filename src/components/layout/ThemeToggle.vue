<template>
  <q-btn
    v-if="q.dark.isActive"
    round
    flat
    text-color="amber"
    icon="light_mode"
    class="q-mx-sm bg-transparent"
    @click="q.dark.toggle"
  />
  <q-btn
    v-else
    round
    flat
    text-color="black"
    icon="dark_mode"
    class="q-mx-sm bg-transparent"
    @click="q.dark.toggle"
  />
</template>

<script>
import { useQuasar } from 'quasar'

export default {
  name: 'ThemeToggle',
  setup() {
    const q = useQuasar()

    return { q }
  }
}
</script>

<style scoped>

</style>
