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
    :loading="loading"
    @filter="handleSearchInput"
    @virtual-scroll="onScroll"
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

const nextPage = ref('')


function onScroll({index, to, ref}) {
  const lastIndex = items.value.length - 1
  console.log('AutoComplete | onScroll lastIndex:', lastIndex, 'to:', to, 'index:', index)

  if (loading.value !== true && !!nextPage.value && to === index) {
    console.log('AutoComplete | onScroll get data')

    loading.value = true

    axiosInstance.get(nextPage.value)
      .then(res => {
        console.log('AutoComplete | onScroll response:', res)
        // for (const item of res.data.items) {
        //   items.value.push(item) // must use ".value.push" to add to ref array
        // }
        items.value.push(...res.data.items)
        console.log(items.value)
        console.log('length items:' , items.value.length)
        nextPage.value = res.data.next
        ref.refresh()
      })
      .catch(err => {
        console.log('AutoComplete | onScroll error:', err)
      })
      .finally(() => loading.value = false)
  }
}

function handleSearchInput(val, update, abort) {
  // console.log('handleSearchInput', val)
  update(
    () => {
      if(!val) return
      loading.value = true
      const url = `${props.api}?${props.queryParam}=${val}`
      console.log('url', url)
      axiosInstance.get(url)
        .then(res => {
          console.log('AutoComplete | handleSearchInput response:', res)
          items.value = res.data.items
          nextPage.value = res.data.next
        })
        .catch(err => {
          console.log('AutoComplete | handleSearchInput error:', err)
        })
        .finally(() => loading.value = false)
    },
    ref => {
      // ref is the q-select itself. you can make changes to the q-select in this function
      if (val !== '' && ref.options.length > 0) {
        ref.setOptionIndex(-1) // reset optionIndex in case there is something selected
        ref.moveOptionSelection(1, true) // focus the first selectable option and do not update the input-value
      }
    },
  )
}


/**
 * because this component only works with id or array of ids, we have to
 * get the related object of each id from the server so we can display
 * its title (or whatever the __repr__ is) to the user
 */
watch(() => props.modelValue, (newVal, oldVal) => {
  console.log('AutoComplete | watch modelValue', newVal)
  if (newVal === null || newVal === undefined) return
  if (Array.isArray(newVal)) {
    // console.log('newVal.length', newVal.length, 'isEqual', isEqual(newVal, oldVal))
    if (newVal.length > 0 && !isEqual(newVal, oldVal))
      getInitialDataToDisplay(newVal)
  } else if (newVal !== oldVal) {
    getInitialDataToDisplay(newVal)
  }
})

/**
 * if we are in an Edit view (we have primary key(s)), get the data from
 * the server to display in the input field as chips
 */
function getInitialDataToDisplay(modelVal) {
  console.log('AutoComplete | modelVal', modelVal)
  if (!modelVal) return
  if (typeof modelVal === 'string' || typeof modelVal === 'number') {
    axiosInstance.get(props.api + modelVal)
      .then(res => {
        console.log('AutoComplete | initial model value', res)
        selectedValue.value = res.data
      })
  } else {
    let query = '?'
    for (const id of modelVal) {
      query += `&${props.listQueryParam}=${id}`
    }
    const url = props.api + props.listApi + query
    // console.log('url:', url)
    axiosInstance.get(url)
      .then(res => {
        console.log('AutoComplete | initial data to populate', res)
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
    // console.log('emit payload', data)
    emits('update:modelValue', data)
  } else if (newValue !== null && typeof newValue === 'object')
    emits('update:modelValue', newValue[props.objUniqueId])
  else
    emits('update:modelValue', newValue)
})

console.log('AutoComplete | auto complete initial modelValue:', props.modelValue)
if (props.modelValue) // if this is true it means we are in an Edit view
  getInitialDataToDisplay(props.modelValue)

axiosInstance.get(props.api)
  .then(res => {
    items.value = res.data.items
    nextPage.value = res.data.next
  })
</script>
