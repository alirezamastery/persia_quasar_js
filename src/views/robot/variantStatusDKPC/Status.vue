<template>
  <div class="q-ma-md q-pa-sm">
    <q-form autofocus class="q-my-md q-col-gutter-md" @submit.prevent="handleSubmit">
      <div class="row">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-input
            v-model="dkpc"
            label="dkpc"
            filled
            class="col-12"
            style="max-width: 200px"
          />
        </div>
      </div>
      <div class="row">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-btn type="submit" color="primary">{{ $t('general.receive') }}</q-btn>
        </div>
      </div>
    </q-form>

    <template v-if="variant">
      <q-separator class="q-my-lg" inset id="variant"/>
      <Variant :variant="variant"/>
    </template>

    <template v-if="notFound">
      <q-separator class="q-my-lg" inset id="variant-not-found"/>
      <span>{{ $t('general.noItemsFound') }}</span>
    </template>

  </div>
</template>

<script setup>
import {ref} from 'vue'
import {axiosInstance} from 'src/boot/axios'
import urls from 'src/urls'
import Variant from 'src/components/Variant'

const dkpc = ref('')
const variant = ref(null)
const notFound = ref(false)

function handleSubmit() {
  notFound.value = false
  const url = urls.variantDigiDataDKPC + dkpc.value + '/'
  axiosInstance.get(url)
    .then(res => {
      variant.value = res.data
    })
    .catch(err => {
      console.log('var errro:', err)
      if (err.response.status === 404) {
        variant.value = null
        notFound.value = true
      }
    })
}

</script>
