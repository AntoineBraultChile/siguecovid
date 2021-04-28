<template>
  <div class="ActivityGraph">
    <div class="optionsGraph">
      <p> Última actualización : {{update}}</p>
      <p id='slogan'>        Visualiza fácilmente en tiempo real los datos de Covid-19 en Chile y en regiones.
      </p>
      <choose-date :listOfMonths='listOfMonths' :fromDate='fromDate' v-on:newFromDate="changeFromDate"></choose-date>
    </div>
    <div id='block_graph' class='d-flex flex-row flex-wrap justify-content-around' v-if="dataCovidChile.labelsUci.length > 0">
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
</template>

<style>
select{
  margin-left:10px;
}
#slogan{
  font-weight: bold;
}
.optionsGraph{
  display:flex;
  flex-direction:row;
  justify-content: center;
}

.optionsGraph p{
  padding: 0px 20px 0px 20px;
}
.graph{
  width:45%;
  /* border: solid 2px; */
  margin-bottom:10px;
  /* border-color: #e8e8e8; */
  /* box-shadow: 1px 1px 2px 2px #e8e8e8; */
  /* box-shadow: 0px 3px 8px #e8e8e8; */
  box-shadow: 0px 0px 5px 5px #e8e8e8;

  border-radius: 25px;
  background-color: white;
  padding:10px 10px 10px 10px;

}

#block_graph{
  width:100%;
}

label{
  margin-right:10px;
}



@media all and (max-width: 1100px) {

  .graph{
    width:100%;
  }
  .optionsGraph{
    display:flex;
    flex-direction:column;
    justify-content: center;
    font-size:15px;

  }
}
</style>

<script>
import BarChart from './BarChart'
import * as d3 from 'd3-fetch'
import moment from 'moment';
moment.locale('es');

import ChooseDate from './ChooseDate'

