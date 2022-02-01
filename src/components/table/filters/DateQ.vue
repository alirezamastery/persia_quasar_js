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
            <q-date
              v-model="date"
              @update:model-value="() => $refs.qDateProxy.hide()"
              calendar="persian"
              today-btn
            >
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
import {useQuasar} from 'quasar'
import moment from 'moment-jalaali'

const emits = defineEmits(['date-change'])

const props = defineProps({
  filterData: {
    type: Object,
    required: true,
    default: () => ({}),
  },
})

const q = useQuasar()

const date = ref(null)
const proxyDate = ref(null)
const inputValue = ref(null)


const generalStore = useGeneralStore()

const resetSignal = computed(() => generalStore.tableFilterResetSignal)


watch(date, (val) => {
    let payload = val
    if (!val)
      payload = null
    if (val && q.lang.isoName === 'fa') {
      payload = moment(val, 'jYYYY/jMM/jDD').format('YYYY-MM-DD')
    }
    emits('date-change', payload)
  },
)
watch(() => resetSignal.value, () => date.value = null)

function updateProxy() {
  proxyDate.value = date.value
}

function save() {
  date.value = proxyDate.value
}
</script>
