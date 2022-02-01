import {computed, ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {cloneDeep} from 'lodash'
import {formatIntNumber} from './number-tools'
import {axiosInstance} from '../boot/axios'
import {addBanner, notifyErrors} from './notif'
import {useRouter} from 'vue-router'
// import {routerInstance} from 'src/router'


export function useAddEdit(
  itemId, form, apiRoot, listViewRoute, itemTypeTranslate, formInit, getRequestData,
) {
  const {t} = useI18n()
  const router = useRouter()

  const editingItemId = computed(() => itemId)
  const formTitle = computed(() => {
    if (editingItemId.value)
      return `${t('general.change')} ${t(itemTypeTranslate)}`
    return t('general.createANew').replace('{0}', t(itemTypeTranslate))
  })

  function saveItem() {
    console.log('form', form.value)
    const data = getRequestData()
    console.log('save payload', data)

    let url = apiRoot
    if (editingItemId.value) url += `${editingItemId.value}/`
    let method = editingItemId.value ? 'patch' : 'post'
    axiosInstance.request({url, data, method})
      .then(res => {
        console.log('save success', res.data)
        addBanner('success')
        router.push({name: listViewRoute})
      })
      .catch(err => {
        console.log('request error', err)
        // errors.value = err.response.data
        notifyErrors(err.response.data)
      })
  }

  function initialize() {
    if (editingItemId.value) {
      axiosInstance.get(apiRoot + editingItemId.value + '/')
        .then(res => {
          console.log('item details', res.data)
          formInit(res.data) // handle ManyToMany relations data in "formInit" method
        })
      console.log('no details, getting the item details from server')
    }
  }

  return{
    editingItemId,
    formTitle,
    saveItem,
    initialize
  }

}
