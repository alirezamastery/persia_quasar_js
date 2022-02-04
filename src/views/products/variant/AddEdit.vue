<template>
  <div class="fit q-pa-sm">
    <div class="text-h6 q-ma-md">{{ formTitle }}</div>
    <q-form @submit.prevent="saveItem">
      <div class="row q-ma-sm">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <AutoComplete
            v-model="form.product.id"
            :label="$t('products.product')"
            :obj-repr-field="'title'"
            :query-param="'search'"
            :api="urls.products"
            :rules="[isRequired]"
          />
        </div>
      </div>

      <div class="row q-ma-sm">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <AutoComplete
            v-model="form.actual_product.id"
            :label="$t('products.actualProduct')"
            :query-param="'search'"
            :obj-repr-field="'title'"
            :api="urls.actualProducts"
            :rules="[isRequired]"
          />
        </div>
      </div>

      <div class="row q-ma-sm">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <AutoComplete
            v-model="form.selector.id"
            :label="$t('products.selectorValues')"
            :query-param="'search'"
            :obj-repr-field="'value'"
            :api="urls.productTypeSelectorValues"
            :rules="[isRequired]"
          />
        </div>
      </div>

      <div class="row q-ma-sm">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-input
            v-model="form.dkpc"
            :label="$t('products.DKPC')"
            filled
            :rules="[isRequired]"
          />
        </div>
      </div>

      <div class="row q-ma-sm">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-input
            v-model="form.price_min"
            :label="$t('general.priceMinToman')"
            filled
            :rules="[isRequired]"
          />
          <!-- SAMPLE ERROR FOR FUTURE: error-message="errors.price_min ? errors.price_min[0] : null"-->
        </div>
      </div>

      <div class="row q-ma-sm">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-checkbox
            v-model="form.is_active"
            :label="$t('products.isActive')"
          />
        </div>
      </div>

      <FormActions/>

    </q-form>
  </div>
</template>

<script setup>
import {computed, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {axiosInstance} from 'src/boot/axios'
import {cloneDeep} from 'lodash'
import {addBanner} from 'src/composables/notif'
import {formatIntNumber, removeCommas} from 'src/composables/number-tools'
import AutoComplete from 'src/components/AutoComplete.vue'
import FormActions from 'src/components/addEdit/FormActions'
import urls from 'src/urls'
import {isRequired} from 'src/composables/form-validation'
import {notifyErrors} from 'src/composables/notif'
import {useAddEdit} from '../../../composables/add-edit'

const router = useRouter()
const route = useRoute()
const {t} = useI18n()

const apiRoot = urls.variants
const listViewRoute = 'variantList'
const itemTypeTranslate = 'products.variant'
const form = ref({
  product: {id: null},
  dkpc: '',
  price_min: null,
  is_active: true,
  selector: {},
  actual_product: {},
})

const errors = ref({
  product: [],
  dkpc: [],
  price_min: [],
  is_active: [],
  selector: [],
  actual_product: [],
})

const {formTitle, initialize, saveItem, editingItemId} = useAddEdit(
  route.params.id,
  form,
  apiRoot,
  listViewRoute,
  ()
)

// const editingItemId = computed(() => route.params.id)
// const formTitle = computed(() => {
//   if (editingItemId.value)
//     return `${t('general.change')} ${t(itemTypeTranslate)}`
//   return t('general.createANew').replace('{0}', t(itemTypeTranslate))
// })
// const itemRepr = computed(() => form.value.dkpc.toString())

// function formInit(resData) {
//   const date = cloneDeep(resData)
//   form.value = date // very important to clone the response !!!
//   form.value.price_min = formatIntNumber(form.value.price_min.toString())
//   form.value.selector_values = date.selector_values.map(itm => itm.id)
// }

// function getRequestData() {
//   return {
//     product: form.value.product.id,
//     dkpc: form.value.dkpc,
//     has_competition: form.value.has_competition,
//     is_active: form.value.is_active,
//     price_min: parseInt(removeCommas(form.value.price_min)),
//     selector_values: form.value.selector_values,
//     actual_product: form.value.actual_product.id,
//   }
// }
//
// function saveItem() {
//   console.log('form', form.value)
//   const data = getRequestData()
//   console.log('save payload', data)
//
//   let url = apiRoot
//   if (editingItemId.value) url += `${editingItemId.value}/`
//   let method = editingItemId.value ? 'patch' : 'post'
//   axiosInstance.request({url, data, method})
//     .then(res => {
//       console.log('save success', res.data)
//       addBanner('success')
//       router.push({name: listViewRoute})
//     })
//     .catch(err => {
//       console.log('request error', err)
//       // errors.value = err.response.data
//       notifyErrors(err.response.data)
//     })
// }
//
// if (editingItemId.value) {
//   axiosInstance.get(apiRoot + editingItemId.value + '/')
//     .then(res => {
//       console.log('item details', res.data)
//       formInit(res.data) // handle ManyToMany relations data in "formInit" method
//     })
//   console.log('no details, getting the item details from server')
// }


</script>

<style scoped>

</style>
