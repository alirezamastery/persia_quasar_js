<template>
  <q-pagination
    v-model="pageValue"
    :max="5"
    :disable="tableLoading"
    boundary-numbers
    @update:model-value="emits('page-select', $event)"
    direction-links
  />
  <q-select
    v-model="pageSizeValue"
    :options="pageSizeOptions"
    style="max-width: 90px"
    @update:model-value="$emit('page-size-select', $event)"
  />
</template>

<script setup>
import {ref, watch} from 'vue'

const emits = defineEmits(['page-select', 'page-size-select'])
const props = defineProps({
  page: {type: Number, required: true},
  pageSize: {type: Number, required: true},
  pageSizeOptions: {
    type: Array,
    required: false,
    default: () => [10, 20, 50, 100],
  },
  tableLoading: {type: Boolean, required: false},
  totalVisible: {type: Number, required: false, default: 7},
  pageCount: {type: Number, required: true},
  totalCount: {type: Number, required: true},
})

const pageValue = ref(props.page)
const pageSizeValue = ref(props.pageSize)

watch(() => props.page, (newValue) => pageValue.value = newValue)
watch(() => props.pageSize, (newValue) => pageSizeValue.value = newValue)
</script>
