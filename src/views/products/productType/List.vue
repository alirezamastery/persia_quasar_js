<template>
  <Table
    :title="$t('products.productTypes')"
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

  </Table>
</template>

<script setup>
import {useI18n} from 'vue-i18n'
import Table from 'src/components/table/Table.vue'
import urls from 'src/urls'

const {t} = useI18n()
const apiRoot = urls.productTypes
const editRoute = 'productTypeEdit'
const addRoute = 'productTypeAdd'
const columns = [
  {name: 'title', label: t('general.title'), field: 'title', align: 'left'},
]

</script>
