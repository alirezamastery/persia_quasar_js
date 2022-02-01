<template>
  <q-toolbar
    class="row q-pa-md q-mb-sm flex items-center justify-between"
  >
    <div class="col">
      <span class="text-h5">{{ title }}</span>
    </div>
    <q-space/>
    <q-btn
      v-if="!hideCreateBtn"
      color="primary"
      class="q-mr-sm"
      @click="$router.push({name: addRoute})"
    >
      {{ $t('general.create') }}
    </q-btn>
  </q-toolbar>
</template>

<script>
export default {
  name: 'Header',
  props: {
    title: {
      type: String,
      required: false,
    },
    addRoute: {
      type: String,
      required: true,
    },
    hideCreateBtn: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
}
</script>

<style scoped>

</style>
