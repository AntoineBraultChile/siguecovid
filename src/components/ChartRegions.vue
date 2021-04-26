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
          <bar-chart  :chartData="getRegionValues(currentRegion,'Cases')" :options="getRegionOptions(currentRegion,'Cases')"> </bar-chart>
        </div>
        <div class='graph'>
          <bar-chart  :chartData="getRegionValues(currentRegion,'Pcr')" :options="getRegionOptions(currentRegion,'Pcr')"> </bar-chart>
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

  select{
    margin-left:10px;
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
          MetropolitanaDeaths:[]
        },
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
        let backgroundColor ={'Uci':'#dd4b39', 'Pcr':'#82CFFD', 'Cases':'#93DB70', 'Deaths': '#232b2b'}
        let title ={'Uci':'Unidad de cuidados intensivos',
        'Pcr':'Pcr',
        'Cases':'Casos',
        'Deaths': 'Fallecidos por COVID-19'
      }
      let fromDate = this.fromDate
      // console.log(Math.max(this.dataCovid['labels'+type].reduce(function (a, b) { return a < b ? a : b; })))
      let indexDate = this.dataCovid['labels'+type].indexOf(fromDate)
      return {
        labels:this.dataCovid['labels'+type].filter((x) => { return x >= fromDate }),
        datasets:[
          {label:title[type]+ ' en '+ name, backgroundColor:backgroundColor[type],fill: false, data:this.dataCovid[name+type].slice(indexDate)}]
        }
      },
      getRegionOptions(name,type){
        let title ={'Uci':'Unidad de cuidados intensivos',
        'Pcr':'Pcr',
        'Cases':'Casos',
        'Deaths': 'Fallecidos por COVID-19'
      }
      return{
        title:{
          display:true,
          text:title[type]+ ' en ' + name,
          fontSize:20

        },
        legend: {
          display:false,
          // labels: {
          //   boxWidth: 0,
          // }
        },
        responsive:true,
      maintainAspectRatio:false
    }
      // this.options.title.text = title[type]+ ' en '+ name
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
      const getDataCsv = (path, type, derivative, initializeRegionName = false, initializeMonths = false) => {
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
          for (let index=0; index <data.length; index++){
            if (initializeRegionName == true && data[index].Region!=undefined){
              this.regionName.push(data[index].Region)
            }

            // if we ask the derivative of the time serie (use to convert cumulative time serie to daily time serie)
            if(derivative==true){
              let dayCases = derivate(Object.values(data[index]).slice(3).map(i => Number(i)))
              this.$set(this.dataCovid, data[index].Region+type, dayCases);
              chileValues = sumArray(chileValues,dayCases)
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

      // this.regionName.push('Chile') // add Chile to the name of region
      getDataCsv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto3/CasosTotalesCumulativo.csv', 'Cases', true, false)
      getDataCsv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto7/PCR.csv', 'Pcr', false);
      getDataCsv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto8/UCI.csv', 'Uci', false,true,true);
      getDataCsv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto14/FallecidosCumulativo.csv', 'Deaths', true)

  }
}
</script>
