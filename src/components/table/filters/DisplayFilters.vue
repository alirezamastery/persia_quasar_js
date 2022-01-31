<template>
  <div class="col-xs-12 col-md-4 col-lg-3 col-xl-2 q-ma-sm rounded-borders">
    <div class="flex row justify-between q-pa-sm">
      <span>{{ $t('general.filters') }}</span>
    </div>
    <q-separator/>
    <template
      v-for="(filter, index) in filters"
      :key="index"
      class="q-pa-sm q-ma-sm"
    >
      <FilterTypes
        :filter="filter"
        :reset-signal="justForResetSignal"
        v-model="filterValues[filter.queryParam]"
      />
      <q-separator v-if="index < filters.length - 1"/>
    </template>
  </div>
</template>

<script setup>
import {ref, watch} from 'vue'
import FilterTypes from './FilterTypes.vue'

const emits = defineEmits(['filter-change'])

const props = defineProps({
  filters: {type: Array, required: true},
})

const filterValues = ref({})
const justForResetSignal = ref(0)
const showReset = ref(false)

watch(filterValues, (val) => {
  console.log('side filter | watch:', val)
  let finalQuery = ''
  let nullCount = 0
  for (const [key, value] of Object.entries(val)) {
    if (value === null)
      nullCount++
    else
      finalQuery += `&${key}=${value}`
  }
  showReset.value = nullCount !== Object.keys(val).length
  console.log('finalQuery:', finalQuery)
  emits('filter-change', finalQuery)
}, {deep: true})
</script>
