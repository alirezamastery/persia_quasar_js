<template>
  <div class="custom-login-container">

    <q-card bordered class="q-pa-md">
      <q-form
        @submit.prevent="handleSubmit"
        class="q-gutter-md"
      >
        <q-input
          v-model="form.mobile"
          type="text"
          :label="$t('general.mobile')"
          filled
        >
          <template v-slot:prepend>
            <q-icon name="phone" />
          </template>
        </q-input>
        <q-input
          v-model="form.password"
          filled
          :type="showPassword ? 'text' : 'password'"
          :label="$t('general.password')"
        >
          <template v-slot:prepend>
            <q-icon name="key" />
          </template>
          <template v-slot:append>
            <q-icon
              :name="showPassword ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="showPassword = !showPassword"
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

<script >
// import { useQuasar } from 'quasar'
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { axiosInstance } from 'src/boot/axios'
import { useUserStore } from 'src/stores/user'
import urls from 'src/urls'

export default {
  name: 'Login',
  setup() {
    // const q = useQuasar()
    const userStore = useUserStore()
    const router = useRouter()
    // const mobile= ref('')
    // const password= ref('')
    const showPassword = ref(false)
    const form = reactive({
      mobile: '',
      password: '',
    })

    function handleSubmit() {
      // if (!(this.mobile && this.password)) return
      axiosInstance.post(urls.token, form).then(res => {
        console.log('Login', res)
        localStorage.setItem('access_token', res.data.access)
        localStorage.setItem('refresh_token', res.data.refresh)
        axiosInstance.defaults.headers['Authorization'] = 'Bearer ' + localStorage.getItem('access_token')
        userStore.Login(form.mobile)
        void router.push({ name: 'Home' })
        // getUserData()
      }).catch(err => {
        console.log('axios error:', err)
      })
    }

    function getUserData() {
      axiosInstance.get(urls.userProfile)
        .then(res => {
          console.log('getUserData', res)
        })
        .catch(err => {
          console.log('getUserData error', err)
        })
    }

    return {
      // mobile,
      // password,
      showPassword,
      handleSubmit,
      form,
    }
  },
}
</script>

<style scoped lang="scss">
.custom-login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 90vh;
  //height: max-content;
  background-color: transparent;
  color: white;
  z-index: 2;
  margin-right: auto;
}
</style>
