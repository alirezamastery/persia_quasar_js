import useGeneralStore from '../stores/general'
import {Notify, uid} from 'quasar'


const errorActions = [
  {label: '', icon: 'close', color: 'white', round: true},
]

export function addBanner(text, bgColor, textColor) {
  const generalStore = useGeneralStore()
  generalStore.AddPendingBanner({
    text,
    bgColor: bgColor || 'green',
    textColor: textColor || 'white',
    key: uid(),
  })
}

export function notifyAxiosError(error, log = false) {
  if (log) console.log('error:', error)
  const options = {
    type: 'negative',
    position: 'top',
    actions: errorActions,
  }
  if (error.response === undefined) {
    return // has been handled in axios interceptor
  } else if (error.response.status === 404) {
    options.message = '404 Not Found'
  } else {
    for (const [field, err] of Object.entries(error.response.data)) {
      if (Array.isArray(err)) {
        for (const msg of err) {
          options.message = `${field}: ${msg}`
          Notify.create(options)
        }
        return
      } else {
        options.message = `${field}: ${err}`
      }
    }
  }
  Notify.create(options)
}

export function notifyErrors(data) {
  for (const [field, error] of Object.entries(data)) {
    if (Array.isArray(error)) {
      for (const msg of error) {
        Notify.create({
          type: 'negative',
          message: `${field}: ${msg}`,
          position: 'top',
          actions: [
            {label: '', icon: 'close', color: 'white', round: true},
          ],
        })
      }
    } else {
      Notify.create({
        type: 'negative',
        message: `${field}: ${error}`,
        position: 'top',
        actions: [
          {label: '', icon: 'close', color: 'white', round: true},
        ],
      })
    }
  }
}

export function notifyMessage(type, msg, pos = 'top', btnColor = 'white') {
  Notify.create({
    type: type,
    message: msg,
    position: pos,
    actions: [
      {label: '', icon: 'close', color: btnColor, round: true},
    ],
  })
}
