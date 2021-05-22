<template lang="html">
  <div class="ChartComunas">
    <div class="containerSection">
      <box-container>
        <title-container titleName='La pandemia de Covid-19 en las comunas de Chile'> </title-container>
      </box-container>
      <div id='block_graph' v-if="cases.labels.length > 0">
        <comuna-choice :currentComuna='currentComuna' :comunaNames='comunaNames' v-on:new-comuna="changeCurrentComuna" v-if='comunaNames.length>0'/>
          <slide-bar  v-if="listOfMonths.length > 0" :listOfMonths='listOfMonths' :fromMonth='fromMonth' v-on:newdate='updateCurrentDate'/>
            <div class='graph' v-if='cases.labels.length>0'>
              <title-graphic>Incidencia semanal en la comuna de {{currentComuna}}</title-graphic>
              <span style='font-size:1rem'>Incidencia: número semanal de casos por cada 100.000 habitantes</span> <br>
              <update :labels="cases.labels"> </update>
              <line-chart :chartData="ChartIncidence(currentComuna)" :options="options()"/>
            </div>
            <div class='graph' v-if='positivity.labels.length>0'>
              <title-graphic>Positividad semanal de los test PCR en la comuna de {{currentComuna}}</title-graphic>
              <update :labels="cases.labels"> </update>
              <line-chart :chartData="ChartPositivity(currentComuna)" :options="options('positivity')"/>
            </div>
            <div class='graph' v-if='cases.labels.length>0'>
              <title-graphic>Fallecidos semanal por Covid-19 en la comuna de {{currentComuna}}</title-graphic>
              <span style='font-size:1rem'>Son sólo los fallecidos confirmados con un test PCR positivo</span> <br>
              <update :labels="cases.labels"> </update>
              <bar-chart :chartData="ChartDeaths(currentComuna)" :options="options()"></bar-chart>
            </div>
          </div>
          <spinner size='massive' v-else ></spinner>
        </div>
      </div>
    </template>

    <script>
    import * as d3 from 'd3-fetch'
    import * as dayjs from 'dayjs'
    var customParseFormat = require('dayjs/plugin/customParseFormat')
    dayjs.extend(customParseFormat)
    import 'dayjs/locale/es' // load on demand
    dayjs.locale('es') // use Spanish locale globally
    import {derivate} from '../assets/mathFunctions'
    import LineChart from '@/components/LineChart'
    import BarChart from '@/components/BarChart'
    import Update from '../components/Update'
    import TitleGraphic from '@/components/TitleGraphic'
    import TitleContainer from '@/components/TitleContainer'
    import BoxContainer from '@/components/BoxContainer'
    import SlideBar from '@/components/SlideBar'
    import ComunaChoice from '@/components/ComunaChoice'

    export default {
      name:'ChartComunas',
      components:{
        'line-chart':LineChart,
        'bar-chart':BarChart,
        'update':Update,
        'title-graphic':TitleGraphic,
        'title-container': TitleContainer,
        'box-container':BoxContainer,
        'slide-bar':SlideBar,
        'comuna-choice':ComunaChoice
      },
      metaInfo() {
        return {
          title: "Evolución de la pandemia de Covid-19 en las comunas de Chile",
          meta: [
            { name: 'description',
            content:  `Visualizacion de la pandemia de Covid-19 por comuna en Chile. Sigue la evolucion de la incidencia.`},
            {name: 'robots', content: 'index,follow'}
          ]
        }},
      data(){
        return{
          backgroundColor :{'Uci':'#dd4b39', 'Pcr':'#82CFFD', 'Cases':'#93DB70', 'Deaths': '#232b2b'},
          fromDate: "01-02-2021",
          fromMonth:'',
          listOfMonths:[],
          dicMonth:{},
          currentComuna:'Arica',
          comunaNames:[],
          dicComunaNamesAccentWithoutWith:{},
          cases:{
            labels:[],
            comuna:{
              Arica:[],
            }
          },
          deaths:{
            labels:[],
            comuna:{
              Arica:[],
            }
          },
          positivity:{
            labels:[],
            comuna:{
              Arica:[],
            }
          },
        }
      },
      methods:{
        changeCurrentComuna(payload){
          this.currentComuna = payload;
        },
        updateCurrentDate(payload){
          this.fromMonth = payload
          this.fromDate = dayjs(payload, 'MMMM YYYY').format('01-MM-YYYY')
        },
        ChartIncidence(comuna){
          let index = this.cases.labels.indexOf(this.dicMonth[this.fromDate])
          index = index>0 ? index:0;
          return{
            labels:this.cases.labels.slice(index),
            datasets:[
              {label:'', borderColor:this.backgroundColor['Cases'], backgroundColor:this.backgroundColor['Cases'], fill: false, data:this.cases.comuna[comuna].slice(index)},
            ]
          }},
          ChartDeaths(comuna){
            let index = this.deaths.labels.indexOf(this.dicMonth[this.fromDate])
            index = index>0 ? index:0;
            return{
              labels:this.deaths.labels.slice(index),
              datasets:[
                {label:'Confirmados', borderColor:this.backgroundColor['Deaths'], backgroundColor:this.backgroundColor['Deaths'], fill: false, data:this.deaths.comuna[comuna].slice(index)},
                // {label:'Sospechosos', borderColor:this.backgroundColor['Deaths'], backgroundColor:this.backgroundColor['Uci'], fill: false, data:this.deathsSuspicious.comuna[comuna].slice(index)},
              ]
            }},
          ChartPositivity(comuna){
            let index = this.positivity.labels.indexOf(this.dicMonth[this.fromDate])
            index = index>0 ? index:0;
            return{
              labels:this.positivity.labels.slice(index),
              datasets:[
                {label:'', borderColor:this.backgroundColor['Pcr'], backgroundColor:this.backgroundColor['Pcr'], fill: false, data:this.positivity.comuna[comuna].slice(index)},
              ]
            }},
            options(type){
              let opt= {
              scales: {
                yAxes: [{
                  ticks: {
                    beginAtZero: true,
                  }
                }]
              },
              legend: {
                display:false,
              },
              tooltips: {
                mode: 'index',
                intersect: false
              },
              hover: {
                mode: 'index',
                intersect: false
              },
              responsive:true,
              maintainAspectRatio:false
            }

          if(type==='positivity'){
            opt.scales.yAxes[0].ticks["callback"] = function(tick) {
              return tick.toString() + '%';
            }
          }
          return opt
        }
      },
        async created(){
          //fetch deaths by comuna
          const deathsComunas = await d3.csv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto61/serie_fallecidos_comuna.csv')
          let allLabelsDeaths= Object.keys(deathsComunas[0]).slice(5).map(date => {return dayjs(date,"YYYY-MM-DD").format("DD-MM-YYYY")})
          // we keep only monday date
          allLabelsDeaths.forEach(d => {
            // if it is a monday
            if(dayjs(d,"DD-MM-YYYY").get("day") === 1) {
              this.deaths.labels.push(dayjs(d,"DD-MM-YYYY").format("DD-MM-YYYY"))
            }
          })
          // we eliminate the first monday because we are going to compute of derivative to get variation of incidence
          this.deaths.labels = this.deaths.labels.slice(1)

          // deaths each week by comune
          deathsComunas.forEach((comuna)=>{
            // only deaths confirmed by PCR
            if(comuna["CIE 10"]=='U07.1' || comuna["CIE 10"]==''){
              if(!Object.keys(this.dicComunaNamesAccentWithoutWith).includes(comuna['Comuna'])){
                  this.dicComunaNamesAccentWithoutWith[deleteAccent(comuna['Comuna'])] = comuna['Comuna']
                }
            let allValues = Object.values(comuna).slice(5).map(i => {return Number(i)})
            let valuesEachMonday = []
            allValues.forEach((d,index) =>{
              if(dayjs(allLabelsDeaths[index],'DD-MM-YYYY').get("day")===1){
                valuesEachMonday.push(d)
              }
            })
            this.deaths.comuna[comuna['Comuna']] = derivate(valuesEachMonday)
          }
          })

          // because Aysen can be written Aisen
          // this.deaths.comuna['Aysen'] = this.deaths.comuna['Aisen']
          delete this.dicComunaNamesAccentWithoutWith['Aisen']
          this.dicComunaNamesAccentWithoutWith['Aysen'] = 'Aisén'

          // we set comuna names with accents
          this.comunaNames = Object.values(this.dicComunaNamesAccentWithoutWith)

          // fetch cases
          const casesComunas = await d3.csv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto1/Covid-19.csv');
          const allLabels = Object.keys(casesComunas[0]).slice(5,-1).map(date => {return dayjs(date,"YYYY-MM-DD").format("DD-MM-YYYY")})
          // we keep only monday date
          allLabels.forEach(d => {
            // if it is a monday
            if(dayjs(d,"DD-MM-YYYY").get("day") === 1) {
              this.cases.labels.push(dayjs(d,"DD-MM-YYYY").format("DD-MM-YYYY"))
              if(! (this.listOfMonths.includes(dayjs(d,"DD-MM-YYYY").format('MMMM YYYY')))) {
                this.listOfMonths.push(dayjs(d,"DD-MM-YYYY").format('MMMM YYYY'))
                if (!Object.values(this.dicMonth).includes(dayjs(d,"DD-MM-YYYY").format("DD-MM-YYYY"))){
                  this.dicMonth[dayjs(d,"DD-MM-YYYY").format('01-MM-YYYY')] = dayjs(d,"DD-MM-YYYY").format("DD-MM-YYYY")
                }
              }
            }
          })

          // we eliminate the first monday because we are going to compute of derivative to get variation of incidence
          this.cases.labels = this.cases.labels.slice(1)
          this.listOfMonths = this.listOfMonths.slice(1)

          // we compute incidence each week
          casesComunas.forEach((comuna)=>{
            let allValues = Object.values(comuna).slice(5,-1).map(i => {return Number(i)})
            let valuesEachMonday = []
            allValues.forEach((d,index) =>{
              if(dayjs(allLabels[index],'DD-MM-YYYY').get("day")===1){
                valuesEachMonday.push(Math.round(d/comuna['Poblacion']*100000))
              }
            })
            this.cases.comuna[this.dicComunaNamesAccentWithoutWith[comuna['Comuna']]] = derivate(valuesEachMonday)
          })
          // this.comunaNames = Object.keys(this.cases.comuna).filter(comuna => !comuna.includes("Desconocido"))
          this.fromMonth = dayjs(this.fromDate, '01-MM-YYYY').format('MMMM YYYY')


          // fetch positivity by comune
          const positivityComunas = await d3.csv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto65/PositividadPorComuna.csv')
          this.positivity.labels = Object.keys(positivityComunas[0]).slice(5).map(date => {return dayjs(date,"YYYY-MM-DD").format("DD-MM-YYYY")})
          positivityComunas.forEach(comuna =>{
            this.positivity.comuna[this.dicComunaNamesAccentWithoutWith[comuna['Comuna']]] = Object.values(comuna).slice(5).map(i => {return Number(i)})
          })


          // function to delete accent
          function deleteAccent(string){
            return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
          }
        }
      }
      </script>

      <style lang="css" scoped>
      .ChartComunas{
        width:100%;
        display:flex;
        flex-direction:column;
        align-items: center;
        justify-content: center;
      }
      .containerSection{
        max-width:1400px;
        padding:0px 10px 0px 10px;
        display:flex;
        align-items: center;
        justify-content: center;
        flex-direction:column;
      }

      .graph{
        width:49.5%;
        margin:5px 0px 5px 0px;
        box-shadow: 0px 0px 2px 2px #e8e8e8;
        border-radius: 7px;
        background-color: white;
        padding:0px 0px 10px 0px;
      }
      #block_graph{
        width:100%;
        display:flex;
        flex-direction:row;
        justify-content: center;
        flex-wrap: wrap;
        justify-content: space-between;
      }
      .box-container{
        display:flex;
        align-items: center;
      }

      @media all and (max-width: 1100px) {
        .containerSection{
          width:100%;
        }
        .graph{
          width:100%;
          margin:5px 0px 5px 0px;
        }
        #block_graph{
          flex-direction:column;
          padding:0px 0px 0px 0px;
        }
      }
      </style>
