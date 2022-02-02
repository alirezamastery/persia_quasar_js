<template>
  <div class="q-ma-md q-pa-sm">

    <div class="text-h5 q-mb-sm">{{ $t('products.brands') }}</div>
    <div class="row q-col-gutter-sm">
      <div
        v-for="brand in brands"
        :key="brand.id"
        class="col-xs-12 col-sm-6 col-md-4 col-lg-2 col-xl-1"
      >
        <q-btn
          color="green"
          size="xl"
          class="full-width"
          @click="handleBrandSelect(brand.id)"
        >
          {{ brand.title }}
        </q-btn>
      </div>

    </div>

    <template v-if="actualProducts.length > 0">
      <q-separator class="q-my-lg" inset/>
      <div class="text-h5 q-mb-sm">{{ $t('products.actualProducts') }}</div>
      <div class="row q-col-gutter-sm">
        <div
          v-for="actual in actualProducts"
          :key="actual.id"
          class="col-xs-12 col-sm-6 col-md-4 col-lg-2"
        >
          <q-btn
            color="primary"
            size="lg"
            class="full-width full-height"
            @click="handleActualProductSelect(actual.id)"
          >
            {{ actual.title }}
          </q-btn>
        </div>

      </div>
    </template>

    <template v-if="variants.length > 0">
      <q-separator class="q-my-md" inset/>
      <div class="text-h5 q-mb-sm">{{ $t('products.variants') }}</div>
      <div class="row q-col-gutter-sm">
        <div
          v-for="variant in variants"
          :key="variant.id"
          class="col-xs-12 col-sm-6 col-lg-4"
        >
          <q-btn
            color="primary"
            flat
            @click="handleVariantSelect(variant.id)"
          >
            {{ `${variant.product.title} ${variant.selector_values[0].value}` }}
          </q-btn>
        </div>
      </div>
    </template>

    <template v-if="variant">
      <q-separator class="q-my-lg" inset/>
      <Variant :variant="variant"/>
    </template>

  </div>
</template>

<script setup>
import {ref} from 'vue'
import urls from 'src/urls'
import Variant from './Variant.vue'

import {axiosInstance} from 'src/boot/axios'
import {notifyErrors} from 'src/composables/notif'

const brands = ref(null)
const actualProducts = ref([])
const variants = ref([])
const variant = ref(null)

axiosInstance.get(urls.brandsAll)
  .then(res => {
    console.log('brands', res.data)
    brands.value = res.data
  })

function handleBrandSelect(brandId) {
  const url = urls.actualProductByBrand + `?brand_id=${brandId}`
  axiosInstance.get(url)
    .then(res => {
      console.log('actuala', res.data)
      actualProducts.value = res.data
      variants.value = []
      variant.value = null
    })
}

function handleActualProductSelect(id) {
  const url = urls.actualProducts + id + '/'
  axiosInstance.get(url)
    .then(res => {
      console.log('handleActualProductSelect', res.data)
      variants.value = res.data.variants
      variant.value = null
    })
}


function handleVariantSelect(id) {
  const url = urls.variantDigiData + id + '/'
  axiosInstance.get(url)
    .then(res => {
      console.log('handleVariantSelect')
      variant.value = res.data
    })
    .catch(err => {
      notifyErrors(err.response.data)
    })
}

</script>

<style scoped>

</style>
