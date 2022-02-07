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


</script>
