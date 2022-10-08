<template>
  <q-toolbar
    class="row q-pa-md q-mb-sm flex items-center justify-between"
  >
    <div class="col">
      <span class="text-h5">{{ title }}</span>
    </div>
    <template
      v-for="(link,i) in extraLinks"
      :key="i"
    >
      <q-btn
        color="primary"
        class="q-mr-sm"
        @click="$router.push({name:link.routeName})"
      >
        {{ link.title }}
      </q-btn>
    </template>
    <q-space/>
    <q-btn
      v-if="addRoute"
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
      required: false,
      default: null,
    },
    extraLinks: {
      type: Array,
      required: false,
      default: () => ([]),
    },
  },
}
</script>

<style scoped>

</style>
