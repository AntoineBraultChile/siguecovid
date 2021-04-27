<template>
  <div class="ActivityGraph">
    <div class="optionsGraph">
      <p> Última actualización : {{update}}</p>
        <p>
          <label for="region">Elija su región </label>
          <select name="region" id="region" v-on:change="changeCurrentRegion($event)">
            <option v-for="region in regionName"  :key='region' :value='region' :selected='currentRegion==region'> {{region}} </option>
          </select>
        </p>
        <choose-date :listOfMonths='listOfMonths' :fromDate='fromDate' v-on:newFromDate="changeFromDate"></choose-date>
      </div>
      <div id='block_graph' v-if="dataCovid.labelsUci.length > 0">

        <div class='graph'>
          <!-- <bar-chart  :chartData="getRegionValues(currentRegion,'Cases')" :options="getRegionOptions(currentRegion,'Cases')"> </bar-chart> -->
          <bar-chart  :chartData="getChartWithMean(currentRegion,'Cases')" :options="getOptionsChartWithMean(currentRegion,'Cases')"> </bar-chart>

        </div>
        <div class='graph'>
          <!-- <bar-chart  :chartData="getRegionValues(currentRegion,'Pcr')" :options="getRegionOptions(currentRegion,'Pcr')"> </bar-chart> -->
          <bar-chart  :chartData="getChartPosPcr(currentRegion)" :options="getOptionsChartPosPcr(currentRegion)"> </bar-chart>

        </div>
        <div class='graph'>
          <bar-chart  :chartData="getRegionValues(currentRegion,'Uci')" :options="getRegionOptions(currentRegion,'Uci')"> </bar-chart>
        </div>
        <div class='graph'>
          <bar-chart  :chartData="getRegionValues(currentRegion,'Deaths')" :options="getRegionOptions(currentRegion,'Deaths')"> </bar-chart>
        </div>

      </div>

    </div>
  </template>

  <style>
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
  }

  #block_graph{
    width:100%;
    display:flex;
    flex-direction:row;
    flex-wrap: wrap;
    justify-content: space-around;
  }

  @media all and (max-width: 960px) {

   #block_graph{
     flex-direction:column;
   }

   .graph{
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
  import * as d3 from 'd3-fetch'
  import moment from 'moment';

  import ChooseDate from './ChooseDate'

  export default {
    name:'ChartRegions',
    components:{
      'bar-chart': BarChart,
      'choose-date': ChooseDate
    },
    data () {
      return{
        currentRegion:'Metropolitana',
        regionName:[],
        dataCovid:{
          labelsUci:[1],
          labelsPcr:[],
          labelsCases:[],
          labelsDeaths:[],
          MetropolitanaUci:[],
          MetropolitanaPcr:[],
          MetropolitanaCases:[],
          MetropolitanaDeaths:[],
          MetropolitanaMeanCases:[]
        },
        title:{'Uci':'Personas en unidad de cuidados intensivos por Covid-19',
        'Pcr':'PCR',
        'Cases':'Casos',
        'Deaths': 'Fallecidos por COVID-19'
      },
      backgroundColor:{'Uci':'#dd4b39', 'Pcr':'#82CFFD', 'Cases':'#93DB70', 'Deaths': '#232b2b'},
        fromDate: "2021-01-01",
        listOfMonths:[],
        options:{
          title:{
            display:true,
            text:''
          },
          responsive:true,
          maintainAspectRatio:false,
          // to delete the box aside title
          legend: {
            display:false,
            // labels: {
            //   boxWidth: 0,
            // }
          }
        }
      }
    },
    methods:{
      getRegionValues(name,type){
      let fromDate = this.fromDate
      // console.log(Math.max(this.dataCovid['labels'+type].reduce(function (a, b) { return a < b ? a : b; })))
      let indexDate = this.dataCovid['labels'+type].indexOf(fromDate)
      return {
        labels:this.dataCovid['labels'+type].filter((x) => { return x >= fromDate }),
        datasets:[
          {label:this.title[type]+ ' en '+ name, backgroundColor:this.backgroundColor[type],fill: false, data:this.dataCovid[name+type].slice(indexDate)}]
        }
      },
      getRegionOptions(name,type){
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
          text:this.title[type]+ ' en ' + name,
          fontSize:20

        },
        legend: {
          display:false,
        },
        responsive:true,
        maintainAspectRatio:false
    }
    },
    getChartWithMean(name,type){
      let fromDate = this.fromDate
      let indexDate = this.dataCovid['labels'+type].indexOf(fromDate)
      // let indexDateMean = this.dataCovidChile['labelsMean'+type].indexOf(fromDate)
      return{
        labels:this.dataCovid['labels'+type].filter((x) => { return x >= fromDate }),
        datasets:[
          {type:'line', label:'Media de 7 dias', borderColor:'#dd4b39', backgroundColor:'#dd4b39', fill: false, data:this.dataCovid[name+'Mean'+type].slice(indexDate-7)},

          {type:'bar',label:this.title[type]+ ' diarios', backgroundColor:this.backgroundColor[type],fill: false, data:this.dataCovid[name+type].slice(indexDate)}
        ]
      }
    },
    getOptionsChartWithMean(name, type){
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
          text:this.title[type]+ ' en '+name,
          fontSize:20
        },
        responsive:true,
        maintainAspectRatio:false
      }
    },
    getChartPosPcr(name){
      // compute the positivity
      let Pcr= this.dataCovid[name+'Pcr']
      let Cases = this.dataCovid[name+'Cases']
      let Pos=[]
      for (let i=0;i<Pcr.length;i++){
        Pos.push(Math.floor(Cases[Cases.length-i-1]/Pcr[Pcr.length-i-1]*1000)/10)
      }
      Pos = meanWeek(Pos.reverse());
      let fromDate = this.fromDate
      let indexDate = this.dataCovid['labelsPcr'].indexOf(fromDate)
      // let indexDatePos = this.dataCovidChile['labelsPos'].indexOf(fromDate)
      return{
        labels:this.dataCovid['labelsPcr'].filter((x) => { return x >= fromDate }),
        datasets:[
          {type:'line', label:'Positividad (media de 7 dias)', yAxisID: 'Pos',borderColor:'#dd4b39', backgroundColor:'#dd4b39', fill: false, data:Pos.slice(indexDate-7)},
          {type:'bar',label:'Numero de test PCR ', yAxisID: 'Pcr', backgroundColor:this.backgroundColor['Pcr'],fill: false, data:this.dataCovid[name+'Pcr'].slice(indexDate)}
        ]
      }
    },
    getOptionsChartPosPcr(name){
      return{
        scales: {
          yAxes: [{
            id: 'Pos',
            type: 'linear',
            position: 'left',
            ticks: {   beginAtZero: true,
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
          text:'Positividad y PCR en '+ name,
          fontSize:20
        },
        responsive:true,
        maintainAspectRatio:false
      }
    },
      changeCurrentRegion(event){
        this.currentRegion = event.target.value;
      },
      changeFromDate(event){
        this.fromDate = moment(event.target.value, 'MMMM-YYYY').format('YYYY-MM-01')
      }
    },
    computed:{
      update: function(){
        return moment(this.dataCovid.labelsCases[this.dataCovid.labelsCases.length-1], "YYYY-MM-DD").format("DD-MM-YYYY")
      }
    },
    async created(){
      const getDataCsv = (path, type, derivative, initializeRegionName = false, initializeMonths = false, mean = false) => {
        d3.csv(path).then(data => {
          if (derivative==true){
            this.dataCovid['labels'+type] = Object.keys(data[0]).slice(3+1).map((d)=>  {return moment(d, "YYYY-MM-DD").format("YYYY-MM-DD")})
          }else{
            this.dataCovid['labels'+type] = Object.keys(data[0]).slice(3).map((d)=>  {return moment(d, "YYYY-MM-DD").format("YYYY-MM-DD")})
          }


          if(initializeMonths == true){
            generateListOfMonths();
          }

          let chileValues = []; // the sum of the regional time series
          for (let index=0; index < data.length; index++){
            if (initializeRegionName == true && data[index].Region!=undefined){
              this.regionName.push(data[index].Region)
            }

            // if we ask the derivative of the time serie (use to convert cumulative time serie to daily time serie)
            if(derivative==true){
              let dayCases = derivate(Object.values(data[index]).slice(3).map(i => Number(i)))
              this.$set(this.dataCovid, data[index].Region+type, dayCases);
              chileValues = sumArray(chileValues,dayCases)
              if(mean==true){
              this.$set(this.dataCovid, data[index].Region+'Mean'+type, meanWeek(dayCases))
            }
            }else{
              this.$set(this.dataCovid, data[index].Region+type, Object.values(data[index]).slice(3).map(i => Number(i)));
              chileValues = sumArray(chileValues,Object.values(data[index]).slice(3).map(i => Number(i)))
            }
          }
          this.$set(this.dataCovid, 'Chile'+type, chileValues);

        })

      }

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
      // function to generate list of months
      let generateListOfMonths  =  () => {
       let currentDate = moment('05-2020', 'MM-YYYY')
       while(currentDate < moment(this.dataCovid.labelsUci[this.dataCovid.labelsUci.length-1],'YYYY-MM-DD')){
         this.listOfMonths.push(currentDate.format('MMMM YYYY'))
         currentDate = moment(currentDate,'MM-YYYY').add(1,'M')
       }
     }

     // compute the rolling week average
     function meanWeek(tabValues){
       let weekAverage=[];
       for (let i=0;i<tabValues.length-7; i++){
         weekAverage.push(Math.floor((tabValues[i]+tabValues[i+1]+tabValues[i+2]+tabValues[i+3]+tabValues[i+4]+tabValues[i+5]+tabValues[i+6])/7))
       }
       return weekAverage;
     }

      // this.regionName.push('Chile') // add Chile to the name of region
      // (path, type, derivative, initializeRegionName = false, initializeMonths = false, mean = false)
      getDataCsv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto3/CasosTotalesCumulativo.csv', 'Cases', true, false,false, true)
      getDataCsv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto7/PCR.csv', 'Pcr', false);
      getDataCsv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto8/UCI.csv', 'Uci', false,true,true);
      getDataCsv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto14/FallecidosCumulativo.csv', 'Deaths', true)

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
