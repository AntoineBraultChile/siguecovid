<template>
  <div class="ChartUciAge">
    <div class="optionsGraph">
      <p> Última actualización : {{update}}</p>
      <choose-date :listOfMonths='listOfMonths' :fromDate='fromDate' v-on:newFromDate="changeFromDate"></choose-date>
    </div>
    <div id='block_graph' v-if="uciChile.labels.length > 0">

      <div class='graphUci'>
        <line-chart  :chartData="renderChileUciChart()" :options='optionsLineUciChile'> </line-chart>
      </div>
    </div>

  </div>
</template>

<style scoped>

.optionsGraph{
  display:flex;
  flex-direction:row;
  justify-content: center;
}

.optionsGraph p{
  padding: 0px 20px 0px 20px;
}
.graphUci{
  width:50%;
  /* box-shadow: 1px 1px 2px 2px #e8e8e8; */
  box-shadow: 0px 3px 8px #e8e8e8;

  border-radius:45px;
  background-color: white;
  padding:10px;
}

#block_graph{

  display:flex;
  flex-direction:row;
  justify-content: center;
}

@media all and (max-width: 960px) {

 #block_graph{
   flex-direction:column;
 }

 .graphUci{
   width:100%;
 }
 .optionsGraph{
   display:flex;
   flex-direction:column;
   justify-content: center;
 }
}
</style>

<script>
import LineChart from './LineChart'
import * as d3 from 'd3-fetch'
import moment from 'moment';

import ChooseDate from './ChooseDate'

export default {
  name:'ChartUciAge',
  components:{
    'line-chart': LineChart,
    'choose-date': ChooseDate
  },
  data () {
    return{
      uciChile:{
        labels:[],
        '<=39':[],
        '40-49':[],
        '50-59':[],
        '60-69':[],
        '>=70':[]
      },
      fromDate: "2021-01-01",
      listOfMonths:[],
      optionsLineUciChile:{
        scales: {
          yAxes: [{
            ticks: {
               beginAtZero: true
            }
          }]
        },
        title:{
          display:true,
          text:'Unidad de cuidados intensivos por edad',
          fontSize:20
        },
        lineTension: 1,
        responsive:true,
        maintainAspectRatio:false
      }
    }
  },
  methods:{
    changeFromDate(event){
      this.fromDate = moment(event.target.value, 'MMMM-YYYY').format('YYYY-MM-01')
    },
    renderChileUciChart(){
      let indexDate = this.uciChile.labels.indexOf(this.fromDate)
      return {
        labels:this.uciChile.labels.filter((x) => { return x >= this.fromDate }),
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
    }
  },
  computed:{
    update: function(){
      return moment(this.uciChile.labels[this.uciChile.labels.length-1], "YYYY-MM-DD").format("DD-MM-YYYY")
    }
  },
  async created(){
    d3.csv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto9/HospitalizadosUCIEtario.csv').then(data => {
      this.uciChile.labels = Object.keys(data[0]).slice(1);
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
      while(currentDate < moment(this.uciChile.labels[this.uciChile.labels.length-1],'YYYY-MM-DD')){
        this.listOfMonths.push(currentDate.format('MMMM YYYY'))
        currentDate = moment(currentDate,'MM-YYYY').add(1,'M')
      }
    }
  }
}
</script>
