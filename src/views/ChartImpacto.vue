<template>
  <div class="ChartImpacto">
    <div class="containerSection">
      <box-container>
                  <title-container
          titleName='Impacto de la campaña de vacunación en la pandemia de Covid-19 en Chile'
          :update='false'/>

      <p class="two-columns">
        Una persona tiene un esquema completo de vacunación 14 días después de una segunda dosis o una dosis única. Los gráficos deben interpretarse teniendo en cuenta que puede
        haber sesgos significativos. De hecho, la cobertura de vacunación y las tasas de infección no son uniformes en toda la población. La situación económica, el lugar de residencia y los factores
        de riesgo de Covid-19 son variables importantes para medir adecuadamente la eficacia de la vacunación. Por el momento, sólo la estratificación por edad está disponible en los datos abiertos.
      </p>
      
      </box-container>

      <div id='block_graph'  v-if="dataCovid.ve.cases.vaccinated != undefined">
      <!--   <slide-bar
          v-if="fromMonth.length > 0"
          :listOfMonths='listOfMonths'
          :fromMonth='fromMonth'
          v-on:newdate='updateCurrentDate'
        /> -->

         <div class="graph" v-if="Object.keys(dataCovid.incidenceVaccinalAjustedByAge.cases).length > 0">
      <chart-incidence-adjusted-by-age
        :fromDate="fromDate"
        :dataCovid="dataCovid"
        :backgroundColor="backgroundColor"
        :pointRadius="pointRadius"
        :colorsPasoAPaso="colorsPasoAPaso"
      />
    </div>

    <div class="graph" >
      <chart-incidence-by-age
        :fromDate="fromDate"
        :dataCovid="dataCovid"
        :backgroundColor="backgroundColor"
        :pointRadius="pointRadius"
        :colorsPasoAPaso="colorsPasoAPaso"
      />
    </div>

    <div class="graph" v-if="dataCovid.ve.cases.vaccinated != undefined">
      <chart-vaccine-effectiveness
        :fromDate="fromDate"
        :dataCovid="dataCovid"
        :backgroundColor="backgroundColor"
        :pointRadius="pointRadius"
        :colorsPasoAPaso="colorsPasoAPaso"
      />
    </div>


      </div>
      <spinner
        size='massive'
        v-else
      ></spinner>
    </div>
    <footer-indicators>
      <p>
        Como se calculan los indicatores :
      <ul>

        <li>
          La incidencia ajustada por edad se calcula  cada semana epidemiológica tomando como referencia la distribución de la edad sin esquema de vacunación completa.
          Para evitar grandes fluctuaciones estadísticas, la incidencia en un grupo de edad sólo se tiene en cuenta cuando la población de ese grupo de edad con un esquema de vacunación  es superior a 5.000. Recuerde que una semana epidemiológica comienza el domingo y termina el sábado. Cada fecha del gráfico corresponde a un sábado, es decir, a la incidencia del final de la semana.
        </li>

                <li>
Más información sobre el método de tamizaje utilizado para medir la efectividad de las vacunas <a href='https://github.com/AntoineBraultChile/bayesian-screening-method' target="_blank"> aquí</a>.        
</li>
        <!-- <li> El número de muertes corresponde únicamente al número de muertes confirmadas por la prueba PCR. El <a href="https://deis.minsal.cl/">Departamento de Estadiscticas e Informacion de Salud</a>
          da el número de fallecidos por Covid-19 sospechosos. </li> -->
      </ul>
      </p>

    </footer-indicators>
  </div>
</template>


<style src='../assets/chartChileAndRegion.css'></style>




<script>
import TitleContainer from "@/components/TitleContainer";
import FooterIndicators from "@/components/FooterIndicators";
// import SlideBar from "@/components/SlideBar";
import * as d3 from "d3-fetch";

import * as dayjs from "dayjs";
var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);
import "dayjs/locale/es"; // load on demand
dayjs.locale("es"); // use Spanish locale globally

import ChartIncidenceByAge from "@/components/ChartIncidenceByAge";
import ChartIncidenceAdjustedByAge from "@/components/ChartIncidenceAdjustedByAge";
import ChartVaccineEffectiveness from "@/components/ChartVaccineEffectiveness";

