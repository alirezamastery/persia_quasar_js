<template>
  <div class="fit q-pa-sm">

    <div class="text-h6 q-ma-md">{{ formTitle }}</div>

    <q-form v-if="showForm" @submit.prevent="saveItem" class="q-gutter-sm">

      <div class="row">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-input
            v-model="form.title"
            :label="$t('general.title')"
            filled
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
import FormActions from 'src/components/addEdit/FormActions.vue'
import DeleteDialog from 'src/components/addEdit/DeleteDialog.vue'
import urls from 'src/urls'

export default {
  name: 'AddEdit',
  components: {
    DeleteDialog,
    FormActions,
  },
  mixins: [dataToolsMixin, addEditViewMixin],
  data() {
    return {
      urls: urls,
      apiRoot: urls.costTypes,
      listViewRoute: 'costTypeList',
      itemType: 'acc.costType',
      form: {
        title: '',
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
      }
    },
  },
}
</script>
