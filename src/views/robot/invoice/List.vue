<template>
<!--  <div class="q-pa-md q-ma-md">-->
<!--    <q-card-section>-->
<!--      <div class="text-h5">{{ $t('general.routes.invoices') }}</div>-->
<!--    </q-card-section>-->
<!--    <q-card-section>-->
<!--      <q-btn color="primary" @click="getReport">{{ $t('robot.getReport') }}</q-btn>-->
<!--    </q-card-section>-->
<!--  </div>-->

    <Table
      :title="$t('robot.invoices')"
      :columns="columns"
      :api-root="apiRoot"
      :add-route="addRoute"
      :filters="filters"
      hide-edit
      hide-create-btn
      hide-search
    >

      <template v-slot:col-number="{ props }">
        <q-btn :to="{name: 'invoiceDetails', params: {id: props.row.id}}" color="light-blue" dense flat>
          {{ props.row.number }}
        </q-btn>
      </template>

    </Table>

</template>

<script setup>
import {ref} from 'vue'
import urls from 'src/urls'
import {notifyMessage, notifyErrors} from 'src/composables/notif'
import {axiosInstance} from 'src/boot/axios'
import Table from 'src/components/table/Table.vue'
import {useI18n} from 'vue-i18n'

const {t} = useI18n()
const apiRoot = urls.invoices
const editRoute = 'variantEdit'
const addRoute = 'variantAdd'
const columns = [
  {name: 'number', label: t('general.number'), field: 'number', align: 'left'},
  {name: 'start_date_persian', label: t('general.fromDate'), field: 'start_date_persian', align: 'left'},
  {name: 'end_date_persian', label: t('general.untilDate'), field: 'end_date_persian', align: 'left'},
]
const filters = [
  {
    type: 'date',
    queryParam: 'end_date_gte',
    label: 'general.fromDate',
  },
  {
    type: 'date',
    queryParam: 'end_date_lte',
    label: 'general.untilDate',
  },
]

function getReport() {
  axiosInstance.get(urls.invoiceExcel)
    .then(res => {
      console.log('invoice', res)
      const link = document.createElement('a')
      link.href = process.env.SERVER_BASE_URL + '/' + res.data.path
      link.click()
    })
    .catch(err => {
      notifyErrors(err.response.data)
    })
}
</script>
