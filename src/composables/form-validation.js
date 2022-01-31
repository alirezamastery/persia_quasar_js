import {i18n} from 'src/boot/i18n'
import {Dialog, Notify} from 'quasar';

export function isRequired(val) {
  const {t} = i18n.global
  return !!val || t('general.error.fieldIsRequired')
}

export function notifyErrors(data) {
  Object.entries(data).map(([field, errors]) => {
    for (const msg of errors) {
      Notify.create({
        type: 'negative',
        message: `${field}: ${msg}`,
        position: 'top',
        actions: [
          {label: '', icon: 'close'},
        ],
      })
    }
  })
}
