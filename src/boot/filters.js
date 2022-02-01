import {boot} from 'quasar/wrappers'
import moment from 'moment-jalaali'


// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(({app}) => {
  app.config.globalProperties.$filters = {
    price(val) {
      const reverse = txt =>
        (txt || 0)
          .toString()
          .split('')
          .reverse()
          .join('')

      return reverse(reverse(val).replace(/(\d{3})(?=\d)/g, '$1,'))
    },
    persianDate(val, format = 'jYYYY/jMM/jDD') {
      if (!val) return ''
      return moment(val).format(format)
    },
  }
})
