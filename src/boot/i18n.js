import {boot} from 'quasar/wrappers'
import {createI18n} from 'vue-i18n'

import messages from 'src/i18n'

const defaultLocale = 'fa'

// moved this out of boot because we needed it outside of components
export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: defaultLocale,
  messages,
})

export default boot(({app}) => {
  // const i18n = createI18n({
  //   legacy: false,
  //   globalInjection: true,
  //   locale: defaultLocale,
  //   messages,
  // })

  // Set i18n instance on app
  app.use(i18n)
})
