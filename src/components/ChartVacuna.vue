<template>
  <div class="ChartVacuna">
    <div class="containerSection">
      <div class="titleContainer">

      <h1 id='slogan'>Avances de la campaña de vacunación contra el Covid-19 en Chile </h1>
      <p> Última actualización : {{update}}</p>

        <div class="optionsGraph">
          <!-- <choose-date :listOfMonths='listOfMonths' :fromDate='fromDate' v-on:newFromDate="changeFromDate"></choose-date> -->
        </div>
      </div>

    <div id='block_graph' class='d-flex flex-row flex-wrap justify-content-between' v-if="vacunaChile.labels.length > 0">
      <div class="optionDosis">
        <span class='dosis color1'> <span>{{this.vacunaChile['primera dosis'].slice(-1)[0]}}% con una dosis <span> (+{{Math.round((this.vacunaChile['primera dosis'].slice(-1)[0]-this.vacunaChile['primera dosis'].slice(-2)[0])*10)/10}}%)</span></span>  </span>
        <span class='dosis color2'> <span>{{this.vacunaChile['segunda dosis'].slice(-1)[0]}}% con dos dosis <span> (+{{Math.round((this.vacunaChile['segunda dosis'].slice(-1)[0]-this.vacunaChile['segunda dosis'].slice(-2)[0])*10)/10}}%)</span></span> </span>
      </div>
      <div class="optionDosis">
        <span class='dosis color1' > <span>{{this.vacunaChile['total primera dosis'][1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}} primera dosis <span> (+{{(this.vacunaChile['total primera dosis'][1]-this.vacunaChile['total primera dosis'][0]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}})</span></span> </span>
        <span class='dosis color2'> <span>{{this.vacunaChile['total segunda dosis'][1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") }} segunda dosis <span> (+{{(this.vacunaChile['total segunda dosis'][1]-this.vacunaChile['total segunda dosis'][0]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}})</span></span> </span>
      </div>
      <div class='wrapper'>
        <line-chart  :chartData="renderChartVacuna()" :options='options'> </line-chart>
      </div>
      <div class='wrapper'>
        <bar-chart  :chartData="renderChartVacunaPorDia()" :options='optionsPorDia'> </bar-chart>
      </div>
    </div>
</div>
  </div>
</template>

<style scoped>

.ChartVacuna{
  display:flex;
  align-items: center;
  justify-content: center;
  flex-direction:column;
}
.titleContainer{
  width:100%;
  box-shadow: 0px 0px 2px 2px #e8e8e8;
  border-radius: 7px;
  background-color: white;
  padding:15px 10px 0px 10px;
  margin-bottom:5px;
}

#slogan{
  font-size:25px;
}

.containerSection{
  /* width:80%; */
  max-width:1400px;
  padding:0px 10px 0px 10px;
  display:flex;
  align-items: center;
  justify-content: center;
  flex-direction:column;
}
.optionDosis{
  width:49%;
  display:flex;
  flex-direction:row;
  justify-content: space-around;
  align-items: space-around ;
}

.dosis{
  display:flex;
  justify-content:center;
  align-items:center;
  font-weight: bold;
  color:#2c3e50;
  border-radius:7px;
  padding: 5px 5px 5px 5px;
  margin-top:5px;
  margin-bottom:5px;
  margin-left:10px;
  margin-right:10px;
}
.color1{
  border: solid 1px rgb(130,207,253);
  background-color: rgb(130,207,253,0.4);
}
.color2{
  border: solid 1px rgb( 	235, 164, 52);
  background-color:rgb( 	235, 164, 52,0.4);
}

.optionsGraph{
  display:flex;
  flex-direction:row;
  justify-content: center;
}


.optionsGraph p{
  padding: 0px 20px 0px 20px;
}

.wrapper{
  width:49.4%;
  margin:5px 0px 5px 0px;

  /* box-shadow: 1px 1px 2px 2px #e8e8e8; */
  /* box-shadow: 0px 3px 8px #e8e8e8; */
  box-shadow: 0px 0px 2px 2px #e8e8e8;
  border-radius:7px;
  background-color: white;
  /* padding:10px 10px 10px 10px; */
  /* margin:5px 5px 5px 5px; */
  padding:0px 0px 10px 0px;

}

#block_graph{
  padding-left:0px;
  display:flex;
  justify-content: space-between;
  align-items: stretch;
}

@media all and (max-width: 1100px) {
  .containerSection{
    padding-left: 10px;
    padding-right: 10px;

  }
  .titleContainer{
    width:100%;
    margin:5px 20px 5px 20px;
  }
  .containerSection{
    width:100%;
  }
  #slogan{

    font-size:20px;

  }
  .dosis.color1{
    width:50%;
    margin:5px 5px 5px 0px;

}
.dosis.color2{
  width:50%;
  margin:5px 0px 5px 5px;
}
  .optionDosis{
    width:100%;
  }

  #block_graph{
    flex-direction:column;
    font-size:15px;


  }
  .wrapper{
    width:100%;
    margin:5px 0px 5px 0px;

    /* margin:10px 0px 10px 0px; */

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
import LineChart from './LineChart'
import * as d3 from 'd3-fetch'
import moment from 'moment';

// import ChooseDate from './ChooseDate'

export default {
  name:'ChartVacuna',
  components:{
    'line-chart': LineChart,
    'bar-chart': BarChart
    // 'choose-date': ChooseDate
  },
  metaInfo() {
       return {
           title: "Campaña de vacunación en Chile",
           meta: [
               { name: 'description', content: `Avances de la campaña de vacunación en Chile: proporción de la población chilena
               vacunada con una o dos dosis, numero de primera dosis y segunda sosis administrada cada dia y en total.`},
               {name: 'robots', content: 'index,follow'}
           ]
       }},
  data () {
    return{
      vacunaChile:{
        labels:[],
        'primera dosis':[],
        'segunda dosis':[],
        'primera dosis por dia':[],
        'segunda dosis por dia':[],
        'total primera dosis':'',
        'total segunda dosis':''
      },
      fromDate: "01-02-2021",
      listOfMonths:[],
      options:{
        scales: {
          yAxes: [{
            ticks: {
              callback: function(tick) {
                return tick.toString() + '%';
              }
            }
          }]
        },
        title:{
          display:true,
          text:'Proporción de la población chilena vacunada',
          fontSize:20
        },
        lineTension: 1,
        responsive:true,
        maintainAspectRatio:false
      },

      optionsPorDia:{
        title:{
          display:true,
          text:'Número de personas vacunadas cada dia',
          fontSize:20
        },
        responsive:true,
        maintainAspectRatio:false
      }
    }
  },
  methods:{
    changeFromDate(event){
      this.fromDate = moment(event.target.value, 'MMMM-YYYY').format('YYYY-MM-01')
    },
    renderChartVacuna(){
      let indexDate = this.vacunaChile.labels.indexOf(this.fromDate)
      return {
        labels:this.vacunaChile.labels.filter((x) => { return moment(x,'DD-MM-YYYY') >= moment(this.fromDate,'DD-MM-YYYY') }),
        datasets: [
          {
            label: "primera dosis",
             // borderColor: '#93DB70',
             // backgroundColor: '#93DB70',
            borderColor: '#82CFFD',
            backgroundColor: '#82CFFD',
            fill: false,
            data: this.vacunaChile["primera dosis"].slice(indexDate)
          },
          {
            label: "segunda dosis",
            // borderColor: '#dd4b39',
            // backgroundColor:'#dd4b39',
            borderColor: '#eba434',
            backgroundColor:'#eba434',
            fill: false,
            data: this.vacunaChile["segunda dosis"].slice(indexDate)
          }
        ]
      }
    },
    renderChartVacunaPorDia(){
      let indexDate = this.vacunaChile.labels.indexOf(this.fromDate)
      return {
        labels:this.vacunaChile.labels.filter((x) => { return  moment(x,'DD-MM-YYYY') >= moment(this.fromDate,'DD-MM-YYYY')}),
        datasets: [
          {
            label: "con primera dosis",
            backgroundColor: '#82CFFD',
            data: this.vacunaChile["primera dosis por dia"].slice(indexDate)
          },
          {
            label: "con segunda dosis",
            backgroundColor: '#eba434',
            data: this.vacunaChile["segunda dosis por dia"].slice(indexDate)
          }
        ]
      }
    }
  },
  computed:{
    update: function(){
      let now = new Date();
      now = moment(now).format("DD-MM-YYYY");
      let lastUpdate = moment(this.vacunaChile.labels[this.vacunaChile.labels.length-1], "DD-MM-YYYY").format("DD-MM-YYYY")
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
    d3.csv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto76/vacunacion.csv').then(data => {
      this.vacunaChile.labels = Object.keys(data[0]).slice(2).map(d =>  {return moment(d, "YYYY-MM-DD").format("DD-MM-YYYY")});
      Object.values(data[0]).slice(2).map(i => Number(i)).forEach(d => {this.vacunaChile['primera dosis'].push(Math.round(d/19000)/10)})
      this.vacunaChile['total primera dosis'] = Object.values(data[0]).slice(1).slice(-2).map(d=>{return Math.round(d)})
      Object.values(data[1]).slice(2).map(i => Number(i)).forEach(d =>{ this.vacunaChile['segunda dosis'].push(Math.round(d/19000)/10)})
      this.vacunaChile['total segunda dosis'] = Object.values(data[1]).slice(1).slice(-2).map(d=>{return Math.round(d)})

      derivate(Object.values(data[0]).slice(2).map(i => Number(i))).forEach((d)=> {this.vacunaChile['primera dosis por dia'].push(d)})
      derivate(Object.values(data[1]).slice(2).map(i => Number(i))).forEach((d)=>{ this.vacunaChile['segunda dosis por dia'].push(d)})
    })
    // return the derivative of an array
    function derivate(cumulativeValues){
      let derivative = []
      for ( let i=0; i < cumulativeValues.length-1;i++){
        derivative.push(cumulativeValues[i+1]-cumulativeValues[i])
      }
      return derivative;
    }
  }
}
</script>
