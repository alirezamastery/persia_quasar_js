import {useI18n} from 'vue-i18n'

const {t} = useI18n()

export const fillTranslationString = (sentence, payload) => {
  return t(sentence).replace('{0}', payload.toString())
}

export const fillTranslationI18Path = (sentence, i18Path) => {
  return t(sentence).replace('{0}', t(i18Path))
}

export const itemAction = (sentence, itemType, item) => {
  return t(sentence)
    .replace('{0}', itemType)
    .replace('{1}', item.toString())
}

export const itemTypeAction = (sentence, itemType) => {
  return t(sentence)
    .replace('{0}', itemType)
}

export const createNewTitle = (i18Path) => {
  return t('general.createANew').replace('{0}', t(i18Path))
}