export default {
  name:'ChartRegions',
  components:{
    'bar-chart': BarChart,
    'choose-date': ChooseDate
  },
  data () {
    return{
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
        ChilePos:[]
      },
      fromDate: "2021-01-01",
      listOfMonths:[],
      backgroundColor :{'Uci':'#dd4b39', 'Pcr':'#82CFFD', 'Cases':'#93DB70', 'Deaths': '#232b2b'},
      title:{'Uci':'Personas en unidad de cuidados intensivos por Covid-19',
      'Pcr':'PCR',
      'Cases':'Casos',
      'Deaths': 'Fallecidos por COVID-19'
    }
  }
},
methods:{
  getRegionValues(type){
    let fromDate = this.fromDate
    // console.log(Math.max(this.dataCovid['labels'+type].reduce(function (a, b) { return a < b ? a : b; })))
    let indexDate = this.dataCovidChile['labels'+type].indexOf(fromDate)
    return {
      labels:this.dataCovidChile['labels'+type].filter((x) => { return x >= fromDate }),
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
          labels:this.dataCovidChile['labels'+type].filter((x) => { return x >= fromDate }),
          datasets:[
            {type:'line', label:'Media de 7 dias',borderColor:'#dd4b39', backgroundColor:'#dd4b39', fill: false, data:this.dataCovidChile['ChileMean'+type].slice(indexDate-7)},
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
          labels:this.dataCovidChile['labelsPcr'].filter((x) => { return x >= fromDate }),
          datasets:[
            {type:'line', label:'Positividad (media de 7 dias)', yAxisID: 'Pos',borderColor:'#dd4b39', backgroundColor:'#dd4b39', fill: false, data:Pos.slice(indexDate-7)},
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
              // ticks: {
              //   max: 1,
              //   min: 0
              // }
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
      changeFromDate(event){
        this.fromDate = moment(event.target.value, 'MMMM-YYYY').format('YYYY-MM-01')
      }
    },
      computed:{
        update: function(){
          let now = new Date();
          now = moment(now).format("DD-MM-YYYY");
          let lastUpdate = moment(this.dataCovidChile.labelsCases[this.dataCovidChile.labelsCases.length-1], "YYYY-MM-DD").format("DD-MM-YYYY")
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
        d3.csv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto3/CasosTotalesCumulativo.csv').then(data=>{
          this.dataCovidChile['labelsCases'] =  Object.keys(data[0]).slice(3+1).map((d)=>  {return moment(d, "YYYY-MM-DD").format("YYYY-MM-DD")})
          let dayCases = derivate(Object.values(data[16]).slice(3).map(i => Number(i)))
          this.$set(this.dataCovidChile, 'ChileCases', dayCases);

          this.$set(this.dataCovidChile, 'LabelsMeanCases' ,Object.keys(data[0]).slice(3+1+7).map((d)=>  {return moment(d, "YYYY-MM-DD").format("YYYY-MM-DD")}));
          this.$set(this.dataCovidChile, 'ChileMeanCases' ,meanWeek(dayCases).map((d)=>{return Math.round(d)}));

        })
        d3.csv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto14/FallecidosCumulativo.csv').then(data=>{
          this.dataCovidChile['labelsDeaths'] =  Object.keys(data[0]).slice(3+1).map((d)=>  {return moment(d, "YYYY-MM-DD").format("YYYY-MM-DD")})
          let dayCases = derivate(Object.values(data[16]).slice(3).map(i => Number(i)))
          this.$set(this.dataCovidChile, 'ChileDeaths', dayCases);


        })

        const getDataCsv = (path, type, derivative,  initializeMonths = false) => {
          d3.csv(path).then(data => {
            if (derivative==true){
              this.dataCovidChile['labels'+type] = Object.keys(data[0]).slice(3+1).map((d)=>  {return moment(d, "YYYY-MM-DD").format("YYYY-MM-DD")})
            }else{
              this.dataCovidChile['labels'+type] = Object.keys(data[0]).slice(3).map((d)=>  {return moment(d, "YYYY-MM-DD").format("YYYY-MM-DD")})
            }

            if(initializeMonths == true){
              let currentDate = moment('05-2020', 'MM-YYYY')
              while(currentDate < moment(this.dataCovidChile.labelsUci[this.dataCovidChile.labelsUci.length-1],'YYYY-MM-DD')){
                this.listOfMonths.push(currentDate.format('MMMM YYYY'))
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

        // d3.csv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto55/Positividad_nacional.csv').then(data =>{
        //     data.slice(6).forEach((d)=> {
        //       this.dataCovidChile['ChilePos'].push(Math.round(d['positividad']*1000)/10);
        //       this.dataCovidChile['labelsPos'].push(d['fecha']);
        //     })
        // })



        // // compute the rolling week average
        // function meanWeek(tabValues){
        //   let weekAverage=[];
        //   for (let i=0;i<tabValues.length-7; i++){
        //     weekAverage.push((tabValues[i]+tabValues[i+1]+tabValues[i+2]+tabValues[i+3]+tabValues[i+4]+tabValues[i+5]+tabValues[i+6])/7)
        //   }
        //   return weekAverage;
        // }
        // return the derivative of an array
        function derivate(cumulativeValues){
          let derivative = []
          for ( let i=0; i < cumulativeValues.length-1;i++){
            derivative.push(cumulativeValues[i+1]-cumulativeValues[i])
          }
          return derivative;
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

        // // this.regionName.push('Chile') // add Chile to the name of region
        // getDataCsv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto3/CasosTotalesCumulativo.csv', 'Cases', true)
        getDataCsv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto7/PCR.csv', 'Pcr', false,false);
        getDataCsv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto8/UCI.csv', 'Uci', false, true);
        // getDataCsv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto14/FallecidosCumulativo.csv', 'Deaths', true)

      }
    }

    // compute rolling mean on a week window

    function meanWeek(tabValues){
      let weekAverage=[];
      for (let i=0;i<tabValues.length-7; i++){
        weekAverage.push((tabValues[i]+tabValues[i+1]+tabValues[i+2]+tabValues[i+3]+tabValues[i+4]+tabValues[i+5]+tabValues[i+6])/7)
      }
      return weekAverage;
    }
    </script>
