<template>
  <Table
    :title="$t('products.products')"
    :columns="columns"
    :api-root="apiRoot"
    :edit-route="editRoute"
    :add-route="addRoute"
    :filters="filters"
    hide-edit
  >

    <template v-slot:col-title="{ props }">
      <q-btn :to="{name: editRoute, params: {id: props.row.id}}" color="light-blue" dense flat>
        {{ props.row.title }}
      </q-btn>
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

    <template v-slot:col-is_active="{ props }">
      <q-icon v-if="props.row.is_active" right small color="green" name="mdi-checkbox-marked-circle"/>
      <q-icon v-else right small color="red" name="mdi-cancel"/>
    </template>

    <template v-slot:col-type="{ props }">
      {{ props.row.type.title }}
    </template>

  </Table>
</template>

<script setup>
import {useI18n} from 'vue-i18n'
import Table from 'src/components/table/Table.vue'
import urls from 'src/urls'
import {useQuasar} from 'quasar'
import {axiosInstance} from 'src/boot/axios'

const {t} = useI18n()
const q = useQuasar()
const apiRoot = urls.products
const editRoute = 'productEdit'
const addRoute = 'productAdd'
const columns = [
  {name: 'title', label: t('general.title'), field: 'title', align: 'left'},
  {name: 'dkp', label: t('general.dkp'), field: 'dkp', align: 'left'},
  {name: 'price_step', label: t('general.priceStep'), field: 'price_step', align: 'left'},
  {name: 'is_active', label: t('general.isActive'), field: 'is_active', align: 'left'},
  {name: 'type', label: t('general.type'), field: 'type', align: 'left'},
]
const filters = [
  {
    type: 'boolean',
    queryParam: 'is_active',
    label: 'general.isActive',
  },
  {
    type: 'select',
    queryParam: 'price_step',
    label: 'general.priceStep',
    options: [100, 200, 300, 400, 500],
  },
]

const priceStepOptions = [100, 200, 300, 400, 500]

function handlePriceStepChange(id, tableData, event) {
  console.log(id, event)
  const row = tableData.items.find(item => item.id === id)
  row['price_step'] = event
  console.log(row)
  const url = apiRoot + id + '/'
  const payload = {
    'price_step': event,
  }
  axiosInstance.patch(url, payload).then(res => {
    console.log('res', res)
    q.notify({
      type: 'positive',
      message: t('general.snack.saveSuccess'),
      position: 'bottom-right',
      actions: [
        {label: '', icon: 'close', color: 'white', round: true},
      ],
    })
  })
}
</script>
