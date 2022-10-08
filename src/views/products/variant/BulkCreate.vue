<template>
  <div class="fit" :class="$q.screen.gt.sm ? 'q-pa-md' : 'q-pa-sm'">

    <div class="text-h5 q-ma-md">{{ formTitle }}</div>

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
          <q-input
            v-model="form.price_min"
            :label="$t('general.priceMinRial')"
            filled
            :rules="[isRequired]"
          />
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

      <q-separator class="q-my-md"/>

      <div class="text-h6 q-mb-md">
        {{ $t('products.variants') }}
      </div>

      <!-- key=i is necessary because if dkpc is used, it will change by each character and input loses focus -->
      <div
        v-for="(variant , i) in form.variants"
        class="row q-gutter-sm q-pa-sm"
        :key="i"
      >
        <div class="col col-xs-10 col-sm-5 col-md-5 col-lg-3 col-xl-2">
          <AutoComplete
            v-model="variant.selector.id"
            :hint="$t('products.selectorValues')"
            :query-param="'search'"
            :obj-repr-field="'value'"
            :api="urls.variantSelectors"
            :rules="[isRequired]"
            :filled="false"
            outlined
          />
        </div>
        <div class="col col-xs-10 col-sm-5 col-md-5 col-lg-3 col-xl-2">
          <q-input
            v-model="variant.dkpc"
            :hint="$t('products.DKPC')"
            :rules="[isRequired]"
            outlined
          />
        </div>
        <div class="q-pt-sm col-1">
          <q-btn
            v-if="i === form.variants.length - 1"
            icon="add"
            color="primary"
            round
            flat
            @click="addVariantInput"
          />
          <q-btn
            v-else
            icon="remove"
            color="red"
            round
            flat
            @click="removeVariantInput(i)"
          />
        </div>
      </div>

      <FormActions :show-delete="false"/>

    </q-form>

  </div>
</template>

<script setup>
import {reactive, watch} from 'vue'
import FormActions from 'src/components/addEdit/FormActions.vue'
import AutoComplete from 'src/components/AutoComplete.vue'
import {isRequired} from 'src/composables/form-validation'
import {axiosInstance} from 'src/boot/axios'
import urls from 'src/urls'
import {useI18n} from 'vue-i18n'
import {formatIntNumber, removeCommas} from 'src/composables/number-tools'
import useGeneralStore from 'src/stores/general'
import {addBanner, notifyMessage} from 'src/composables/notif'
import {routerInstance} from 'src/router'

const {t} = useI18n()
const generalStore = useGeneralStore()
const formTitle = `${t('general.bulkCreate')} ${t('products.variant')}`
const form = reactive({
  product: {id: null},
  actual_product: {id: null},
  price_min: null,
  is_active: true,
  variants: [{
    dkpc: null,
    selector: {id: null},
  }],
})

watch(() => form.price_min, (newVal) => {
  form.price_min = formatIntNumber(newVal)
})

function addVariantInput() {
  form.variants.push({
    dkpc: null,
    selector: {id: null},
  })
}

function removeVariantInput(index) {
  form.variants.splice(index, 1)
}


function validateVariants() {
  generalStore.ClearBanners()
  const selectorIds = form.variants.map(variant => variant.selector.id)
  if (form.variants.length !== new Set(selectorIds).size) {
    notifyMessage('negative', t('general.snack.duplicateSelector'))
    return false
  }
  const dkpcList = form.variants.map(variant => variant.dkpc)
  if (form.variants.length !== new Set(dkpcList).size) {
    notifyMessage('negative', t('general.snack.duplicateDkpc'))
    return false
  }
  return true
}

function saveItem() {
  if (!validateVariants()) return
  const data = {
    product: form.product.id,
    actual_product: form.actual_product.id,
    price_min: parseInt(removeCommas(form.price_min)),
    is_active: form.is_active,
    variants: form.variants.map(v => ({dkpc: v.dkpc, selector: v.selector.id})),
  }
  console.log('form:', data)
  axiosInstance.post(urls.variantBulkCreate, data)
    .then(res => {
      console.log('save success', res.data)
      addBanner(t('general.alert.saveSuccessGeneral', {type: t('products.variant')}))
      routerInstance.push({name: 'variantList'})
    })
    .catch(err => console.log('bulk create error:', err))
}
</script>

