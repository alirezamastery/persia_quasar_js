<template>
  <div
    class="col-xs-12 col-md-3 col-lg-3 col-xl-2 q-mx-sm bordered"
    style="height: fit-content"
  >
    <div
      class="flex row justify-between q-pa-sm bg-soft"
      style="min-height: 40px"
    >
      <span>{{ $t('general.filters') }}</span>
      <q-space/>
      <q-btn
        v-if="Object.keys(filterValues).length > 0 && showReset"
        icon="refresh"
        class="bg-yellow text-black"
        size="xs"
        round
        @click="resetFilters"
      />
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
import useGeneralStore from 'src/stores/general'
import {useQuasar} from 'quasar'

const emits = defineEmits(['filter-change'])

const props = defineProps({
  filters: {type: Array, required: true},
})

const generalStore = useGeneralStore()

const q = useQuasar()

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
  emits('filter-change', finalQuery)
}, {deep: true})


function resetFilters() {
  filterValues.value = {}
  generalStore.ResetTableFilter()
}
</script>
