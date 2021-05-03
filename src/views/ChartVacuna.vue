<template>
  <div class="ChartVacuna">
    <div class="containerSection">
      <title-container titleName='Avances de la campaña de vacunación contra el Covid-19 en Chile' />

      <div id='block_graph' class='d-flex flex-row flex-wrap justify-content-between' v-if="vacunaChile.labels.length > 0">

        <indicators v-if="vacunaChile.labels.length > 0"
          :labels="vacunaChile.labels"
          :cases="vacunaChile['primera dosis']"
          :positivity="vacunaChile['segunda dosis']"
          :uci="vacunaChile['total primera dosis']"
          :deaths="vacunaChile['total segunda dosis']"
          :colors='colorsIndicator'
          type='vaccin'
          />

          <div class='wrapper'>
            <line-chart  :chartData="renderChartVacuna()" :options='options'> </line-chart>
          </div>
          <div class='wrapper'>
            <bar-chart  :chartData="renderChartVacunaPorDia()" :options='optionsPorDia'> </bar-chart>
          </div>
          <div class='wrapper'>
            <line-chart v-if="vacunaChile.labelsByAge.length > 0" :chartData="renderChileVaccineByAge('firstDosesByAgeGroup')" :options="optionsByAge('una dosis')"> </line-chart>
          </div>
          <div class='wrapper'>
            <line-chart   v-if="vacunaChile.labelsByAge.length > 0" :chartData="renderChileVaccineByAge('secondDosesByAgeGroup')" :options="optionsByAge('dos dosis')"> </line-chart>
          </div>
        </div>
      </div>
    </div>
  </template>

  <style src='../assets/chartChileAndRegion.css'>
  </style>

  <style scoped>

  .ChartVacuna{
    display:flex;
    align-items: center;
    justify-content: center;
    flex-direction:column;
  }


  /* .containerSection{
  max-width:1400px;
  padding:0px 10px 0px 10px;
  display:flex;
  align-items: center;
  justify-content: center;
  flex-direction:column;
  } */

  .wrapper{
    width:49.4%;
    margin:5px 0px 5px 0px;
    box-shadow: 0px 0px 2px 2px #e8e8e8;
    border-radius:7px;
    background-color: white;
    padding:0px 0px 10px 0px;

  }

  /* #block_graph{
  padding-left:0px;
  display:flex;
  justify-content: space-between;
  align-items: stretch;
  } */

  @media all and (max-width: 1100px) {
    /* .containerSection{
    padding-left: 10px;
    padding-right: 10px;

  }
  .containerSection{
  width:100%;
}

#block_graph{
flex-direction:column;
font-size:16px;
} */

.wrapper{
  width:100%;
  margin:5px 0px 5px 0px;
}

}
</style>

<script>
import  {derivate, sumArray} from '@/assets/mathFunctions'

import LineChart from '../components/LineChart'
import BarChart from '../components/BarChart'
// import Update from '../components/Update'
import TitleContainer from '@/components/TitleContainer'
import Indicators from '@/components/Indicators'
import * as d3 from 'd3-fetch'
import moment from 'moment';
// import ChooseDate from './ChooseDate'

