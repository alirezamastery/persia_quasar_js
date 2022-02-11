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
/**
 * to fix RTLCSS rtl problem with cropper css, we had to copy the css file to
 * the component style tag and use ignore syntax for the whole section
 * import 'vue-advanced-cropper/dist/style.css'
 * import 'vue-advanced-cropper/dist/theme.classic.css'
 */

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


<style>
/* rtl:begin:ignore */

.vue-advanced-cropper {
  text-align: center;
  position: relative;
  user-select: none;
  max-height: 100%;
  max-width: 100%;
  direction: ltr;
}
.vue-advanced-cropper__stretcher {
  pointer-events: none;
  position: relative;
  max-width: 100%;
  max-height: 100%;
}
.vue-advanced-cropper__image {
  user-select: none;
  position: absolute;
  transform-origin: center;
  max-width: none !important;
}
.vue-advanced-cropper__background, .vue-advanced-cropper__foreground {
  opacity: 1;
  background: black;
  transform: translate(-50%, -50%);
  position: absolute;
  top: 50%;
  left: 50%;
}
.vue-advanced-cropper__foreground {
  opacity: 0.5;
}
.vue-advanced-cropper__boundaries {
  opacity: 1;
  transform: translate(-50%, -50%);
  position: absolute;
  left: 50%;
  top: 50%;
}
.vue-advanced-cropper__cropper-wrapper {
  width: 100%;
  height: 100%;
}
.vue-advanced-cropper__image-wrapper {
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
}
.vue-advanced-cropper__stencil-wrapper {
  position: absolute;
}

.vue-draggable-area {
  position: relative;
}

.vue-line-wrapper {
  background: none;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
}
.vue-line-wrapper--north, .vue-line-wrapper--south {
  height: 12px;
  width: 100%;
  left: 0;
  transform: translateY(-50%);
}
.vue-line-wrapper--north {
  top: 0;
  cursor: n-resize;
}
.vue-line-wrapper--south {
  top: 100%;
  cursor: s-resize;
}
.vue-line-wrapper--east, .vue-line-wrapper--west {
  width: 12px;
  height: 100%;
  transform: translateX(-50%);
  top: 0;
}
.vue-line-wrapper--east {
  left: 100%;
  cursor: e-resize;
}
.vue-line-wrapper--west {
  left: 0;
  cursor: w-resize;
}
.vue-line-wrapper--disabled {
  cursor: auto;
}

