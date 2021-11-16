import Vue from "vue";
import App from "./App.vue";
import router from "./router";
// import VueCompositionAPI from '@vue/composition-api'
// Vue.use(VueCompositionAPI)

import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/default.css";

Vue.component("VueSlider", VueSlider);

import Spinner from "vue-simple-spinner";
Vue.component("spinner", Spinner);

// // import 'bootstrap'
// import 'bootstrap/dist/css/bootstrap.min.css'

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faVirus,
  faBars,
  faTimes,
  faHome,
  faSyringe,
  faFlag,
  faEnvelope,
  faUsers,
  faAngleDoubleUp,
  faAngleDoubleDown,
  faMapMarker,
  faSearch,
  faDna,
  faFistRaised,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faVirus);
library.add(faBars);
library.add(faTimes);
library.add(faHome);
library.add(faSyringe);
library.add(faFlag);
library.add(faEnvelope);
library.add(faUsers);
library.add(faAngleDoubleUp);
library.add(faAngleDoubleDown);
library.add(faMapMarker);
library.add(faSearch);
library.add(faDna);
library.add(faFistRaised);

Vue.component("font-awesome-icon", FontAwesomeIcon);

import BoxContainer from "@/components/BoxContainer";
Vue.component("box-container", BoxContainer);

import Subtitle from "@/components/Subtitle";
Vue.component("subtitle", Subtitle);

Vue.config.productionTip = false;

import VueMeta from "vue-meta";
Vue.use(VueMeta);

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
