<template>
  <div class="q-ma-md q-pa-sm">

    <div class="text-h5">{{ $t('products.brands') }}</div>
    <div class="q-ma-sm row q-gutter-md">
      <q-btn
        v-for="brand in brands"
        :key="brand.id"
        color="green"
        size="xl"
        @click="handleBrandSelect(brand.id)"
      >
        {{ brand.title }}
      </q-btn>
    </div>

    <template v-if="actualProducts.length > 0">
      <q-separator class="q-my-lg" inset/>
      <div class="text-h5">{{ $t('products.actualProducts') }}</div>
      <div class="q-ma-sm row q-gutter-sm">
        <q-btn
          v-for="actual in actualProducts"
          :key="actual.id"
          color="primary"
          size="lg"
          @click="handleActualProductSelect(actual.id)"
        >
          {{ actual.title }}
        </q-btn>
      </div>
    </template>

    <template v-if="variants.length > 0">
      <q-separator class="q-my-lg" inset/>
      <div class="text-h5">{{ $t('products.variants') }}</div>
      <div class="q-ma-sm row q-gutter-sm">
        <q-btn
          v-for="variant in variants"
          :key="variant.id"
          color="primary"
          flat
        >
          {{ `${variant.product.title} ${variant.selector_values[0].value}` }}
        </q-btn>
      </div>
    </template>

  </div>
</template>

<script setup>
import {ref} from 'vue'
import urls from 'src/urls'

import {axiosInstance} from 'src/boot/axios'

const brands = ref(null)
const actualProducts = ref([])
const variants = ref([])

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
    })
}

function handleActualProductSelect(id) {
  const url = urls.actualProducts + id + '/'
  axiosInstance.get(url)
    .then(res => {
      console.log('handleActualProductSelect', res.data)
      variants.value = res.data.variants
    })
}

</script>

<style scoped>

</style>