.vue-handler-wrapper {
  position: absolute;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
}
.vue-handler-wrapper__draggable {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.vue-handler-wrapper--west-north {
  cursor: nw-resize;
}
.vue-handler-wrapper--north {
  cursor: n-resize;
}
.vue-handler-wrapper--east-north {
  cursor: ne-resize;
}
.vue-handler-wrapper--east {
  cursor: e-resize;
}
.vue-handler-wrapper--east-south {
  cursor: se-resize;
}
.vue-handler-wrapper--south {
  cursor: s-resize;
}
.vue-handler-wrapper--west-south {
  cursor: sw-resize;
}
.vue-handler-wrapper--west {
  cursor: w-resize;
}
.vue-handler-wrapper--disabled {
  cursor: auto;
}

.vue-simple-handler {
  display: block;
  background: white;
  height: 10px;
  width: 10px;
}

.vue-simple-line {
  background: none;
  transition: border 0.5s;
  border-color: rgba(255, 255, 255, 0.3);
  border-width: 0;
  border-style: solid;
}
.vue-simple-line--south, .vue-simple-line--north {
  height: 0;
  width: 100%;
}
.vue-simple-line--east, .vue-simple-line--west {
  height: 100%;
  width: 0;
}
.vue-simple-line--east {
  border-right-width: 1px;
}
.vue-simple-line--west {
  border-left-width: 1px;
}
.vue-simple-line--south {
  border-bottom-width: 1px;
}
.vue-simple-line--north {
  border-top-width: 1px;
}
.vue-simple-line--hover {
  opacity: 1;
  border-color: white;
}

.vue-bounding-box {
  position: relative;
  height: 100%;
  width: 100%;
}
.vue-bounding-box__handler {
  position: absolute;
}
.vue-bounding-box__handler--west-north {
  left: 0;
  top: 0;
}
.vue-bounding-box__handler--north {
  left: 50%;
  top: 0;
}
.vue-bounding-box__handler--east-north {
  left: 100%;
  top: 0;
}
.vue-bounding-box__handler--east {
  left: 100%;
  top: 50%;
}
.vue-bounding-box__handler--east-south {
  left: 100%;
  top: 100%;
}
.vue-bounding-box__handler--south {
  left: 50%;
  top: 100%;
}
.vue-bounding-box__handler--west-south {
  left: 0;
  top: 100%;
}
.vue-bounding-box__handler--west {
  left: 0;
  top: 50%;
}

.vue-rectangle-stencil {
  position: absolute;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}
.vue-rectangle-stencil__preview {
  position: absolute;
  width: 100%;
  height: 100%;
}
.vue-rectangle-stencil--movable {
  cursor: move;
}

.vue-preview-result {
  overflow: hidden;
  box-sizing: border-box;
  position: absolute;
  height: 100%;
  width: 100%;
}
.vue-preview-result__wrapper {
  position: absolute;
}
.vue-preview-result__image {
  pointer-events: none;
  position: relative;
  user-select: none;
  transform-origin: center;
  max-width: none !important;
}

.vue-circle-stencil {
  position: absolute;
  height: 100%;
  width: 100%;
  box-sizing: content-box;
  cursor: move;
}
.vue-circle-stencil__preview {
  border-radius: 50%;
  position: absolute;
  width: 100%;
  height: 100%;
}
.vue-circle-stencil--movable {
  cursor: move;
}

.vue-preview {
  overflow: hidden;
  box-sizing: border-box;
  position: relative;
}
.vue-preview--fill {
  width: 100%;
  height: 100%;
  position: absolute;
}
.vue-preview__wrapper {
  position: absolute;
  height: 100%;
  width: 100%;
}
.vue-preview__image {
  pointer-events: none;
  position: absolute;
  user-select: none;
  transform-origin: center;
  max-width: none !important;
}

/* advanced css */
.vue-simple-line {
  border-color: rgba(255, 255, 255, 0.8);
}

.vue-simple-handler {
  display: block;
  position: relative;
  -ms-flex-negative: 0;
  flex-shrink: 0;
  -webkit-transition: opacity 0.5s;
  transition: opacity 0.5s;
  border: none;
  background: white;
  height: 8px;
  width: 8px;
  opacity: 0.5;
}
.vue-simple-handler--hover {
  opacity: 1;
}

.vue-circle-stencil__preview {
  border: solid 2px rgba(255, 255, 255, 0.8);
}
.vue-circle-stencil .vue-simple-line {
  border-color: rgba(255, 255, 255, 0.3);
}
.vue-circle-stencil .vue-simple-handler--west-north, .vue-circle-stencil .vue-simple-handler--east-south, .vue-circle-stencil .vue-simple-handler--west-south, .vue-circle-stencil .vue-simple-handler--east-north {
  opacity: 0.5;
}
.vue-circle-stencil .vue-simple-handler--hover {
  opacity: 1;
}

.vue-circle-stencil__preview:after, .vue-circle-stencil__preview:before,
.vue-rectangle-stencil__preview:after,
.vue-rectangle-stencil__preview:before {
  content: "";
  opacity: 0;
  -webkit-transition: opacity 0.25s;
  transition: opacity 0.25s;
  position: absolute;
  pointer-events: none;
  z-index: 1;
}
.vue-circle-stencil__preview:after,
.vue-rectangle-stencil__preview:after {
  border-left: dashed 1px white;
  border-right: dashed 1px white;
  width: 33%;
  height: 100%;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
  left: 50%;
  top: 0;
}
.vue-circle-stencil__preview:before,
.vue-rectangle-stencil__preview:before {
  border-top: dashed 1px white;
  border-bottom: dashed 1px white;
  height: 33%;
  width: 100%;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  top: 50%;
  left: 0;
}
.vue-circle-stencil--moving .vue-rectangle-stencil__preview:after, .vue-circle-stencil--moving .vue-rectangle-stencil__preview:before,
.vue-circle-stencil--moving .vue-circle-stencil__preview:after,
.vue-circle-stencil--moving .vue-circle-stencil__preview:before, .vue-circle-stencil--resizing .vue-rectangle-stencil__preview:after, .vue-circle-stencil--resizing .vue-rectangle-stencil__preview:before,
.vue-circle-stencil--resizing .vue-circle-stencil__preview:after,
.vue-circle-stencil--resizing .vue-circle-stencil__preview:before,
.vue-rectangle-stencil--moving .vue-rectangle-stencil__preview:after,
.vue-rectangle-stencil--moving .vue-rectangle-stencil__preview:before,
.vue-rectangle-stencil--moving .vue-circle-stencil__preview:after,
.vue-rectangle-stencil--moving .vue-circle-stencil__preview:before,
.vue-rectangle-stencil--resizing .vue-rectangle-stencil__preview:after,
.vue-rectangle-stencil--resizing .vue-rectangle-stencil__preview:before,
.vue-rectangle-stencil--resizing .vue-circle-stencil__preview:after,
.vue-rectangle-stencil--resizing .vue-circle-stencil__preview:before {
  opacity: 0.7;
}
.vue-circle-stencil--moving .vue-simple-handler, .vue-circle-stencil--resizing .vue-simple-handler,
.vue-rectangle-stencil--moving .vue-simple-handler,
.vue-rectangle-stencil--resizing .vue-simple-handler {
  opacity: 1;
}

.vue-circle-stencil--moving .vue-simple-handler, .vue-circle-stencil--resizing .vue-simple-handler,
.vue-rectangle-stencil--moving .vue-simple-handler,
.vue-rectangle-stencil--resizing .vue-simple-handler {
  opacity: 1;
}

/* rtl:end:ignore */

</style>
