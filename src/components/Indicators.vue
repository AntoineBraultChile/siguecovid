<template lang="html">
  <div class="indicators">
    <div class="optionDosis">
      <div class='dosis color1'>
        <span>{{cases.slice(-1)[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}} casos  </span>
        <span class='en24horas'> {{incrementLastDay(cases)}} casos  en 24 horas </span>
        <span  style="font-weight:normal; font-size:12px;"> Media móvil de 7 días</span>
        <update :labels='labels'> </update>
   </div>
       <div class='dosis color2'> <span> {{positivity.slice(-1)[0]}} % de positividad</span>
         <span class='en24horas'> {{incrementLastDay(positivity)}}% en 24 horas </span>
         <span  style="font-weight:normal; font-size:12px;"> Media móvil de 7 días</span>
         <update :labels='labels'> </update>
        </div>
    </div>
    <div class="optionDosis">
      <div class='dosis color3'>
        <span> {{uci.slice(-1)[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}} personas en UCI</span>
        <span class='en24horas'> {{incrementLastDay(uci)}} en 24 horas </span>
        <span style='font-size:12px;font-weight:normal'> UCI: unidad de cuidados intensivos </span>
        <update :labels='labels'> </update>
      </div>
      <div class='dosis color4'>
        <span>Total fallecidos {{totalDeaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}} </span>
        <span class='en24horas'> + {{deaths.slice(-1)[0]}} en 24 horas </span>
        <update :labels='labels'> </update>
      </div>
    </div>
  </div>
</template>

<script>
import Update from './Update'

export default {
  name:'Indicators',
  // examples props : dataCovidChile.labelsCases, dataCovidChile.ChileMeanCases, dataCovidChile.ChilePos, dataCovidChile.ChileUci, dataCovidChile.ChileDeaths, dataCovidChile.ChileTotalDeaths[0][0]
  props:['labels','cases','positivity','uci','deaths', 'totalDeaths'],
  components:{
    'update':Update
  },
  methods: {
    // return the increment of values at time n minus time n-1, with + or - in front of the increment
    incrementLastDay(timeSerie){
      return (timeSerie.slice(-1)[0]-timeSerie.slice(-2)[0]>0? '+':' ')+(Math.round((timeSerie.slice(-1)[0]-timeSerie.slice(-2)[0])*10)/10).toString()
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
.optionDosis{
  width:49%;
  display:flex;
  flex-direction:row;
  justify-content: space-around;
  align-items: space-around ;
}

.dosis{
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  font-weight: bold;
  color:#2c3e50;
  border-radius:7px;
  padding: 5px 5px 5px 5px;
  margin-top:5px;
  margin-bottom:5px;
  margin-left:10px;
  margin-right:10px;

}
.color1{
  border: solid 1px rgb(147,219,112);
  background-color: rgb(147,219,112,0.4);
}
.color2{
  border: solid 1px rgb(130,207,253);
  background-color:rgb(130,207,253,0.4);
}
.color3{
  border: solid 1px 	rgb(221,75,57);
  background-color:	rgb(221,75,57,0.4);

}
.color4{
  border: solid 1px rgb(35, 43, 43);
  background-color:rgb(35, 43, 43,0.4);
}

@media all and (max-width: 1100px) {
  .indicators{
  flex-direction:column;
  }
  .en24horas{
    font-size:14px;
  }
  .dosis.color1, .dosis.color3{
    width:50%;
    margin:5px 5px 5px 0px;

  }
  .dosis.color2, .dosis.color4{
    width:50%;
    margin:5px 0px 5px 5px;
  }
  .optionDosis{
    width:100%;
  }
}
</style>
