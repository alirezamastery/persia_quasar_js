<template>
  <Table
    :title="$t('acc.income')"
    :columns="columns"
    :api-root="apiRoot"
    :edit-route="editRoute"
    :add-route="addRoute"
    :filters="filters"
  >

    <template v-slot:col-amount="{ props }">
      <q-btn
        :to="{name: editRoute, params: {id: props.row.id}}"
        dense
        flat
      >
        {{ $filters.price(props.row.amount) }}
      </q-btn>
    </template>

    <template v-slot:col-date="{ props }">
      <template v-if="q.lang.isoName === 'fa'">
        {{ $filters.persianDate(props.row.date) }}
      </template>
      <template v-else>{{ props.row.date }}</template>
    </template>

  </Table>
</template>

<script setup>
import {useI18n} from 'vue-i18n'
import Table from 'src/components/table/Table.vue'
import urls from 'src/urls'
import {useQuasar} from 'quasar'

const {t} = useI18n()
const q = useQuasar()

const apiRoot = urls.incomes
const editRoute = 'incomeEdit'
const addRoute = 'incomeAdd'
const columns = [
  {name: 'amount', label: t('general.amountToman'), field: 'amount', align: 'left'},
  {name: 'date', label: t('general.date'), field: 'date'},
]

const filters = [
  {
    type: 'date',
    queryParam: 'date_gte',
    label: 'general.fromDate',
  },
  {
    type: 'date',
    queryParam: 'date_lte',
    label: 'general.untilDate',
  },
]

</script>
