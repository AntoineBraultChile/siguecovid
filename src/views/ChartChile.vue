<template>
  <div class="ChartChile">
    <div class="containerSection">
      <div class="titleContainer">
        <h1  id='slogan'>La pandemia de Covid-19 en Chile</h1>
        <!-- <div class="optionsGraph" v-if="dataCovidChile.labelsUci.length > 0"> -->
          <!-- <choose-date :listOfMonths='listOfMonths' :fromDate='fromDate' :fromMonth='fromMonth' v-on:newFromDate="changeFromDate"></choose-date> -->
          <!-- </div> -->
      </div>
      <div id='block_graph' class='d-flex flex-row flex-wrap justify-content-between' v-if="dataCovidChile.labelsUci.length > 0">

        <div class="optionDosis">
          <div class='dosis color1'> <span>{{this.dataCovidChile.ChileMeanCases.slice(-1)[0]}} casos <span  style="font-weight:normal; font-size:16px;">media móvil de 7 días</span>   </span>
            <update :labels='dataCovidChile.labelsCases'> </update>
       </div>
          <div class='dosis color2'> <span>Variación semanal de los casos {{(variationCases() > 0 ? '+' : ' ')+variationCases().toString()}}%</span>
            <update :labels='dataCovidChile.labelsCases'> </update>
           </div>
        </div>
        <div class="optionDosis">
          <div class='dosis color3'> <span>Personas en unidad de cuidados intensivos {{this.dataCovidChile.ChileUci.slice(-1)[0]}} </span>
            <update :labels='dataCovidChile.labelsCases'> </update>
          </div>
          <div class='dosis color4'> Fallecidos {{this.dataCovidChile.ChileDeaths.slice(-1)[0]}}
            <update :labels='dataCovidChile.labelsCases'> </update>

          </div>
        </div>
        <div class="slideBarContainer">
          Gráficos a partir de {{fromMonth}}
          <div class="slideBar" v-if="dataCovidChile.labelsUci.length > 0">
            <vue-slider :data="listOfMonths" :adsorb="true" v-model="fromMonth"  :marks='true' :hideLabel='true' :tooltip="'active'"  :use-keyboard="false" v-on:change="updateCurrentDate()"></vue-slider>
          </div>
        </div>


        <div class='graph'>

          <!-- <bar-chart  :chartData="getRegionValues('Cases')" :options="getRegionOptions('Cases')"> </bar-chart> -->
          <bar-chart  :chartData="getChartWithMean('Cases')" :options="getOptionsChartWithMean('Cases')"> </bar-chart>
        </div>
        <div class='graph'>
          <!-- <bar-chart  :chartData="getRegionValues('Pcr')" :options="getRegionOptions('Pcr')"> </bar-chart> -->
          <bar-chart  :chartData="getChartPosPcr()" :options="getOptionsChartPosPcr()"> </bar-chart>

        </div>
        <div class='graph'>
          <bar-chart  :chartData="getRegionValues('Uci')" :options="getRegionOptions('Uci')"> </bar-chart>
        </div>
        <div class='graph'>
          <bar-chart  :chartData="getRegionValues('Deaths')" :options="getRegionOptions('Deaths')"> </bar-chart>
        </div>
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
import BarChart from '../components/BarChart'
// import ChooseDate from '../components/ChooseDate'
import Update from '../components/Update'

import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'


import * as d3 from 'd3-fetch'
import moment from 'moment';
moment.locale('es');


import  {meanWeek, derivate} from '@/assets/mathFunctions'

