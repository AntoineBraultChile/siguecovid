<template>
  <div class="ChartChile">
    <div class="containerSection">
      <box-container>
         <title-container titleName='La pandemia de Covid-19 en Chile' :update='false'/>
         <p id='description'>Sigue Covid facilita el seguimiento y la visualización de la evolución de la pandemia de Covid-19 en Chile
         basado en  <a href="https://www.minciencia.gob.cl/covid19/" target='_blank'>datos del Ministerio de Ciencia</a>.</p>
       </box-container>

      <div id='block_graph' v-if="dataCovid.labelsCases.length > 0">
        <indicators v-if="dataCovid.labelsUci.length > 0"
          :labels='dataCovid.labelsCases'
          :cases='dataCovid.ChileMeanCases'
          :positivity='dataCovid.ChilePos'
          :uci='dataCovid.ChileUci'
          :deaths='dataCovid.ChileTotalDeaths'
          type='epidemic'
          region='Chile'
           />
        <slide-bar v-if="fromMonth.length > 0" :listOfMonths='listOfMonths' :fromMonth='fromMonth' v-on:newdate='updateCurrentDate'/>

          <charts-epidemic  region="Chile" :fromDate="fromDate" :dataCovid="dataCovid"/>

      </div>

      <spinner size='massive' v-else ></spinner>
    </div>


<footer-indicators><p>
  Como se calculan los indicatores :
  <ul>
    <li> La media móvil de 7 días de una cantidad (casos, positividad...) del día n es la medía de la cantidad entre los días n y n-7. </li>
    <li> El número de muertes corresponde únicamente al número de muertes confirmadas por la prueba PCR. El <a href="https://deis.minsal.cl/">Departamento de Estadiscticas e Informacion de Salud</a>
    da el número de fallecidos por Covid-19 sospechosos. </li>
  </ul>
</p>
</footer-indicators>
  </div>
</template>

<style src='../assets/chartChileAndRegion.css'>
</style>

<style >
.box-container{
  display:flex;
  align-items: center;
}
.ChartChile{
  width:100%;
  display:flex;
  flex-direction:column;
  align-items: center;
  justify-content: center;
}
#description{
  font-size:20px;
  text-align:justify;
  line-height: 150%;
  padding:0px 10px 0px 10px;
}

@media all and (max-width: 1100px) {
  #description{
    font-size:16px;
  }
}
</style>

<script>
import  {meanWeek, derivate} from '@/assets/mathFunctions'

import Indicators from '@/components/Indicators'
import ChartsEpidemic from '@/components/ChartsEpidemic'
import TitleContainer from '@/components/TitleContainer'
import FooterIndicators from '@/components/FooterIndicators'
import SlideBar from '@/components/SlideBar'
// import BarChart from '@/components/BarChart'


// import VueSlider from 'vue-slider-component'
// import 'vue-slider-component/theme/default.css'


import * as d3 from 'd3-fetch'


// const moment = require('moment');
// require('moment/locale/es');
// moment.locale('es');

import * as dayjs from 'dayjs'
var customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)
import 'dayjs/locale/es' // load on demand
dayjs.locale('es') // use Spanish locale globally

