<template>
  <q-input
    v-model="date"
    :label="label"
    mask="date"
    filled
    :rules="required ? [isRequired] : []"
  >
    <template v-slot:append>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
          <q-date
            v-model="date"
            :calendar="q.lang.isoName === 'fa' ? 'persian' : 'gregorian'"
            mask="YYYY-MM-DD"
            today-btn
            @update:model-value="() => $refs.qDateProxy.hide()"
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
</template>

<script setup>
import {ref, watch} from 'vue'
import {isRequired} from 'src/composables/form-validation'
import moment from 'moment-jalaali'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'


const q = useQuasar()
const {t} = useI18n()

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: String,
  required: {type: Boolean, required: false, default: true},
  label: {type: String, required: false, default: 'date'},
})


const date = ref(null)
watch(() => props.modelValue, (newVal, oldVal) => {
  console.log('first val', newVal, oldVal)
  let n = newVal
  if (newVal && q.lang.isoName === 'fa') {
    n = moment(newVal, 'jYYYY/jMM/jDD').format('YYYY-MM-DD')
  }
  console.log('nnn' , n)
  if (n !== oldVal)
    date.value = n
})
watch(date, (val) => {
    let payload = val
    if (!val)
      payload = null
    if (val && q.lang.isoName === 'fa') {
      payload = moment(val, 'jYYYY/jMM/jDD').format('YYYY-MM-DD')
    }
    console.log('emit the date', payload)
    emits('update:modelValue', payload)
  },
)

</script>
