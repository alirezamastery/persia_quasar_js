<template>
  <q-select
    v-model="selectedValue"
    :input-debounce="200"
    :label="label"
    :options="items"
    :multiple="selectMultiple"
    :autocomplete="objUniqueId"
    use-input
    clearable
    filled
    use-chips
    @filter="handleSearchInput"
    :error-message="errors"
    :error="errors?.length > 0"
    :rules="rules"
  >
    <!--    :rules="[val => (isRequired || !!val) || $t('general.error.fieldIsRequired')]"-->

    <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps">
        <q-item-section>
          <q-item-label>{{ scope.opt[objReprField] }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>

    <template v-slot:selected-item="scope">
      <template v-if="typeof scope.opt === 'string'">
        {{ scope.opt }}
      </template>
      <template v-else>
        <template v-if="selectMultiple">
          <q-chip
            removable
            @remove="scope.removeAtIndex(scope.index)"
            :tabindex="scope.tabindex"
          >
            {{ scope.opt[objReprField] }}
          </q-chip>
        </template>
        <template v-else>
          {{ scope.opt[objReprField] }}
        </template>
      </template>
    </template>

    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">
          {{ $t('general.noItemsFound') }}
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup>
import {ref, watch, reactive} from 'vue'
import {axiosInstance} from '../boot/axios'
import {isEqual} from 'lodash'
import {isRequired} from 'src/composables/form-validation'

const props = defineProps({
  modelValue: {type: [Number, Array, String]},
  name: String,
  objUniqueId: {type: String, default: 'id'},
  objReprField: {type: String, default: 'title'},
  label: String,
  api: String,
  queryParam: String,
  selectMultiple: {type: Boolean, default: false},
  isRequired: {type: Boolean, default: false},
  rules: {type: Array, required: false, default: () => ([])},
  errors: {type: String, required: false, default: ''},
  listQueryParam: {type: String, required: false, default: 'ids[]'},
  listApi: {type: String, required: false, default: 'get_by_list/'},
})

const emits = defineEmits(['update', 'update:modelValue', 'new-selection'])

const loading = ref(false)
const items = ref([])
const selectedValue = ref(null)


function handleSearchInput(val, update, abort) {
  console.log('handleSearchInput', val, update)
  update(
    () => {
      loading.value = true
      const url = `${props.api}?${props.queryParam}=${val}`
      console.log('url', url)
      axiosInstance.get(url)
        .then(res => {
          console.log('handleSearchInput response:', res)
          items.value = res.data.items
        })
        .catch(err => {
          console.log('handleSearchInput error:', err)
        })
        .finally(() => loading.value = false)
    },
    ref => {
      // you can make changes to the q-select in this function
    },
  )
}


/**
 * because this component only works with id or array of ids, we have to
 * get the related object of each id from the server so we can display
 * its title (or whatever the __repr__ is) to the user
 */
watch(() => props.modelValue, (newVal, oldVal) => {
  console.log('watch modelValue', newVal)
  if (newVal === null || newVal === undefined) return
  if (Array.isArray(newVal)) {
    console.log('newVal.length', newVal.length, 'isEqual', isEqual(newVal, oldVal))
    if (newVal.length > 0 && !isEqual(newVal, oldVal))
      getInitialData(newVal)
  } else if (newVal !== oldVal) {
    getInitialData(newVal)
  }
})

function getInitialData(modelVal) {
  if (!modelVal) return
  if (typeof modelVal === 'string' || typeof modelVal === 'number') {
    axiosInstance.get(props.api + modelVal)
      .then(res => {
        console.log('initial model value', res)
        selectedValue.value = res.data
      })
  } else {
    let query = '?'
    for (const id of modelVal) {
      query += `&${props.listQueryParam}=${id}`
    }
    const url = props.api + props.listApi + query
    console.log('url:', url)
    axiosInstance.get(url)
      .then(res => {
        console.log('initial data to populate', res)
        selectedValue.value = res.data
      })
  }
}

/**
 * it might be necessary to split this into 2 components if the
 * logic for single and multiple selection gets more complicated
 */
watch(selectedValue, (newValue) => {
  if (Array.isArray(selectedValue.value)) {
    const data = newValue.map(item => item[props.objUniqueId])
    console.log('emit payload', data)
    emits('update:modelValue', data)
  } else if (newValue !== null && typeof newValue === 'object')
    emits('update:modelValue', newValue[props.objUniqueId])
  else
    emits('update:modelValue', newValue)
})

console.log('initial modelValue', props.modelValue)

axiosInstance.get(props.api)
  .then(res => {
    items.value = res.data.items
  })
</script>
