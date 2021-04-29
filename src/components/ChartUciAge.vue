<template>
  <div class="ChartUciAge">
    <div class="containerSection">
      <div class="titleContainer">

    <h1 id='slogan'> Personas actualmente en unidad de cuidados intensivos por edad en Chile.</h1>
    <p> Última actualización : {{update}}</p>

    <div class="optionsGraph">
      <choose-date :listOfMonths='listOfMonths' :fromDate='fromDate' v-on:newFromDate="changeFromDate"></choose-date>
    </div>
  </div>
    <div id='block_graph' class='d-flex flex-row flex-wrap justify-content-between' v-if="uciChile.labels.length > 0">

      <div class='graphUci'>
        <line-chart  :chartData="renderChileUciChart()" :options='optionsLineUciChile'> </line-chart>
      </div>
    </div>
  </div>

  </div>
</template>

<style scoped>

.titleContainer{
  width:100%;
  box-shadow: 0px 0px 2px 2px #e8e8e8;
  border-radius: 7px;
  background-color: white;
  padding:15px 10px 0px 10px;
  margin-bottom:5px;
}
.ChartUciAge{
  display:flex;
  flex-direction:column;
  align-items: center;
  justify-content: center;

}
.containerSection{
  width:80%;
  display:flex;
  align-items: center;
  justify-content: center;
  flex-direction:column;
}

#slogan{
  /* text-align:justify; */
  font-size:25px;

  /* padding:0px 10px 0px 10px; */
}
.titleContainer p{
  font-size:20px;
}
.optionsGraph{
  display:flex;
  flex-direction:row;
  justify-content: center;
}

/* .optionsGraph p{
  padding: 0px 20px 0px 20px;
} */
.graphUci{
  margin-top:10px;
  width:100%;
  box-shadow: 0px 0px 2px 2px #e8e8e8;
  border-radius:7px;
  background-color: white;

}

#block_graph{
  width:100%;
  display:flex;
  flex-direction:row;
  justify-content: center;
}

@media all and (max-width: 1100px) {
  .containerSection{
    width:100%;
  }

  #slogan{
    font-size:20px;
  }
.titleContainer  p{
    font-size:15px;
  }
 #block_graph{
   flex-direction:column;
   padding:0px 0px 0px 0px;

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
  metaInfo() {
       return {
           title: "Numero de personas en unidad de cuidados intensivos por Covid-19 y por edad en Chile",
           meta: [
               { name: 'description', content: `Grafico del numero de personas en unidad de cuidados intensivos por Covid-19 y por edad en Chile`},
               { name: 'robots', content: 'index,follow'}
           ]
       }
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
      fromDate: "01-01-2021",
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
          text:'Personas en unidad de cuidados intensivos por Covid-19 por edad',
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
      this.fromDate = moment(event.target.value, 'MMMM-YYYY').format('01-MM-YYYY')
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
    }
  },
  computed:{
    update: function(){
      let now = new Date();
      now = moment(now).format("DD-MM-YYYY");
      let lastUpdate = moment(this.uciChile.labels[this.uciChile.labels.length-1], "DD-MM-YYYY").format("DD-MM-YYYY")
      if(now == lastUpdate){
        return 'hoy'
      }
      else if(moment(lastUpdate,'DD-MM-YYYY').add(1,'d').format("DD-MM-YYYY") == now ){
        return 'ayer'
      }
      else{
        return lastUpdate
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
  }
}
</script>
