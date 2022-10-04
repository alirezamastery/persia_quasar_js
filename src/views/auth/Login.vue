<template>
  <div class="custom-login-container">

<!--    <MatrixRain/>-->

    <q-card bordered class="q-pa-md" style="z-index: 10000">
      <q-form
        @submit.prevent="handleSubmit"
        class="q-gutter-md"
      >
        <q-input
          v-model="form.mobile"
          type="text"
          :label="$t('general.mobile')"
          filled
          :rules="[isRequired]"
        >
          <template v-slot:prepend>
            <q-icon name="phone"/>
          </template>
        </q-input>
        <q-input
          v-model="form.password"
          filled
          :type="showPassword ? 'text' : 'password'"
          :label="$t('general.password')"
        >
          <template v-slot:prepend>
            <q-icon name="key"/>
          </template>
          <template v-slot:append>
            <q-icon
              :name="showPassword ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="handleShowPassword"
            />
          </template>
        </q-input>
        <div class="col">
          <q-checkbox
            v-model="rememberMe"
            :label="$t('general.rememberMe')"
          />
        </div>
        <div class="col flex justify-center">
          <q-btn
            :label="$t('general.routes.login')"
            type="submit"
            color="green"
            ripple
            size="lg"
            style="min-width: 120px"
          />
        </div>
      </q-form>
    </q-card>

  </div>
</template>

<script setup>
import {useQuasar} from 'quasar'
import {ref, reactive} from 'vue'
import {useRouter} from 'vue-router'
import {axiosInstance} from 'src/boot/axios'
import useUserStore from 'src/stores/user'
import useWebsocketStore from 'src/stores/websocket'
import MatrixRain from 'src/components/MatrixRain.vue'
import {isRequired} from 'src/composables/form-validation'
import urls from 'src/urls'
import localDb from 'src/local-db'


const q = useQuasar()
const userStore = useUserStore()
const wsStore = useWebsocketStore()
const router = useRouter()
const showPassword = ref(false)
const rememberMe = ref(false)
const form = reactive({
  mobile: '',
  password: '',
})

function handleSubmit() {
  axiosInstance.post(urls.token, form)
    .then(res => {
      console.log('Login', res)
      localDb.set('access_token', res.data.access)
      localDb.set('refresh_token', res.data.refresh)
      axiosInstance.defaults.headers['Authorization'] = 'Bearer ' + localDb.get('access_token')
      userStore.Login(form.mobile)
      router.push({name: 'Home'})
    })
    .catch(err => {
      console.log('axios error:', err)
    })
}

function handleShowPassword() {
  showPassword.value = !showPassword.value
}

function storeCredentials() {
  q.localStorage.set('rememberMe', rememberMe.value)
  if (rememberMe.value) {
    q.localStorage.set('credentials', form)
  } else {
    q.localStorage.remove('credentials')
  }
}

let rem = q.localStorage.getItem('rememberMe')
if (rem === null) {
  rem = false
  q.localStorage.set('rememberMe', false)
}
rememberMe.value = rem
if (rememberMe.value) {
  const credentials = q.localStorage.getItem('credentials')
  form.mobile = credentials.mobile
  form.password = credentials.password
}

</script>

<style scoped lang="scss">
.custom-login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 90vh;
  background-color: transparent;
  color: white;
  z-index: 2;
  margin-right: auto;
}
</style>
