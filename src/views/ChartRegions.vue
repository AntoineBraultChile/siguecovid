<template>
  <div class="ChartRegion">
    <div class="containerSection">
      <box-container>

    <title-container titleName='La pandemia de Covid-19 en las regiones de Chile' :update='false'/>
  </box-container>

    <region-choice :currentRegion='currentRegion' :regionName='regionName' v-on:new-region="changeCurrentRegion" v-if='regionName.length>0'/>
      <!-- <div class="subtitleContainer" v-if='regionName.length>0'>
        <h2><span class='subtitle'>Región {{currentRegion}}</span></h2>
        <div class="optionsGraph">
          <p>
            <label for="region">Elija otra región  </label>
            <select name="region" id="region" v-on:change="changeCurrentRegion($event)">
              <option v-for="region in regionName"  :key='region' :value='region' :selected='currentRegion==region'> {{region}} </option>
            </select>
          </p>
        </div>
      </div> -->

      <!-- <div id='block_graph' class='d-flex flex-row flex-wrap justify-content-between' v-if="dataCovid.labelsCases.length > 0" > -->
      <div id='block_graph'  v-if="dataCovid.labelsCases.length > 0" >

        <indicators
          :labels="dataCovid['labelsCases']"
          :cases="dataCovid[currentRegion+'MeanCases']"
          :positivity="dataCovid[currentRegion+'Pos']"
          :uci="dataCovid[currentRegion+'Uci']"
          :deaths="dataCovid[currentRegion+'TotalDeaths']"
          type='epidemic'
          :region='currentRegion'
          />
