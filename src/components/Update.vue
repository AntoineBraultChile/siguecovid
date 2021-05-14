<template lang="html">
      <span style="font-weight:normal; font-size:0.9rem; color:gray;"> Última actualización : {{update}} </span>
</template>

<script>

import * as dayjs from 'dayjs'
var customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)
import 'dayjs/locale/es' // load on demand
dayjs.locale('es') // use Spanish locale globally

export default {
  name:'update',
  props:['labels'],
  computed:{
    update: function(){
      let now = new Date();
      now = dayjs(now).format("DD-MM-YYYY");
      let lastUpdate = dayjs(this.labels.slice(-1)[0], "DD-MM-YYYY").format("DD-MM-YYYY")
      if(now == lastUpdate){
        return 'hoy'+' ('+lastUpdate+')'
      }
      else if(dayjs(lastUpdate,'DD-MM-YYYY').add(1,'d').format("DD-MM-YYYY") == now ){
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
