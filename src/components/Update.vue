<template lang="html">
      <span style="font-weight:normal; font-size:12px;"> Última actualización : {{update}} </span>
</template>

<script>
// import moment from 'moment';
const moment = require('moment');
require('moment/locale/es');
moment.locale('es');

export default {
  name:'update',
  props:['labels'],
  computed:{
    update: function(){
      let now = new Date();
      now = moment(now).format("DD-MM-YYYY");
      let lastUpdate = moment(this.labels.slice(-1)[0], "DD-MM-YYYY").format("DD-MM-YYYY")
      if(now == lastUpdate){
        return 'hoy'+' ('+lastUpdate+')'
      }
      else if(moment(lastUpdate,'DD-MM-YYYY').add(1,'d').format("DD-MM-YYYY") == now ){
        return 'ayer '+' ('+lastUpdate+')'
      }
      else{
        return lastUpdate
      }
    }
  }
}
</script>

<style lang="css" scoped>
</style>
