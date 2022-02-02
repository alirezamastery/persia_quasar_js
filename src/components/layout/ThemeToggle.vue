<template>
  <q-btn
    v-if="q.dark.isActive"
    text-color="amber"
    icon="light_mode"
    class="bg-transparent"
    @click="q.dark.toggle"
    flat
  />
  <q-btn
    v-else
    text-color="black"
    icon="dark_mode"
    class="bg-transparent"
    @click="q.dark.toggle"
    flat
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
