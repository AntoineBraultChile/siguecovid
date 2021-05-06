<template>
  <div class="ChartAge">
    <div class="containerSection">

  <title-container titleName='La pandemia de Covid-19 por edad en Chile.'/>

    <!-- <div id='block_graph' class='d-flex flex-row flex-wrap justify-content-between' v-if="uciChile.labels.length > 0"> -->
    <div id='block_graph' v-if="casesChile.labels.length > 0">
      <slide-bar  v-if="listOfMonths.length > 0" :listOfMonths='listOfMonths' :fromMonth='fromMonth' v-on:newdate='updateCurrentDate'/>
        <div class='graphUci'>
          <title-graphic>Incidencia por edad </title-graphic>
          <span style='font-size:16px'>Incidencia: número semanal de casos por cada 100.000 habitantes</span> <br>
          <update :labels="casesChile.labels"> </update>
          <line-chart  :chartData="renderChileCases()" :options='optionsLineUciChile'> </line-chart>

        </div>
      <div class='graphUci'>
        <title-graphic>Personas en unidad de cuidados intensivos por Covid-19 por edad</title-graphic>
        <update :labels="uciChile.labels"> </update>
        <line-chart  :chartData="renderChileUciChart()" :options='optionsLineUciChile'> </line-chart>
      </div>
      <div class='graphUci'>
        <title-graphic>Total fallecidos por Covid-19 por edad </title-graphic>
        <update :labels="uciChile.labels"> </update>
        <bar-chart  :chartData="renderChileDeaths()" :options='optionsChileDeathsByAge'> </bar-chart>
      </div>
    </div>
    <spinner size='massive' v-else ></spinner>

  </div>
  <footer-indicators><p>
    Como se calculan los indicatores :
    <ul>
      <li> El número de muertes corresponde únicamente al número de muertes confirmadas por la prueba PCR. El <a href="https://deis.minsal.cl/">Departamento de Estadiscticas e Informacion de Salud</a>
      da el número de fallecidos por Covid-19 sospechosos. </li>
    </ul>
  </p>
  </footer-indicators>

  </div>
</template>

<style scoped>

.ChartAge{
  display:flex;
  flex-direction:column;
  align-items: center;
  justify-content: center;

}
.containerSection{
  width:100%;
  max-width:1400px;
  padding:0px 10px 0px 10px;
  display:flex;
  align-items: center;
  justify-content: center;
  flex-direction:column;
}


.graphUci{
  margin-top:5px;
  margin-bottom:5px;

  width:49.4%;
  box-shadow: 0px 0px 2px 2px #e8e8e8;
  border-radius:7px;
  background-color: white;

}

 #block_graph{
  width:100%;
  display:flex;
  flex-direction:row;
  justify-content: center;
  flex-wrap: wrap;
  justify-content: space-between;
}

@media all and (max-width: 1100px) {
  .containerSection{
    width:100%;
  }



 #block_graph{
   flex-direction:column;
   padding:0px 0px 0px 0px;
   font-size:16px;
 }

 .graphUci{
   width:100%;
   margin-top:5px;
 }
 .optionsGraph{
   display:flex;
   flex-direction:column;
   justify-content: center;
 }
}
</style>

<script>
import  {derivate, sumArray} from '@/assets/mathFunctions'

import LineChart from '../components/LineChart'
import BarChart from '../components/BarChart'
// import ChooseDate from '../components/ChooseDate'
import Update from '../components/Update'
import TitleContainer from '../components/TitleContainer'
import SlideBar from '../components/SlideBar'
import TitleGraphic from '../components/TitleGraphic'
import FooterIndicators from '../components/FooterIndicators'
// import VueSlider from 'vue-slider-component'
// import 'vue-slider-component/theme/default.css'


import * as d3 from 'd3-fetch'
// import moment from 'moment';

const moment = require('moment');
require('moment/locale/es');
moment.locale('es');

