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
// import 'vue-advanced-cropper/dist/style.css'
// import 'vue-advanced-cropper/dist/theme.classic.css'

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
        // notifyAxiosError(err)
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
        // notifyAxiosError(err)
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
.vue-advanced-cropper {
  text-align: center /* rtl:ignore */;
  position: relative /* rtl:ignore */;
  user-select: none /* rtl:ignore */;
  max-height: 100% /* rtl:ignore */;
  max-width: 100% /* rtl:ignore */;
  direction: ltr /* rtl:ignore */;
}
.vue-advanced-cropper__stretcher {
  pointer-events: none /* rtl:ignore */;
  position: relative /* rtl:ignore */;
  max-width: 100% /* rtl:ignore */;
  max-height: 100% /* rtl:ignore */;
}
.vue-advanced-cropper__image {
  user-select: none /* rtl:ignore */;
  position: absolute /* rtl:ignore */;
  transform-origin: center /* rtl:ignore */;
  max-width: none !important /* rtl:ignore */;
}
.vue-advanced-cropper__background, .vue-advanced-cropper__foreground {
  opacity: 1 /* rtl:ignore */;
  background: black /* rtl:ignore */;
  transform: translate(-50%, -50%) /* rtl:ignore */;
  position: absolute /* rtl:ignore */;
  top: 50% /* rtl:ignore */;
  left: 50% /* rtl:ignore */;
}
.vue-advanced-cropper__foreground {
  opacity: 0.5 /* rtl:ignore */;
}
.vue-advanced-cropper__boundaries {
  opacity: 1 /* rtl:ignore */;
  transform: translate(-50%, -50%) /* rtl:ignore */;
  position: absolute /* rtl:ignore */;
  left: 50% /* rtl:ignore */;
  top: 50% /* rtl:ignore */;
}
.vue-advanced-cropper__cropper-wrapper {
  width: 100% /* rtl:ignore */;
  height: 100% /* rtl:ignore */;
}
.vue-advanced-cropper__image-wrapper {
  overflow: hidden /* rtl:ignore */;
  position: absolute /* rtl:ignore */;
  width: 100% /* rtl:ignore */;
  height: 100% /* rtl:ignore */;
}
.vue-advanced-cropper__stencil-wrapper {
  position: absolute /* rtl:ignore */;
}

.vue-draggable-area {
  position: relative /* rtl:ignore */;
}

.vue-line-wrapper {
  background: none /* rtl:ignore */;
  position: absolute /* rtl:ignore */;
  display: flex /* rtl:ignore */;
  align-items: center /* rtl:ignore */;
  justify-content: center /* rtl:ignore */;
}
.vue-line-wrapper--north, .vue-line-wrapper--south {
  height: 12px /* rtl:ignore */;
  width: 100% /* rtl:ignore */;
  left: 0 /* rtl:ignore */;
  transform: translateY(-50%) /* rtl:ignore */;
}
.vue-line-wrapper--north {
  top: 0 /* rtl:ignore */;
  cursor: n-resize /* rtl:ignore */;
}
.vue-line-wrapper--south {
  top: 100% /* rtl:ignore */;
  cursor: s-resize /* rtl:ignore */;
}
.vue-line-wrapper--east, .vue-line-wrapper--west {
  width: 12px /* rtl:ignore */;
  height: 100% /* rtl:ignore */;
  transform: translateX(-50%) /* rtl:ignore */;
  top: 0 /* rtl:ignore */;
}
.vue-line-wrapper--east {
  left: 100% /* rtl:ignore */;
  cursor: e-resize /* rtl:ignore */;
}
.vue-line-wrapper--west {
  left: 0 /* rtl:ignore */;
  cursor: w-resize /* rtl:ignore */;
}
.vue-line-wrapper--disabled {
  cursor: auto /* rtl:ignore */;
}

.vue-handler-wrapper {
  position: absolute /* rtl:ignore */;
  transform: translate(-50%, -50%) /* rtl:ignore */;
  width: 30px /* rtl:ignore */;
  height: 30px /* rtl:ignore */;
}
.vue-handler-wrapper__draggable {
  width: 100% /* rtl:ignore */;
  height: 100% /* rtl:ignore */;
  display: flex /* rtl:ignore */;
  align-items: center /* rtl:ignore */;
  justify-content: center /* rtl:ignore */;
}
.vue-handler-wrapper--west-north {
  cursor: nw-resize /* rtl:ignore */;
}
.vue-handler-wrapper--north {
  cursor: n-resize /* rtl:ignore */;
}
.vue-handler-wrapper--east-north {
  cursor: ne-resize /* rtl:ignore */;
}
.vue-handler-wrapper--east {
  cursor: e-resize /* rtl:ignore */;
}
.vue-handler-wrapper--east-south {
  cursor: se-resize /* rtl:ignore */;
}
.vue-handler-wrapper--south {
  cursor: s-resize /* rtl:ignore */;
}
.vue-handler-wrapper--west-south {
  cursor: sw-resize /* rtl:ignore */;
}
.vue-handler-wrapper--west {
  cursor: w-resize /* rtl:ignore */;
}
.vue-handler-wrapper--disabled {
  cursor: auto /* rtl:ignore */;
}

