import useGeneralStore from '../stores/general'
import {Notify, uid} from 'quasar'


export function addBanner(text, bgColor, textColor) {
  const generalStore = useGeneralStore()
  generalStore.AddPendingBanner({
    text,
    bgColor: bgColor || 'green',
    textColor: textColor || 'white',
    key: uid(),
  })
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
