<template>
  <div class="q-pa-md q-ma-md">
    <q-card-section>
      <div class="text-h5">{{ $t('general.routes.scrapeInvoice') }}</div>
    </q-card-section>
    <div class="text-md-body-1">نکات استفاده:</div>
    <ul class="q-ma-sm">
      <!--    <li>-->
      <!--      کار استخراج صورت حساب باید به صورت خودکار انجام شود. اگر به هر دلیلی آخرین صورت حساب در لیست وجود نداشت،-->
      <!--      از این دکمه استفاده کنید.-->
      <!--    </li>-->
      <li>
        پروسه استخراج صورت حساب حدود یک تا دو دقیقه طول میکشه
      </li>
      <li>
        باید مطمئن باشید پسورد دیجیکالا آپدیت هست.
      </li>
      <li>
        در صورت عدم موفقیت مجدد بزنید.
      </li>
      <li>
        اونقدر بزن تا بالاخره اوکی شه. چون لاجیکش درسته ولی safety زیاد نذاشتم براش.
      </li>
      <li>
        در ضمن کار کردن ربات به باز بودن این صفحه ربطی نداره.بعد از زدن دکمه میتونید این صفحه رو ببندید
      </li>
    </ul>

    <div>
      <q-btn
        v-if="taskId === null"
        @click="handleScrape"
        color="primary"
        class="q-ma-sm"
      >
        {{ $t('general.start') }}
      </q-btn>
      <q-spinner-gears
        v-else-if="taskId && !taskDone"
        color="amber"
        size="xl"
      />
      <div v-if="taskState === 'FAILURE' && taskDone">
        <span class="text-negative">{{ $t('general.error.operationFailed') }}</span> &nbsp;
        <q-icon name="cancel" color="negative" size="lg"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onBeforeUnmount} from 'vue'
import {axiosInstance} from 'src/boot/axios'
import urls from 'src/urls'
import {notifyErrors, notifyMessage} from 'src/composables/notif'
import {useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'

const router = useRouter()
const {t} = useI18n()

const taskId = ref(null)
const taskState = ref(null)
const taskDone = ref(null)

const stateInterval = ref(null)
const taskColors = {
  'FAILURE': 'red',
  'PENDING': 'yellow',
  'SUCCESS': 'success',
}

const taskColor = computed(() => taskColors[taskState.value] || 'black')

onBeforeUnmount(() => stopChecking())

function stopChecking() {
  window.clearInterval(stateInterval.value)
}

function handleScrape() {
  taskDone.value = false
  axiosInstance.post(urls.scrapeInvoice)
    .then(res => {
      console.log('scrape task res', res)
      taskId.value = res.data.task_id
      handleTaskId()
    })
    .catch(err => {
      console.log('task test error', err)
      notifyErrors(err.response.data)
    })
}

function handleTaskId() {
  stateInterval.value = window.setInterval(() => {
    const url = urls.taskState.replace('{0}', taskId.value)
    console.log('status url', url)
    axiosInstance.get(url)
      .then(res => {
        console.log('task state response:', res)
        taskState.value = res.data.state
        console.log('taskState', taskState.value)
        if (taskState.value !== 'PENDING') {
          stopChecking()
          taskDone.value = true
          taskId.value = null
          if (taskState.value === 'SUCCESS') {
            notifyMessage('positive', t('general.alert.operationSuccess'))
            router.push({name: 'invoiceDownload'})
          }
        }
      })
      .catch(err => {
        console.log('task state error', err)
        notifyErrors(err.response.data)
        stopChecking()
      })
  }, 5000)

}
</script>
