<template>
  <div class="fit q-pa-sm">

    <div class="text-h6 q-ma-md">{{ formTitle }}</div>

    <q-form @submit.prevent="saveItem">
      <div class="row q-ma-sm">
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

      <div class="row q-ma-sm">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-input
            v-model="form.amount"
            :label="$t('general.amountToman')"
            filled
            :rules="[isRequired]"
          />
        </div>
      </div>

      <div class="row q-ma-sm">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <QDateInput v-model="form.date" required :label="$t('general.date')"/>
<!--          <q-input-->
<!--            v-model="form.date"-->
<!--            :label="$t('general.date')"-->
<!--            mask="date"-->
<!--            filled-->
<!--            :rules="[isRequired]"-->
<!--          >-->
<!--            <template v-slot:append>-->
<!--              <q-icon name="event" class="cursor-pointer">-->
<!--                <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">-->
<!--                  <q-date-->
<!--                    v-model="form.date"-->
<!--                    @update:model-value="() => $refs.qDateProxy.hide()"-->
<!--                    calendar="persian"-->
<!--                    today-btn-->
<!--                  >-->
<!--                    <div class="row items-center justify-end">-->
<!--                      <q-btn-->
<!--                        v-close-popup-->
<!--                        :label="$t('general.cancel')"-->
<!--                        color="primary"-->
<!--                        flat-->
<!--                      />-->
<!--                    </div>-->
<!--                  </q-date>-->
<!--                </q-popup-proxy>-->
<!--              </q-icon>-->
<!--            </template>-->
<!--          </q-input>-->
        </div>
      </div>

      <div class="row q-ma-sm">
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

    <Delete
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
import Delete from 'src/components/addEdit/Delete.vue'
import QDateInput from 'src/components/QDateInput.vue'
import urls from 'src/urls'
import moment from 'moment-jalaali'

export default {
  name: 'AddEdit',
  components: {
    Delete,
    AutoComplete,
    FormActions,
    QDateInput
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
      persianDate: '',
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
    // 'form.date': function (newVal) {
    //   this.persianDate = moment(newVal,'YYYY/MM/DD').format('jYYYY/jMM/jDD')
    // },
  },
  methods: {
    formInit(resData) {
      this.form = cloneDeep(resData)
      this.form.amount = this.formatIntNumber(this.form.amount.toString())
      const m = moment(this.form.date, 'YYYY/MM/DD')
      this.persianDate = m.format('jYYYY/jMM/jDD')
      this.form.date = m.format('jYYYY/jMM/jDD')
    },
    getRequestData() {
      return {
        type: this.form.type.id,
        amount: this.numberWithCommaToInt(this.form.amount),
        date: moment(this.form.date, 'jYYYY/jMM/jDD').format('YYYY-MM-DD'),
        description: this.form.description,
      }
    },
  },
}
</script>
