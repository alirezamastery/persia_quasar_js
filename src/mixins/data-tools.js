export const dataToolsMixin = {
  methods: {
    addCommaForIntNumber(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    removeCommas(val) {
      return String(val).replace(/,/g, '')
    },
    formatIntNumber(val) {
      const commaRemoved = this.removeCommas(val)
      return this.addCommaForIntNumber(commaRemoved)
    },
    numberWithCommaToInt(val) {
      return parseInt(this.removeCommas(val))
    },
    fillTranslationString(sentence, payload) {
      return this.$t(sentence).replace('{0}', payload.toString())
    },
    fillTranslationI18Path(sentence, i18Path) {
      return this.$t(sentence).replace('{0}', this.$t(i18Path))
    },
    itemAction(sentence, itemType, item) {
      console.log('sentence' , this.$t('general.alert.saveSuccess'))
      return this.$t(sentence).replace('{0}', itemType).replace('{1}', String(item))
    },
    itemTypeAction(sentence, itemType) {
      return this.$t(sentence).replace('{0}', itemType)
    },
    createNewTitle(i18Path) {
      return this.$t('general.createANew').replace('{0}', this.$t(i18Path))
    },
  },
}
