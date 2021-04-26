<template>
  <div class="ChartVacuna">
    <div class="optionsGraph">
      <p> Última actualización : {{update}}</p>
      <!-- <choose-date :listOfMonths='listOfMonths' :fromDate='fromDate' v-on:newFromDate="changeFromDate"></choose-date> -->
    </div>
    <div id='block_graph' v-if="vacunaChile.labels.length > 0">

      <div class='graphVac'>
        <line-chart  :chartData="renderChartVacuna()" :options='options'> </line-chart>
      </div>
      <div class='graphVac'>
        <bar-chart  :chartData="renderChartVacunaPorDia()" :options='optionsPorDia'> </bar-chart>
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
.graphVac{
  width:50%;
  /* box-shadow: 1px 1px 2px 2px #e8e8e8; */
  box-shadow: 0px 3px 8px #e8e8e8;
  border-radius:45px;
  background-color: white;
  padding:10px 10px 10px 10px;
  margin-top:5px;
  margin-bottom:5px;

}

#block_graph{
  display:flex;
  flex-direction:row;
  justify-content: center;
  align-items: center;
}

@media all and (max-width: 960px) {

  #block_graph{
    flex-direction:column;
  }

  .graphVac{
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
import BarChart from './BarChart'
import LineChart from './LineChart'
import * as d3 from 'd3-fetch'
import moment from 'moment';

// import ChooseDate from './ChooseDate'

export default {
  name:'ChartVacuna',
  components:{
    'line-chart': LineChart,
    'bar-chart': BarChart
    // 'choose-date': ChooseDate
  },
  data () {
    return{
      vacunaChile:{
        labels:[],
        'primera dosis':[],
        'segunda dosis':[],
        'primera dosis por dia':[],
        'segunda dosis por dia':[]
      },
      fromDate: "2021-02-01",
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
    changeFromDate(event){
      this.fromDate = moment(event.target.value, 'MMMM-YYYY').format('YYYY-MM-01')
    },
    renderChartVacuna(){
      let indexDate = this.vacunaChile.labels.indexOf(this.fromDate)
      return {
        labels:this.vacunaChile.labels.filter((x) => { return x >= this.fromDate }),
        datasets: [
          {
            label: "primera dosis",
            borderColor: '#82CFFD',
            fill: false,
            data: this.vacunaChile["primera dosis"].slice(indexDate)
          },
          {
            label: "segunda dosis",
            borderColor: '#eba434',
            fill: false,
            data: this.vacunaChile["segunda dosis"].slice(indexDate)
          }
        ]
      }
    },
    renderChartVacunaPorDia(){
      let indexDate = this.vacunaChile.labels.indexOf(this.fromDate)
      return {
        labels:this.vacunaChile.labels.filter((x) => { return x >= this.fromDate }),
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
  computed:{
    update: function(){
      return moment(this.vacunaChile.labels[this.vacunaChile.labels.length-1], "YYYY-MM-DD").format("DD-MM-YYYY")
    }
  },
  async created(){
    d3.csv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto76/vacunacion.csv').then(data => {
      this.vacunaChile.labels = Object.keys(data[0]).slice(2);
      Object.values(data[0]).slice(2).map(i => Number(i)).forEach((d)=> {this.vacunaChile['primera dosis'].push(d/190000)})
      Object.values(data[1]).slice(2).map(i => Number(i)).forEach((d)=>{ this.vacunaChile['segunda dosis'].push(d/190000)})
      derivate(Object.values(data[0]).slice(2).map(i => Number(i))).forEach((d)=> {this.vacunaChile['primera dosis por dia'].push(d)})
      derivate(Object.values(data[1]).slice(2).map(i => Number(i))).forEach((d)=>{ this.vacunaChile['segunda dosis por dia'].push(d)})

      console.log(this.vacunaChile['primera dosis por dia'])
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
