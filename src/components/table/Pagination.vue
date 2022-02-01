<template>
  <div class="row items-center justify-between q-pa-sm">
    <div class="col-12 col-lg-1 text-no-wrap">
      {{ countDisplay }}
    </div>
    <div class="col-12 col-md-6 col-lg-8 col-xl-9 flex justify-center">
      <q-pagination
        v-model="pageValue"
        :max="5"
        :disable="tableLoading"
        boundary-numbers
        direction-links
        @update:model-value="emits('page-select', $event)"
      />
    </div>
    <div
      class="col-4 col-md-5 col-lg-3 col-xl-2 flex"
      :class="[q.screen.gt.sm ? 'justify-end' : '']"
    >
      <q-select
        v-model="pageSizeValue"
        :options="pageSizeOptions"
        style="max-width: 90px"
        dense
        filled
        @update:model-value="$emit('page-size-select', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import {ref, computed, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'

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

const {t} = useI18n()

const q = useQuasar()

const pageValue = ref(props.page)
const pageSizeValue = ref(props.pageSize)

const countDisplay = computed(() => `${t('general.totalCount')}: ${props.totalCount}`)

watch(() => props.page, (newValue) => pageValue.value = newValue)
watch(() => props.pageSize, (newValue) => pageSizeValue.value = newValue)
</script>
