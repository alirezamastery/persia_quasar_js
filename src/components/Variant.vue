<template>
  <q-card bordered>
    <q-card-section>
      <!--  First Row START -->
      <div class="row items-center q-col-gutter-sm">
        <div class="col-xs-12 col-sm-3 col-md-1 col-lg-1 text-h6 flex flex-center">
          <img :src="variant.dk.product.image" alt="" style="max-width: 60px;max-height: 60px"/>
        </div>
        <q-btn
          type="a"
          target="_blank"
          class="col-xs-12 col-sm-9 col-md-5 col-lg-3 text-h6"
          color="blue"
          flat
          :href="`https://www.digikala.com/product/dkp-${variant.product.dkp}`"
        >
          {{ variant.product.title }}
        </q-btn>
        <q-btn
          flat
          rounded
          :glossy="variant.selector.selector_type.title === 'color'"
          class="col-xs-12 col-sm-6 col-md-2 col-lg-1 text-body1 q-my-sm"
          :style="visualizeVariantSelector(variant.selector)"
        >
          {{ variant.selector.value }}
        </q-btn>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-3 offset-lg-3">
          <q-toggle
            v-model="digiStatus"
            :label="$t('products.activeInDigi')"
            @update:model-value="handleDigiStatusUpdate"
            checked-icon="check"
            unchecked-icon="clear"
            size="lg"
          >
            <template v-slot:default v-if="loadingDigiStatus">
              <q-circular-progress indeterminate/>
            </template>
          </q-toggle>
        </div>
      </div>
      <!--  First Row END -->
    </q-card-section>

    <q-card-section>
      <!--  Second Row START -->
      <div class="row items-center q-col-gutter-sm">
        <div class="col-xs-12 col-md-6 col-lg-4">
          <div class="row items-center justify-between">
            <div class="col-6">
              <q-btn
                outline
                disable
              >
                {{ `${$t('products.ordered')}: ${variant.dk.stock.dk_reserved_stock}` }}
              </q-btn>
            </div>
            <div class="col-6">
              <q-btn
                outline
                disable
              >
                {{ `${$t('products.inDigiStock')}: ${variant.dk.stock.dk_stock}` }}
              </q-btn>
            </div>
          </div>
        </div>
        <!--  Digi data Inputs -->
        <div class="col-xs-12 col-md-8 col-lg-4">
          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-6">
              <q-input
                v-model="newPrice"
                :label="$t('general.priceRial')"
                :disable="loadingDigiData"
                filled
              />
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-input
                v-model="newStock"
                :label="$t('products.inventory')"
                :disable="loadingDigiData"
                filled
              />
            </div>
          </div>
        </div>
        <!--  Digi data Buttons -->
        <div
          v-show="showBtnDigi"
          class="col-xs-12 col-sm-12 col-md-4 col-lg-2"
        >
          <div v-if="loadingDigiData" class="row justify-center">
            <q-circular-progress
              indeterminate
              color="red"
              size="md"
            />
          </div>
          <div v-else class="row justify-center">
            <q-btn
              color="green"
              class="q-mx-sm"
              icon="done"
              @click="handleDigiDataUpdate"
            >
            </q-btn>
            <q-btn
              color="red"
              class="q-mx-sm"
              icon="block"
              @click="revertDigiChange"
            >
            </q-btn>
          </div>
        </div>
      </div>
      <!--  Second Row END -->
    </q-card-section>

    <q-separator/>

    <q-card-section>
      <!--  Third Row START -->
      <div class="row items-center q-col-gutter-sm">
        <!--  Robot Status -->
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4">
          <q-toggle
            v-model="robotStatus"
            :label="$t('products.robotActive')"
            checked-icon="bolt"
            unchecked-icon="power_settings_new"
            @update:model-value="handleRobotStatusUpdate"
            size="lg"
          >
            <template v-slot:default v-if="loadingDigiStatus">
              <q-circular-progress indeterminate/>
            </template>
          </q-toggle>
        </div>
        <!--  Persia Atlas Data Input -->
        <div class="col-xs-12 col-md-8 col-lg-4">
          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-6">
              <q-input
                v-model="newPriceMin"
                :label="$t('general.priceMinRial')"
                filled
              />
            </div>
            <div class="col-xs-12 col-sm-6">

              <q-input
                v-model="newStopLoss"
                :label="$t('acc.stopLoss')"
                filled
              />
            </div>
          </div>
        </div>
        <!--  Persia Atlas Data Buttons -->
        <div
          v-show="showBtnAtlas"
          class="col-xs-12 col-sm-6 col-md-4 col-lg-2"
        >
          <div v-if="loadingRobotStatus" class="row justify-center">
            <q-circular-progress
              indeterminate
              color="red"
            />
          </div>
          <div v-else class="row justify-center">
            <q-btn
              color="green"
              icon="done"
              class="q-mx-sm"
              @click="handleAtlasUpdate"
            />
            <q-btn
              color="red"
              icon="block"
              class="q-mx-sm"
              @click="revertAtlasDataChange"
            />
          </div>
        </div>
      </div>
      <!--  Third Row END -->
    </q-card-section>
  </q-card>
</template>

<script setup>
import {ref, computed, watch} from 'vue'
import {formatIntNumber, removeCommas} from 'src/composables/number-tools'
import {axiosInstance} from 'src/boot/axios'
import urls from 'src/urls'
import {notifyAxiosError, notifyMessage} from 'src/composables/notif'
import {useI18n} from 'vue-i18n'
import {visualizeVariantSelector} from '../utils'


