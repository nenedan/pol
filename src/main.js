// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import Vue from 'vue'
import App from './App'
import router from './router'
import Firebase from 'firebase'
import Vuefire from 'vuefire'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import * as VueGoogleMaps from 'vue2-google-maps'
import VCalendar from 'v-calendar'
import 'v-calendar/lib/v-calendar.min.css'

Vue.use(
  VueGoogleMaps, {
    load: {
      key: process.env.API_KEY_MAPS
    }
  }
)

Vue.config.productionTip = false
Vue.use(Vuefire)
Vue.use(Vuetify)
Vue.use(VCalendar, {
  firstDayOfWeek: 2
})

let app
// Initialize Firebase
let config = {
  apiKey: process.env.API_KEY_FIREBASE,
  authDomain: 'poli-c41fc.firebaseapp.com',
  databaseURL: 'https://poli-c41fc.firebaseio.com',
  projectId: 'poli-c41fc',
  storageBucket: 'poli-c41fc.appspot.com',
  messagingSenderId: '710005870221'
}
Firebase.initializeApp(config)
export const db = Firebase.firestore()

Firebase.auth().onAuthStateChanged(function (user) {
  if (!app) {
    app = new Vue({
      el: '#app',
      router,
      components: { App },
      template: '<App/>'
    })
  }
})
/* eslint-disable no-new */
