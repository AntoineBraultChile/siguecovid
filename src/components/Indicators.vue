<template lang="html">
  <div class="indicators">
    <div class="optionDosis">
      <div class='dosis indicator1' :class='colorsIndicator[0]' v-if='cases.length>0'>
        <div>{{numberToStringFormat(cases.slice(-1)[0])+text[0]}}  </div>
        <div  class='legend' v-if="type=='epidemic'"> Media móvil de 7 días</div>
        <div class='en24horas'> {{incrementLastDay(cases)}}  en 24 horas </div>
        <update :labels='labels'> </update>
      </div>
      <div class='dosis indicator2' :class='colorsIndicator[1]' v-if='positivity.length>0'>
         <span> {{positivity.slice(-1)[0]+text[1]}} </span>
        <span  class='legend' v-if="type=='epidemic'"> Media móvil de 7 días</span>
        <span class='en24horas'> {{incrementLastDay(positivity)}} en 24 horas </span>
        <update :labels='labels'> </update>
      </div>
    </div>
    <div class="optionDosis">
      <div class='dosis indicator3' :class='colorsIndicator[2]' v-if='uci.length>0'>
        <span> {{numberToStringFormat(uci.slice(-1)[0]) + text[2]}}</span>
        <span class='en24horas'> {{incrementLastDay(uci).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}} en 24 horas </span>
        <span class='legend' v-if="type=='epidemic'"> UCI: unidad de cuidados intensivos </span>
        <update :labels='labels'> </update>
      </div>
      <div class='dosis indicator4' :class='colorsIndicator[3]' v-if='deaths.length>0'>
        <span>{{numberToStringFormat(deaths.slice(-1)[0]) + text[3]}} </span>
        <span class='en24horas'>  {{numberToStringFormat(incrementLastDay(deaths))}} en 24 horas </span>
        <update :labels='labels'> </update>
      </div>
    </div>
  </div>
</template>

<script>
import Update from './Update'

export default {
  name:'Indicators',
  props:{'labels':{type:Array},
  'cases':{type:Array},
  'positivity':{type:Array},
  'uci':{type:Array},
  'deaths':{type:Array},
  'colors':{type:Array, default: function (){return ['green', 'blue', 'red', 'black']}},
  'type':{type :String, default: function (){return 'epidemic'} }
},
data(){
  return{
    typeIndicator: this.type,
    colorsIndicator: this.colors,
    text:[]
  }
},
components:{
  'update':Update
},
methods: {
  // return the increment of values at time n minus time n-1, with + or - in front of the increment
  incrementLastDay(timeSerie){
    if (Math.round((timeSerie.slice(-1)[0]-timeSerie.slice(-2)[0])*10)==0){
      return 'No variación'
    }else{
    return (timeSerie.slice(-1)[0]-timeSerie.slice(-2)[0]>0? '+':' ')+(Math.round((timeSerie.slice(-1)[0]-timeSerie.slice(-2)[0])*10)/10).toString()
  }
  },
  numberToStringFormat(number){
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  }
},
created(){
  if(this.typeIndicator=='epidemic'){
    this.text = [' casos', ' % de positividad', ' personas en UCI', ' total fallecidos']
  }else if(this.typeIndicator=='vaccin'){
    this.text = ['% con una dosis', '% con dos dosis', ' primera dosis', ' segunda dosis']
  }else{
    console.log('Error type does not exist, choose epidemic or vaccin !')
  }

}
}
</script>

<style lang="css" scoped>


.indicators{
  width:100%;
  display:flex;
  flex-direction:row;
  justify-content: space-between;
  align-items: center;
}
.en24horas{
  font-size:16px;
  font-weight:normal;
}
.legend{
  font-weight:normal;
  font-size:12px;
}
.optionDosis{
  width:49%;
  display:flex;
  flex-direction:row;
  justify-content: space-around;
  align-items: space-around ;
}

.dosis{
  height:80px;
  display:flex;
  flex-direction:column;
  justify-content:space-between;
  align-items:center;
  font-weight: bold;
  color:#2c3e50;
  border-radius:7px;
  padding: 5px 5px 5px 5px;
  margin-top:5px;
  margin-bottom:5px;
  /* margin-left:10px;
  margin-right:10px; */

}
.green{
  border: solid 1px rgb(147,219,112);
  background-color: rgb(147,219,112,0.4);
}
.blue{
  border: solid 1px rgb(130,207,253);
  background-color:rgb(130,207,253,0.4);
}
.red{
  border: solid 1px 	rgb(221,75,57);
  background-color:	rgb(221,75,57,0.4);

}
.black{
  border: solid 1px rgb(35, 43, 43);
  background-color:rgb(35, 43, 43,0.4);
}

.orange{
  border: solid 1px rgb( 	235, 164, 52);
  background-color:rgb( 235, 164, 52, 0.4);
}

@media all and (max-width: 1100px) {
  .indicators{
    flex-direction:column;
  }
  .en24horas{
    font-size:14px;
  }
  .dosis.indicator1, .dosis.indicator3{
    width:50%;
    margin:5px 5px 5px 0px;

  }
  .dosis.indicator2, .dosis.indicator4{
    width:50%;
    margin:5px 0px 5px 5px;
  }
  .optionDosis{
    width:100%;
    justify-content: space-between;
  }

}
</style>
