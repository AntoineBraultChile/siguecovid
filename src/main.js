import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

Vue.config.productionTip = false

Vue.mixin({
  methods: {
    meanWeek: function (tabValues) {
      let weekAverage=[];
      for (let i=0;i<tabValues.length-7; i++){
        weekAverage.push((tabValues[i]+tabValues[i+1]+tabValues[i+2]+tabValues[i+3]+tabValues[i+4]+tabValues[i+5]+tabValues[i+6])/7)
      }
      return weekAverage;
    },
  },
})




new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
