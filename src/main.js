import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import VueCompositionAPI from '@vue/composition-api'
// Vue.use(VueCompositionAPI)

import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'

Vue.component('VueSlider', VueSlider)


// import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'


import { library } from '@fortawesome/fontawesome-svg-core'
import { faVirus, faBars, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faVirus)
library.add(faBars)
library.add(faTimes)


Vue.component('font-awesome-icon', FontAwesomeIcon)


Vue.config.productionTip = false

import VueMeta from 'vue-meta'
Vue.use(VueMeta)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
