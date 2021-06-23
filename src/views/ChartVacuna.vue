<template>
  <div class="ChartVacuna">
    <div class="containerSection">
      <box-container>

        <title-container titleName='Avances de la campaña de vacunación contra el Covid-19 en Chile' />


      </box-container>

      <box-container class='explication'>
        <p style="font-size:1.2rem;max-width:800px;text-align:justify;line-height: 150%;margin:20px 20px 20px 20px">Actualmente hay cuatro vacunas autorizadas en Chile. Las vacunas de Sinovac, Pfizer y AstraZeneca
          requieren dos inyecciones, mientras que CanSino sólo requiere una. Se considerará que una persona está
          parcialmente vacunada si ha recibido sólo una dosis de Sinovac, Pfizer o AstraZeneca, y totalmente
           vacunada si ha recibido dos dosis o una dosis de CanSino.</p>
      </box-container>

      <div id='block_graph'  v-if="vacunaChile.labels.length > 0 && listOfMonths.length > 0">
        <indicators
          :labels="vacunaChile.labels"
          :cases="vacunaChile['primera dosis']"
          :positivity="vacunaChile['segunda dosis']"
          :uci="vacunaChile['total primera dosis']"
          :deaths="vacunaChile['total segunda dosis']"
          :colors='colorsIndicator'
          type='vaccin'
          />

          <slide-bar  :listOfMonths='listOfMonths' :fromMonth='fromMonth' v-on:newdate='updateCurrentDate'/>
            <div class='wrapper'>
              <title-graphic> Proporción de la población chilena vacunada</title-graphic>
              <update :labels="vacunaChile.labels"> </update>
              <line-chart  :chartData="renderChartVacuna()" :options="options('vertical')"> </line-chart>
            </div>

            <div class='wrapper'>
              <title-graphic> Número de personas vacunadas cada dia en Chile</title-graphic>
              <update :labels="vacunaChile.labels"> </update>
              <bar-chart  :chartData="renderChartVacunaPorDia()" :options='optionsPorDia'> </bar-chart>
            </div>

            <div class='wrapper'>
              <title-graphic> Personas con al menos una dosis por edad en Chile</title-graphic>
              <!-- <span style='font-size:1rem'> Estar parcialmente vacunado significa tener una dosis de Sinovac, Astra-Zeneca, Pfizer.</span> <br> -->
              <update :labels="vacunaChile.labels"> </update>
              <line-chart v-if="vacunaChile.labelsByAge.length > 0" :chartData="renderChileVaccineByAge('firstDosesByAgeGroup')" :options="options('vertical')"> </line-chart>
            </div>

            <div class='wrapper'>
              <title-graphic> Personas completamente vacunadas por edad en Chile</title-graphic>
              <!-- <span style='font-size:1rem'> Estar completamente vacunado significa tener dos dosis de Sinovac, Astra-Zeneca, Pfizer o una dosis de CanSino.</span> <br> -->
              <update :labels="vacunaChile.labels"> </update>
              <line-chart   v-if="vacunaChile.labelsByAge.length > 0" :chartData="renderChileVaccineByAge('secondDosesByAgeGroup')" :options="options('vertical')"> </line-chart>
            </div>

            <div class='wrapper'>
              <title-graphic> Personas parcialmente vacunadas cada día por tipo de vacuna en Chile</title-graphic>
              <update :labels="vaccineType.labels"> </update>
              <bar-chart  :chartData="renderChartTypeVaccine('first')" :options='optionsPorDia'> </bar-chart>
            </div>

            <div class='wrapper'>
              <title-graphic> Personas completamente vacunadas cada día por tipo de vacuna en Chile</title-graphic>
              <update :labels="vaccineType.labels"> </update>
              <bar-chart  :chartData="renderChartTypeVaccine('second')" :options='optionsPorDia'> </bar-chart>
            </div>

            <div class='wrapper'>
              <title-graphic> Proporción de cada tipo de vacuna utilizada en Chile</title-graphic>
              <span style='font-size:1rem'> Sólo se tienen en cuenta las personas totalmente vacunadas. </span> <br>
              <update :labels="vaccineType.labels"> </update>
              <doughnut-chart   v-if="vacunaChile.labelsByAge.length > 0" :chartData="renderChartDoughnut()" :options="optionsDoughnut"> </doughnut-chart>
              </div>

            <div class='wrapper'>
              <title-graphic> Proporción de población vacunada en las regiones de Chile</title-graphic>
              <update :labels="vacunaChile.labels"> </update>
                <horizontal-bar-chart   v-if="vacunaChile.labelsByAge.length > 0" :chartData="renderChartVacunaPorRegion()" :options="options('horizontal')"> </horizontal-bar-chart>
            </div>
          </div>

            <spinner size='massive' v-else ></spinner>

          </div>
          <footer-indicators>
            <p>
              Los datos vienen del repository github de <a href="https://github.com/juancri/covid19-vaccination">COVID-19 Vaccination (JC Olivares)</a> y
              del <a href="https://www.minciencia.gob.cl/covid19/">Ministerio de Ciencia, Technología, Conocimiento e Innovación</a>.
            </p>
            <p>
              Calculamos los porcentajes a partir de las proyecciones de población del <a href="https://www.ine.cl/docs/default-source/proyecciones-de-poblacion/cuadros-estadisticos/base-2017/ine_estimaciones-y-proyecciones-2002-2035_base-2017_region_base.csv?sfvrsn=1c01d705_8&download=true">INE</a> para el año 2021.
              Se calcula que la población chilena es de {{populationChile['Total']}}.
            </p>
          </footer-indicators>
        </div>

      </template>

      <style src='../assets/chartChileAndRegion.css'>
      </style>

    <style lang="css" scoped>
      .ChartVacuna{
        display:flex;
        align-items: center;
        justify-content: center;
        flex-direction:column;
      }

      .wrapper{
        width:49.4%;
        margin:5px 0px 5px 0px;
        box-shadow: 0px 0px 2px 2px #e8e8e8;
        border-radius:7px;
        background-color: white;
        padding:0px 0px 10px 0px;

      }
      .explication{
        display:flex;
        flex-direction:row;
        justify-content: center;
      }

      @media all and (max-width: 1100px) {

        .wrapper{
          width:100%;
          margin:5px 0px 5px 0px;
        }

      }
      </style>

      <script>
      import  {derivate, sumArray, order} from '@/assets/mathFunctions'
      import DoughnutChart from '../components/DoughnutChart'
      import LineChart from '../components/LineChart'
      import BarChart from '../components/BarChart'
      import HorizontalBarChart from '../components/HorizontalBarChart'
      import Update from '../components/Update'
      import TitleContainer from '@/components/TitleContainer'
      import Indicators from '@/components/Indicators'
      import TitleGraphic from '@/components/TitleGraphic'
      import FooterIndicators from '@/components/FooterIndicators'
      import SlideBar from '../components/SlideBar'

      import * as d3 from 'd3-fetch'

      import * as dayjs from 'dayjs'
      var customParseFormat = require('dayjs/plugin/customParseFormat')
      dayjs.extend(customParseFormat)
      import 'dayjs/locale/es' // load on demand
      dayjs.locale('es') // use Spanish locale globally

      export default {
        name:'ChartVacuna',
        components:{
          'line-chart': LineChart,
          'bar-chart': BarChart,
          'horizontal-bar-chart':HorizontalBarChart,
          'doughnut-chart':DoughnutChart,
          'title-container': TitleContainer,
          'title-graphic': TitleGraphic,
          'indicators':Indicators,
          'footer-indicators': FooterIndicators,
          'update':Update,
          'slide-bar':SlideBar,
          // 'choose-date': ChooseDate
        },
        metaInfo() {
          return {
            title: "Campaña de vacunación en Chile",
            meta: [
              { name: 'description', content: `Avances de la campaña de vacunación en Chile: proporción de la población chilena
              vacunada con una o dos dosis, numero de primera dosis y segunda sosis administrada cada dia y en total. Graficos de la proporción
              de la población vacunada por edad con una o dos dosis.`},
              {name: 'robots', content: 'index,follow'}
            ]
          }},
          data () {
            return{
              colorsIndicator:['blue', 'orange', 'blue', 'orange'],
              vaccineType:{
                labels:[],
                firstDoses:{
                  'Pfizer':[],
                  'Sinovac':[],
                  "AstraZeneca":[],
                  'CanSino':[],
                  proportion:[]
                },
                secondDoses:{
                  'Pfizer':[],
                  'Sinovac':[],
                  "AstraZeneca":[],
                  'CanSino':[],
                  proportion:[]
                }
              },
              vacunaRegions:{
                regionName:[],
                firstDoses:[],
                secondDoses:[]
              },
              populationChile:{ // projection 2021 https://es.wikipedia.org/wiki/Anexo:Regiones_de_Chile_por_poblaci%C3%B3n
                'Total':19678363,
                'Metropolitana':8242459,
                'Aysén':107158 ,
                'Antofagasta':703534 ,
                'Arica y Parinacota':316168 ,
                'Atacama':316168,
                'Coquimbo':848079 ,
                'Araucanía':1019548 ,
                'Los Lagos':897708 ,
                'Los Ríos':407837 ,
                'Magallanes':179533 ,
                'Tarapacá':391558 ,
                'Valparaíso':1979373 ,
                "Ñuble":514609 ,
                "Biobío":1670590 ,
                "O’Higgins":1000959 ,
                "Maule":1143012 ,

              },
              vacunaChile:{
                labels:[],
                'primera dosis':[],
                'segunda dosis':[],
                'primera dosis por dia':[],
                'segunda dosis por dia':[],
                'total primera dosis':'',
                'total segunda dosis':'',
                labelsByAge:[],
                populationByAge:{
                  '30':3614461, // 18 to 39
                  '40':3031451, // 40 to 49
                  '50':2618520,
                  '60':2369901,
                  '70':1804002,
                  '300':1544008
                },
                firstDosesByAgeGroup:{
                  '30':[],
                  '40':[],
                  '50':[],
                  '60':[],
                  '70':[],
                  '300' :[]
                },
                secondDosesByAgeGroup:{
                  '30':[],
                  '40':[],
                  '50':[],
                  '60':[],
                  '70':[],
                  '300' :[]
                },
                uniqueDosesByAgeGroup:{
                  '30':[],
                  '40':[],
                  '50':[],
                  '60':[],
                  '70':[],
                  '300' :[]
                }
              },
              fromDate: "01-02-2021",
              listOfMonths:[],
              optionsDoughnut:{
                tooltips: {
                  callbacks: {
                    label: function(tooltipItem, data) {
                      //get the concerned dataset
                      var dataset = data.datasets[tooltipItem.datasetIndex];
                      //calculate the total of this data set
                      var total = dataset.data.reduce(function(previousValue, currentValue) {
                        return previousValue + currentValue;
                      });
                      //get the current items value
                      var currentValue = dataset.data[tooltipItem.index];
                      //calculate the precentage based on the total and current item, also this does a rough rounding to give a whole number
                      // var percentage = Math.floor(((currentValue/total) * 100)+0.5);
                      var percentage = Math.round(currentValue/total*1000)/10 ;
                      return ' '+percentage + "%";
                    }
                  }
                },
                responsive:true,
                maintainAspectRatio:false
              },


              optionsPorDia:{
                animation: {
                  duration: 0
                },
                tooltips: {
                  mode: 'index',
                  intersect: true
                },
                hover: {
                  mode: 'index',
                  intersect: true
                },
                responsive:true,
                maintainAspectRatio:false,
                scales: {
                  xAxes: [{
                    stacked: true,
                  }],
                  yAxes: [{
                    stacked: true
                  }]
                },
              },
            }
          },
          methods:{
            options(position){
              let opt ={
                animation: {
                  duration: 0
                },
              scales: {
                yAxes: [{
                  ticks: {
                    beginAtZero: true,

                    callback: function(tick) {
                      return tick.toString() + '%';
                    }
                  }
                }]
              },
              tooltips: {
                mode: 'index',
                intersect: true
              },
               hover: {
                mode: 'index',
                intersect: true
              },
              lineTension: 1,
              responsive:true,
              maintainAspectRatio:false
            }
            if (position=='horizontal'){
              opt['scales']={
                xAxes: [{
                  ticks: {
                    beginAtZero: true,
                    callback: function(tick) {
                      return tick.toString() + '%';
                    }
                  }
                }]
              }
            }else if (position=='vertical'){
              opt['scales']={
                yAxes: [{
                  ticks: {
                    callback: function(tick) {
                      return tick.toString() + '%';
                    }
                  }
                }]
              }
            }
            return opt
          },
            updateCurrentDate(payload){
              this.fromMonth = payload
              this.fromDate = dayjs(payload, 'MMMM YYYY').format('01-MM-YYYY')
            },
            renderChartDoughnut(){
              return{
                labels: [
                  'AstraZeneca',
                  'Pfizer',
                  'Sinovac',
                  'CanSino',
                ],
                datasets: [{
                  label: 'My First Dataset',
                  data: this.vaccineType.secondDoses.proportion,
                  backgroundColor: [
                    '#eba434',
                    '#82CFFD',
                    '#f87979',
                    '#93DB70',
                  ],
                  hoverOffset: 4
                }]
              }
            },
            renderChartTypeVaccine(doses){
              let indexDate = this.vaccineType.labels.indexOf(this.fromDate)
              let datasets = [
                {
                  label: "Pfizer",
                  backgroundColor: '#82CFFD',
                  data: (doses=='first') ? this.vaccineType.firstDoses['Pfizer'].slice(indexDate): this.vaccineType.secondDoses['Pfizer'].slice(indexDate)
                },
                {
                  label: "Sinovac",
                  backgroundColor: '#f87979',
                  data: (doses=='first') ? this.vaccineType.firstDoses['Sinovac'].slice(indexDate): this.vaccineType.secondDoses['Sinovac'].slice(indexDate)
                },
                {
                  label: "AstraZeneca",
                  backgroundColor: '#eba434',
                  data: (doses=='first')? this.vaccineType.firstDoses['AstraZeneca'].slice(indexDate): this.vaccineType.secondDoses['AstraZeneca'].slice(indexDate)
                },

              ]
              if(doses=='second'){
                datasets.push({
                  label: "CanSino",
                  backgroundColor: '#93DB70',
                  data: this.vaccineType.secondDoses['CanSino'].slice(indexDate)
                })
              }
              return {
                labels:this.vaccineType.labels.filter((x) => {return  dayjs(x,'DD-MM-YYYY') >= dayjs(this.fromDate,'DD-MM-YYYY')}),
                datasets: datasets
              }
            },
            renderChartVacuna(){
              let indexDate = this.vacunaChile.labels.indexOf(this.fromDate)
              return {
                labels:this.vacunaChile.labels.filter((x) => { return dayjs(x,'DD-MM-YYYY') >= dayjs(this.fromDate,'DD-MM-YYYY') }),
                datasets: [
                  {
                    label: "al menos una dosis",
                    borderColor: '#82CFFD',
                    backgroundColor: '#82CFFD',
                    fill: false,
                    data: this.vacunaChile["primera dosis"].slice(indexDate)
                  },
                  {
                    label: "completamente",
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
                labels:this.vacunaChile.labels.filter((x) => {return  dayjs(x,'DD-MM-YYYY') >= dayjs(this.fromDate,'DD-MM-YYYY')}).slice(1),
                datasets: [
                  {
                    label: "primera dosis",
                    backgroundColor: '#82CFFD',
                    data: this.vacunaChile["primera dosis por dia"].slice(indexDate)
                  },
                  {
                    label: "única o segunda dosis",
                    backgroundColor: '#eba434',
                    data: this.vacunaChile["segunda dosis por dia"].slice(indexDate)
                  }
                ]
              }
            },
            renderChartVacunaPorRegion(){
              return {
                labels:this.vacunaRegions.regionName,
                datasets: [
                  {
                    label: "con al menos una dosis",
                    backgroundColor: '#82CFFD',
                    data: this.vacunaRegions.firstDoses
                  },
                  {
                    label: "completamente",
                    backgroundColor: '#eba434',
                    data: this.vacunaRegions.secondDoses
                  }
                ]
              }
            },
            renderChileVaccineByAge(dosesType){
              let indexDate = this.vacunaChile.labelsByAge.indexOf(this.fromDate)

              return {
                labels: this.vacunaChile.labelsByAge.filter((x) => { return  dayjs(x,'DD-MM-YYYY') >= dayjs(this.fromDate,'DD-MM-YYYY')}),
                datasets: [
                  {
                    label: "18-29",
                    borderColor: '#82CFFD',
                    backgroundColor:'#82CFFD',
                    // borderColor: '#845EC2',
                    // backgroundColor:'#845EC2',
                    fill: false,
                    data: this.vacunaChile[dosesType]["30"].slice(indexDate)
                  },
                  {
                    label: "30-39",
                    borderColor: '#eba434',
                    backgroundColor:'#eba434',
                    fill: false,
                    data: this.vacunaChile[dosesType]["40"].slice(indexDate)
                  },
                  {
                    label: '40-49',
                    borderColor: '#93DB70',
                    backgroundColor: '#93DB70',
                    fill: false,
                    data: this.vacunaChile[dosesType]['50'].slice(indexDate)
                  },
                  {
                    label: '50-59',
                    borderColor: '#f87979',
                    backgroundColor: '#f87979',
                    fill: false,
                    data: this.vacunaChile[dosesType]['60'].slice(indexDate)
                  },
                  {
                    label: '60-69',
                    borderColor: '#845EC2',
                    backgroundColor:'#845EC2',
                    fill: false,
                    data: this.vacunaChile[dosesType]['70'].slice(indexDate)
                  },
                  {
                    label:  ">=70",
                    borderColor: '#232b2b',
                    backgroundColor:  '#232b2b',
                    fill: false,
                    data: this.vacunaChile[dosesType]["300"].slice(indexDate)
                  }
                ]
              }
            },
          },

          async created(){
            // fromDate 3 months before today
            this.fromDate = dayjs().subtract(3, 'month').format('01-MM-YYYY')

            // fetching datas vaccination first and second doses in Chile
            let  data = await d3.csv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto76/vacunacion.csv')
            // let  data = await d3.csv('https://raw.githubusercontent.com/juancri/covid19-vaccination/master/output/chile-vaccination.csv')
            let firstDoses = []
            let secondDoses = []
            let uniqueDoses = []
            data.forEach(d => {
              (!this.vacunaRegions.regionName.includes(d['Region']))?this.vacunaRegions.regionName.push(d['Region']):'';
              let value = Math.round(Object.values(d).slice(-1)[0]/this.populationChile[d['Region']]*1000)/10;
              if(d['Dosis']=='Primera'){
                firstDoses.push(value)
              }else if(d['Dosis']=='Segunda'){
                secondDoses.push(value)
              }else if (d['Dosis']=='Unica'){
                uniqueDoses.push(value)
              }
              // (d['Dosis']=='Primera' )?this.vacunaRegions.firstDoses.push(value):this.vacunaRegions.secondDoses.push(value);
            })
            this.vacunaRegions.firstDoses = sumArray(firstDoses,uniqueDoses)
            this.vacunaRegions.secondDoses = sumArray(secondDoses,uniqueDoses)

            // order percentage vaccined by region
            let [labelsSort, firstDosesSort] = order(this.vacunaRegions.regionName, this.vacunaRegions.firstDoses)
            let secondDosesSort = []
            firstDosesSort.forEach(value =>{
              let index = this.vacunaRegions.firstDoses.indexOf(value)
              secondDosesSort.push(this.vacunaRegions.secondDoses[index])
            })
            this.vacunaRegions.regionName = labelsSort
            this.vacunaRegions.firstDoses = firstDosesSort
            this.vacunaRegions.secondDoses = secondDosesSort

            // time serie vacuna Chile
            this.vacunaChile.labels = Object.keys(data[0]).slice(2).map(d =>  {return dayjs(d, "YYYY-MM-DD").format("DD-MM-YYYY")});
            let firstDosesChile = []
            let secondDosesChile = []
            let uniqueDosesChile = []
            Object.values(data[0]).slice(2).map(i => Number(i)).forEach(d => {firstDosesChile.push(d)})
            Object.values(data[1]).slice(2).map(i => Number(i)).forEach(d =>{ secondDosesChile.push(d)})
            Object.values(data[2]).slice(2).map(i => Number(i)).forEach(d =>{ uniqueDosesChile.push(d)})
            this.vacunaChile['primera dosis'] = sumArray(firstDosesChile,uniqueDosesChile).map(d => Math.round(d/this.populationChile['Total']*1000)/10)
            this.vacunaChile['segunda dosis'] = sumArray(secondDosesChile,uniqueDosesChile).map(d => Math.round(d/this.populationChile['Total']*1000)/10)
            this.vacunaChile['total primera dosis'] = sumArray(firstDosesChile,uniqueDosesChile).slice(1).slice(-2)
            this.vacunaChile['total segunda dosis'] = sumArray(secondDosesChile,uniqueDosesChile).slice(1).slice(-2)
            this.vacunaChile['primera dosis por dia'] = derivate(firstDosesChile)
            this.vacunaChile['segunda dosis por dia'] = derivate(sumArray(secondDosesChile,uniqueDosesChile))

            // feching data vaccination by age in chile
            const [firstDosesByAge, secondDosesByAge, uniqueDosesByAge] = await Promise.all([
              d3.csv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto78/vacunados_edad_fecha_1eraDosis.csv'),
              d3.csv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto78/vacunados_edad_fecha_2daDosis.csv'),
              d3.csv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto78/vacunados_edad_fecha_UnicaDosis.csv')])

              this.vacunaChile.labelsByAge  = Object.keys(firstDosesByAge[0]).slice(1).map(d =>  {return dayjs(d, "YYYY-MM-DD").format("DD-MM-YYYY")})
              let ageGroup =['16']
              Object.keys(this.vacunaChile.firstDosesByAgeGroup).forEach(d => ageGroup.push(d))

              let getVaccinByAge = async  (dosis, typeDosis)=> {
                dosis.map((data)=>{
                  for (let i=0; i < ageGroup.length-1 ;i++){
                    if (Number(ageGroup[i]) <= Number(data.Edad) && Number(data.Edad) < Number(ageGroup[i+1])){
                      // let cumulSum =[]
                      // Object.values(data).slice(1).map(i => Number(i)).reduce(function(a,b,i) { return cumulSum[i] = a+b; },0);
                      // console.log(this.vacunaChile["firstDosesByAgeGroup"])
                      this.vacunaChile[typeDosis][ageGroup[i+1]] = sumArray(this.vacunaChile[typeDosis][ageGroup[i+1]],   Object.values(data).slice(1).map(i => (i=="")?0:Number(i)))
                    }
                  } })
                  for (let i=0; i < ageGroup.length-1 ;i++){
                    let cumulSum =[]
                    this.vacunaChile[typeDosis][ageGroup[i+1]].reduce(function(a,b,j) { return cumulSum[j] = a+b; },0);
                    this.vacunaChile[typeDosis][ageGroup[i+1]]=cumulSum
                    this.vacunaChile[typeDosis][ageGroup[i+1]] = cumulSum.map(d => {return Math.round(d/this.vacunaChile.populationByAge[ageGroup[i+1]]*1000)/10})
                  }
                }

                getVaccinByAge(firstDosesByAge, "firstDosesByAgeGroup")
                getVaccinByAge(secondDosesByAge, "secondDosesByAgeGroup")
                getVaccinByAge(uniqueDosesByAge, "uniqueDosesByAgeGroup")

                // add unique doses and second doses in second doses
                Object.keys(this.vacunaChile.firstDosesByAgeGroup).forEach(age =>{
                  this.vacunaChile['firstDosesByAgeGroup'][age] = sumArray(this.vacunaChile['uniqueDosesByAgeGroup'][age], this.vacunaChile['firstDosesByAgeGroup'][age]).map(i=>Math.round(i*10)/10)
                  this.vacunaChile['secondDosesByAgeGroup'][age] = sumArray(this.vacunaChile['uniqueDosesByAgeGroup'][age], this.vacunaChile['secondDosesByAgeGroup'][age]).map(i=>Math.round(i*10)/10)
                })

                // function to generate list of months
                let generateListOfMonths  =  async (labels) => {
                  let currentDate = dayjs('02-2021', 'MM-YYYY')
                  let listOfMonths =[]
                  while(currentDate < dayjs(labels[labels.length-1],'DD-MM-YYYY')){
                    listOfMonths.push(currentDate.format('MMMM YYYY'))
                    currentDate = dayjs(currentDate,'MM-YYYY').add(1,'M')
                  }
                  return listOfMonths
                }
                this.listOfMonths =   await generateListOfMonths(this.vacunaChile.labels)
                this.fromMonth = dayjs(this.fromDate, '01-MM-YYYY').format('MMMM YYYY')


                // // vaccine type
                // // let vaccineType = await d3.csv('https://raw.githubusercontent.com/juancri/covid19-vaccination/master/output/chile-vaccination-type.csv')
                // let vaccineType = await d3.csv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto76/fabricante.csv')
                // this.vaccineType.labels = Object.keys(vaccineType[0]).slice(2).map(d =>  {return dayjs(d, "YYYY-MM-DD").format("DD-MM-YYYY")})
                // vaccineType.forEach(d=>{
                //   if(d['Dosis']=='Primera' && d['Fabricante']!='Total'){
                //     this.vaccineType.firstDoses.proportion.push(Number(Object.values(d).slice(-1)[0]))
                //     this.vaccineType.firstDoses[d['Fabricante']] = derivate(Object.values(d).slice(2).map(i => {return Number(i)}));
                //   } else if (d['Dosis']=='Segunda' && d['Fabricante']!='Total'){
                //     this.vaccineType.secondDoses.proportion.push(Number(Object.values(d).slice(-1)[0]))
                //     this.vaccineType.secondDoses[d['Fabricante']] = derivate(Object.values(d).slice(2).map(i => {return Number(i)}));
                //   }
                // })
                // let sum = this.vaccineType.firstDoses.proportion.reduce((total, element)=> {return total+element})
                // this.vaccineType.firstDoses.proportion = this.vaccineType.firstDoses.proportion.map(d=>{return Math.round(d/sum*1000)/10})
                // sum = this.vaccineType.secondDoses.proportion.reduce((total, element)=> {return total+element})
                // this.vaccineType.secondDoses.proportion = this.vaccineType.secondDoses.proportion.map(d=>{return Math.round(d/sum*1000)/10})


                // vaccine type
                let vaccineTypeFirstDoses = await d3.csv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto83/vacunacion_fabricantes_1eraDosis.csv')
                let vaccineTypeSecondDoses = await d3.csv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto83/vacunacion_fabricantes_2daDosis.csv')
                let vaccineTypeUniqueDoses = await d3.csv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto83/vacunacion_fabricantes_UnicaDosis.csv')
                this.vaccineType.labels = Object.keys(vaccineTypeFirstDoses[0]).slice(1).map(d =>  {return dayjs(d, "YYYY-MM-DD").format("DD-MM-YYYY")})

                vaccineTypeFirstDoses.forEach(d=>{
                  if(d['Fabricante']!='CanSino'){
                  this.vaccineType.firstDoses.proportion.push(Object.values(d).slice(1).map(i=>Number(i)).reduce((total, element)=> total+element))
                  this.vaccineType.firstDoses[d['Fabricante']] = Object.values(d).slice(1).map(i => {return Number(i)});
                }
                })

                vaccineTypeSecondDoses.forEach(d=>{
                  if(d['Fabricante']!='CanSino'){
                  this.vaccineType.secondDoses.proportion.push(Object.values(d).slice(1).map(i=>Number(i)).reduce((total, element)=> total+element))
                  this.vaccineType.secondDoses[d['Fabricante']] = Object.values(d).slice(1).map(i => {return Number(i)});
                }
                })

                vaccineTypeUniqueDoses.forEach(d=>{
                  if(d['Fabricante']=='CanSino'){
                    this.vaccineType.secondDoses.proportion.push(Object.values(d).slice(1).map(i=> Number(i)).reduce((total, element)=> total+element))
                    this.vaccineType.secondDoses[d['Fabricante']] = Object.values(d).slice(1).map(i => {return Number(i)});
                  }
                })

                let sum = this.vaccineType.firstDoses.proportion.reduce((total, element)=> {return total+element})
                this.vaccineType.firstDoses.proportion = this.vaccineType.firstDoses.proportion.map(d=>{return Math.round(d/sum*1000)/10})
                sum = this.vaccineType.secondDoses.proportion.reduce((total, element)=> {return total+element})
                this.vaccineType.secondDoses.proportion = this.vaccineType.secondDoses.proportion.map(d=>{return Math.round(d/sum*1000)/10})
              }
            }
            </script>
