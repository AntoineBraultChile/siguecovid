<template >
  <p>
    <label for="month">A partir del </label>
    <select name="month" id="month" v-on:change="changeFromDate($event)">
      <option v-for="month in listOfMonths"  :key='month' :value='month' :selected='fromDate==monthToDate(month)'> {{month}} </option>
    </select>
  </p>
</template>

<script>
import moment from 'moment';

export default {
  name:'choose-date',
  props:['listOfMonths','fromDate'],
  methods:{
    monthToDate(date){
      return moment(date, 'MMMM-YYYY').format('YYYY-MM-01')
    },
    changeFromDate(event){
      this.$emit('newFromDate', event)
     }
  }
}
</script>
