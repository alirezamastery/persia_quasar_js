import {notifyErrors, addBanner, notifyMessage} from '../composables/notif'

export const addEditViewMixin = {
  data() {
    return {
      showForm: true,
      deleteDialog: false,
    }
  },
  computed: {
    editingItemId() {
      return this.$route.params.id
    },
    formTitle() {
      if (this.editingItemId)
        return this.$t('general.change') + ' ' + this.$t(this.itemType)
      return this.$t('general.createANew', {item: this.$t(this.itemType)})
    },
  },
  created() {
    if (this.editingItemId) {
      this.showForm = false
      this.$axios.get(this.apiRoot + this.editingItemId + '/')
        .then(res => {
          console.log('item details', res)
          this.formInit(res.data) // handle ManyToMany relations data in "formInit" method
          this.showForm = true
        })
      console.log('no details, getting the item details from server')
    }
  },
  methods: {
    isRequired(val) {
      return !!val || this.$t('general.error.fieldIsRequired')
    },
    saveItem() {
      console.log('form', this.form)
      const data = this.getRequestData()
      console.log('save payload', data)

      let url = this.apiRoot
      if (this.editingItemId) url += `${this.editingItemId}/`
      let method = this.editingItemId ? 'patch' : 'post'
      this.$axios.request({url, data, method})
        .then(res => {
          console.log('save success', res.data)
          this.handleAlert()
          this.$router.push({name: this.listViewRoute})
        })
        .catch(err => {
          console.log('request error', err)
          notifyErrors(err.response.data)
        })
    },

    handleAlert() {
      let alertText
      if (this.editingItemId) {
        alertText = this.$t('general.alert.updateSuccess', {
          type: this.$t(this.itemType),
          item: this.itemRepr,
        })
      } else
        alertText = this.$t('general.alert.saveSuccessGeneral', {type: this.$t(this.itemType)})
      addBanner(alertText)
    },

    handleDeleteItem() {
      this.deleteDialog = false
      this.$axios.delete(this.apiRoot + this.editingItemId + '/')
        .then(res => {
          console.log('res delete', res.data)
          const txt = this.$t('general.alert.deleteSuccess', {
            type: this.$t(this.itemType),
            item: this.itemRepr,
          })
          addBanner(txt)
          this.$router.push({name: this.listViewRoute})
        })
        .catch(err => {
          console.log('delete error ', err)
          notifyErrors(err.response.data)
        })
    },

  },
}
