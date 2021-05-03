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
        'total segunda dosis':''
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
      }
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
    }
  },

  async created(){
    d3.csv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto76/vacunacion.csv').then(data => {
      this.vacunaChile.labels = Object.keys(data[0]).slice(2).map(d =>  {return moment(d, "YYYY-MM-DD").format("DD-MM-YYYY")});
      Object.values(data[0]).slice(2).map(i => Number(i)).forEach(d => {this.vacunaChile['primera dosis'].push(Math.round(d/19000)/10)})
      this.vacunaChile['total primera dosis'] = Object.values(data[0]).slice(1).slice(-2).map(d=>{return Math.round(d)})
      Object.values(data[1]).slice(2).map(i => Number(i)).forEach(d =>{ this.vacunaChile['segunda dosis'].push(Math.round(d/19000)/10)})
      this.vacunaChile['total segunda dosis'] = Object.values(data[1]).slice(1).slice(-2).map(d=>{return Math.round(d)})

      derivate(Object.values(data[0]).slice(2).map(i => Number(i))).forEach((d)=> {this.vacunaChile['primera dosis por dia'].push(d)})
      derivate(Object.values(data[1]).slice(2).map(i => Number(i))).forEach((d)=>{ this.vacunaChile['segunda dosis por dia'].push(d)})
    })
    // return the derivative of an array
    function derivate(cumulativeValues){
      let derivative = []
      for ( let i=0; i < cumulativeValues.length-1;i++){
        derivative.push(cumulativeValues[i+1]-cumulativeValues[i])
      }
      return derivative;
    }
  }
}
</script>
