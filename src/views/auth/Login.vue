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
        <q-btn
          :label="$t('general.submit')"
          type="submit"
          color="green"
          ripple
          size="lg"
        />
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