export default {
  name:'ChartAge',
  components:{
    'line-chart': LineChart,
    'bar-chart':BarChart,
    'slide-bar': SlideBar,
    'footer-indicators': FooterIndicators,
    // 'vue-slider': VueSlider,
    'title-container': TitleContainer,
    'title-graphic':TitleGraphic,
    // 'choose-date': ChooseDate,
    'update': Update
  },
  metaInfo() {
       return {
           title: "La pandemia de Covid-19 por edad en Chile.",
           meta: [
               { name: 'description', content: `Graficos de la incidencia,  del numero de personas en unidad de cuidados intensivos y del numero total de fallecidos por edad en Chile`},
               { name: 'robots', content: 'index,follow'}
           ]
       }
     },
  data () {
    return{
      // colors:['#82CFFD','#eba434','#93DB70','#232b2b', '#f87979', 'rgb(153, 102, 255)', 'rgb(255, 205, 86)'],
      // backgroundColor: ["rgb(35, 43, 100)","rgb(35, 43, 43)","rgb(35, 43, 43)","rgb(35, 43, 43)", "rgb(35, 43, 43)", "rgb(35, 43, 43)", "rgb(35, 43, 43)"],
      colors: "rgb(35, 43, 100)",
      backgroundColors: "rgb(35, 43, 43,0.4)",
      deathsChile:{
        // labels:[],
        ageGroup:[],
        values:[]
      },
      casesChile:{
        colors:['#D2E6EE','#82CFFD','#93DB70', '#f87979','#eba434',  '#24819C','#845EC2','#232b2b'],
        ageGroup:[],
        agePopulation:[2472769, 2525331, 3092328, 3031451, 2618520, 2369901, 1804002, 1544008],
        labels:[],
        values:[]
      },
      uciChile:{
        labels:[],
        '<=39':[],
        '40-49':[],
        '50-59':[],
        '60-69':[],
        '>=70':[]
      },
      fromDate: "01-02-2021",
      listOfMonths:[],
      dicMonth:[],

      optionsLineUciChile:{
        scales: {
          yAxes: [{
            ticks: {
               beginAtZero: true
            }
          }]
        },
        lineTension: 1,
        responsive:true,
        maintainAspectRatio:false
      },

      optionsChileDeathsByAge:{
        scales: {
          yAxes: [{
            ticks: {
               beginAtZero: true
            }
          }]
        },
        legend: {
          display:false,
        },
        responsive:true,
        maintainAspectRatio:false
      }
    }
  },
  methods:{
    // changeFromDate(event){
    //   this.fromDate = moment(event.target.value, 'MMMM-YYYY').format('01-MM-YYYY')
    // },
    updateCurrentDate(payload){
      this.fromMonth = payload
      this.fromDate = moment(payload, 'MMMM YYYY').format('01-MM-YYYY')
    },
    renderChileUciChart(){
      let indexDate = this.uciChile.labels.indexOf(this.fromDate)
      return {
        labels:this.uciChile.labels.filter((x) => { return moment(x,'DD-MM-YYYY') >= moment(this.fromDate,'DD-MM-YYYY') }),
        datasets: [
          {
            label: "<=39",
            borderColor: '#82CFFD',
            backgroundColor:'#82CFFD',
            fill: false,
            data: this.uciChile["<=39"].slice(indexDate)
          },
          {
            label: '40-49',
            borderColor: '#eba434',
            backgroundColor:'#eba434',
            fill: false,
            data: this.uciChile['40-49'].slice(indexDate)
          },
          {
            label: '50-59',
            borderColor: '#93DB70',
            backgroundColor: '#93DB70',
            fill: false,
            data: this.uciChile['50-59'].slice(indexDate)
          },
          {
            label: '60-69',
            borderColor: '#232b2b',
            backgroundColor:  '#232b2b',
            fill: false,
            data: this.uciChile['60-69'].slice(indexDate)
          },
          {
            label:  ">=70",
            borderColor: '#f87979',
            backgroundColor: '#f87979',
            fill: false,
            data: this.uciChile[">=70"].slice(indexDate)
          }
        ]
      }
    },
    renderChileDeaths(){
      return {
        labels: this.deathsChile.ageGroup,
        datasets: [{
          type:'bar',
          label:'',
          borderColor: this.colors,
          backgroundColor: this.backgroundColors,
          data:this.deathsChile.values
        }],
        borderWidth:1
      }
    },
    renderChileCases(){
      let indexDate = this.casesChile.labels.indexOf(this.dicMonth[this.fromDate])
      let mydatasets=[]
      this.casesChile.values.forEach((d,indx)=>{
        mydatasets.push({
          label:this.casesChile.ageGroup[indx],
          borderColor:this.casesChile.colors[indx],
          backgroundColor:this.casesChile.colors[indx],
          fill:false,
          data:d.slice(indexDate-1)
           // data:d
      })})
      return{
        labels:this.casesChile.labels.filter((x) => { return moment(x,'DD-MM-YYYY') >= moment(this.dicMonth[this.fromDate],'DD-MM-YYYY') }),
        // labels:this.casesChile.labels,

        datasets:mydatasets
      }
    }
  },

  async created(){
    d3.csv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto9/HospitalizadosUCIEtario.csv').then(data => {
      this.uciChile.labels = Object.keys(data[0]).slice(1).map(d=>  {return moment(d, "YYYY-MM-DD").format("DD-MM-YYYY")});
      for (let index in data){
        if(index != "columns"){
          let age = Object.values(data[index])[0]
          let valuesUci = Object.values(data[index]).slice(1).map(i => Number(i))
          this.$set(this.uciChile, age, valuesUci);
        }
      }
      //generate list of months
      generateListOfMonths()
    })
    // function to generate list of months
    let generateListOfMonths  =  () => {
      let currentDate = moment('05-2020', 'MM-YYYY')
      while(currentDate < moment(this.uciChile.labels[this.uciChile.labels.length-1],'DD-MM-YYYY')){
        this.listOfMonths.push(currentDate.format('MMMM YYYY'))
        currentDate = moment(currentDate,'MM-YYYY').add(1,'M')
      }
    }
    this.fromMonth = moment(this.fromDate, '01-MM-YYYY').format('MMMM YYYY')

    // fetch deaths y age in chile
    let dataDeaths = await d3.csv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto10/FallecidosEtario.csv')
    // this.deathsChile.labels = Object.keys(dataDeaths[0]).slice(1).map(d=>  {return moment(d, "YYYY-MM-DD").format("DD-MM-YYYY")});
    for (let deaths of dataDeaths){
      this.deathsChile.ageGroup.push(deaths['Grupo de edad'])
      this.deathsChile.values.push(Number(Object.values(deaths).slice(-1)[0]))
    }

    // fetch cases by age and gender, we want to convert it to cases by age groups
    let dataCases = await d3.csv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto16/CasosGeneroEtario.csv')
    this.casesChile.labels = Object.keys(dataCases[0]).slice(2).map(d=>  {return moment(d, "YYYY-MM-DD").format("DD-MM-YYYY")})

    // initialize value cases by age and group age and sum Male and Female
    for (let cases of dataCases){
      let age = cases['Grupo de edad']
      if (this.casesChile.ageGroup.includes(age)){
        let indexAge = this.casesChile.ageGroup.indexOf(age)
        this.casesChile.values[indexAge] = sumArray(this.casesChile.values[indexAge], Object.values(cases).slice(2).map(i => Number(i)))
      }
      else{
        this.casesChile.ageGroup.push(cases['Grupo de edad'])
        this.casesChile.values.push(Object.values(cases).slice(2).map(i => Number(i)))
      }
    }
    // group time serie by age two by two
    let casesByTenYears = []
    for(let i=0; i <this.casesChile.values.length-1; i+=2){
        casesByTenYears.push(sumArray(this.casesChile.values[i],this.casesChile.values[i+1]))
    }
    casesByTenYears.slice(-1)[0] = sumArray(casesByTenYears.slice(-1)[0], this.casesChile.values.slice(-1)[0])
    this.casesChile.values = casesByTenYears;

    // create age group 10 20 30 40 50 60 70 80 200(max age)
    this.casesChile.ageGroup = [...Array(7).keys()].map(i => String((i+1)*10))
     this.casesChile.ageGroup.push(">=70")

    // generate of list of date which start week from '04-05-2020' to today
    let dateWeekStart = ['20-04-2020'];
    let addDate =dateWeekStart[0]
    while(moment(addDate, 'DD-MM-YYYY') <= moment(this.casesChile.labels.slice(-1), 'DD-MM-YYYY')) {
      // console.log(moment(this.casesChile.labels.slice(-1), 'YYYY-MM-DD'))
      addDate = moment(addDate, 'DD-MM-YYYY').add(7,'d').format('DD-MM-YYYY')
      dateWeekStart.push(addDate)
    }

    let weekCasesValues =[]
    this.casesChile.values.forEach((casesAge,indxCasesAge) =>{
      let weekCasesValuesAge=[]
      casesAge.forEach((d,indx) =>  {
        if(dateWeekStart.includes(this.casesChile.labels[indx])){
          weekCasesValuesAge.push(this.casesChile.values[indxCasesAge][indx])
        }
      })
      weekCasesValues.push(derivate(weekCasesValuesAge).map(d => d/this.casesChile.agePopulation[indxCasesAge]*100000))
    })
    this.casesChile.values = weekCasesValues

    // set new labels by week
    let labelsByWeek =[]
    this.casesChile.labels.forEach(d=> {if(dateWeekStart.includes(d)) {labelsByWeek.push(d)}})
    this.casesChile.labels = labelsByWeek

    // create a dictionary between first day of each month in listOfMonths and first day of a month in casesChile.labels
    let dic ={}
    for (let month of this.listOfMonths){
      for (let date of this.casesChile.labels){
        if(moment(date, 'DD-MM-YYYY').format('MM-YYYY') == moment(month,'MMMM YYYY').format('MM-YYYY')){
          if (!Object.keys(dic).includes(moment(month,'MMMM YYYY').format('01-MM-YYYY'))) {
            dic[moment(month, 'MMMM YYYY').format('01-MM-YYYY')] = date
          }
        }
      }
    }
    this.dicMonth = dic

    this.casesChile.ageGroup = ['0-9','10-19','20-29','30-39','40-49','50-59','60-69','>=70']
  }
}
</script>
