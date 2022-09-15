<template>
  <div class="fit q-pa-sm">

    <div class="text-h6 q-ma-md">{{ formTitle }}</div>

    <q-form @submit.prevent="saveItem" v-if="showForm">

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
            v-model="form.selector_type.id"
            :label="$t('products.productTypeSelector')"
            :query-param="'search'"
            :obj-repr-field="'title'"
            :api="urls.variantSelectorTypes"
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
      apiRoot: urls.productTypes,
      listViewRoute: 'productTypeList',
      itemType: 'products.productType',
      form: {
        title: '',
        selector_type: {id: null},
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
        selector_type: this.form.selector_type.id,
      }
    },
  },
}
</script>

<style scoped>

</style>