<!--
          <div class="slideBarContainer" >
            Gráficos a partir de {{fromMonth}}
            <div class="slideBar" v-if="dataCovid.labelsCases.length > 0">

              <vue-slider :data="listOfMonths" :adsorb="true" v-model="fromMonth"  :marks='true' :hideLabel='true' :tooltip="'active'"  :use-keyboard="false" v-on:change="updateCurrentDate()"></vue-slider>
            </div>
          </div> -->
          <slide-bar  v-if="fromMonth.length > 0" :listOfMonths='listOfMonths' :fromMonth='fromMonth' v-on:newdate='updateCurrentDate'/>

          <charts-epidemic :region="currentRegion" :fromDate="fromDate" :dataCovid="dataCovid"/>
          </div>
          <spinner size='massive' v-else ></spinner>

        </div>
        <footer-indicators><p>
          Como se calculan los indicatores :
          <ul>
            <li> La media móvil de 7 días de una cantidad (casos, positividad...) del día n es la medía de la cantidad entre los días n y n-7. </li>
            <li> El número de muertes corresponde únicamente al número de muertes confirmadas por la prueba PCR. El <a href="https://deis.minsal.cl/">Departamento de Estadiscticas e Informacion de Salud</a>
            da el número de fallecidos por Covid-19 sospechosos. </li>
          </ul>
        </p>
        </footer-indicators>
      </div>
    </template>

    <style src='../assets/chartChileAndRegion.css'>
    </style>

    <style >
    .ChartRegion{
      display:flex;
      width:100%;
      flex-direction:column;
      align-items: center;
      justify-content: center;
    }
    /* .subtitleContainer{
      display:flex;
      flex-direction:column;
      justify-content: center;
      align-items: center;
      width:100%;
      box-shadow: 0px 0px 2px 2px #e8e8e8;
      border-radius: 7px;
      background-color: white;
      padding-top:5px;
      margin-bottom:5px;
      margin-top:5px;

    }
    .subtitleContainer h2{
      text-align:center;
      font-size:25px;
      font-weight:normal;

    } */

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

      .optionsGraph p{
        font-size:16px;
      }
    }
    </style>

    <script>
    import Indicators from '@/components/Indicators'
    import ChartsEpidemic from '@/components/ChartsEpidemic'
    import TitleContainer from '@/components/TitleContainer'
    import FooterIndicators from '@/components/FooterIndicators'
    import SlideBar from '@/components/SlideBar'

    import RegionChoice from '@/components/RegionChoice'

    import  {meanWeek, derivate} from '@/assets/mathFunctions'

    // import VueSlider from 'vue-slider-component'
    // import 'vue-slider-component/theme/default.css'

    import * as d3 from 'd3-fetch'
    // const moment = require('moment');
    // require('moment/locale/es');
    // moment.locale('es');

    import * as dayjs from 'dayjs'
    var customParseFormat = require('dayjs/plugin/customParseFormat')
    dayjs.extend(customParseFormat)
    import 'dayjs/locale/es' // load on demand
    dayjs.locale('es') // use Spanish locale globally

    export default {
      name:'ChartRegions',
      components:{
        // 'vue-slider': VueSlider,
        'charts-epidemic': ChartsEpidemic,
        'title-container':TitleContainer,
        'indicators': Indicators,
        'slide-bar': SlideBar,
        'region-choice':RegionChoice,
        'footer-indicators': FooterIndicators

      },
      metaInfo() {
        return {
          title: "Evolución de la pandemia de Covid-19 en las regiones de Chile",
          meta: [
            { name: 'description',
            content:  `Graficos y indicatores de los casos nuevos, positividad, numero de test Pcr, numero de personas actualmente en unidad de cuidados intensivos,
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
          fromDate: "01-02-2021",
          fromMonth: '',
          listOfMonths:[]
        }
      },
      methods:{
        // variationCases(region){
        //   return Math.round(-(1-this.dataCovid[region+'MeanCases'].slice(-1)[0]/this.dataCovid[region+'MeanCases'].slice(-8)[0])*1000)/10;
        // },
          changeCurrentRegion(payload){
            this.currentRegion = payload.target.value;
          },
          // changeFromDate(event){
          //   this.fromDate = dayjs(event.target.value, 'MMMM-YYYY').format('01-MM-YYYY')
          // },
          updateCurrentDate(payload){
            this.fromMonth = payload
            this.fromDate = dayjs(payload, 'MMMM YYYY').format('01-MM-YYYY')
          }
        },

        async created(){
          //fetching data
          const getDataCsv = async (path, type, derivative, initializeRegionName = false, initializeMonths = false, mean = false) => {
            let data = await d3.csv(path)
            if (derivative==true){
              this.dataCovid['labels'+type] = Object.keys(data[0]).slice(3+1).map((d)=>  {return dayjs(d, "YYYY-MM-DD").format("DD-MM-YYYY")})
            }else{
              this.dataCovid['labels'+type] = Object.keys(data[0]).slice(3).map((d)=>  {return dayjs(d, "YYYY-MM-DD").format("DD-MM-YYYY")})
            }

            if(initializeMonths == true){
              generateListOfMonths();
            }

            // get data for each region
            for (let index=0; index < data.length; index++){
              if (initializeRegionName == true && data[index].Region!=undefined && data[index].Region!='Total'){
                this.regionName.push(data[index].Region)
              }
              if(type=='Deaths'){
                this.$set(this.dataCovid, data[index].Region+'TotalDeaths', Object.values(data[index]).map(i => Number(i)))
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
            let currentDate = dayjs('05-2020', 'MM-YYYY')
            while(currentDate < dayjs(this.dataCovid.labelsCases[this.dataCovid.labelsCases.length-1],'DD-MM-YYYY')){
              this.listOfMonths.push(currentDate.format('MMMM YYYY'))
              currentDate = dayjs(currentDate,'MM-YYYY').add(1,'M')
            }
          }

          // Uci
          getDataCsv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto8/UCI.csv', 'Uci', false,false,false);
          // Deaths
          getDataCsv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto14/FallecidosCumulativo.csv', 'Deaths', true, false, false, true)
          // PCR number each day
          let dataPcr = await getDataCsv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto7/PCR.csv', 'Pcr', false);
          // Cases
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

          // update fromMonth from fromDate
          this.fromMonth = dayjs(this.fromDate, '01-MM-YYYY').format('MMMM YYYY')
        }
      }

      </script>