export default {
  name:'ChartChile',
  components:{
    'title-container': TitleContainer,
    'indicators': Indicators,
    'charts-epidemic': ChartsEpidemic,
    // 'vue-slider': VueSlider,
    // 'bar-chart':BarChart,
    'slide-bar': SlideBar,
    'footer-indicators': FooterIndicators
      },
  metaInfo() {
    return {
      title: "Sigue Covid en Chile - Visualizador de la pandemia de Covid-19 y el proceso de vacunación en Chile y en las regiones",
      meta: [
        { name: 'description',
        content:  `Visualizador de datos sobre la pandemia de Covid-19 en Chile. Encontra información actualizada diariamente sobre
        el número de  casos nuevos, pruebas de PCR,
        personas en  unidad de cuidados intensivos y fallecidos.`},
        {name: 'robots', content: 'index,follow'}
      ]
    }},
    data () {
      return{
        populationChile:{ // projection 2021 https://es.wikipedia.org/wiki/Anexo:Regiones_de_Chile_por_poblaci%C3%B3n
          'Total':19678363,
          'Metropolitana':8242459,
          'Aysén':107158 ,
          'Antofagasta':703534 ,
          'Arica y Parinacota':316168 ,
          'Atacama':316168,
          'Coquimbo':848079 ,
          'Araucanía':1019548 ,
          'Los Lagos':897708 ,
          'Los Ríos':407837 ,
          'Magallanes':179533 ,
          'Tarapacá':391558 ,
          'Valparaíso':1979373 ,
          "Ñuble":514609 ,
          "Biobío":1670590 ,
          "O’Higgins":1000959 ,
          "Maule":1143012 ,
        },
        dataCovid:{
          labelsUci:[],
          labelsPcr:[],
          labelsCases:[],
          labelsDeaths:[],
          // labelsPos:[],
          ChileUci:[],
          ChilePcr:[],
          ChileCases:[],
          ChileDeaths:[],
          ChileTotalDeaths:[],
          ChileMeanCases:[],
          ChilePos:[],
          incidence:{
            regionName:[],
            values:[],
            variations:[]
          }
        },
        fromDate: "01-02-2021",
        fromMonth:'',
        listOfMonths:[],
    }
  },
  methods:{
        updateCurrentDate(payload){
          this.fromMonth = payload
          this.fromDate = dayjs(payload, 'MMMM YYYY').format('01-MM-YYYY')
        }
      },
      async created(){
        // fetching data
        const getDataCsv =  async (path, type, derivative,  initializeMonths = false) => {
          let data = await d3.csv(path)
            if (derivative==true){
              this.dataCovid['labels'+type] = Object.keys(data[0]).slice(3+1).map((d)=>  {return dayjs(d, "YYYY-MM-DD").format("DD-MM-YYYY")})
            }else{
              this.dataCovid['labels'+type] = Object.keys(data[0]).slice(3).map((d)=>  {return dayjs(d, "YYYY-MM-DD").format("DD-MM-YYYY")})
            }

            if(initializeMonths == true){
              let currentDate = dayjs('05-2020', 'MM-YYYY')
              while(currentDate < dayjs(this.dataCovid.labelsUci[this.dataCovid.labelsUci.length-1],'DD-MM-YYYY')){
                this.listOfMonths.push(dayjs(currentDate, 'MM-YYYY').format('MMMM YYYY'))
                currentDate = dayjs(currentDate,'MM-YYYY').add(1,'M')
              }
            }
            let chileValues = []; // the sum of the regional time series
            for (let index=0; index <data.length; index++){

              // if we ask the derivative of the time serie (use to convert cumulative time serie to daily time serie)
              if(derivative==true){
                let dayCases = derivate(Object.values(data[index]).slice(3).map(i => Number(i)))
                chileValues = sumArray(chileValues,dayCases)
              }else{
                chileValues = sumArray(chileValues,Object.values(data[index]).slice(3).map(i => Number(i)))
              }
            }
            this.$set(this.dataCovid, 'Chile'+type, chileValues);
          //   if (type =='Pcr'){
          //   return this.dataCovid['ChilePcr']
          // }
          return this.dataCovid['Chile'+type]
        }

        // return the sum of the two array, if the first array is empty it returns the second Array
        function sumArray(firstArray, secondArray){
          if (firstArray.length == 0){
            return secondArray;
          }else{
            if (firstArray.length != secondArray.length){
              console.log('ERROR: the two arrays need to have the same length or the first array need to be empty !');
            }else{
              return firstArray.map((el,indx) => {return el + secondArray[indx]});
            }
          }
        }


        async function requests() {
          try {
            var getResults = await Promise.all([
              d3.csv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto3/CasosTotalesCumulativo.csv'),
              getDataCsv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto7/PCR.csv', 'Pcr', false,false),
              d3.csv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto14/FallecidosCumulativo.csv'),
              getDataCsv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto8/UCI.csv', 'Uci', false, true)
            ]);
            return getResults
          } catch (error) {
            console.log(error)

            throw (error)
          }
        }

        requests().then(data => {
          // deaths
          this.dataCovid['labelsDeaths'] =  Object.keys(data[2][0]).slice(3+1).map((d)=>  {return dayjs(d, "YYYY-MM-DD").format("DD-MM-YYYY")})
          this.dataCovid.ChileTotalDeaths = Object.values(data[2][16]).slice(3).map(i => Number(i))
          let dayCases = derivate(Object.values(data[2][16]).slice(3).map(i => Number(i)))
          this.$set(this.dataCovid, 'ChileDeaths', dayCases);
          this.$set(this.dataCovid, 'LabelsMeanDeaths' ,Object.keys(data[2][0]).slice(3+1+7).map((d)=>  {return dayjs(d, "YYYY-MM-DD").format("DD-MM-YYYY")}));
          this.$set(this.dataCovid, 'ChileMeanDeaths' ,meanWeek(dayCases).map((d)=>{return Math.round(d)}));

          // cases
          this.dataCovid['labelsCases'] =  Object.keys(data[0][0]).slice(3+1).map((d)=>  {return dayjs(d, "YYYY-MM-DD").format("DD-MM-YYYY")})
          dayCases = derivate(Object.values(data[0][16]).slice(3).map(i => Number(i)))
          this.$set(this.dataCovid, 'ChileCases', dayCases);
          this.$set(this.dataCovid, 'LabelsMeanCases' ,Object.keys(data[0][0]).slice(3+1+7).map((d)=>  {return dayjs(d, "YYYY-MM-DD").format("DD-MM-YYYY")}));
          this.$set(this.dataCovid, 'ChileMeanCases' ,meanWeek(dayCases).map((d)=>{return Math.round(d)}));
          this.dataCovid.incidence.regionName
          data[0].forEach(d =>{
            this.dataCovid.incidence.regionName.push(d['Region']);
            let incidence = Object.values(d).slice(-8).map(i => Number(i))
            incidence = Math.round((incidence.slice(-1)[0]-incidence[0])/this.populationChile[d['Region']]*100000)
            let incidenceOneDayBefore = Object.values(d).slice(-15,-7).map(i => Number(i))
            incidenceOneDayBefore = Math.round((incidenceOneDayBefore.slice(-1)[0]-incidenceOneDayBefore[0])/this.populationChile[d['Region']]*100000)
            this.dataCovid.incidence.values.push(incidence);
            this.dataCovid.incidence.variations.push(incidence-incidenceOneDayBefore)
          })
          // console.log(data[0])

          // compute the positivity
          let Cases = this.dataCovid['ChileCases'];
          let Pcr = this.dataCovid['ChilePcr'];
          let Pos=[]
          for (let i=0;i<Pcr.length;i++){
            Pos.push(Cases[Cases.length-i-1]/Pcr[Pcr.length-i-1]*100)
          }
          Pos = meanWeek(Pos.reverse()).map(d =>{return Math.round(d*10)/10});
          this.dataCovid.ChilePos = Pos;

          // update fromMonth
          this.fromMonth = dayjs(this.fromDate, '01-MM-YYYY').format('MMMM YYYY')

        })




      }
    }

    </script>
