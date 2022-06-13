<template>
  <div class="fit q-pa-sm">

    <div class="text-h6 q-ma-md">{{ formTitle }}</div>

    <q-form @submit.prevent="saveItem">
      <div class="row q-ma-sm">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-input
            v-model="form.dkp"
            :label="$t('products.dkp')"
            filled
            :rules="[isRequired]"
          />
        </div>
      </div>

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
          <q-checkbox
            v-model="form.is_active"
            :label="$t('products.isActive')"
          />
        </div>
      </div>

      <div class="row q-ma-sm">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <AutoComplete
            v-model="form.type.id"
            :label="$t('products.productType')"
            :query-param="'search'"
            :obj-repr-field="'title'"
            :api="urls.productTypes"
            :rules="[isRequired]"
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
      apiRoot: urls.products,
      listViewRoute: 'productList',
      itemType: 'products.product',
      form: {
        title: '',
        dkp: null,
        is_active: true,
        type: {},
        price_step: '',
      },
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
      return {
        title: this.form.title,
        dkp: this.form.dkp,
        is_active: this.form.is_active,
        type: this.form.type.id,
      }
    },
  },
}
</script>

<style scoped>

</style>
