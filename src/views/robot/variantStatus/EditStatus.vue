<template>
  <div class="row q-gutter-sm">

  </div>
</template>

<script setup>
import {ref} from 'vue'
import urls from 'src/urls'

import {axiosInstance} from 'src/boot/axios'

const brands = ref(null)
const actualProducts = ref(null)

axiosInstance.get(urls.brandsAll)
  .then(res => {
    console.log('brands', res.data)
    brands.value = res.data
  })

</script>

<style scoped>

</style>
