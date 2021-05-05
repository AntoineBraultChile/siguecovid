<template lang="html">
  <div class="ChartsEpidemic" >
    <div class='graph' v-if='dataCovid.labelsCases.length>0'>
      <title-graphic> {{title['Cases']}} en {{region}} </title-graphic>
      <update :labels="dataCovid.labelsCases"> </update>

      <bar-chart  :chartData="plotBarChartWithMean(region,'Cases')" :options="chartOptions('Cases')"> </bar-chart>
    </div>
    <div class='graph' v-if='dataCovid.labelsPcr.length>0'>
      <title-graphic> {{title['Pcr']}} en {{region}} </title-graphic>
      <update :labels="dataCovid.labelsPcr"> </update>

      <bar-chart  :chartData="getChartPosPcr(region)" :options="chartOptions('Pcr')"> </bar-chart>
    </div>
    <div class='graph' v-if='dataCovid.labelsUci.length>0'>
      <title-graphic> {{title['Uci']}} en {{region}} </title-graphic>
      <update :labels="dataCovid.labelsUci"> </update>
      <bar-chart  :chartData="plotBar(region,'Uci')" :options="chartOptions('Uci')"> </bar-chart>
    </div>
    <div class='graph' v-if='dataCovid.labelsDeaths.length>0'>
      <title-graphic> {{title['Deaths']}} en {{region}} </title-graphic>
      <update :labels="dataCovid.labelsDeaths"> </update>
      <bar-chart  :chartData="plotBarChartWithMean(region,'Deaths')" :options="chartOptions('Deaths')"> </bar-chart>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
moment.locale('es');

import BarChart from '../components/BarChart'
import Update from '../components/Update'


import TitleGraphic from '../components/TitleGraphic'
export default {
  name:'ChartsEpidemic',
  props:['region','fromDate','dataCovid'],
  components:{
    'bar-chart': BarChart,
    'update': Update,
    'title-graphic':TitleGraphic
  },
  data(){
    return{
      backgroundColor :{'Uci':'#dd4b39', 'Pcr':'#82CFFD', 'Cases':'#93DB70', 'Deaths': '#232b2b'},
      title:{'Uci':'Personas en unidad de cuidados intensivos por Covid-19',
      'Pcr':'Positividad y PCR en ',
      'Cases':'Casos',
      'Deaths': 'Fallecidos por Covid-19'
    }
  }
},
methods:{
  plotBar(name,type){
    let fromDate = this.fromDate
    // console.log(Math.max(this.dataCovid['labels'+type].reduce(function (a, b) { return a < b ? a : b; })))
    let indexDate = this.dataCovid['labels'+type].indexOf(fromDate)
    return {
      labels:this.dataCovid['labels'+type].filter((x) => { return moment(x,'DD-MM-YYYY') >= moment(fromDate,'DD-MM-YYYY')  }),
      datasets:[
        {label:this.title[type]+ ' en '+ name, backgroundColor:this.backgroundColor[type],fill: false, data:this.dataCovid[name+type].slice(indexDate)}]
      }
    },



    plotBarChartWithMean(name,type){
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
    chartOptions(type){
      let options={
        scales: {
          // xAxes: [{
          // type: 'time',
          // time: {
          //   unit: 'month',
          // tooltipFormat: 'D MMM, YYYY',
          // displayFormats: {'month': ' MMM YYYY'},
          // }
          // }],
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        },
        legend: {
          display:false,
        },
        responsive:true,
        maintainAspectRatio:false
      }
      if(type == 'Pcr'){
        options.scales ={
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

          }]}
        }
        if (type == 'Pcr' || type=='Cases' || type=='Deaths'){
          options.legend = {display:true}
        }
        return options
      },

    }
  }

  </script>

  <style lang="css" scoped>
  .ChartsEpidemic{
    width:100%;
    display:flex;
    flex-direction:row;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .graph{
    width:49.5%;
    margin:5px 0px 5px 0px;
    box-shadow: 0px 0px 2px 2px #e8e8e8;
    border-radius: 7px;
    background-color: white;
    padding:0px 0px 10px 0px;
  }

  @media all and (max-width: 1100px) {
    .graph{
      width:100%;
      margin:5px 0px 5px 0px;
    }
  }
  </style>
