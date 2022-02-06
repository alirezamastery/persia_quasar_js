<template>
  <q-card class="q-pa-sm q-ma-md">
    <q-card-section>
      <div class="text-h5">{{ $t('acc.profitInMonth') }}</div>
    </q-card-section>
    <q-card-section>
      <q-form @submit.prevent="getProfit">
        <div class="row q-col-gutter-lg">
          <div class="col-xs-12 col-sm-6 col-md-3">
            <q-input
              v-model="jYear"
              filled
              :label="$t('general.year')"
              :rules="[isRequired]"
            />
          </div>
          <div class="col-xs-12 col-sm-6 col-md-3 col-lg-1">
            <q-select
              v-model="jMonth"
              :options="month"
              :label="$t('general.month')"
              :rules="[isRequired]"
              filled
            />
          </div>
        </div>
        <q-btn
          color="primary"
          type="submit"
        >
          {{ $t('general.submit') }}
        </q-btn>
      </q-form>
    </q-card-section>

    <q-card-section v-if="data" class="row">
      <q-markup-table separator="cell" flat bordered class="col-xs-12 col-sm-6 col-lg-2">
        <tbody>
        <tr>
          <td class="text-left">{{ $t('acc.costs') }}</td>
          <td class="text-right">{{ $filters.price(data.costs) }}</td>
        </tr>
        <tr>
          <td class="text-left">{{ $t('acc.productCosts') }}</td>
          <td class="text-right">{{ $filters.price(data['product_costs']) }}</td>
        </tr>
        <tr>
          <td class="text-left">{{ $t('acc.incomes') }}</td>
          <td class="text-right">{{ $filters.price(data.incomes) }}</td>
        </tr>
        <tr>
          <td class="text-left">{{ $t('acc.profit') }}</td>
          <td class="text-right">{{ $filters.price(data.profit) }}</td>
        </tr>
        </tbody>
      </q-markup-table>
    </q-card-section>
  </q-card>
</template>

<script setup>
import {ref} from 'vue'
import {axiosInstance} from 'src/boot/axios'
import urls from 'src/urls'
import {notifyAxiosError, notifyErrors} from 'src/composables/notif'
import {isRequired} from 'src/composables/form-validation'
import moment from 'moment-jalaali'

const month = []
for (let i = 1; i < 13; i++) month.push(i)

const jMonth = ref(null)
const jYear = ref(null)
const data = ref(null)

function getProfit() {
  axiosInstance.get(urls.profit, {
    params: {
      'j_year': jYear.value,
      'j_month': jMonth.value,
    },
  }).then(res => {
    console.log('res:', res)
    data.value = res.data
  }).catch(err => {
    notifyAxiosError(err)
  })
}

const today = moment()
jMonth.value = today.format('jM')
jYear.value = today.format('jYYYY')

</script>
