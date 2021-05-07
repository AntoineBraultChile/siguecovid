<template >
  <div class="ChooseDate">
    <p>
      <label for="month">A partir del </label>
      <select name="month" id="month" v-on:change="changeFromDate($event)">
        <option v-for="month in listOfMonths"  :key='month' :value='month' :selected='fromDate==monthToDate(month)'> {{month}} </option>
      </select>
    </p>

      <!-- <vue-slider :data="listOfMonths" :adsorb="true" v-model="fromMonth" :marks="true" :width='1300' v-on:change="changeFromDate($event)"></vue-slider> -->

  </div>
</template>

<script>
// import moment from 'moment';
const moment = require('moment');
require('moment/locale/es');
moment.locale('es');
// import VueSlider from 'vue-slider-component'
// import 'vue-slider-component/theme/default.css'

export default {
  name:'choose-date',
  props:['listOfMonths','fromDate'],
  // components:{
  //   'vue-slider': VueSlider
  // },
  methods:{
    monthToDate(date){
      return moment(date, 'MMMM-YYYY').format('01-MM-YYYY')
    },
    // monthToDate(){
    //   this.fromDate =  moment(this.fromMonth, 'MMMM-YYYY').format('01-MM-YYYY')
    // },
    // dateToMonth(){
    //   this.fromMonth =  moment(this.fromDate, '01-MM-YYYY').format('MMMM YYYY')
    // },
    changeFromDate(event){
      this.$emit('newFromDate', event)
     }
  }
}
</script>

<style media="screen">

label{
  margin-right:5px;
}
</style>
