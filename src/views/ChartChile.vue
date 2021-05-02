<template>
  <div class="ChartChile">
    <div class="containerSection">
      <div class="titleContainer">
        <h1  id='slogan'>La pandemia de Covid-19 en Chile</h1>
      </div>
      <div id='block_graph' class='d-flex flex-row flex-wrap justify-content-between'>
        <indicators v-if="dataCovid.labelsUci.length > 0" :labels='dataCovid.labelsCases' :cases='dataCovid.ChileMeanCases' :positivity='dataCovid.ChilePos' :uci='dataCovid.ChileUci' :deaths='dataCovid.ChileDeaths' :totalDeaths='dataCovid.ChileTotalDeaths[0][0]' />

        <div class="slideBarContainer">
          Gráficos a partir de {{fromMonth}}
          <div class="slideBar" v-if="dataCovid.labelsUci.length > 0">
            <vue-slider :data="listOfMonths" :adsorb="true" v-model="fromMonth"  :marks='true' :hideLabel='true' :tooltip="'active'"  :use-keyboard="false" v-on:change="updateCurrentDate()"></vue-slider>
          </div>
        </div>

          <charts-epidemic region="Chile" :fromDate="fromDate" :dataCovid="dataCovid"/>
      </div>
    </div>

    <footer>
      <p>
        Como se calculan los indicatores :
        <ul>
          <li> La media móvil de 7 días de una cantidad (casos, positividad...) del día n es la medía de la cantidad entre los días n y n-7. </li>
          <li> La variación semanal se calcula como la media móvil de los últimos siete días dividida por la media móvil del día anterior. </li>
        </ul>
      </p>
    </footer>

  </div>
</template>

<style src='../assets/chartChileAndRegion.css'>
</style>

<style >
.ChartChile{
  display:flex;
  flex-direction:column;
  align-items: center;
  justify-content: center;
}
</style>

<script>
// import BarChart from '../components/BarChart'
import Indicators from '@/components/Indicators'
import ChartsEpidemic from '@/components/ChartsEpidemic'
// import ChooseDate from '../components/ChooseDate'
// import Update from '../components/Update'

import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'


import * as d3 from 'd3-fetch'
import moment from 'moment';
moment.locale('es');


import  {meanWeek, derivate} from '@/assets/mathFunctions'


export default {
  name:'ChartChile',
  components:{
    // 'bar-chart': BarChart,
    // 'choose-date': ChooseDate,
    // 'update': Update,
    'indicators': Indicators,
    'charts-epidemic': ChartsEpidemic,
    'vue-slider': VueSlider
      },
  metaInfo() {
    return {
      title: "Sigue Covid en Chile - Siga  la epidemia de covid-19 y el proceso de vacunación en chile y en regiones",
      meta: [
        { name: 'description',
        content:  `Sigue Covid facilita la visualización de datos sobre la epidemia de covid-19 en Chile
        y en las regiones del país. Encontrará información actualizada diariamente sobre el número de nuevos casos, pruebas de PCR,
        personas en  unidad de cuidados intensivos y fallecidos. También podrá consultar el progreso de la campaña de vacunación.`},
        {name: 'robots', content: 'index,follow'}
      ]
    }},
    data () {
      return{
        dateValue:'enero 2021',
        dataCovid:{
          labelsUci:[],
          labelsPcr:[],
          labelsCases:[],
          labelsDeaths:[],
          labelsPos:[],
          ChileUci:[],
          ChilePcr:[],
          ChileCases:[],
          ChileDeaths:[],
          ChileTotalDeaths:[],
          ChileMeanCases:[],
          ChilePos:[]
        },
        fromDate: "01-01-2021",
        fromMonth:'',
        // markSlideBar:true,
        listOfMonths:[]
    }
  },
  methods:{
    // variationCases(){
    //   return Math.round(-(1-this.dataCovid.ChileMeanCases.slice(-1)[0]/this.dataCovid.ChileMeanCases.slice(-8)[0])*1000)/10
    // },
        updateCurrentDate(){
          this.fromDate = moment(this.fromMonth, 'MMMM YYYY').format('01-MM-YYYY')
        }
      },
      async created(){
        const getDataCsv =  async (path, type, derivative,  initializeMonths = false) => {
          let data = await d3.csv(path)
            if (derivative==true){
              this.dataCovid['labels'+type] = Object.keys(data[0]).slice(3+1).map((d)=>  {return moment(d, "YYYY-MM-DD").format("DD-MM-YYYY")})
            }else{
              this.dataCovid['labels'+type] = Object.keys(data[0]).slice(3).map((d)=>  {return moment(d, "YYYY-MM-DD").format("DD-MM-YYYY")})
            }

            if(initializeMonths == true){
              let currentDate = moment('05-2020', 'MM-YYYY')
              while(currentDate < moment(this.dataCovid.labelsUci[this.dataCovid.labelsUci.length-1],'DD-MM-YYYY')){
                this.listOfMonths.push(moment(currentDate, 'MM-YYYY').format('MMMM YYYY'))
                currentDate = moment(currentDate,'MM-YYYY').add(1,'M')
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
            if (type =='Pcr'){
            return this.dataCovid['ChilePcr']
          }
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




          // download PCR and Cases data
          const dataCases = await d3.csv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto3/CasosTotalesCumulativo.csv')
          this.dataCovid['labelsCases'] =  Object.keys(dataCases[0]).slice(3+1).map((d)=>  {return moment(d, "YYYY-MM-DD").format("DD-MM-YYYY")})
          dayCases = derivate(Object.values(dataCases[16]).slice(3).map(i => Number(i)))
          this.$set(this.dataCovid, 'ChileCases', dayCases);
          this.$set(this.dataCovid, 'LabelsMeanCases' ,Object.keys(dataCases[0]).slice(3+1+7).map((d)=>  {return moment(d, "YYYY-MM-DD").format("DD-MM-YYYY")}));
          this.$set(this.dataCovid, 'ChileMeanCases' ,meanWeek(dayCases).map((d)=>{return Math.round(d)}));

          const Pcr = await getDataCsv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto7/PCR.csv', 'Pcr', false,false)

          // compute the positivity
          let Cases = this.dataCovid['ChileCases'];
          let Pos=[];
          for (let i=0;i<Pcr.length;i++){
            Pos.push(Cases[Cases.length-i-1]/Pcr[Pcr.length-i-1]*100)
          }
          Pos = meanWeek(Pos.reverse()).map(d =>{return Math.round(d*10)/10});
          this.dataCovid.ChilePos = Pos;


          // download deaths data
            const dataDeaths = await  d3.csv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto14/FallecidosCumulativo.csv')
            this.dataCovid['labelsDeaths'] =  Object.keys(dataDeaths[0]).slice(3+1).map((d)=>  {return moment(d, "YYYY-MM-DD").format("DD-MM-YYYY")})
            this.dataCovid.ChileTotalDeaths.push(Object.values(dataDeaths[16]).slice(-1).map(i => Number(i)))
            let dayCases = derivate(Object.values(dataDeaths[16]).slice(3).map(i => Number(i)))
            this.$set(this.dataCovid, 'ChileDeaths', dayCases);


          // download UCI data
          getDataCsv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto8/UCI.csv', 'Uci', false, true);


          // update fromMonth
          this.fromMonth = moment(this.fromDate, '01-MM-YYYY').format('MMMM YYYY')

      }
    }

    </script>
