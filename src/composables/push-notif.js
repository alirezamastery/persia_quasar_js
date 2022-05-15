import {PushNotifications} from '@capacitor/push-notifications'
import {logger} from '../utils'

// FireBase ---------------------------------------------------------------------------------
const addFireBaseListeners = () => {
  PushNotifications.addListener('registration', token => {
    logger('Registration token: ', token.value)
  })

  PushNotifications.addListener('registrationError', err => {
    logger('Registration error: ', err.error)
  })

  PushNotifications.addListener('pushNotificationReceived', notification => {
    logger('Push notification received: ', notification)
  })

  PushNotifications.addListener('pushNotificationActionPerformed', notification => {
    logger('Push notification action performed', notification.actionId, notification.inputValue)
  })
}

const registerNotifications = () => {
  PushNotifications.checkPermissions().then(permStatus => {
    logger('PushNotifications permission status:' , permStatus.receive)
    if (permStatus.receive === 'prompt') {
      PushNotifications.requestPermissions().then(permStatus => {
        if (permStatus.receive !== 'granted') {
          throw new Error('User denied permissions!')
        }
        logger('register PushNotifications')
        PushNotifications.register()
      })
    }
    logger('register PushNotifications')
    PushNotifications.register()
  })
}

const getDeliveredNotifications = () => {
  PushNotifications.getDeliveredNotifications().then(notificationList => {
    logger('delivered notifications', notificationList)
  })
}

export const setupFireBase = () => {
  logger('setup firebase')
  registerNotifications()
  addFireBaseListeners()
  getDeliveredNotifications()
}


// OneSignal ---------------------------------------------------------------------------------
export const setupOneSignal = () => {
  document.addEventListener('deviceready', OneSignalInit, false)

  function OneSignalInit() {
    logger('one signal init')
    // Uncomment to set OneSignal device logging to VERBOSE
    window.plugins.OneSignal.setLogLevel(6, 0)

    // NOTE: Update the setAppId value below with your OneSignal AppId.
    window.plugins.OneSignal.setAppId('10181441-6308-414b-9d4d-2e13dd58cee5')
    window.plugins.OneSignal.setNotificationOpenedHandler(function (jsonData) {
      logger('notificationOpenedCallback: ' + JSON.stringify(jsonData))
    })

    // iOS - Prompts the user for notification permissions.
    //    * Since this shows a generic native prompt, we recommend instead using an In-App Message to prompt for
    // notification permission (See step 6) to better communicate to your users what notifications they will get.
    window.plugins.OneSignal.promptForPushNotificationsWithUserResponse(function (accepted) {
      logger('User accepted notifications: ' + accepted)
    })
  }
}
