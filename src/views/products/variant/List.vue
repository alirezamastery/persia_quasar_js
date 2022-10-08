<template>
  <Table
    :title="$t('products.variants')"
    :columns="columns"
    :api-root="apiRoot"
    :add-route="addRoute"
    :filters="filters"
    :extra-links="extraLinks"
  >

    <template v-slot:col-product="{ props }">
      <q-btn :to="{name: editRoute, params: {id: props.row.id}}" color="light-blue" dense flat>
        {{ props.row.product.title }}
      </q-btn>
    </template>

    <template v-slot:col-actualProduct="{ props }">
      {{ props.row.actual_product.title }}
    </template>

    <template v-slot:col-price_min="{ props }">
      {{ $filters.price(props.row.price_min) }}
    </template>

    <template v-slot:col-selector="{ props }">
      {{ props.row.selector.value }}
    </template>

    <template v-slot:col-is_active="{ props }">
      <q-icon v-if="props.row.is_active" right small color="green" name="mdi-checkbox-marked-circle"/>
      <q-icon v-else right small color="red" name="mdi-cancel"/>
    </template>

    <template v-slot:col-has_competition="{ props }">
      <q-icon v-if="props.row.has_competition" right small color="red" name="mdi-sword-cross"/>
      <q-icon v-else right small color="green" name="mdi-sleep"/>
    </template>
  </Table>
</template>

<script setup>
import {useI18n} from 'vue-i18n'
import Table from 'src/components/table/Table.vue'
import urls from 'src/urls'

const {t} = useI18n()
const apiRoot = urls.variants
const editRoute = 'variantEdit'
const addRoute = 'variantAdd'
const columns = [
  {name: 'product', label: t('products.product'), field: 'product', align: 'left'},
  {name: 'actualProduct', label: t('products.actualProduct'), field: 'actual_product', align: 'left'},
  {name: 'dkpc', label: t('products.DKPC'), field: 'dkpc', align: 'left'},
  {name: 'selector', label: t('products.selector'), field: 'selector', align: 'left'},
  {name: 'price_min', label: t('general.priceMinRial'), field: 'price_min', align: 'left', sortable: true},
  {
    name: 'has_competition',
    label: t('products.hasCompetition'),
    field: 'has_competition',
    align: 'center',
    sortable: true,
  },
  {name: 'is_active', label: t('products.isActive'), field: 'is_active', align: 'center'},
]

const filters = [
  {
    type: 'boolean',
    queryParam: 'is_active',
    label: 'general.isActive',
  },
  {
    type: 'boolean',
    queryParam: 'has_competition',
    label: 'general.hasCompetition',
  },
]

const extraLinks = [
  {routeName:'variantBulkCreate', title:t('general.bulkCreate')}
]

</script>
