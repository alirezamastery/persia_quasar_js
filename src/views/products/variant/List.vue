<template>
  <Table
    :title="$t('products.variants')"
    :columns="columns"
    :api-root="apiRoot"
    :edit-route="editRoute"
    :add-route="addRoute"
    :filters="filters"
  >
    <template v-slot:col-product="{ props }">
      <q-btn
        :to="{name: editRoute, params:{id:props.row.id}}"
        :label="props.row.product.title"
        dense
        flat
      />
    </template>

    <template v-slot:col-price_min="{ props }">
      {{ props.row.price_min }}
    </template>

    <template v-slot:col-selector="{ props }">
      {{ props.row.selector_values[0].value }}
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
import {ref, reactive} from 'vue'
import urls from 'src/urls'
import {useI18n} from 'vue-i18n'
import Table from 'src/components/table/Table.vue'

const {t} = useI18n()
const apiRoot = urls.variants
const editRoute = 'variantEdit'
const addRoute = 'variantAdd'
const columns = [
  {name: 'product', label: t('products.product'), field: 'product', align: 'left'},
  {name: 'dkpc', label: t('products.DKPC'), field: 'dkpc'},
  {name: 'selector', label: t('products.selector'), field: 'selector'},
  {name: 'price_min', label: t('products.priceMin'), field: 'price_min', sortable: true},
  {name: 'has_competition', label: t('products.hasCompetition'), field: 'has_competition', sortable: true},
  {name: 'is_active', label: t('products.isActive'), field: 'is_active'},
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

</script>

<style scoped>

</style>
