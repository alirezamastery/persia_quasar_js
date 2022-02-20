<template>
  <div class="q-ma-sm-sm q-ma-md-xl q-pa-md">
    <template v-if="loaded">
      <div v-if="variants.length === 0">
        {{ $t('general.noItemsFound') }}
      </div>
      <template
        v-else
        v-for="variant in variants"
        :key="variant.id"
      >
        <Variant :variant="variant"/>
        <div class="q-my-lg"></div>
      </template>
    </template>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {axiosInstance} from '../../../boot/axios'
import urls from '../../../urls'
import {useI18n} from 'vue-i18n'
import {cloneDeep} from 'lodash'
import Variant from 'src/components/Variant.vue'

const {t} = useI18n()

// const items = ref([])
const digiItems = ref([])
const variants = ref([])
const loaded = ref(false)

const gotPersiaData = ref(false)
const pagination = ref({
  rowsNumber: 100,
})
const columns = [
  {name: 'title', label: t('general.title'), field: 'product_variant_title', align: 'left'},
  {name: 'dkpc', label: t('general.dkpc'), field: 'product_id', align: 'left'},
]

axiosInstance.get(urls.inactiveVariants)
  .then(res => {
    console.log('inactive variants:', res)
    digiItems.value = res.data.items
    fetchPersiaData()
  })

function fetchPersiaData() {
  let query = '?'
  for (const item of digiItems.value) {
    query += `&dkpc[]=${item.id}`
  }
  const url = urls.variants + 'get_by_list/' + query
  axiosInstance.get(url)
    .then(res => {
      console.log('persia data:', res)
      constructData(res.data)
    })
}

function constructData(resData) {
  const data = cloneDeep(resData)
  const result = []
  for (const variant of data) {
    for (const digiItem of digiItems.value) {
      const temp = cloneDeep(variant)
      if (digiItem.id === variant.dkpc) {
        temp['is_digi_active'] = digiItem['isActive']
        temp['our_stock'] = digiItem['marketplace_seller_stock_latin']
        temp['reserved'] = digiItem['reservation_latin']
        temp['warehouse_stock'] = digiItem['warehouse_stock_latin']
        temp['price'] = digiItem['price_sale_latin']
        temp['maximum_per_order'] = digiItem['maximum_per_order_latin']
        temp['image_src'] = digiItem['image_src']
        result.push(temp)
      }
    }
  }
  console.log('combined result:', result)
  variants.value = result
  loaded.value = true
}
</script>