export default {
  name:'ChartVacuna',
  components:{
    'line-chart': LineChart,
    'bar-chart': BarChart,
    'title-container': TitleContainer,
    'indicators':Indicators,
    // 'update':Update
    // 'choose-date': ChooseDate
  },
  metaInfo() {
    return {
      title: "Campaña de vacunación en Chile",
      meta: [
        { name: 'description', content: `Avances de la campaña de vacunación en Chile: proporción de la población chilena
        vacunada con una o dos dosis, numero de primera dosis y segunda sosis administrada cada dia y en total.`},
        {name: 'robots', content: 'index,follow'}
      ]
    }},
    data () {
      return{
        colorsIndicator:['blue', 'orange', 'blue', 'orange'],
        vacunaChile:{
          labels:[],
          'primera dosis':[],
          'segunda dosis':[],
          'primera dosis por dia':[],
          'segunda dosis por dia':[],
          'total primera dosis':'',
          'total segunda dosis':'',
          labelsByAge:[],
          populationByAge:{
            '40':7141915, // from 16 year old to 39
            '50':2618520,
            '60':2369901,
            '70':1804002,
            '300':1544008
          },
          firstDosesByAgeGroup:{
            '40':[],
            '50':[],
            '60':[],
            '70':[],
            '300' :[]
          },
          secondDosesByAgeGroup:{
            '40':[],
            '50':[],
            '60':[],
            '70':[],
            '300' :[]
          }
        },
        fromDate: "01-02-2021",
        listOfMonths:[],
        options:{
          scales: {
            yAxes: [{
              ticks: {
                callback: function(tick) {
                  return tick.toString() + '%';
                }
              }
            }]
          },
          title:{
            display:true,
            text:'Proporción de la población chilena vacunada',
            fontSize:20
          },
          lineTension: 1,
          responsive:true,
          maintainAspectRatio:false
        },

        optionsPorDia:{
          title:{
            display:true,
            text:'Número de personas vacunadas cada dia',
            fontSize:20
          },
          responsive:true,
          maintainAspectRatio:false
        },
    }
    },
    methods:{
      renderChartVacuna(){
        let indexDate = this.vacunaChile.labels.indexOf(this.fromDate)
        return {
          labels:this.vacunaChile.labels.filter((x) => { return moment(x,'DD-MM-YYYY') >= moment(this.fromDate,'DD-MM-YYYY') }),
          datasets: [
            {
              label: "primera dosis",
              // borderColor: '#93DB70',
              // backgroundColor: '#93DB70',
              borderColor: '#82CFFD',
              backgroundColor: '#82CFFD',
              fill: false,
              data: this.vacunaChile["primera dosis"].slice(indexDate)
            },
            {
              label: "segunda dosis",
              // borderColor: '#dd4b39',
              // backgroundColor:'#dd4b39',
              borderColor: '#eba434',
              backgroundColor:'#eba434',
              fill: false,
              data: this.vacunaChile["segunda dosis"].slice(indexDate)
            }
          ]
        }
      },
      renderChartVacunaPorDia(){
        let indexDate = this.vacunaChile.labels.indexOf(this.fromDate)
        return {
          labels:this.vacunaChile.labels.filter((x) => { return  moment(x,'DD-MM-YYYY') >= moment(this.fromDate,'DD-MM-YYYY')}),
          datasets: [
            {
              label: "con primera dosis",
              backgroundColor: '#82CFFD',
              data: this.vacunaChile["primera dosis por dia"].slice(indexDate)
            },
            {
              label: "con segunda dosis",
              backgroundColor: '#eba434',
              data: this.vacunaChile["segunda dosis por dia"].slice(indexDate)
            }
          ]
        }
      },
      renderChileVaccineByAge(dosesType){
        let indexDate = this.vacunaChile.labelsByAge.indexOf(this.fromDate)

        return {
          labels: this.vacunaChile.labelsByAge.filter((x) => { return  moment(x,'DD-MM-YYYY') >= moment(this.fromDate,'DD-MM-YYYY')}),
          datasets: [
            {
              label: "16-39",
              borderColor: '#82CFFD',
              backgroundColor:'#82CFFD',
              fill: false,
              data: this.vacunaChile[dosesType]["40"].slice(indexDate)
            },
            {
              label: '40-49',
              borderColor: '#eba434',
              backgroundColor:'#eba434',
              fill: false,
              data: this.vacunaChile[dosesType]['50'].slice(indexDate)
            },
            {
              label: '50-59',
              borderColor: '#93DB70',
              backgroundColor: '#93DB70',
              fill: false,
              data: this.vacunaChile[dosesType]['60'].slice(indexDate)
            },
            {
              label: '60-69',
              borderColor: '#232b2b',
              backgroundColor:  '#232b2b',
              fill: false,
              data: this.vacunaChile[dosesType]['70'].slice(indexDate)
            },
            {
              label:  ">=70",
              borderColor: '#f87979',
              backgroundColor: '#f87979',
              fill: false,
              data: this.vacunaChile[dosesType]["300"].slice(indexDate)
            }
          ]
        }
      },
      optionsByAge(dosisNumber){
        return{
        scales: {
          yAxes: [{
            ticks: {
               beginAtZero: true,
               callback: function(tick) {
                 return tick.toString() + '%';
               }
            }
          }]
        },
        title:{
          display:true,
          text:'Personas vacunadas con ' + dosisNumber + ' por edad',
          fontSize:20
        },
        lineTension: 1,
        responsive:true,
        maintainAspectRatio:false
      }
    }
    },

    async created(){

      // fetching datas vaccination first and second doses in Chile
      let  data = await d3.csv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto76/vacunacion.csv')
      this.vacunaChile.labels = Object.keys(data[0]).slice(2).map(d =>  {return moment(d, "YYYY-MM-DD").format("DD-MM-YYYY")});
      Object.values(data[0]).slice(2).map(i => Number(i)).forEach(d => {this.vacunaChile['primera dosis'].push(Math.round(d/19000)/10)})
      this.vacunaChile['total primera dosis'] = Object.values(data[0]).slice(1).slice(-2).map(d=>{return Math.round(d)})
      Object.values(data[1]).slice(2).map(i => Number(i)).forEach(d =>{ this.vacunaChile['segunda dosis'].push(Math.round(d/19000)/10)})
      this.vacunaChile['total segunda dosis'] = Object.values(data[1]).slice(1).slice(-2).map(d=>{return Math.round(d)})
      derivate(Object.values(data[0]).slice(2).map(i => Number(i))).forEach((d)=> {this.vacunaChile['primera dosis por dia'].push(d)})
      derivate(Object.values(data[1]).slice(2).map(i => Number(i))).forEach((d)=>{ this.vacunaChile['segunda dosis por dia'].push(d)})

      // feching data vaccination by age in chile
      const [firstDosesByAge, secondDosesByAge] = await Promise.all([
        d3.csv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto78/vacunados_edad_fecha_1eraDosis.csv'),
        d3.csv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto78/vacunados_edad_fecha_2daDosis.csv')])

      this.vacunaChile.labelsByAge  = Object.keys(firstDosesByAge[0]).slice(1).map(d =>  {return moment(d, "YYYY-MM-DD").format("DD-MM-YYYY")})
      let ageGroup =['16']
      Object.keys(this.vacunaChile.firstDosesByAgeGroup).forEach(d => ageGroup.push(d))

      let getVaccinByAge = async  (dosis, typeDosis)=> {
      dosis.map((data)=>{
        // console.log(data)
        for (let i=0; i < ageGroup.length-1 ;i++){
          if (Number(ageGroup[i]) <= Number(data.Edad) && Number(data.Edad) < Number(ageGroup[i+1])){
            // let cumulSum =[]
            // Object.values(data).slice(1).map(i => Number(i)).reduce(function(a,b,i) { return cumulSum[i] = a+b; },0);
            // console.log(this.vacunaChile["firstDosesByAgeGroup"])
            this.vacunaChile[typeDosis][ageGroup[i+1]] = sumArray(this.vacunaChile[typeDosis][ageGroup[i+1]],   Object.values(data).slice(1).map(i => Number(i)))
          }
        }  })
        for (let i=0; i < ageGroup.length-1 ;i++){
          let cumulSum =[]
          this.vacunaChile[typeDosis][ageGroup[i+1]].reduce(function(a,b,j) { return cumulSum[j] = a+b; },0);
          this.vacunaChile[typeDosis][ageGroup[i+1]]=cumulSum
          this.vacunaChile[typeDosis][ageGroup[i+1]] = cumulSum.map(d => {return Math.round(d/this.vacunaChile.populationByAge[ageGroup[i+1]]*1000)/10})
        }
      }

        getVaccinByAge(firstDosesByAge, "firstDosesByAgeGroup")
        getVaccinByAge(secondDosesByAge, "secondDosesByAgeGroup")

    }

  }
  </script>
