import Vue from 'vue'
import App from './App.vue'
import router from './routers'
import * as firebase from "firebase"
import store from './stores/store'
import * as Boostrap from 'bootstrap'
require('firebase/firestore')
import { firestorePlugin } from 'vuefire'
import columnSortable from 'vue-column-sortable'
import VueCookie from 'vue-cookie'
import './plugins/vuetify'
import MultiFiltersPlugin from "./plugins/MultiFilters";
import SortedTablePlugin from "vue-sorted-table/src";
import VueCollapse from "vue2-collapse/src";
import * as VueGoogleMaps from 'vue2-google-maps'

// import VueLoading from 'vuejs-loading-plugin'

Vue.config.productionTip = false
Vue.config.devtools = true

Vue.use(columnSortable)
Vue.use(Boostrap)
Vue.use(firestorePlugin)
Vue.use(VueCookie)
Vue.use(MultiFiltersPlugin)
Vue.use(SortedTablePlugin)
Vue.use(VueCollapse)
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyC2PAig1DBjKqDOnAMbwhjtUzmRuydxE6s',
    libraries: 'places'
  }
})

var firebaseConfig = {
  apiKey: "AIzaSyC2PAig1DBjKqDOnAMbwhjtUzmRuydxE6s",
  authDomain: "potholereport-1b658.firebaseapp.com",
  databaseURL: "https://potholereport-1b658.firebaseio.com",
  projectId: "potholereport-1b658",
  storageBucket: "potholereport-1b658.appspot.com",
  messagingSenderId: "309915127830",
  appId: "1:309915127830:web:a2192c5bc0fc125fd3e537",
  measurementId: "G-S25W1LQV6G"
};

firebase.initializeApp(firebaseConfig)

firebase.auth().languageCode = 'it'

const storage = firebase.storage()
const storageRef = storage.ref()
const db = firebase.database()

Vue.prototype.$db = db
Vue.prototype.$storage = storage
Vue.prototype.$storageRef = storageRef

router.beforeEach((to, from, next) => {
  if (to.name != 'login') {
    let currentUser = firebase.auth().currentUser

    if (currentUser != null)
      next()
    else
      next({name: 'login'})

  } else {
    next()
  }
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')