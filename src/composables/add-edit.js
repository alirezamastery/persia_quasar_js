import {computed, ref} from 'vue'

export function useAddEdit(config){
  const apiRoot = config.apiRoot
  const listViewRoute = config.listViewRoute
  const itemTypeTranslate = config.itemTypeTranslate

  const editingItemId = computed(() => config.itemId)

}
