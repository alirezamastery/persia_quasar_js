<template>
  <div class="q-ma-md">

    <Header
      :title="title"
      :add-route="addRoute"
    />

    <div class="row no-wrap-md">

      <div class="col">

        <TableHeader api-root=""/>

        <q-table
          :rows="data.items"
          :columns="columns"
          :row-key="itemKey"
          :dense="denseRows"
          :no-data-label="$t('general.noItemsFound')"
          :pagination="pagination"
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
            </q-tr>
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

        <q-separator/>
      </div>

      <DisplayFilters
        v-if="filters.length > 0"
        :filters="filters"
        @filter-change="handleFilterChange"
      />

    </div>
  </div>
</template>


<script setup>
import {ref, reactive, defineEmits, defineProps, watch} from 'vue'
import {axiosInstance} from 'src/boot/axios'
import Pagination from './Pagination.vue'
import DisplayFilters from './filters/DisplayFilters.vue'
import Header from './Header.vue'
import TableHeader from './TableHeader.vue'

const props = defineProps({
  title: {type: String, required: true},
  apiRoot: {type: String, required: true},
  columns: {type: Array, required: true},
  editRoute: {type: String, required: true},
  addRoute: {type: String, required: true},
  itemKey: {type: String, required: false, default: 'id'},
  showActions: {type: Boolean, required: false, default: true},
  denseRows: {type: Boolean, required: false, default: true},
  hideSearch: {type: Boolean, required: false, default: false},
  filters: {type: Array, required: false, default: () => ([])},
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
  page: 1,
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

watch(pageSize, () => {
  page.value = 1
  fetchData()
})

function constructQuery() {
  let query = `?${queries.value}&page_size=${pageSize.value}`
  if (searchPhrase.value)
    query += `&search=${searchPhrase.value}`
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
  axiosInstance.get(url)
    .then(res => {
      console.log('reFetchData | response', res)
      data.value = res.data
      pagination.value.rowsNumber = res.data.count
    })
    .catch(err => {
      console.log('reFetchData | error', err)
    })
}

function handleRequest(props) {
  console.log('handleRequest', props)
  const {page, rowsPerPage, sortBy, descending} = props.pagination
  const filter = props.filter
  const order = descending ? '-' : ''
  queries.value = order + sortBy
  page.value = 1
  fetchData()
}

function handleFilterChange(event) {
  console.log('handleFilterChange', event)
  if (event === undefined) return
  sideFilterQuery.value = event
  page.value = 1
  fetchData()
}

fetchData()

</script>
