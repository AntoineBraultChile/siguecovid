<template>
  <div class="ChartUciAge">
    <div class="containerSection">

  <title-container titleName='Personas actualmente en unidad de cuidados intensivos por edad en Chile.'/>

    <div id='block_graph' class='d-flex flex-row flex-wrap justify-content-between' v-if="uciChile.labels.length > 0">
      <slide-bar  v-if="listOfMonths.length > 0" :listOfMonths='listOfMonths' :fromMonth='fromMonth' v-on:newdate='updateCurrentDate'/>
      <div class='graphUci'>
        <update :labels="uciChile.labels"> </update>
        <line-chart  :chartData="renderChileUciChart()" :options='optionsLineUciChile'> </line-chart>
      </div>
    </div>
  </div>

  </div>
</template>

<style scoped>

.ChartUciAge{
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

import LineChart from '../components/LineChart'
// import ChooseDate from '../components/ChooseDate'
import Update from '../components/Update'
import TitleContainer from '../components/TitleContainer'
import SlideBar from '../components/SlideBar'
// import VueSlider from 'vue-slider-component'
// import 'vue-slider-component/theme/default.css'


import * as d3 from 'd3-fetch'
import moment from 'moment';


export default {
  name:'ChartUciAge',
  components:{
    'line-chart': LineChart,
    'slide-bar': SlideBar,
    // 'vue-slider': VueSlider,
    'title-container': TitleContainer,
    // 'choose-date': ChooseDate,
    'update': Update
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

  }
}
</script>
