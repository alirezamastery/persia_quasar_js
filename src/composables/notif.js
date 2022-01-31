import useGeneralStore from '../stores/general'
import {uid} from 'quasar'


export function addBanner(text, bgColor, textColor) {
  const generalStore = useGeneralStore()
  generalStore.AddPendingBanner({
    text,
    bgColor: bgColor || 'green',
    textColor: textColor || 'white',
    key: uid(),
  })
}
