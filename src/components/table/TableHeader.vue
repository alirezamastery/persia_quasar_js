<template>
  <div class="row q-pa-sm bg-soft">
    <q-input
      v-if="!hideSearch"
      v-model="searchPhrase"
      :label="$t('general.search')"
      debounce="300"
      color="primary"
      outlined
      dense
      hide-hint
      clearable
      @input="$emit('search-input', this.searchPhrase)"
    >
      <template v-slot:append>
        <q-icon name="search"/>
      </template>
    </q-input>
  </div>
</template>

<script>
export default {
  name: 'TableHeader',
  props: {
    hideSearch: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      searchPhrase: '',
    }
  },
}
</script>

<style scoped>

</style>