.vue-simple-handler {
  display: block /* rtl:ignore */;
  background: white /* rtl:ignore */;
  height: 10px /* rtl:ignore */;
  width: 10px /* rtl:ignore */;
}

.vue-simple-line {
  background: none /* rtl:ignore */;
  transition: border 0.5s /* rtl:ignore */;
  border-color: rgba(255, 255, 255, 0.3) /* rtl:ignore */;
  border-width: 0 /* rtl:ignore */;
  border-style: solid /* rtl:ignore */;
}
.vue-simple-line--south, .vue-simple-line--north {
  height: 0 /* rtl:ignore */;
  width: 100% /* rtl:ignore */;
}
.vue-simple-line--east, .vue-simple-line--west {
  height: 100% /* rtl:ignore */;
  width: 0 /* rtl:ignore */;
}
.vue-simple-line--east {
  border-right-width: 1px /* rtl:ignore */;
}
.vue-simple-line--west {
  border-left-width: 1px /* rtl:ignore */;
}
.vue-simple-line--south {
  border-bottom-width: 1px /* rtl:ignore */;
}
.vue-simple-line--north {
  border-top-width: 1px /* rtl:ignore */;
}
.vue-simple-line--hover {
  opacity: 1 /* rtl:ignore */;
  border-color: white /* rtl:ignore */;
}

.vue-bounding-box {
  position: relative /* rtl:ignore */;
  height: 100% /* rtl:ignore */;
  width: 100% /* rtl:ignore */;
}
.vue-bounding-box__handler {
  position: absolute /* rtl:ignore */;
}
.vue-bounding-box__handler--west-north {
  left: 0 /* rtl:ignore */;
  top: 0 /* rtl:ignore */;
}
.vue-bounding-box__handler--north {
  left: 50% /* rtl:ignore */;
  top: 0 /* rtl:ignore */;
}
.vue-bounding-box__handler--east-north {
  left: 100% /* rtl:ignore */;
  top: 0 /* rtl:ignore */;
}
.vue-bounding-box__handler--east {
  left: 100% /* rtl:ignore */;
  top: 50% /* rtl:ignore */;
}
.vue-bounding-box__handler--east-south {
  left: 100% /* rtl:ignore */;
  top: 100% /* rtl:ignore */;
}
.vue-bounding-box__handler--south {
  left: 50% /* rtl:ignore */;
  top: 100% /* rtl:ignore */;
}
.vue-bounding-box__handler--west-south {
  left: 0 /* rtl:ignore */;
  top: 100% /* rtl:ignore */;
}
.vue-bounding-box__handler--west {
  left: 0 /* rtl:ignore */;
  top: 50% /* rtl:ignore */;
}

.vue-rectangle-stencil {
  position: absolute /* rtl:ignore */;
  height: 100% /* rtl:ignore */;
  width: 100% /* rtl:ignore */;
  box-sizing: border-box /* rtl:ignore */;
}
.vue-rectangle-stencil__preview {
  position: absolute /* rtl:ignore */;
  width: 100% /* rtl:ignore */;
  height: 100% /* rtl:ignore */;
}
.vue-rectangle-stencil--movable {
  cursor: move /* rtl:ignore */;
}

.vue-preview-result {
  overflow: hidden /* rtl:ignore */;
  box-sizing: border-box /* rtl:ignore */;
  position: absolute /* rtl:ignore */;
  height: 100% /* rtl:ignore */;
  width: 100% /* rtl:ignore */;
}
.vue-preview-result__wrapper {
  position: absolute /* rtl:ignore */;
}
.vue-preview-result__image {
  pointer-events: none /* rtl:ignore */;
  position: relative /* rtl:ignore */;
  user-select: none /* rtl:ignore */;
  transform-origin: center /* rtl:ignore */;
  max-width: none !important /* rtl:ignore */;
}

.vue-circle-stencil {
  position: absolute /* rtl:ignore */;
  height: 100% /* rtl:ignore */;
  width: 100% /* rtl:ignore */;
  box-sizing: content-box /* rtl:ignore */;
  cursor: move /* rtl:ignore */;
}
.vue-circle-stencil__preview {
  border-radius: 50% /* rtl:ignore */;
  position: absolute /* rtl:ignore */;
  width: 100% /* rtl:ignore */;
  height: 100% /* rtl:ignore */;
}
.vue-circle-stencil--movable {
  cursor: move /* rtl:ignore */;
}

.vue-preview {
  overflow: hidden /* rtl:ignore */;
  box-sizing: border-box /* rtl:ignore */;
  position: relative /* rtl:ignore */;
}
.vue-preview--fill {
  width: 100% /* rtl:ignore */;
  height: 100% /* rtl:ignore */;
  position: absolute /* rtl:ignore */;
}
.vue-preview__wrapper {
  position: absolute /* rtl:ignore */;
  height: 100% /* rtl:ignore */;
  width: 100% /* rtl:ignore */;
}
.vue-preview__image {
  pointer-events: none /* rtl:ignore */;
  position: absolute /* rtl:ignore */;
  user-select: none /* rtl:ignore */;
  transform-origin: center /* rtl:ignore */;
  max-width: none !important /* rtl:ignore */;
}
</style>
