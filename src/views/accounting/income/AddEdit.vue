<template>
  <div class="fit q-pa-sm">

    <div class="text-h6 q-ma-md">{{ formTitle }}</div>

    <q-form v-if="showForm" @submit.prevent="saveItem" class="q-gutter-sm">

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

  </div>
</template>

<script>
import {cloneDeep} from 'lodash'
import {dataToolsMixin} from 'src/mixins/data-tools'
import {addEditViewMixin} from 'src/mixins/add-edit'
import FormActions from 'src/components/addEdit/FormActions.vue'
import DeleteDialog from 'src/components/addEdit/DeleteDialog.vue'
import QDateInput from 'src/components/QDateInput.vue'
import urls from 'src/urls'

export default {
  name: 'AddEdit',
  components: {
    DeleteDialog,
    FormActions,
    QDateInput,
  },
  mixins: [dataToolsMixin, addEditViewMixin],
  data() {
    return {
      urls: urls,
      apiRoot: urls.incomes,
      listViewRoute: 'incomeList',
      itemType: 'acc.income',
      form: {
        amount: '',
        date: '',
        description: '',
      },
    }
  },
  computed: {
    itemRepr() {
      return this.form.amount.toString()
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
        amount: this.numberWithCommaToInt(this.form.amount),
        date: this.form.date,
        description: this.form.description,
      }
    },
  },
}
</script>
