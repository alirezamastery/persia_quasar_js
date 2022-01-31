<template>
  <div class="q-pa-sm">
    <q-input
      v-model="date"
      :label="$t(filterData.label)"
      mask="date"
      filled
    >
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
            <q-date v-model="date" @update:model-value="() => $refs.qDateProxy.hide()">
              <div class="row items-center justify-end">
                <q-btn
                  v-close-popup
                  :label="$t('general.cancel')"
                  color="primary"
                  flat
                />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>

<script setup>
import {ref, watch, computed} from 'vue'
import useGeneralStore from 'src/stores/general'

const emits = defineEmits(['date-change'])

const props = defineProps({
  filterData: {
    type: Object,
    required: true,
    default: () => ({}),
  },
})

const date = ref(null)
const proxyDate = ref(null)
const inputValue = ref(null)


const generalStore = useGeneralStore()

const resetSignal = computed(() => generalStore.tableFilterResetSignal)


watch(date, (val) => emits('date-change', val))
watch(() => resetSignal, () => date.value = null)

function updateProxy() {
  proxyDate.value = date.value
}

function save() {
  date.value = proxyDate.value
}
</script>
