<template>
  <div class="fit q-pa-sm">

    <div class="text-h6 q-ma-md">{{ formTitle }}</div>

    <q-form @submit.prevent="saveItem">
      <div class="row q-ma-sm">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <AutoComplete
            v-model="form.product.id"
            :label="$t('products.product')"
            :obj-repr-field="'title'"
            :query-param="'search'"
            :api="urls.products"
            :rules="[isRequired]"
          />
        </div>
      </div>

      <div class="row q-ma-sm">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <AutoComplete
            v-model="form.actual_product.id"
            :label="$t('products.actualProduct')"
            :query-param="'search'"
            :obj-repr-field="'title'"
            :api="urls.actualProducts"
            :rules="[isRequired]"
          />
        </div>
      </div>

      <div class="row q-ma-sm">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <AutoComplete
            v-model="form.selector.id"
            :label="$t('products.selectorValues')"
            :query-param="'search'"
            :obj-repr-field="'value'"
            :api="urls.variantSelectors"
            :rules="[isRequired]"
          />
        </div>
      </div>

      <div class="row q-ma-sm">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-input
            v-model="form.dkpc"
            :label="$t('products.DKPC')"
            filled
            :rules="[isRequired]"
          />
        </div>
      </div>

      <div class="row q-ma-sm">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-input
            v-model="form.price_min"
            :label="$t('general.priceMinRial')"
            filled
            :rules="[isRequired]"
          />
        </div>
      </div>

      <div class="row q-ma-sm">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-checkbox
            v-model="form.is_active"
            :label="$t('products.isActive')"
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
      apiRoot: urls.variants,
      listViewRoute: 'variantList',
      itemType: 'products.variant',
      form: {
        product: {id: null},
        dkpc: '',
        price_min: null,
        is_active: true,
        // selector_values: [],
        selector: {},
        actual_product: {},
      },
    }
  },
  computed: {
    itemRepr() {
      return this.form.dkpc.toString()
    },
  },
  watch: {
    'form.price_min': function (newVal) {
      this.form.price_min = this.formatIntNumber(newVal)
    },
  },
  methods: {
    formInit(resData) {
      this.form = cloneDeep(resData)
      this.form.price_min = this.formatIntNumber(this.form.price_min.toString())
      // this.form.selector_values = resData.selector_values.map(itm => itm.id)
    },
    getRequestData() {
      return {
        product: this.form.product.id,
        dkpc: this.form.dkpc,
        has_competition: this.form.has_competition,
        is_active: this.form.is_active,
        price_min: parseInt(this.removeCommas(this.form.price_min)),
        // selector_values: this.form.selector_values,
        selector: this.form.selector.id,
        actual_product: this.form.actual_product.id,
      }
    },
  },
}
</script>

<style scoped>

</style>
