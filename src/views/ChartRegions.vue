<template>
  <div class="ChartRegion">
    <div class="containerSection">
        <div class="titleContainer">
    <h1 id='slogan'>   La pandemia de Covid-19 en las regiones de Chile   </h1>

      </div>
      <div class="subtitleContainer">
        <h2><span class='subtitle'>Región {{currentRegion}}</span></h2>
        <div class="optionsGraph">
            <p>
              <label for="region">Elija otra región  </label>
              <select name="region" id="region" v-on:change="changeCurrentRegion($event)">
                <option v-for="region in regionName"  :key='region' :value='region' :selected='currentRegion==region'> {{region}} </option>
              </select>
            </p>
            <!-- <choose-date :listOfMonths='listOfMonths' :fromDate='fromDate' v-on:newFromDate="changeFromDate"></choose-date> -->
          </div>
      </div>
      <div id='block_graph' class='d-flex flex-row flex-wrap justify-content-between' v-if="dataCovid.labelsCases.length > 0">
        <div class="optionDosis">
          <div class='dosis color1'> <span>{{dataCovid[currentRegion+'MeanCases'].slice(-1)[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}} casos</span>
            <span class='en24horas'> {{(dataCovid[currentRegion+'MeanCases'].slice(-1)[0]-dataCovid[currentRegion+'MeanCases'].slice(-2)[0]>0? '+':' ')+(dataCovid[currentRegion+'MeanCases'].slice(-1)[0]-dataCovid[currentRegion+'MeanCases'].slice(-2)[0]).toString()}} casos en 24 horas </span>
             <span  style="font-weight:normal; font-size:12px;"> Media móvil de 7 días</span>
            <update :labels="dataCovid['labelsCases']"> </update>

           </div>
          <!-- <div class='dosis color2'> Variación semanal de los casos {{(variationCases(currentRegion) > 0 ? '+' : ' ')+variationCases(currentRegion).toString()}}%
            <update :labels="dataCovid['labelsPcr']"> </update>

          </div> -->
          <div class='dosis color2'>
            <span> {{dataCovid[currentRegion+'Pos'].slice(-1)[0]}} % de positividad</span>
            <span class='en24horas'> {{(dataCovid[currentRegion+'Pos'].slice(-1)[0]-dataCovid[currentRegion+'Pos'].slice(-2)[0]>0? '+':' ')+(Math.round((dataCovid[currentRegion+'Pos'].slice(-1)[0]-dataCovid[currentRegion+'Pos'].slice(-2)[0])*10)/10).toString()}}% en 24 horas </span>
            <span  style="font-weight:normal; font-size:12px;"> Media móvil de 7 días</span>

            <update :labels="dataCovid['labelsPcr']"> </update>

          </div>
        </div>

        <div class="optionDosis">
          <div class='dosis color3' >
            <span>{{dataCovid[currentRegion+'Uci'].slice(-1)[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}} personas en UCI</span>
            <span class='en24horas'> {{(((dataCovid[currentRegion+'Uci'].slice(-1)[0]-dataCovid[currentRegion+'Uci'].slice(-2)[0])>0)?'+':' ')+(dataCovid[currentRegion+'Uci'].slice(-1)[0]-dataCovid[currentRegion+'Uci'].slice(-2)[0]).toString()}} en 24 horas </span>
            <span style='font-size:12px;font-weight:normal'>UCI: unidad de cuidados intensivos </span>
            <update :labels="dataCovid['labelsUci']"> </update>
          </div>
          <div class='dosis color4'>
            <span>Total fallecidos {{dataCovid[currentRegion+'TotalDeaths'][0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}} </span>
            <span class='en24horas'> + {{dataCovid[currentRegion+'Deaths'].slice(-1)[0]}} en 24 horas </span>
            <update :labels="dataCovid['labelsDeaths']"> </update>
          </div>
        </div>
        <div class="slideBarContainer" >
          Gráficos a partir de {{fromMonth}}
          <div class="slideBar" v-if="dataCovid.labelsCases.length > 0">
            <vue-slider :data="listOfMonths" :adsorb="true" v-model="fromMonth"  :marks='true' :hideLabel='true' :tooltip="'active'"  :use-keyboard="false" v-on:change="updateCurrentDate()"></vue-slider>
          </div>
        </div>
        <div class='graph'>
          <bar-chart  :chartData="getChartWithMean(currentRegion,'Cases')" :options="getOptionsChartWithMean(currentRegion,'Cases')"> </bar-chart>
        </div>
        <div class='graph'>
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
      <footer>
        <p>
          Como se calculan los indicatores :
          <ul>
            <li> La media móvil de 7 días de una cantidad (casos, positividad...) del día n es la medía de la cantidad entre los días n y n-7. </li>
            <li> La variación semanal se calcula como la media móvil de los últimos siete días dividida por la media móvil del día anterior. </li>
          </ul>
        </p>
      </footer>

    </div>

  </template>

  <style src='../assets/chartChileAndRegion.css'>
  </style>

  <style >
  .ChartRegion{
    display:flex;
    flex-direction:column;
    align-items: center;
    justify-content: center;
  }
  .subtitleContainer{
    display:flex;
    flex-direction:column;
    justify-content: center;
    align-items: center;
    width:100%;
    box-shadow: 0px 0px 2px 2px #e8e8e8;
    border-radius: 7px;
    background-color: white;
    padding-top:5px;
    /* padding:15px 10px 0px 10px; */
    margin-bottom:5px;
    margin-top:5px;
  }
  .subtitleContainer h2{
    text-align:center;
    /* border:solid; */
  }

  .optionsGraph label{
    padding-right: 5px;
  }

  @media all and (max-width: 1100px) {
  .subtitleContainer{
    margin-top:5px;
  }

  .subtitle{
    font-size: 20px;
    font-weight:normal;
  }
}
  </style>

  <script>

  import BarChart from '../components/BarChart'
  // import ChooseDate from '../components/ChooseDate'
  import Update from '../components/Update'

  import VueSlider from 'vue-slider-component'
  import 'vue-slider-component/theme/default.css'


  import * as d3 from 'd3-fetch'
  import moment from 'moment';

  import  {meanWeek, derivate} from '@/assets/mathFunctions'


  export default {
    name:'ChartRegions',
    components:{
      'bar-chart': BarChart,
      // 'choose-date': ChooseDate,
      'vue-slider': VueSlider,
      'update': Update
    },
    metaInfo() {
         return {
             title: "Evolución de  la epidemia de Covid-19 en las regiones de Chile",
             meta: [
                 { name: 'description',
                  content:  `Graficos de los casos nuevos, positividad, numero de test Pcr, numero de personas actualmente en unidad de cuidados intensivos,
                  fallecidos en las regiones de Chile `},
                 {name: 'robots', content: 'index,follow'}
             ]
         }},
    data () {
      return{
        currentRegion:'Metropolitana',
        regionName:[],
        dataCovid:{
          labelsUci:[],
          labelsPcr:[],
          labelsCases:[],
          labelsDeaths:[],
          MetropolitanaUci:[],
          MetropolitanaPcr:[],
          MetropolitanaCases:[],
          MetropolitanaDeaths:[],
          MetropolitanaMeanCases:[],
          MetropolitanaPos:[]
        },
        title:{'Uci':'Personas en unidad de cuidados intensivos por Covid-19',
        'Pcr':'PCR',
        'Cases':'Casos',
        'Deaths': 'Fallecidos por Covid-19'
      },
      backgroundColor:{'Uci':'#dd4b39', 'Pcr':'#82CFFD', 'Cases':'#93DB70', 'Deaths': '#232b2b'},
        fromDate: "01-01-2021",
        fromMonth: '',
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
      variationCases(region){
        return Math.round(-(1-this.dataCovid[region+'MeanCases'].slice(-1)[0]/this.dataCovid[region+'MeanCases'].slice(-8)[0])*1000)/10;
      },
      getRegionValues(name,type){
      let fromDate = this.fromDate
      // console.log(Math.max(this.dataCovid['labels'+type].reduce(function (a, b) { return a < b ? a : b; })))
      let indexDate = this.dataCovid['labels'+type].indexOf(fromDate)
      return {
        labels:this.dataCovid['labels'+type].filter((x) => { return moment(x,'DD-MM-YYYY') >= moment(fromDate,'DD-MM-YYYY')  }),
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
        labels:this.dataCovid['labels'+type].filter((x) => { return moment(x,'DD-MM-YYYY') >= moment(fromDate,'DD-MM-YYYY')  }),
        datasets:[
          {type:'line', label:'Media móvil de 7  días', borderColor:'#dd4b39', backgroundColor:'#dd4b39', fill: false, data:this.dataCovid[name+'Mean'+type].slice(indexDate-7)},
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
          text:this.title[type]+ ' en '+ this.currentRegion,
          fontSize:20
        },
        responsive:true,
        maintainAspectRatio:false
      }
    },
    getChartPosPcr(name){
      let fromDate = this.fromDate
      let indexDate = this.dataCovid['labelsPcr'].indexOf(fromDate)
      let indexDatePos = indexDate-7
      return{
        labels:this.dataCovid['labelsPcr'].filter((x) => { return moment(x,'DD-MM-YYYY') >= moment(fromDate,'DD-MM-YYYY')  }),
        datasets:[
          {type:'line', label:'Positividad (media móvil de 7 días)', yAxisID: 'Pos',borderColor:'#dd4b39', backgroundColor:'#dd4b39', fill: false, data:this.dataCovid[name+'Pos'].slice(indexDatePos)},
          {type:'bar',label:'Numero de test PCR ', yAxisID: 'Pcr', backgroundColor:this.backgroundColor['Pcr'],fill: false, data:this.dataCovid[name+'Pcr'].slice(indexDate)}
        ]
      }
    },
    getOptionsChartPosPcr(name){
      return{
        title:{
          display:true,
          text:'Positividad y PCR en '+ name,
          fontSize:20
        },
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

        responsive:true,
        maintainAspectRatio:false
      }
    },
      changeCurrentRegion(event){
        this.currentRegion = event.target.value;
      },
      // changeFromDate(event){
      //   this.fromDate = moment(event.target.value, 'MMMM-YYYY').format('01-MM-YYYY')
      // },
      updateCurrentDate(){
        this.fromDate = moment(this.fromMonth, 'MMMM YYYY').format('01-MM-YYYY')
      }
    },

    async created(){
      const getDataCsv = async (path, type, derivative, initializeRegionName = false, initializeMonths = false, mean = false) => {
        let data = await d3.csv(path)
          if (derivative==true){
            this.dataCovid['labels'+type] = Object.keys(data[0]).slice(3+1).map((d)=>  {return moment(d, "YYYY-MM-DD").format("DD-MM-YYYY")})
          }else{
            this.dataCovid['labels'+type] = Object.keys(data[0]).slice(3).map((d)=>  {return moment(d, "YYYY-MM-DD").format("DD-MM-YYYY")})
          }

          if(initializeMonths == true){
            generateListOfMonths();
          }

          // let chileValues = []; // the sum of the regional time series
          for (let index=0; index < data.length; index++){
            if (initializeRegionName == true && data[index].Region!=undefined && data[index].Region!='Total'){
              this.regionName.push(data[index].Region)
            }
            if(type=='Deaths'){
              this.$set(this.dataCovid, data[index].Region+'TotalDeaths', Object.values(data[index]).slice(-1).map(i => Number(i)))
            }
            // if we ask the derivative of the time serie (use to convert cumulative time serie to daily time serie)
            if(derivative==true){
              let dayCases = derivate(Object.values(data[index]).slice(3).map(i => Number(i)))
              this.$set(this.dataCovid, data[index].Region+type, dayCases);
              // chileValues = sumArray(chileValues,dayCases)
              if(mean==true){
              this.$set(this.dataCovid, data[index].Region+'Mean'+type, meanWeek(dayCases).map((d)=>{return Math.round(d)}))
            }
            }else{
              this.$set(this.dataCovid, data[index].Region+type, Object.values(data[index]).slice(3).map(i => Number(i)));
            }
          }
          if (type=='Cases' || type=='Pcr'){
            return this.dataCovid
          }
      }

      // function to generate list of months
      let generateListOfMonths  =  () => {
       let currentDate = moment('05-2020', 'MM-YYYY')
       while(currentDate < moment(this.dataCovid.labelsCases[this.dataCovid.labelsCases.length-1],'DD-MM-YYYY')){
         this.listOfMonths.push(currentDate.format('MMMM YYYY'))
         currentDate = moment(currentDate,'MM-YYYY').add(1,'M')
       }
     }

     getDataCsv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto8/UCI.csv', 'Uci', false,false,false);
     getDataCsv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto14/FallecidosCumulativo.csv', 'Deaths', true)
     let dataPcr = await getDataCsv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto7/PCR.csv', 'Pcr', false);
     let dataCases = await getDataCsv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto3/CasosTotalesCumulativo.csv', 'Cases', true, true,true, true)


     // compute the positivity
     for (let region of this.regionName){
       const Cases = dataCases[region+'Cases']
       const Pcr = dataPcr[region+'Pcr']
       let Pos=[]
       for (let i=0;i<Pcr.length;i++){
         Pos.push(Cases[Cases.length-i-1]/Pcr[Pcr.length-i-1]*100)
        }
        Pos = meanWeek(Pos.reverse()).map(d =>{return Math.round(d*10)/10});
        this.$set(this.dataCovid, region+'Pos', Pos);
     }

     // // compute the positivity
     // let Pos=[]
     // for (let i=0;i<Pcr.length;i++){
     //   Pos.push(Cases[Cases.length-i-1]/Pcr[Pcr.length-i-1]*100)
     // }
     // Pos = meanWeek(Pos.reverse()).map(d =>{return Math.round(d*10)/10});
     // console.log(Cases)



      this.fromMonth = moment(this.fromDate, '01-MM-YYYY').format('MMMM YYYY')

  }
}

</script>
