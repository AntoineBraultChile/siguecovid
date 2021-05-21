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
              <title-graphic>Incidencia en la comuna de {{currentComuna}}</title-graphic>
              <span style='font-size:1rem'>Incidencia: número semanal de casos por cada 100.000 habitantes</span> <br>
              <update :labels="cases.labels"> </update>
              <line-chart :chartData="ChartIncidence(currentComuna)" :options='options'></line-chart>
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
        'update':Update,
        'title-graphic':TitleGraphic,
        'title-container': TitleContainer,
        'box-container':BoxContainer,
        'slide-bar':SlideBar,
        'comuna-choice':ComunaChoice
      },
      data(){
        return{
          fromDate: "01-02-2021",
          fromMonth:'',
          listOfMonths:[],
          dicMonth:{},
          currentComuna:'Arica',
          comunaNames:[],
          cases:{
            labels:[],
            comuna:{
              Arica:[],
            }
          },
          options:{
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            },
            legend: {
              display:false,
            },
            tooltips: {
              mode: 'index',
              intersect: false
            },   hover: {
              mode: 'index',
              intersect: false
            },
            responsive:true,
            maintainAspectRatio:false
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
          return{
            labels:this.cases.labels.slice(index),
            datasets:[
              {label:'', borderColor:'#dd4b39', backgroundColor:'#dd4b39', fill: false, data:this.cases.comuna[comuna].slice(index)},
            ]
          }}
        },
        async created(){
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

          casesComunas.forEach((comuna)=>{
            let allValues = Object.values(comuna).slice(5,-1).map(i => {return Number(i)})
            let valuesEachMonday = []
            allValues.forEach((d,index) =>{
              if(dayjs(allLabels[index],'DD-MM-YYYY').get("day")===1){
                valuesEachMonday.push(Math.round(d/comuna['Poblacion']*100000))
              }
            })
            this.cases.comuna[comuna['Comuna']] = derivate(valuesEachMonday)
          })

          this.comunaNames = Object.keys(this.cases.comuna).filter(comuna => !comuna.includes("Desconocido"))
          this.fromMonth = dayjs(this.fromDate, '01-MM-YYYY').format('MMMM YYYY')

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
        width:100%;
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
