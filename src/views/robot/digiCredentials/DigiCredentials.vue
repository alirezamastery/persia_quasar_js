<template>
  <q-card>
    <q-card-section>
      <div class="text-h5">{{ $t('general.routes.digiPassword') }}</div>
    </q-card-section>
    <q-card-section>
      <q-form @submit.prevent="handleSubmit" class="q-gutter-lg">

        <div class="row q-col-gutter-sm items-center">
          <div class="col-xs-10 col-sm-8 col-md-5 col-lg-3">
            <q-input
              v-model="newUsername"
              :disable="!editUsername"
              :label="$t('general.username')"
              class="latin-text-font"
              filled
            />
          </div>
          <div class="col-xs-2 col-sm-2 col-md-1 col-lg-1">
            <q-toggle
              v-model="editUsername"
              color="red"
              unchecked-icon="verified_user"
              checked-icon="warning"
              size="lg"
            />
          </div>
        </div>

        <div class="row q-col-gutter-sm items-center">
          <div class="col-xs-10 col-sm-8 col-md-5 col-lg-3">
            <q-input
              v-model="newPassword"
              :disable="!editPassword"
              :label="$t('general.password')"
              class="latin-text-font"
              filled
            />
          </div>
          <div class="col-xs-2 col-sm-2 col-md-1 col-lg-1">
            <q-toggle
              v-model="editPassword"
              color="red"
              unchecked-icon="verified_user"
              checked-icon="warning"
              size="lg"
            />
          </div>
        </div>

        <q-btn
          type="submit"
          class="bg-orange text-black"
          :disable="!hasChange"
        >
          {{ $t('general.submit') }}
        </q-btn>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup>
import {ref, computed} from 'vue'
import {notifyErrors, notifyMessage} from 'src/composables/notif'
import {useI18n} from 'vue-i18n'
import {axiosInstance} from 'src/boot/axios'
import urls from 'src/urls'

const {t} = useI18n()

const oldUsername = ref('')
const oldPassword = ref('')
const editUsername = ref(false)
const editPassword = ref(false)
const newUsername = ref('')
const newPassword = ref('')

const hasChange = computed(() => {
  return newUsername.value !== oldUsername.value || newPassword.value !== oldPassword.value
})

function handleSubmit() {
  const data = {
    'digi_username': newUsername.value,
    'digi_password': newPassword.value,
  }
  axiosInstance.post(urls.digiCreds, data)
    .then(res => {
      console.log('digi password', res)
      editUsername.value = false
      editPassword.value = false
      oldUsername.value = res.data.digi_username
      newUsername.value = oldUsername.value
      oldPassword.value = res.data.digi_password
      newPassword.value = oldPassword.value
      notifyMessage('positive', t('general.snack.saveSuccess'))
    })
    .catch(err => {
      notifyErrors(err.response.data)
    })
}

axiosInstance.get(urls.digiCreds)
  .then(res => {
    oldUsername.value = res.data.digi_username
    newUsername.value = oldUsername.value
    oldPassword.value = res.data.digi_password
    newPassword.value = oldPassword.value
  })
</script>
