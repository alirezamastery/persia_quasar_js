<template>
  <q-card class="q-pa-lg q-ma-lg">

    <div class="text-h6 q-ma-md">{{ formTitle }}</div>

    <q-form v-if="showForm" @submit.prevent="saveItem" class="q-gutter-sm">
      <div class="row">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <AutoComplete
            v-model="form.type.id"
            :label="$t('general.type')"
            :query-param="'search'"
            :obj-repr-field="'title'"
            :api="urls.costTypes"
            :rules="[isRequired]"
          />
        </div>
      </div>

      <div class="row">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-input
            v-model="form.amount"
            :label="$t('general.amountToman')"
            filled
            :rules="[isRequired]"
          />
        </div>
      </div>

      <div class="row">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <QDateInput
            v-model="form.date"
            :label="$t('general.date')"
            required
          />
        </div>
      </div>

      <div class="row">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-input
            v-model="form.description"
            :label="$t('general.description')"
            filled
            type="textarea"
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

  </q-card>
</template>

<script>
import {cloneDeep} from 'lodash'
import {dataToolsMixin} from 'src/mixins/data-tools'
import {addEditViewMixin} from 'src/mixins/add-edit'
import AutoComplete from 'src/components/AutoComplete.vue'
import FormActions from 'src/components/addEdit/FormActions.vue'
import DeleteDialog from 'src/components/addEdit/DeleteDialog.vue'
import QDateInput from 'src/components/QDateInput.vue'
import urls from 'src/urls'

export default {
  name: 'AddEdit',
  components: {
    DeleteDialog,
    AutoComplete,
    FormActions,
    QDateInput,
  },
  mixins: [dataToolsMixin, addEditViewMixin],
  data() {
    return {
      urls: urls,
      apiRoot: urls.costs,
      listViewRoute: 'costList',
      itemType: 'acc.cost',
      form: {
        type: {title: ''},
        amount: '',
        date: '',
        description: '',
      },
    }
  },
  computed: {
    itemRepr() {
      return this.form.type.title
    },
  },
  watch: {
    'form.amount': function (newVal) {
      this.form.amount = this.formatIntNumber(newVal)
    },
  },
  methods: {
    formInit(resData) {
      this.form = cloneDeep(resData)
      this.form.amount = this.formatIntNumber(this.form.amount.toString())
    },
    getRequestData() {
      return {
        type: this.form.type.id,
        amount: this.numberWithCommaToInt(this.form.amount),
        date: this.form.date,
        description: this.form.description,
      }
    },
  },
}
</script>