export default {
  name: "ChartImpacto",
  components: {
    "title-container": TitleContainer,
    // 'vue-slider': VueSlider,
    // 'bar-chart':BarChart,
    // "slide-bar": SlideBar,
    "footer-indicators": FooterIndicators,

    "chart-incidence-adjusted-by-age": ChartIncidenceAdjustedByAge,
    "chart-incidence-by-age": ChartIncidenceByAge,
    "chart-vaccine-effectiveness": ChartVaccineEffectiveness,
  },
  metaInfo() {
    return {
      title:
        "Impacto de la campaña de vacunación en la pandemia de Covid-19 en Chile",
      meta: [
        {
          name: "description",
          content: `Incidence ajustada por edad y por esquema de vacunación y efectividad de las vacunas en Chile.`,
        },
        { name: "robots", content: "index,follow" },
      ],
    };
  },
  data() {
    return {
      dataCovid: {
        incidenceByVaccinalSchemeByAge:{'week':[], 'cases':{'con esquema completo':{},'sin esquema completo':{}, 'con dosis refuerzo > 14 dias':{}},'uci':{'con esquema completo':{},'sin esquema completo':{}, 'con dosis refuerzo > 14 dias':{}},'deaths':{'con esquema completo':{},'sin esquema completo':{},  'con dosis refuerzo > 14 dias':{}}},
        ve:{'cases':{}, 'uci':{}, 'deaths':{}},
        incidenceVaccinalAjustedByAge : {'cases':{}, 'uci':{} ,'deaths': {}} 
      },
      fromDate: "01-02-2021",
      fromMonth: "",
      listOfMonths: [],
      pointRadius: 1.5,
      pointHoverRadius: 4,
      colorsPasoAPaso: {
        1: "#dd4b39",
        2: "#eba434",
        3: "#82CFFD",
        4: "#93DB70",
      },
      backgroundColor: {
        Uci: "#dd4b39",
        Pcr: "#82CFFD",
        Cases: "#93DB70",
        Deaths: "#232b2b",
      },
    };
  },
  methods: {
    updateCurrentDate(payload) {
      this.fromMonth = payload;
      this.fromDate = dayjs(payload, "MMMM YYYY").format("01-MM-YYYY");
    },
  },
  async created() {
    // fromDate 3 months before today
    this.fromDate = dayjs().subtract(3, "month").format("01-MM-YYYY");

  // --------------------------------   incidence by vaccinated or non-vaccinated groups and by age ---------------------
  let incidenceByAgeByVaccinalScheme = await d3.dsv(',', 'https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto89/incidencia_en_vacunados_edad.csv')
  let numberWeekEpidemiological = incidenceByAgeByVaccinalScheme.length
  // console.log(incidenceByAgeByVaccinalScheme)
    // dictionary between epidemiological week and date in 2021
    // each epidemiogical week start sunday and finish saturday
    let dicEpiWeek = {1:'09-01-2021'}
    let k = 1
    while(k < numberWeekEpidemiological){
      dicEpiWeek[k+1] = dayjs(dicEpiWeek[k], "DD-MM-YYYY").add(7, "d").format("DD-MM-YYYY")
      k+=1
    }

  let saturdaySemana = dicEpiWeek[Number(incidenceByAgeByVaccinalScheme.slice(-1)[0]['semana_epidemiologica'])]
  let sundaySemana = dayjs(saturdaySemana, "DD-MM-YYYY").add(-6, "d").format("DD-MM-YYYY")

  let incidenceCasesByVaccinalScheme = {'con esquema completo':{},'sin esquema completo':{}, 'con dosis refuerzo > 14 dias':{} }
  let incidenceUciByVaccinalScheme = {'con esquema completo':{},'sin esquema completo':{},'con dosis refuerzo > 14 dias':{} }
  let incidenceDeathsByVaccinalScheme = {'con esquema completo':{},'sin esquema completo':{},'con dosis refuerzo > 14 dias':{} }

  incidenceByAgeByVaccinalScheme.forEach(d => {
    if(d['grupo_edad']!='Total' & d['grupo_edad']!='06 - 11 años'){
    incidenceCasesByVaccinalScheme[d['estado_vacunacion']][d['grupo_edad']] = Math.round(Number(d['incidencia_casos'])*100)/100
    incidenceUciByVaccinalScheme[d['estado_vacunacion']][d['grupo_edad']] = Math.round(Number(d['incidencia_uci'])*100)/100
    incidenceDeathsByVaccinalScheme[d['estado_vacunacion']][d['grupo_edad']] = Math.round(Number(d['incidencia_def'])*100)/100
    }
  })
  this.dataCovid.incidenceByVaccinalSchemeByAge["cases"] = incidenceCasesByVaccinalScheme
  this.dataCovid.incidenceByVaccinalSchemeByAge["uci"] = incidenceUciByVaccinalScheme
  this.dataCovid.incidenceByVaccinalSchemeByAge["deaths"] = incidenceDeathsByVaccinalScheme
  this.dataCovid.incidenceByVaccinalSchemeByAge['week'] = [sundaySemana, saturdaySemana]
  
  
    // --------------------------------   incidence cases, UCI, deaths by vaccination status ajusted by age ---------------------
  // let incidenceByAgeByVaccinalScheme = await d3.dsv(',', 'https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto89/incidencia_en_vacunados_edad.csv')
  // console.log(incidenceByAgeByVaccinalScheme)
  const firstEpidemiologicalWeek = Number(incidenceByAgeByVaccinalScheme[0]['semana_epidemiologica'])
  const lastEpidemiologicalWeek = Number(incidenceByAgeByVaccinalScheme.slice(-1)[0]['semana_epidemiologica'])
  let listWeek = []
  for (let i = firstEpidemiologicalWeek ;i <= lastEpidemiologicalWeek; i++){
    listWeek.push(String(i))
  }
  // console.log(listWeek)

  const vaccinalStatus = ['con esquema completo','sin esquema completo','con dosis refuerzo > 14 dias']
  const ageGroup = ['12 - 20 años', '21 - 30 años', '31 - 40 años', '41 - 50 años', '61 - 70 años', '61 - 70 años', '80 años o más']
  let incidenceAjustedCases = {'con esquema completo':{},'sin esquema completo':{},'con dosis refuerzo > 14 dias':{}}
  let incidenceAjustedUCI = {'con esquema completo':{},'sin esquema completo':{},'con dosis refuerzo > 14 dias':{}}
  let incidenceAjustedDeaths = {'con esquema completo':{},'sin esquema completo':{},'con dosis refuerzo > 14 dias':{}}
  for (let v of vaccinalStatus){
    for (let w of listWeek){
      let data = incidenceByAgeByVaccinalScheme.filter(obj =>  {return obj['semana_epidemiologica'] === w && obj['estado_vacunacion'] === v})
      let dataRef = incidenceByAgeByVaccinalScheme.filter(obj =>  {return obj['semana_epidemiologica'] === w && obj['estado_vacunacion'] === 'sin esquema completo'})
      if(data.length > 0){
        let totalPopulationRef = 0
        dataRef.forEach(d =>{
          if (ageGroup.includes(d['grupo_edad'])){
            totalPopulationRef += Number(d['poblacion'])
          }
        })
        let incidenceCases = 0
        let incidenceUCI = 0
        let incidenceDeaths = 0
        for (let a of ageGroup){       
          let dataAge = data.find(obj => obj.grupo_edad === a)
          let dataAgeRef = dataRef.find(obj => obj.grupo_edad === a)
          if (Number(dataAge['poblacion']) > 5000){
            incidenceCases += Number(dataAge['incidencia_casos']) *  Number(dataAgeRef['poblacion']) / totalPopulationRef
            incidenceUCI += Number(dataAge['incidencia_uci']) *  Number(dataAgeRef['poblacion']) / totalPopulationRef
            incidenceDeaths += Number(dataAge['incidencia_def']) *  Number(dataAgeRef['poblacion']) / totalPopulationRef
          }
        }
        incidenceAjustedCases[v][dicEpiWeek[w]] = Math.round(incidenceCases*100)/100
        incidenceAjustedUCI[v][dicEpiWeek[w]] = Math.round(incidenceUCI*100)/100
        incidenceAjustedDeaths[v][dicEpiWeek[w]] = Math.round(incidenceDeaths*100)/100
      }else{
        incidenceAjustedCases[v][dicEpiWeek[w]] = undefined
        incidenceAjustedUCI[v][dicEpiWeek[w]] = undefined
        incidenceAjustedDeaths[v][dicEpiWeek[w]] = undefined
      }
    }
  }
this.dataCovid.incidenceVaccinalAjustedByAge = {'cases':incidenceAjustedCases, 'uci':incidenceAjustedUCI ,'deaths': incidenceAjustedDeaths} 

//  vaccine effectivness
let ve = await d3.csv('https://raw.githubusercontent.com/AntoineBraultChile/bayesian-screening-method/main/output/estimation-VE-by-week.csv')

let veCases = {'vaccinated':{},'boost':{}}
let veUCI = {'vaccinated':{},'boost':{}}
let veDeaths = {'vaccinated':{},'boost':{}}

ve.forEach(d =>{
  veCases[d['vaccinal_status']][dicEpiWeek[d['week']]] = {'mean':Math.round(d['ve_cases']*100)/100, 'lb':Math.round(d['ve_cases_lb']*100)/100, 'ub':Math.round(d['ve_cases_ub']*100)/100}
  veUCI[d['vaccinal_status']][dicEpiWeek[d['week']]] =  {'mean':Math.round(d['ve_icu']*100)/100, 'lb':Math.round(d['ve_icu_lb']*100)/100, 'ub':Math.round(d['ve_icu_ub']*100)/100}
  veDeaths[d['vaccinal_status']][dicEpiWeek[d['week']]] = {'mean':Math.round(d['ve_deaths']*100)/100, 'lb':Math.round(d['ve_deaths_lb']*100)/100, 'ub':Math.round(d['ve_deaths_ub']*100)/100}
})
this.dataCovid['ve'] = {'cases':veCases, 'uci':veUCI, 'deaths':veDeaths}


//     // function to generate list of months
//     let generateListOfMonths = async (labels) => {
//       let currentDate = dayjs("08-2021", "MM-YYYY");
//       let listOfMonths = [];
//       while (currentDate < dayjs(labels[labels.length - 1], "DD-MM-YYYY")) {
//         listOfMonths.push(currentDate.format("MMMM YYYY"));
//         currentDate = dayjs(currentDate, "MM-YYYY").add(1, "M");
//       }
//       return listOfMonths;
//     };
//     this.listOfMonths = await generateListOfMonths(Object.keys(this.dataCovid.incidenceVaccinalAjustedByAge.cases['sin esquema completo']));

// // update fromMonth
// this.fromMonth = dayjs(this.fromDate, "01-MM-YYYY").format("MMMM YYYY");

},
};
</script>
<style >

h2{
  font-weight: normal;
}
.box-container {
  display: flex;
  align-items: center;
}
.ChartImpacto {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.description {

  font-size: 20px;
  text-align: justify;
  line-height: 150%;
  padding: 0px 10px 0px 10px;
}

.ChartsEpidemic {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}
.horizontalBar {
  width: 200px;
  height: 4000px;
}
.graph {
  width: 49.65%;
  margin: 5px 0px 5px 0px;
  box-shadow: 0px 0px 2px 2px #e8e8e8;
  border-radius: 7px;
  background-color: white;
  padding: 0px 0px 10px 0px;
}

.two-columns {
  display: inline-block;
  column-count: 2;
  font-size: 1.1rem;

  text-align: justify;
  line-height: 150%;
  padding: 0px 10px 0px 10px;
}

@media all and (max-width: 1100px) {
    .graph {
    width: 100%;
    margin: 5px 0px 5px 0px;
  }

  .two-columns {
    column-count: 1;
  }
  .description {
    font-size: 16px;
  }
}
</style>