export default {
  name:'ChartRegions',
  components:{
    'bar-chart': BarChart,
    // 'choose-date': ChooseDate,
    'update': Update,
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
        dataCovidChile:{
          labelsUci:[],
          labelsPcr:[],
          labelsCases:[],
          labelsDeaths:[],
          labelsPos:[],
          ChileUci:[],
          ChilePcr:[],
          ChileCases:[],
          ChileDeaths:[],
          ChileMeanCases:[],
          ChilePos:[],
        },
        fromDate: "01-01-2021",
        fromMonth:'',
        // markSlideBar:true,
        listOfMonths:[],
        backgroundColor :{'Uci':'#dd4b39', 'Pcr':'#82CFFD', 'Cases':'#93DB70', 'Deaths': '#232b2b'},
        title:{'Uci':'Personas en unidad de cuidados intensivos por Covid-19',
        'Pcr':'PCR',
        'Cases':'Casos',
        'Deaths': 'Fallecidos por Covid-19'
      }
    }
  },
  methods:{
    variationCases(){
      return Math.round(-(1-this.dataCovidChile.ChileMeanCases.slice(-1)[0]/this.dataCovidChile.ChileMeanCases.slice(-8)[0])*1000)/10
    },
    getRegionValues(type){
      let fromDate = this.fromDate
      // console.log(Math.max(this.dataCovid['labels'+type].reduce(function (a, b) { return a < b ? a : b; })))
      let indexDate = this.dataCovidChile['labels'+type].indexOf(fromDate)

      return {
        labels:this.dataCovidChile['labels'+type].filter((x) => { return moment(x,'DD-MM-YYYY') >= moment(fromDate,'DD-MM-YYYY') }),
        datasets:[
          {type:'bar',label:this.title[type]+ ' en Chile', backgroundColor:this.backgroundColor[type], fill:false, data:this.dataCovidChile['Chile'+type].slice(indexDate)}]
        }
      },
      getRegionOptions(type){
        return{
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          },
          title:{
            display:true,
            text:this.title[type]+ ' en Chile',
            fontSize:20
          },
          legend: {
            display:false,
          },
          responsive:true,
          maintainAspectRatio:false
        }},
        getChartWithMean(type){

          let fromDate = this.fromDate
          let indexDate = this.dataCovidChile['labels'+type].indexOf(fromDate)
          // let indexDateMean = this.dataCovidChile['labelsMean'+type].indexOf(fromDate)
          return{
            labels:this.dataCovidChile['labels'+type].filter((x) => { return moment(x,'DD-MM-YYYY') >= moment(fromDate,'DD-MM-YYYY') }),
            datasets:[
              {type:'line', label:'Media móvil de 7  días',borderColor:'#dd4b39', backgroundColor:'#dd4b39', fill: false, data:this.dataCovidChile['ChileMean'+type].slice(indexDate-7)},
              {type:'bar',label:this.title[type]+' diarios', backgroundColor:this.backgroundColor[type],fill: false, data:this.dataCovidChile['Chile'+type].slice(indexDate)}
            ]
          }
        },
        getChartPosPcr(){
          // compute the positivity
          let Pcr= this.dataCovidChile['ChilePcr']
          let Cases = this.dataCovidChile['ChileCases']
          let Pos=[]
          for (let i=0;i<Pcr.length;i++){
            Pos.push(Cases[Cases.length-i-1]/Pcr[Pcr.length-i-1]*100)
          }
          Pos = meanWeek(Pos.reverse()).map(d =>{return Math.round(d*10)/10});
          let fromDate = this.fromDate
          let indexDate = this.dataCovidChile['labelsPcr'].indexOf(fromDate)
          // let indexDatePos = this.dataCovidChile['labelsPos'].indexOf(fromDate)
          return{
            labels:this.dataCovidChile['labelsPcr'].filter((x) => { return moment(x,'DD-MM-YYYY') >= moment(fromDate,'DD-MM-YYYY')}),
            datasets:[
              {type:'line', label:'Positividad (media móvil de 7 días)', yAxisID: 'Pos',borderColor:'#dd4b39', backgroundColor:'#dd4b39', fill: false, data:Pos.slice(indexDate-7)},
              {type:'bar',label:'Numero de test PCR ', yAxisID: 'Pcr', backgroundColor:this.backgroundColor['Pcr'],fill: false, data:this.dataCovidChile['ChilePcr'].slice(indexDate)}
            ]
          }
        },
        getOptionsChartWithMean(type){
          return{
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            },
            title:{
              display:true,
              text:this.title[type]+ ' en Chile',
              fontSize:20
            },
            responsive:true,
            maintainAspectRatio:false
          }
        },
        getOptionsChartPosPcr(){
          return{
            scales: {
              yAxes: [{
                id: 'Pos',
                type: 'linear',
                position: 'left',
                ticks: {
                  beginAtZero: true,
                  callback: function(tick) {
                    return tick.toString() + '%';
                  }
                }
              }, {
                id: 'Pcr',
                type: 'linear',
                position: 'right',
              }]
            },
            title:{
              display:true,
              text:'Positividad y PCR en Chile',
              fontSize:20
            },
            responsive:true,
            maintainAspectRatio:false
          }
        },
        // changeFromDate(event){
        //   this.fromDate = moment(event.target.value, 'MMMM YYYY').format('01-MM-YYYY')
        //   console.log(event.target.value)
        // },
        updateCurrentDate(){
          this.fromDate = moment(this.fromMonth, 'MMMM YYYY').format('01-MM-YYYY')
        }
      },
      async created(){
        d3.csv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto3/CasosTotalesCumulativo.csv').then(data=>{
          this.dataCovidChile['labelsCases'] =  Object.keys(data[0]).slice(3+1).map((d)=>  {return moment(d, "YYYY-MM-DD").format("DD-MM-YYYY")})
          let dayCases = derivate(Object.values(data[16]).slice(3).map(i => Number(i)))
          this.$set(this.dataCovidChile, 'ChileCases', dayCases);
          this.$set(this.dataCovidChile, 'LabelsMeanCases' ,Object.keys(data[0]).slice(3+1+7).map((d)=>  {return moment(d, "YYYY-MM-DD").format("DD-MM-YYYY")}));
          this.$set(this.dataCovidChile, 'ChileMeanCases' ,meanWeek(dayCases).map((d)=>{return Math.round(d)}));

        })
        d3.csv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto14/FallecidosCumulativo.csv').then(data=>{
          this.dataCovidChile['labelsDeaths'] =  Object.keys(data[0]).slice(3+1).map((d)=>  {return moment(d, "YYYY-MM-DD").format("DD-MM-YYYY")})
          let dayCases = derivate(Object.values(data[16]).slice(3).map(i => Number(i)))
          this.$set(this.dataCovidChile, 'ChileDeaths', dayCases);


        })

        const getDataCsv = (path, type, derivative,  initializeMonths = false) => {
          d3.csv(path).then(data => {
            if (derivative==true){
              this.dataCovidChile['labels'+type] = Object.keys(data[0]).slice(3+1).map((d)=>  {return moment(d, "YYYY-MM-DD").format("DD-MM-YYYY")})
            }else{
              this.dataCovidChile['labels'+type] = Object.keys(data[0]).slice(3).map((d)=>  {return moment(d, "YYYY-MM-DD").format("DD-MM-YYYY")})
            }

            if(initializeMonths == true){
              let currentDate = moment('05-2020', 'MM-YYYY')
              while(currentDate < moment(this.dataCovidChile.labelsUci[this.dataCovidChile.labelsUci.length-1],'DD-MM-YYYY')){
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
            this.$set(this.dataCovidChile, 'Chile'+type, chileValues);
          })

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

        getDataCsv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto7/PCR.csv', 'Pcr', false,false);
        getDataCsv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto8/UCI.csv', 'Uci', false, true);
        this.fromMonth = moment(this.fromDate, '01-MM-YYYY').format('MMMM YYYY')
      }
    }

    </script>
