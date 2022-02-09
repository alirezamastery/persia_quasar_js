<template>
  <q-card class="q-ma-md q-pa-sm">
    <q-card-section>
      <q-form class="q-my-md" @submit.prevent="getProfitData">
        <div class="row q-col-gutter-md items-center">
          <q-input
            v-model="jYear"
            :label="$t('general.year')"
            type="number"
            filled
            class="col-xs-6"
            style="max-width: 200px"
          />
          <div class="col-xs-6">
            <q-btn type="submit" color="primary">{{ $t('general.receive') }}</q-btn>
          </div>
        </div>
      </q-form>

    </q-card-section>
    <div id="chart-container">
      <canvas id="myChart"></canvas>
    </div>
  </q-card>
</template>

<script setup>
import {ref, onMounted, watch} from 'vue'
import Chart from 'chart.js/auto'
import {axiosInstance} from '../../../boot/axios'
import urls from '../../../urls'
import {useI18n} from 'vue-i18n'
import moment from 'moment-jalaali'

const {t} = useI18n()
const persianMonth = ('فروردین_اردیبهشت_خرداد_تیر_مرداد_شهریور_مهر_آبان_آذر_دی_بهمن_اسفند').split('_')

const profits = ref([1, 2])
const jYear = ref(moment().format('jYYYY'))
const profitChart = ref(null)

function getProfitData() {
  axiosInstance.get(urls.profitYear + `?j_year=${jYear.value}`)
    .then(res => {
      console.log('res', res)
      profits.value = res.data.data.profits
      console.log(profits.value)
      createChart()
    })
}

function getBG() {
  const colors = []
  for (const val of profits.value) {
    if (val > 0) colors.push('rgba(75, 192, 192, 0.5)')
    else colors.push('rgba(255, 99, 132, 0.5)')
  }
  return colors
}

function createChart() {
  const canvas = document.getElementById('myChart')
  console.log('canvas', canvas)
  const ctx = canvas.getContext('2d')
  if (profitChart.value !== null)
    profitChart.value.destroy()
  profitChart.value = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: persianMonth,
      datasets: [{
        label: false,
        title: `${t('general.year')} ${jYear.value}`,
        data: profits.value,
        fill: false,
        backgroundColor: getBG(),
        barPercentage: 0.5,
      }],
    },
    options: {
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          stacked: true,
        },
      },
      plugins: {
        title: {
          display: true,
          text: `${t('general.year')} ${jYear.value}`,
          font: {
            family: '\'Samim\' , \'Robot-Regular\'',
          },
        },
        legend: {
          display: false,
        },
      },
    },
  })
}

onMounted(() => {
  getProfitData()

})

</script>

<style scoped lang="scss">
#chart-container {
  position: relative;
  width: 100%;
  height: 70vh;
}
</style>
