import {i18n} from 'src/boot/i18n'
import {Dialog, Notify} from 'quasar'

export function isRequired(val) {
  const {t} = i18n.global
  return !!val || t('general.error.fieldIsRequired')
}

export function positiveNumber(val) {
  const {t} = i18n.global
  return val >= 0 || t('general.error.positiveNumber')
}

export function positiveNaturalNumber(val) {
  console.log('got type:', typeof val)
  const {t} = i18n.global
  return val > 0 || t('general.error.positiveNaturalNumber')
}

//
// export function notifyErrors(data) {
//   Object.entries(data).map(([field, error]) => {
//     if (Array.isArray(error)) {
//       for (const msg of error) {
//         Notify.create({
//           type: 'negative',
//           message: `${field}: ${msg}`,
//           position: 'top',
//           actions: [
//             {label: '', icon: 'close'},
//           ],
//         })
//       }
//     } else {
//       Notify.create({
//         type: 'negative',
//         message: `${field}: ${error}`,
//         position: 'top',
//         actions: [
//           {label: '', icon: 'close'},
//         ],
//       })
//     }
//   })
// }
//
// export function generalNotif(type, msg, pos = 'top', btnColor = 'white') {
//   Notify.create({
//     type: type,
//     message: msg,
//     position: pos,
//     actions: [
//       {label: '', icon: 'close', color: btnColor, round: true},
//     ],
//   })
// }
