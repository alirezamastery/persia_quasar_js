<template>
  <q-card class="q-ma-md">
    <q-card-section>
      <div class="text-h5">
        {{ $t('general.routes.profile') }}
      </div>
    </q-card-section>
    <q-card-section>
      <q-form class="q-gutter-md" @submit.prevent="handleFormSubmit">
        <div class="row">
          <div class="col-md-6 col-lg-3 col-xl-2">
            <div class="user-avatar">
              <img
                v-if="avatarSrc"
                :src="avatarSrc"
                alt=""
                class="avatar-img"
                @click="handleImageSelect"
              >
              <img
                v-else
                :src="require('src/assets/svg/user-blank.svg')"
                alt=""
                class="avatar-img"
                @click="handleImageSelect"
              >
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 col-lg-3 col-xl-2">
            <q-input
              v-model="form.first_name"
              :label="$t('general.firstName')"
              filled
            />
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 col-lg-3 col-xl-2">
            <q-input
              v-model="form.last_name"
              :label="$t('general.lastName')"
              filled
            />
          </div>
        </div>
        <q-btn
          type="submit"
          color="green"
        >
          {{ $t('general.submit') }}
        </q-btn>
      </q-form>
    </q-card-section>
  </q-card>

  <q-dialog v-model="dialogOpen" persistent>
    <q-card>
      <q-card-section>
        <q-btn
          v-close-popup
          icon="close"
          size="lg"
          round
        />
      </q-card-section>
      <q-card-section>
        <Cropper
          ref="cropper"
          :src="cropperImageObjectURL"
          :stencil-component="CircleStencil"
          :stencil-props="{aspectRatio: 1, resizable: true}"
          :canvas="{minHeight: 0, minWidth: 0, maxHeight: 200, maxWidth: 200}"
        />
      </q-card-section>
      <q-card-actions>
        <q-btn
          color="primary"
          size="lg"
          @click="handleCropperSubmit"
        >
          {{ $t('general.submit') }}
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>

</template>

<script setup>
import 'vue-advanced-cropper/dist/style.css'
import 'vue-advanced-cropper/dist/theme.classic.css'

import {ref, computed, watch} from 'vue'
import {Cropper, CircleStencil} from 'vue-advanced-cropper'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import useUserStore from '../../stores/user'
import {useRouter} from 'vue-router'
import {axiosInstance} from '../../boot/axios'
import urls from 'src/urls'
import {notifyAxiosError, notifyErrors, notifyMessage} from 'src/composables/notif'

const {t} = useI18n()
const q = useQuasar()
const userStore = useUserStore()
const router = useRouter()

// const userAvatar = computed(() => process.env.SERVER_BASE_URL + userStore.profile.avatar)

const validExtensions = ['png', 'jpg', 'jpeg', 'JPG', 'JPEG']
const form = ref({
  first_name: null,
  last_name: null,
  avatar: null,
})
const cropper = ref(null)
const avatarSrc = ref(null)
const hasCroppedImage = ref(false)
const cropperImageObjectURL = ref(null)
// const imageInput = ref(null)
const dialogOpen = ref(false)
const showAvatarMenu = ref(false)
const deletedImage = ref(false)

function handleCropperCancel() {

}

function handleImageSelect() {
  const imageInput = document.createElement('input')
  imageInput.type = 'file'
  imageInput.addEventListener('change', handleImageSelected)
  imageInput.click()
}

function handleImageSelected(event) {
  console.log('handleImageSelected', event)
  const file = event.target.files[0]
  const extension = file.name.split('.').pop()
  if (!validExtensions.includes(extension)) {
    q.notify({
      type: 'warning',
      message: t('general.snack.fileFormatError'),
      position: 'top',
      actions: [
        {label: '', icon: 'close', color: 'black', round: true},
      ],
    })
    return
  }
  cropperImageObjectURL.value = window.URL.createObjectURL(file)
  dialogOpen.value = true
  console.log('imgURL', cropperImageObjectURL.value)
}

function handleCropperSubmit() {
  dialogOpen.value = false
  const {canvas} = cropper.value.getResult()
  avatarSrc.value = canvas.toDataURL()
  hasCroppedImage.value = true
}

function handleFormSubmit() {
  if (hasCroppedImage.value) {
    const {canvas} = cropper.value.getResult()
    const form = new FormData()
    form.append('first_name', form.first_name)
    form.append('last_name', form.last_name)
    canvas.toBlob(blob => {
      form.append('avatar', blob, `avatar.png`)
      axiosInstance.patch(urls.userProfile, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then(res => {
        console.log('form patch response', res)
        q.notify({
          type: 'positive',
          message: t('general.snack.saveSuccess'),
        })
        userStore.SetProfile(res.data)
      }).catch(err => {
        console.log('file upload error', err)
        notifyAxiosError(err)
      })
    })
  } else {
    const data = {
      'first_name': form.value.first_name,
      'last_name': form.value.last_name,
    }
    axiosInstance.patch(urls.userProfile, data)
      .then(res => {
        console.log('simple patch response', res)
        userStore.SetProfile(res.data)
        notifyMessage('positive', t('general.snack.saveSuccess'))
      })
      .catch(err => {
        console.log('simple patch error', err)
        notifyAxiosError(err)
      })
  }
}

avatarSrc.value = userStore.profile.avatar
console.log('avatarSrc', avatarSrc)
axiosInstance.get(urls.userProfile)
  .then(res => {
    console.log('Profile response', res)
    form.value = res.data
  })
  .catch(err => {
    console.log('Profile error', err)
  })

</script>

<style scoped>

</style>
