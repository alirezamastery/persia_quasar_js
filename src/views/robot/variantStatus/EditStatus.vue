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
          size="lg"
          class="full-width"
          :class="selectedBtnClass(brand.id === selectedIds.brand, $q.dark.isActive)"
          @click="handleBrandSelect(brand.id)"
        >
          {{ brand.title }}
        </q-btn>
      </div>
    </div>

    <template v-if="actualProducts.length > 0">
      <q-separator class="q-my-lg" inset id="actual-product"/>
      <div class="text-h6 q-mb-sm">{{ $t('products.actualProducts') }}</div>
      <div class="row q-col-gutter-sm">
        <div
          v-for="actual in actualProducts"
          :key="actual.id"
          class="col-xs-12 col-sm-6 col-md-4 col-lg-2"
        >
          <q-btn
            color="primary"
            size="md"
            class="full-width full-height"
            :class="selectedBtnClass(actual.id === selectedIds.actualProduct, $q.dark.isActive)"
            @click="handleActualProductSelect(actual.id)"
          >
            {{ actual.title }}
          </q-btn>
        </div>
      </div>
    </template>

    <template v-if="relatedSelectors.length > 0">
      <q-separator class="q-my-md" inset id="selectors"/>
      <div class="text-h6 q-mb-sm">{{ $t('products.selectors') }}</div>
      <div class="row q-col-gutter-sm">
        <div
          v-for="selector in relatedSelectors"
          :key="selector.id"
          class="col-xs-12 col-sm-6 col-md-2 col-lg-1"
        >
          <q-btn
            flat
            rounded
            :style="selectorStyles(selector)"
            @click="handleRelatedSelectorSelect(selector.id)"
          >
            <div class="no-wrap row">
              <span>{{ selector.value }}</span>
              <q-icon v-if="selector.id === selectedIds.selector" name="check_circle" class="q-mx-sm"/>
            </div>
          </q-btn>
        </div>
      </div>
    </template>

    <template v-if="variants.length > 0">
      <q-separator class="q-my-md" inset id="variants"/>
      <div class="text-h6 q-mb-sm">{{ $t('products.variants') }}</div>
      <div class="row q-col-gutter-sm">
        <div
          v-for="variant in variants"
          :key="variant.id"
          class="col-xs-12 col-sm-6 col-lg-4"
        >
          <q-btn
            color="primary"
            @click="handleVariantSelect(variant.id)"
            :class="selectedBtnClass(variant.id === selectedIds.variant,$q.dark.isActive)"
          >
            {{ `${variant.product.title} ${variant.selector_values[0].value}` }}
          </q-btn>
        </div>
      </div>
    </template>

    <template v-if="variant">
      <q-separator class="q-my-lg" inset id="variant"/>
      <Variant :variant="variant"/>
    </template>

  </div>
</template>

<script setup>
import {ref, nextTick} from 'vue'
import urls from 'src/urls'
import Variant from './Variant.vue'
import {axiosInstance} from 'src/boot/axios'
import {notifyAxiosError, notifyErrors} from 'src/composables/notif'
import {scroll} from 'quasar'

const {getScrollTarget, setVerticalScrollPosition} = scroll


const brands = ref([])
const actualProducts = ref([])
const relatedSelectors = ref([])
const variants = ref([])
const variant = ref(null)
const selectedIds = ref({
  brand: null,
  actualProduct: null,
  selector: null,
  variant: null,
})

axiosInstance.get(urls.brandsAll)
  .then(res => {
    console.log('brands:', res.data)
    brands.value = res.data
  })

function scrollToElement(el) {
  const target = getScrollTarget(el)
  el.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'})
}

function handleBrandSelect(brandId) {
  selectedIds.value.brand = brandId
  const url = urls.actualProductByBrand.replace('{0}', brandId)
  axiosInstance.get(url)
    .then(async (res) => {
      console.log('actual products:', res.data)
      actualProducts.value = res.data
      relatedSelectors.value = []
      variants.value = []
      variant.value = null
      await nextTick()
      const el = document.getElementById('actual-product')
      el.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'})
    })
}


function handleActualProductSelect(id) {
  const url = urls.actualProducts + `${id}/related_selectors/`
  console.log('url:', url)
  selectedIds.value.actualProduct = id
  axiosInstance.get(url)
    .then(async (res) => {
      console.log('related selectors:', res.data)
      relatedSelectors.value = res.data
      variants.value = []
      variant.value = null
      await nextTick()
      const el = document.getElementById('selectors')
      el.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'})
    })
}

function handleRelatedSelectorSelect(selectorId) {
  const url = urls.robotVariantsFilter + `?actual_product_id=${selectedIds.value.actualProduct}&selector_id=${selectorId}`
  selectedIds.value.selector = selectorId
  axiosInstance.get(url)
    .then(async (res) => {
      console.log('variants:', res.data)
      variants.value = res.data
      variant.value = null
      await nextTick()
      const el = document.getElementById('variants')
      el.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'})
    })
}

function handleVariantSelect(id) {
  const url = urls.variantDigiData + id + '/'
  selectedIds.value.variant = id
  axiosInstance.get(url)
    .then(async (res) => {
      console.log('handleVariantSelect', res.data)
      variant.value = res.data
      await nextTick()
      const el = document.getElementById('variant')
      el.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'})
    })
    .catch(err => {
      notifyAxiosError(err)
    })
}

function selectorStyles(selector) {
  if (selector.selector.title === 'color')
    return {
      'background-color': selector['extra_info'],
      'color': 'black',
    }
  return {}
}

function selectedBtnClass(isSelected, isDark) {
  if (isSelected) {
    return 'bg-green text-white'
  } else if (isDark) {
    return 'bg-grey-4 text-grey-10'
  } else {
    return 'bg-grey-14 text-white'
  }
}
</script>
