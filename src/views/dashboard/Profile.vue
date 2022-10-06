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
          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-2 col-xl-2">
            <div class="user-avatar">
              <img
                v-if="form.avatar"
                :src="form.avatar"
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
              <div class="action-icons">
                <q-btn
                  round
                  color="primary"
                  icon="mdi-image-filter-none"
                >
                  <q-menu>
                    <q-list style="min-width: 100px">
                      <q-item clickable v-close-popup @click="handleImageSelect">
                        <q-item-section>
                          <q-icon name="mdi-pencil"/>
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{ $t('general.select') }}</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup @click="handleImageDelete">
                        <q-item-section>
                          <q-icon name="mdi-delete"/>
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{ $t('general.delete') }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </div>

            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-2 col-xl-2">
            <q-input
              v-model="form.first_name"
              :label="$t('general.firstName')"
              filled
            />
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-2 col-xl-2">
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

  <q-dialog v-model="dialogOpen">
    <q-card class="cropper-custom overflow-hidden-y">
      <q-card-section class="row justify-between">
        <q-btn
          v-close-popup
          icon="close"
          size="lg"
          round
        />
        <q-btn
          v-if="$q.screen.lt.md"
          color="primary"
          size="lg"
          @click="handleCropperSubmit"
        >
          {{ $t('general.submit') }}
        </q-btn>
      </q-card-section>
      <q-card-section class="cropper-custom__cropper-wrapper">
        <Cropper
          ref="cropper"
          :src="cropperImageObjectURL"
          :stencil-component="CircleStencil"
          :stencil-props="{aspectRatio: 1, resizable: true}"
          :canvas="{minHeight: 30, minWidth: 30, maxHeight: 300, maxWidth: 300}"
          class="cropper-custom__cropper"
        />
      </q-card-section>
      <q-card-actions>
        <q-btn
          v-if="$q.screen.gt.sm"
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
/*rtl:begin:ignore*/
import 'vue-advanced-cropper/dist/style.css'
import 'vue-advanced-cropper/dist/theme.classic.css'
/*rtl:end:ignore*/

import {ref} from 'vue'
import {Cropper, CircleStencil} from 'vue-advanced-cropper'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import useUserStore from 'src/stores/user'
import {useRouter} from 'vue-router'
import {axiosInstance} from 'src/boot/axios'
import urls from 'src/urls'
import {notifyMessage} from 'src/composables/notif'
import {cloneDeep} from 'lodash'

const {t} = useI18n()
const q = useQuasar()
const userStore = useUserStore()
const router = useRouter()

const validExtensions = ['png', 'jpg', 'jpeg', 'JPG', 'JPEG']
const form = ref({
  first_name: null,
  last_name: null,
  avatar: null,
})
const cropper = ref(null) // ref in the template
const hasCroppedImage = ref(false)
const cropperImageObjectURL = ref(null)
const dialogOpen = ref(false)

let canvasData = null


function handleImageSelect() {
  const imageInput = document.createElement('input')
  imageInput.type = 'file'
  imageInput.addEventListener('change', handleImageSelected)
  imageInput.click()
}

function handleImageDelete() {
  const data = {
    'avatar': null,
  }
  axiosInstance.patch(urls.userProfile, data)
    .then(res => {
      console.log('delete response:', res)
      form.value = cloneDeep(res.data)
      userStore.SetProfile(cloneDeep(res.data))
      notifyMessage('info', t('general.snack.saveSuccess'))
    })
    .catch(err => console.log('delete error:', err))
}

function handleImageSelected(event) {
  console.log('handleImageSelected', event)
  const file = event.target.files[0]
  const extension = file.name.split('.').pop()
  if (!validExtensions.includes(extension)) {
    notifyMessage('warning', t('general.snack.fileFormatError'))
    return
  }
  cropperImageObjectURL.value = window.URL.createObjectURL(file)
  dialogOpen.value = true
  console.log('imgURL', cropperImageObjectURL.value)
}

function handleCropperSubmit() {
  dialogOpen.value = false
  const {canvas} = cropper.value.getResult()
  canvasData = canvas
  form.value.avatar = canvasData.toDataURL()
  console.log('handleCropperSubmit | canvas', canvasData)
  hasCroppedImage.value = true
}


function handleFormSubmit() {
  if (hasCroppedImage.value) {
    const formData = new FormData()
    formData.append('first_name', form.value.first_name)
    formData.append('last_name', form.value.last_name)
    canvasData.toBlob(blob => {
      formData.append('avatar', blob, `avatar.png`)
      axiosInstance.patch(urls.userProfile, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then(res => {
        console.log('form patch response:', res)
        notifyMessage('info', t('general.snack.saveSuccess'))
        userStore.SetProfile(res.data)
      }).catch(err => {
        console.log('file upload error', err)
      })
    })
  } else {
    const data = {
      'first_name': form.value.first_name,
      'last_name': form.value.last_name,
    }
    axiosInstance.patch(urls.userProfile, data)
      .then(res => {
        console.log('without avatar change response:', res)
        userStore.SetProfile(res.data)
        notifyMessage('info', t('general.snack.saveSuccess'))
      })
      .catch(err => {
        console.log('simple patch error', err)
      })
  }
}

axiosInstance.get(urls.userProfile)
  .then(res => {
    console.log('Profile response', res)
    form.value = res.data
    console.log('form data:', form.value)
  })
  .catch(err => {
    console.log('Profile error', err)
  })

</script>


<style lang="scss">
.cropper-custom {
  user-select: none;

  &__cropper {
    max-height: 50vh !important;
    width: 100%;
  }

  &__cropper-wrapper {
    position: relative;
  }
}
</style>
