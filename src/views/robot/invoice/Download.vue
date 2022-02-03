<template>
  <q-car>
    <q-card-section>
      <div class="text-h5">{{ $t('general.routes.invoice') }}</div>
    </q-card-section>
    <q-card-section>
      <q-btn color="primary" @click="getReport">{{ $t('robot.getReport') }}</q-btn>
    </q-card-section>
    <a :href="downloadPath" id="downloadLink" style="display: none"/>
  </q-car>
</template>

<script setup>
import {ref} from 'vue'
import urls from 'src/urls'
import {notifyMessage, notifyErrors} from 'src/composables/notif'
import {axiosInstance} from '../../../boot/axios'

const downloadPath = ref(null)

function getReport() {
  axiosInstance.get(urls.invoiceExcel)
    .then(res => {
      console.log('invoice', res)
      downloadPath.value = process.env.VUE_APP_SERVER_BASE_URL + '/' + res.data.path
      console.log('path', downloadPath.value)
      const link = document.getElementById('downloadLink')
      link.href = downloadPath.value
      link.click()
    })
    .catch(err => {
      notifyErrors(err.response.data)
    })
}
</script>
