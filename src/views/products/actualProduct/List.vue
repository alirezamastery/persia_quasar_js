<template>
  <Table
    :title="$t('products.actualProducts')"
    :columns="columns"
    :api-root="apiRoot"
    :edit-route="editRoute"
    :add-route="addRoute"
  >

    <template v-slot:col-title="{ props }">
      <q-btn :to="{name: editRoute, params: {id: props.row.id}}" dense flat>
        {{ props.row.title }}
      </q-btn>
    </template>

    <template v-slot:col-brand="{ props }">
      {{ props.row.brand ? props.row.brand.title : '-' }}
    </template>

    <template v-slot:col-price_step="{ props, data }">
      <q-select
        v-model="props.row.price_step"
        :options="priceStepOptions"
        @update:model-value="handlePriceStepChange(props.row.id, data , $event)"
        dense
        filled
        style="max-width: 100px"
      />
    </template>

  </Table>
</template>

<script setup>
import {useI18n} from 'vue-i18n'
import Table from 'src/components/table/Table.vue'
import urls from 'src/urls'
import {axiosInstance} from '../../../boot/axios'
import {notifyMessage} from 'src/composables/notif'

const {t} = useI18n()

const apiRoot = urls.actualProducts
const editRoute = 'actualProductEdit'
const addRoute = 'actualProductAdd'
const columns = [
  {name: 'title', label: t('general.title'), field: 'title', align: 'left'},
  {name: 'brand', label: t('products.brand'), field: 'brand', align: 'left'},
  {name: 'price_step', label: t('general.priceStepRial'), field: 'price_step', align: 'left'},
]

const priceStepOptions = [
  {label:'1,000',value: 1000},
  {label:'2,000',value:2000 },
  {label:'3,000',value: 3000},
  {label:'4,000',value: 4000},
  {label:'5,000',value: 5000},
]

function handlePriceStepChange(id, tableData, event) {
  console.log(id, event)
  const row = tableData.items.find(item => item.id === id)
  row['price_step'] = event
  console.log('row:', row)
  const url = apiRoot + id + '/'
  const payload = {
    'price_step': event.value,
  }
  axiosInstance.patch(url, payload).then(res => {
    console.log('res', res)
    notifyMessage('info', t('general.snack.saveSuccess'))
  })
}

</script>
