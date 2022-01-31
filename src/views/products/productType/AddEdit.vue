<template>
  <q-input
    v-model="dkpc"
    :label="$t('products.DKPC')"
    filled
  />
  <span>{{ dkpcError }}</span>
  <q-input
    v-model="price"
    :label="$t('products.DKPC')"
    filled
  />
  <span>{{ priceError }}</span>

</template>

<script setup>
import {defineRule, useField, useForm} from 'vee-validate'
import {required, email, min} from '@vee-validate/rules'
import * as yup from 'yup'

defineRule('required', required)

const schema = yup.object({
  dkpc: yup.string().required(),
  price: yup.number().required(),
})

useForm({
  validationSchema: schema,
})
const {value: dkpc, errorMessage: dkpcError} = useField('dkpc')
const {value: price, errorMessage: priceError} = useField('price')
</script>
