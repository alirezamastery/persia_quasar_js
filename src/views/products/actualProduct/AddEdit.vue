<template>
  <div class="fit q-pa-sm">

    <div class="text-h6 q-ma-md">{{ formTitle }}</div>

    <q-form @submit.prevent="saveItem">
      <div class="row q-ma-sm">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-input
            v-model="form.title"
            :label="$t('general.title')"
            filled
            :rules="[isRequired]"
          />
        </div>
      </div>

      <div class="row q-ma-sm">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <AutoComplete
            v-model="form.brand.id"
            :label="$t('products.brand')"
            :query-param="'search'"
            :obj-repr-field="'title'"
            :api="urls.brands"
            :rules="[isRequired]"
          />
        </div>
      </div>

      <div class="row q-ma-sm">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-select
            v-model="form.price_step"
            :options="priceStepOptions"
            :label="$t('general.priceStepRial')"
            filled
          />
        </div>
      </div>

      <FormActions
        :show-delete="!!editingItemId"
        @delete="deleteDialog = true"
      />

    </q-form>

    <DeleteDialog
      v-if="editingItemId"
      v-model="deleteDialog"
      :item-repr="itemRepr"
      @delete="handleDeleteItem"
    />

  </div>
</template>

<script>
import {cloneDeep} from 'lodash'
import {dataToolsMixin} from 'src/mixins/data-tools'
import {addEditViewMixin} from 'src/mixins/add-edit'
import AutoComplete from 'src/components/AutoComplete.vue'
import FormActions from 'src/components/addEdit/FormActions.vue'
import DeleteDialog from 'src/components/addEdit/DeleteDialog.vue'
import urls from 'src/urls'

export default {
  name: 'AddEdit',
  components: {
    DeleteDialog,
    AutoComplete,
    FormActions,
  },
  mixins: [dataToolsMixin, addEditViewMixin],
  data() {
    return {
      urls: urls,
      apiRoot: urls.actualProducts,
      listViewRoute: 'actualProductList',
      itemType: 'products.actualProduct',
      form: {
        title: null,
        brand: {id: null},
      },
      priceStepOptions: [
        {label: '1,000', value: 1000},
        {label: '2,000', value: 2000},
        {label: '3,000', value: 3000},
        {label: '4,000', value: 4000},
        {label: '5,000', value: 5000},
      ]
    }
  },
  computed: {
    itemRepr() {
      return this.form.title
    },
  },
  methods: {
    formInit(resData) {
      this.form = cloneDeep(resData)
    },
    getRequestData() {
      console.log(this.form.price_step)
      return {
        title: this.form.title,
        brand: this.form.brand.id,
        price_step: this.form.price_step.value,
      }
    },
  },
}
</script>

<style scoped>

</style>
