<template>
  <div class="q-pa-md q-ma-md">
    <q-card-section>
      <div class="text-h5">{{ $t('general.routes.invoices') }}</div>
    </q-card-section>
    <q-card-section>
      <q-btn color="primary" @click="getReport">{{ $t('robot.getReport') }}</q-btn>
    </q-card-section>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import urls from 'src/urls'
import {notifyMessage, notifyErrors} from 'src/composables/notif'
import {axiosInstance} from 'src/boot/axios'

function getReport() {
  axiosInstance.get(urls.invoiceExcel)
    .then(res => {
      console.log('invoice', res)
      const link = document.createElement('a')
      link.href = process.env.SERVER_BASE_URL + '/' + res.data.path
      link.click()
    })
    .catch(err => {
      notifyErrors(err.response.data)
    })
}
</script>