const {t} = useI18n()

const props = defineProps({
  variant: Object,
})

const initialPriceMin = ref(null)
const newPriceMin = ref(null)
const initialPrice = ref(null)
const initialStock = ref(null)
const initialStopLoss = ref(null)
const newPrice = ref(null)
const newStock = ref(null)
const newStopLoss = ref(null)
const robotStatus = ref(null)
const digiStatus = ref(null)

const loadingDigiStatus = ref(false)
const loadingDigiData = ref(false)
const loadingRobotStatus = ref(false)
const loadingAtlasData = ref(false)

const showBtnDigi = computed(() => {
  const price = removeCommas(newPrice.value)
  return initialPrice.value !== price || initialStock.value !== newStock.value
})
const showBtnAtlas = computed(() => {
  const priceMin = removeCommas(newPriceMin.value)
  const stopLoss = removeCommas(newStopLoss.value)
  return initialPriceMin.value !== priceMin || initialStopLoss.value !== stopLoss
})

watch(newPrice, (newVal) => newPrice.value = formatIntNumber(newVal))
watch(newPriceMin, (newVal) => newPriceMin.value = formatIntNumber(newVal))
watch(newStopLoss, (newVal) => newStopLoss.value = formatIntNumber(newVal))
watch(() => props.variant, () => {
  setInitialValues()
})

setInitialValues()

function setInitialValues() {
  initialPriceMin.value = props.variant['price_min'].toString()
  newPriceMin.value = formatIntNumber(props.variant['price_min'].toString())
  initialPrice.value = props.variant.dk.price.selling_price.toString()
  initialStock.value = props.variant.dk.stock.seller_stock.toString()
  initialStopLoss.value = props.variant['stop_loss'].toString()
  newPrice.value = formatIntNumber(props.variant.dk.price.selling_price.toString())
  newStock.value = props.variant.dk.stock.seller_stock.toString()
  newStopLoss.value = formatIntNumber(props.variant['stop_loss'].toString())
  robotStatus.value = props.variant.is_active
  digiStatus.value = props.variant.dk.is_active
}

function revertDigiChange() {
  newPrice.value = initialPrice.value
  newStock.value = initialStock.value
}

function revertAtlasDataChange() {
  newPriceMin.value = initialPriceMin.value
  newStopLoss.value = initialStopLoss.value
}

function handleDigiStatusUpdate(event) {
  if (!!event && initialStock.value === '0') {
    notifyMessage('warning', t('general.snack.enterStockPLease'))
    digiStatus.value = !event
    return
  }
  const data = {
    'is_active': !!event,
  }
  digiStatus.value = !!event
  const url = urls.updateVariantData + props.variant.dkpc + '/'
  axiosInstance.post(url, data)
    .then(res => {
      console.log('handleDigiStatusUpdate | res', res)
      console.log('handleDigiStatusUpdate | digiStatus', digiStatus.value)
      notifyMessage('info', t('general.snack.saveSuccess'))
    })
    .catch(err => {
      console.log('handleDigiStatusUpdate | error', err.response?.data)
      digiStatus.value = !event
      // notifyAxiosError(err)
    })
    .finally(() => loadingDigiStatus.value = false)
}

function handleDigiDataUpdate() {
  loadingDigiData.value = true
  const data = {
    'price': removeCommas(newPrice.value),
    'seller_stock': newStock.value,
  }
  const url = urls.updateVariantData + props.variant.dkpc + '/'
  axiosInstance.post(url, data)
    .then(res => {
      console.log('handleDigiDataUpdate | res', res)
      const data = res.data
      initialPrice.value = data.price.selling_price.toString()
      initialStock.value = data.stock.seller_stock.toString()
      newPrice.value = initialPrice.value
      newStock.value = initialStock.value
      notifyMessage('info', t('general.snack.saveSuccess'))
    })
    .catch(err => {
      console.log('handleDigiDataUpdate | error', err)
    })
    .finally(() => loadingDigiData.value = false)
}

function handleRobotStatusUpdate(event) {
  loadingRobotStatus.value = true
  const data = {
    'is_active': !!event,
  }
  console.log('data', data)
  robotStatus.value = !!event
  axiosInstance.patch(`${urls.variants}${props.variant.id}/`, data)
    .then(res => {
      console.log('handleRobotStatusUpdate | res', res)
      robotStatus.value = res.data.is_active
      notifyMessage('info', t('general.snack.saveSuccess'))
    })
    .catch(err => {
      console.log('handleRobotStatusUpdate | error', err)
      robotStatus.value = !event
      // notifyAxiosError(err)
    })
    .finally(() => loadingRobotStatus.value = false)
}

function handleAtlasUpdate() {
  loadingAtlasData.value = true
  const data = {
    'price_min': parseInt(removeCommas(newPriceMin.value)),
    'stop_loss': parseInt(removeCommas(newStopLoss.value)),
  }
  axiosInstance.patch(`${urls.variants}${props.variant.id}/`, data)
    .then(res => {
      console.log('handleAtlasUpdate | res', res)
      initialPriceMin.value = res.data.price_min.toString()
      newPriceMin.value = initialPriceMin.value
      initialStopLoss.value = res.data.stop_loss.toString()
      newStopLoss.value = initialStopLoss.value
      notifyMessage('info', t('general.snack.saveSuccess'))
    })
    .catch(err => {
      console.log('handleAtlasUpdate | error', err)
      // notifyAxiosError(err)
    })
    .finally(() => loadingAtlasData.value = false)
}

</script>
