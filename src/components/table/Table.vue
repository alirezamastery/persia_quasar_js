<template>
  <div class="q-ma-lg">

    <Header
      :title="title"
      :add-route="addRoute"
      :hide-create-btn="hideCreateBtn"
    />

    <div class="row no-wrap-md">

      <q-card class="col-sm-12 col-md">

        <TableHeader
          :api-root="apiRoot"
          :hide-search="hideSearch"
          @search-input="searchPhrase = $event"
        />

        <q-table
          :rows="data.items"
          :columns="columns"
          :row-key="itemKey"
          :dense="denseRows"
          v-model:pagination="pagination"
          :filter="filter"
          hide-bottom
          flat
          @request="handleRequest"
        >

          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td
                v-for="column in columns"
                :key="column.name"
                :props="props"
              >
                <slot
                  :name="`col-${column.name}`"
                  :props="props"
                  :data="data"
                >
                  {{ props.row[column.field] }}
                </slot>
              </q-td>

              <!-- key should be set for the cell to show -->
              <q-td v-if="!hideEdit" :props="props" key="edit">
                <q-btn
                  :to="{name: editRoute, params: {id: props.row.id}}"
                  icon="edit"
                  size="sm"
                  flat
                  round
                >
                </q-btn>
              </q-td>

            </q-tr>
          </template>

          <template v-slot:no-data>
            {{ $t('general.noItemsFound') }}
          </template>

        </q-table>

        <q-separator/>

        <Pagination
          :page="page"
          :page-size="pageSize"
          :page-size-options="pageSizeOptions"
          :page-count="data.page_count"
          :total-count="data.count"
          :table-loading="loading"
          @page-select="handlePageSelect"
          @page-size-select="pageSize = $event"
        />
      </q-card>

      <DisplayFilters
        v-if="filters.length > 0"
        :filters="filters"
        @filter-change="handleFilterChange"
      />

    </div>
  </div>
</template>


<script setup>
import {ref, reactive, watch, computed} from 'vue'
import {axiosInstance} from 'src/boot/axios'
import Pagination from './Pagination.vue'
import DisplayFilters from './filters/DisplayFilters.vue'
import Header from './Header.vue'
import TableHeader from './TableHeader.vue'
import {useI18n} from 'vue-i18n'
import {cloneDeep} from 'lodash'

const {t} = useI18n()

const props = defineProps({
  title: {type: String, required: true},
  apiRoot: {type: String, required: true},
  columns: {type: Array, required: true},
  editRoute: {type: String, required: false, default: ''},
  addRoute: {type: String, required: false, default: ''},
  itemKey: {type: String, required: false, default: 'id'},
  showActions: {type: Boolean, required: false, default: true},
  denseRows: {type: Boolean, required: false, default: true},
  filters: {type: Array, required: false, default: () => ([])},
  hideSearch: {type: Boolean, required: false, default: false},
  hideEdit: {type: Boolean, required: false, default: false},
  hideCreateBtn: {type: Boolean, required: false, default: false},
  searchWord: {type: String, required: false, default: 'search'},
})

const emit = defineEmits(['change', 'delete'])

const loading = ref(false)
const pageSize = ref(20)
const pageSizeOptions = ref([10, 20, 50, 100])
const page = ref(1)
const queries = ref('')
const totalPaginationVisible = ref(7)
const filter = ref('')
const pagination = ref({
  rowsNumber: 10,
})
const data = ref({
  items: [],
  count: 0,
  page_count: 0,
  next: null,
  previous: null,
})
const searchPhrase = ref('')
const sideFilterQuery = ref('')

const finalColumns = computed(() => {
  const columns = cloneDeep(props.columns)
  if (!props.hideEdit) {
    columns.push({name: 'edit', label: t('general.tools'), field: 'id', align: 'left'})
  }
  return columns
})

watch(pageSize, () => {
  page.value = 1
  fetchData()
})
watch(searchPhrase, () => {
  console.log('search phrase')
  page.value = 1
  fetchData()
})

function constructQuery() {
  let query = `?${queries.value}&page_size=${pageSize.value}`
  if (searchPhrase.value)
    query += `&${props.searchWord}=${searchPhrase.value}`
  if (page.value)
    query += `&page=${page.value}`
  if (sideFilterQuery.value)
    query += sideFilterQuery.value
  console.log('constructQuery', query)
  return query
}

function handlePageSelect(event) {
  console.log('handlePageSelect', event)
  page.value = event
  fetchData()
}

function fetchData() {
  const url = props.apiRoot + constructQuery()
  loading.value = true
  axiosInstance.get(url)
    .then(res => {
      console.log('reFetchData | response', res)
      data.value = res.data
      pagination.value.rowsNumber = res.data.count
    })
    .catch(err => {
      console.log('reFetchData | error', err)
    })
    .finally(() => loading.value = false)
}

function handleRequest(props) {
  console.log('handleRequest', props)
  const {page: tablePage, rowsPerPage, sortBy, descending} = props.pagination
  console.log(tablePage, rowsPerPage, sortBy, descending)
  if (sortBy === null) {
    queries.value = ''
  } else {
    const order = descending ? '-' : ''
    queries.value = 'o=' + order + sortBy
  }

  pagination.value.page = tablePage
  pagination.value.rowsPerPage = rowsPerPage
  pagination.value.sortBy = sortBy
  pagination.value.descending = descending

  page.value = 1
  fetchData()
}

function handleFilterChange(event) {
  console.log('handleFilterChange', event)
  // if (!event) return
  sideFilterQuery.value = event
  page.value = 1
  fetchData()
}

fetchData()

</script>
