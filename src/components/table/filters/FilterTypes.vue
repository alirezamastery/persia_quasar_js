<template>
  <div
    v-if="uiType === 'radioDual'"
    class="q-gutter-sm column q-pa-sm"
  >
    <span class="flex justify-center">{{ $t(filter.label) }}</span>
    <q-radio v-model="inputValue" :label="$t('general.all')" :val="null" dense/>
    <q-radio v-model="inputValue" :label="$t('general.yes')" :val="true" dense/>
    <q-radio v-model="inputValue" :label="$t('general.no')" :val="false" dense/>
  </div>

  <q-select
    v-else-if="uiType === 'select'"
    v-model="inputValue"
    :options="filter.options"
    :label="$t(filter.label)"
    dense
    filled
    class="q-pa-sm"
  />

  <DateQ
    v-else-if="uiType === 'date'"
    :filter-data="filter"
    @date-change="inputValue = $event"
  />

  <div v-else>Invalid Filter type</div>
</template>

<script setup>
import {ref, computed, watch} from 'vue'
import DateQ from './DateQ.vue'
import useGeneralStore from 'src/stores/general'

const emits = defineEmits(['update', 'update:modelValue'])
const props = defineProps({
  modelValue: [String, Number, Boolean],
  filter: {
    type: Object,
    required: true,
  },
  resetSignal: {type: [Number, Boolean], required: true, default: 0},
})

const generalStore = useGeneralStore()

const inputValue = ref(props.modelValue)

const resetSignal = computed(() => generalStore.tableFilterResetSignal)
const uiType = computed(() => {
  const type = props.filter.type
  if (type === 'boolean') {
    return 'radioDual'
  }
  return type
})

if (props.filter.type === 'boolean') {
  inputValue.value = null
}

watch(() => resetSignal.value, () => inputValue.value = null)
watch(inputValue, () => {
  emits('update:modelValue', inputValue.value)
})

</script>

