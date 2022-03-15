<template>
  <div class="ChartChile">
    <div class="containerSection">
      <box-container>
        <title-container
          titleName='La pandemia de Covid-19 en Chile'
          :update='false'
        />
        <p class='description'>Sigue Covid es un visor que facilita el seguimiento y la visualización de la evolución de la pandemia de Covid-19 en Chile
          basado en <a
            href="https://www.minciencia.gob.cl/covid19/"
            target='_blank'
          >datos del Ministerio de Ciencia</a>.
          </p>
      </box-container>

        <box-container style='flex-direction:row; justify-content:space-evenly'>
      <twitter/>
      
      <!-- <apoyo/>  -->
</box-container>
      <!-- <box-container style="border:solid rgb(66,133,244,0.1) 2px;border-radius:10px;background-color:rgb(66,133,244,0.1)">
          <p style='font-size:1.2rem;font-weight:bold'>Puede apoyar Sigue Covid y los costes del servidor haciendo una <router-link to="/about"> donación </router-link> </p>
        </box-container> -->

      <div
        id='block_graph'
        v-if="dataCovid.vm.labels.length > 0"
      >
        <indicators
          v-if="dataCovid.deis.Chile.total.length > 0"
          :labels='dataCovid.labelsCases'
          :cases='dataCovid.ChileMeanCases'
          :positivity='dataCovid.ChilePos'
          :uci='dataCovid.ChileUci'
          :deaths='dataCovid.ChileTotalDeaths'
          :deathsDeis = dataCovid.deis.Chile.total
          type='epidemic'
          region='Chile'
        />
        <slide-bar
          v-if="fromMonth.length > 0"
          :listOfMonths='listOfMonths'
          :fromMonth='fromMonth'
          v-on:newdate='updateCurrentDate'
        />

        <charts-epidemic
          region="Chile"
          :fromDate="fromDate"
          :dataCovid="dataCovid"
        />
      
      <!-- <box-container>
      <title-graphic> Mapa de la incidencia en Chile </title-graphic>
      <map-chile />
      <signature />
      </box-container> -->


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
        <li> La media móvil de 7 días de una cantidad (casos, positividad...) del día n es la medía de la cantidad entre los días n y n-7. </li>
        <li>La variación semanal de casos se calcula a partir de la sucesión de medias móviles de 7 días de los nuevos casos M(1),...,M(i),... de la siguiente manera:
          (M(i+7)-M(i))/M(i)*100.
        </li>
        <li>
          La tasa de letalidad es el porcentaje de casos detectados con un test PCR o antigeno que fallecieron.
          Se estima aquí de la siguiente manera: 
                  (Media móvil 7 días de los muertos por Covid-19 (confirmados o sospechosos))/ (Media móvil 7 días de los casos detectados con un defase de 20 días)*100.
         Cuidado, la tasa de letalidad es una sobreestimación de la tasa de letalidad por infección que el porcentaje de casos reales (detectados o no) que fallecieron.

        </li>

        <!-- <li>
          La incidencia ajustada por edad se calcula  cada semana epidemiológica tomando como referencia la distribución de la edad sin esquema de vacunación completa.
          Para evitar grandes fluctuaciones estadísticas, la incidencia en un grupo de edad sólo se tiene en cuenta cuando la población de ese grupo de edad con un esquema de vacunación  es superior a 5.000. Recuerde que una semana epidemiológica comienza el domingo y termina el sábado. Cada fecha del gráfico corresponde a un sábado, es decir, a la incidencia del final de la semana.
        </li>

                <li>
Más información sobre el método de tramizaje utilizado para medir la efectividad de las vacunas <a href='https://github.com/AntoineBraultChile/bayesian-screening-method' target="_blank"> aquí</a>.        
</li> -->
      </ul>
      </p>

    </footer-indicators>
  </div>
</template>

<style src='../assets/chartChileAndRegion.css'></style>


<style lang="css" scoped>
h2{
  font-weight: normal;
}
.box-container {
  display: flex;
  align-items: center;
}
.ChartChile {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.description {
  font-size: 1.1rem;;
  text-align: justify;
  line-height: 150%;
  padding: 0px 10px 0px 10px;
}



/* @media all and (max-width: 1100px) {
  .description {
    font-size: 16px;
  }
} */
</style>

<script>
import { meanWeek, derivate, sumArray , removeSenselessValues, toTimeSerie} from "@/assets/mathFunctions";

import Indicators from "@/components/Indicators";
import ChartsEpidemic from "@/components/epidemic/ChartsEpidemic";
import TitleContainer from "@/components/TitleContainer";
import FooterIndicators from "@/components/FooterIndicators";
import SlideBar from "@/components/SlideBar";
import * as d3 from "d3-fetch";

// import MapChile from "@/components/maps/MapChile";


import * as dayjs from "dayjs";
var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);
import "dayjs/locale/es"; // load on demand
import BoxContainer from '../components/BoxContainer.vue';
// import ButtonChoice from '../components/ButtonChoice.vue';
// import { meanWeek } from '../assets/mathFunctions';
dayjs.locale("es"); // use Spanish locale globally

export default {
  name: "ChartChile",
  components: {
    "title-container": TitleContainer,
    indicators: Indicators,
    "charts-epidemic": ChartsEpidemic,
    // 'vue-slider': VueSlider,
    // 'bar-chart':BarChart,
    "slide-bar": SlideBar,
    "footer-indicators": FooterIndicators,
    "box-container":BoxContainer,
    // "button-choice": ButtonChoice,
        // "map-chile": MapChile,

  },
  metaInfo() {
    return {
      title:
        "Sigue Covid en Chile - Visualizador de la pandemia de Covid-19 y del proceso de vacunación en Chile y en las regiones",
      meta: [
        {
          name: "description",
          content: `Visor de los datos sobre la pandemia de Covid-19 en Chile. Encontra información actualizada diariamente sobre
              el número de  casos nuevos, pruebas de PCR,
              personas en  unidad de cuidados intensivos y fallecidos.`,
        },
        { name: "robots", content: "index,follow" },
      ],
    };
  },
  data() {
    return {
      populationChile: {
        // projection 2021 https://es.wikipedia.org/wiki/Anexo:Regiones_de_Chile_por_poblaci%C3%B3n
        Total: 19678363,
        Metropolitana: 8242459,
        Aysén: 107158,
        Antofagasta: 703534,
        "Arica y Parinacota": 255068,
        Atacama: 316168,
        Coquimbo: 848079,
        Araucanía: 1019548,
        "Los Lagos": 897708,
        "Los Ríos": 407837,
        Magallanes: 179533,
        Tarapacá: 391558,
        Valparaíso: 1979373,
        Ñuble: 514609,
        Biobío: 1670590,
        "O’Higgins": 1000959,
        Maule: 1143012,
      },
      dataCovid: {
        // incidenceByVaccinalSchemeByAge:{'week':[], 'cases':{'con esquema completo':{},'sin esquema completo':{}, 'con dosis refuerzo > 14 dias':{}},'uci':{'con esquema completo':{},'sin esquema completo':{}, 'con dosis refuerzo > 14 dias':{}},'deaths':{'con esquema completo':{},'sin esquema completo':{},  'con dosis refuerzo > 14 dias':{}}},
        // ve:{'cases':{}, 'uci':{}, 'deaths':{}},
        //         incidenceVaccinalAjustedByAge : {'cases':{}, 'uci':{} ,'deaths': {}},

        // incidenceCompleteVaccinalScheme:{'09-01-2021':0},
        // incidenceUncompleteVaccinalScheme:{'09-01-2021':0},
        // uciCompleteVaccinalScheme:{'09-01-2021':0},
        // uciUncompleteVaccinalScheme:{'09-01-2021':0},

        // labelsVariant:[],
        labelsIngresoUCI:[],
        labelsUci: [],
        labelsPcr: [],
        labelsCases: [],
        labelsDeaths: [],
        labelsAntigeno: [],
        labelsVaccine: [],
        // labelsPos:[],
        // ChileVariant:{},
        ChileIngresoUCI:[],
        ChileUci: [],
        ChilePcr: [],
        ChileCases: [],
        ChileDeaths: [],
        ChileTotalDeaths: [],
        ChileMeanCases: [],
        ChilePos: [],
        ChileAntigeno: [],
        ChileVaccine: {
          firstDoses: [],
          secondDoses: [],
        },
        incidence: {
          lastUpdate: [],
          Chile: {
            names: [],
            values: [],
            variations: [],
          },
        },
        pasoAPaso: {
          labels: [],
          fase1: [],
          fase2: [],
          fase3: [],
          fase4: [],
          fase5:[],
        },
        deis:{
          Chile:{
            labels:[],
            confirmed:[],
            suspected:[],
            mediaMovil:[],
            total:[],
          }
        },
        vm:{labels:[], vmi:[]},
        CFR:{labels:[], values: [] },
        hospitalization:{labels:[]},
        ingresoHospi:{labels:[]},
        casesAcc:{Chile:{labels:[],values:[], late:[],meanWeek:[]}}
      },
      fromDate: "01-02-2021",
      fromMonth: "",
      listOfMonths: [],
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
    // fetching data
    const getDataCsv = async (
      path,
      type,
      derivative,
      initializeMonths = false
    ) => {
      let data = await d3.csv(path);
      if (derivative == true) {
        this.dataCovid["labels" + type] = Object.keys(data[0])
          .slice(3 + 1)
          .map((d) => {
            return dayjs(d, "YYYY-MM-DD").format("DD-MM-YYYY");
          });
      } else {
        this.dataCovid["labels" + type] = Object.keys(data[0])
          .slice(3)
          .map((d) => {
            return dayjs(d, "YYYY-MM-DD").format("DD-MM-YYYY");
          });
      }

      if (initializeMonths == true) {
        let currentDate = dayjs("04-2020", "MM-YYYY");
        while (
          currentDate <
          dayjs(
            this.dataCovid.labelsUci[this.dataCovid.labelsUci.length - 1],
            "DD-MM-YYYY"
          )
        ) {
          this.listOfMonths.push(
            dayjs(currentDate, "MM-YYYY").format("MMMM YYYY")
          );
          currentDate = dayjs(currentDate, "MM-YYYY").add(1, "M");
        }
      }
      let chileValues = []; // the sum of the regional time series
      for (let index = 0; index < data.length; index++) {
        // if we ask the derivative of the time serie (use to convert cumulative time serie to daily time serie)
        if (derivative == true) {
          let dayCases = derivate(
            Object.values(data[index])
              .slice(3)
              .map((i) => Number(i))
          );
          chileValues = sumArray(chileValues, dayCases);
        } else {
          chileValues = sumArray(
            chileValues,
            Object.values(data[index])
              .slice(3)
              .map((i) => Number(i))
          );
        }
      }
      // chileValues = removeSenselessValues(chileValues);
      this.$set(this.dataCovid, "Chile" + type, chileValues);
      //   if (type =='Pcr'){
      //   return this.dataCovid['ChilePcr']
      // }
      return this.dataCovid["Chile" + type];
    };

    async function requests() {
      try {
        var getResults = await Promise.all([
          // d3.csv(
          //   "https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto3/CasosTotalesCumulativo.csv"
          // ),
          d3.csv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto13/CasosNuevosCumulativo.csv'),
          getDataCsv(
            "https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto7/PCR.csv",
            "Pcr",
            false,
            false
          ),
          d3.csv(
            "https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto14/FallecidosCumulativo.csv"
          ),
          getDataCsv(
            "https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto8/UCI.csv",
            "Uci",
            false,
            true
          ),
          getDataCsv(
            "https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto87/Ag.csv",
            "Antigeno",
            false,
            false
          ),
          // d3.csv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto87/Ag.csv')
        ]);
        return getResults;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }

    requests().then((data) => {
      // deaths
      this.dataCovid["labelsDeaths"] = Object.keys(data[2][0])
        .slice(3 + 1)
        .map((d) => {
          return dayjs(d, "YYYY-MM-DD").format("DD-MM-YYYY");
        });
      this.dataCovid.ChileTotalDeaths = Object.values(data[2][16])
        .slice(3)
        .map((i) => Number(i));
      let dayCases = derivate(
        Object.values(data[2][16])
          .slice(3)
          .map((i) => Number(i))
      );
      // dayCases = removeSenselessValues(dayCases,10);

      this.$set(this.dataCovid, "ChileDeaths", dayCases);
      this.$set(
        this.dataCovid,
        "LabelsMeanDeaths",
        Object.keys(data[2][0])
          .slice(3 + 1 + 7)
          .map((d) => {
            return dayjs(d, "YYYY-MM-DD").format("DD-MM-YYYY");
          })
      );
      this.$set(
        this.dataCovid,
        "ChileMeanDeaths",
        meanWeek(dayCases).map((d) => {
          return Math.round(d);
        })
      );

      // cases
      this.dataCovid["labelsCases"] = Object.keys(data[0][0])
        .slice(3 + 1)
        .map((d) => {
          return dayjs(d, "YYYY-MM-DD").format("DD-MM-YYYY");
        });
      // dayCases = derivate(
      //   Object.values(data[0][16])
      //     .slice(3)
      //     .map((i) => Number(i))
      // );
      dayCases = Object.values(data[0][16]).slice(3+1).map((i) => Number(i))
      dayCases = removeSenselessValues(dayCases);

      this.$set(this.dataCovid, "ChileCases", dayCases);
      this.$set(
        this.dataCovid,
        "LabelsMeanCases",
        Object.keys(data[0][0])
          .slice(3 + 1 + 7)
          .map((d) => {
            return dayjs(d, "YYYY-MM-DD").format("DD-MM-YYYY");
          })
      );
      this.$set(
        this.dataCovid,
        "ChileMeanCases",
        meanWeek(dayCases).map((d) => {
          return Math.round(d);
        })
      );
      


      // this.dataCovid.incidence.Chile.regionName
      this.dataCovid.incidence.lastUpdate.push(
        this.dataCovid["labelsCases"][this.dataCovid["labelsCases"].length - 1]
      );
      data[0].forEach((d) => {
        this.dataCovid.incidence.Chile.names.push(d["Region"]);
        let casesLast7days = Object.values(d)
          .slice(-7)
          .map((i) => Number(i));
          let incidence = Math.round(casesLast7days.reduce((acc,val)=> acc+val)/((this.populationChile[d["Region"]]))*100000)
        // incidence = Math.round(
        //   ((incidence.slice(-1)[0] - incidence[0]) /
        //     this.populationChile[d["Region"]]) *
        //     100000
        // );
        


        let casesLastWeeBefore = Object.values(d)
          .slice(-14, -7)
          .map((i) => Number(i));

        let incidenceWeekDayBefore = Math.round(casesLastWeeBefore.reduce((acc,val)=> acc+val)/((this.populationChile[d["Region"]]))*100000)
        this.dataCovid.incidence.Chile.values.push(incidence);
        this.dataCovid.incidence.Chile.variations.push(
          incidence - incidenceWeekDayBefore
        );
      });


      // mean UCI 
      // this.dataCovid['ChileMeanUci'] = meanWeek(this.dataCovid.ChileUci).map(i=> Math.round(i))
      // this.dataCovid['labelsMeanUci'] = this.dataCovid.labelsUci.slice(6)
      // const diff = this.dataCovid['ChileMeanCases'].length - this.dataCovid['ChileMeanUci'].length
      // for (let i = 0; i < diff; i++){
      //   this.dataCovid['ChileMeanUci'].unshift(undefined)
      // }


      // test Antigeno
      let antigeno = [];
      let count = 0;
      this.dataCovid["labelsPcr"].forEach((d) => {
        // console.log(this.dataCovid['labelsAntigeno'])
        if (!this.dataCovid["labelsAntigeno"].includes(d)) {
          antigeno.push(0);
        } else {
          antigeno.push(this.dataCovid["ChileAntigeno"][count]);
          count += 1;
        }
      });
      this.dataCovid["ChileAntigeno"] = antigeno;

      // compute the positivity
      let Cases = this.dataCovid["ChileCases"];
      let Pcr = this.dataCovid["ChilePcr"];
      let Ant = this.dataCovid["ChileAntigeno"];
      let Pos = [];
      for (let i = 0; i < Pcr.length; i++) {
        Pos.push(
          (Cases[Cases.length - i - 1] /
            (Pcr[Pcr.length - i - 1] + Ant[Ant.length - i - 1])) *
            100
        );
      }
      Pos = meanWeek(Pos.reverse()).map((d) => {
        return Math.round(d * 100) / 100;
      });
      const firstNullValues = [null,null,null,null,null,null]

      this.dataCovid.ChilePos = [...firstNullValues,...Pos];



      // update fromMonth
      this.fromMonth = dayjs(this.fromDate, "01-MM-YYYY").format("MMMM YYYY");
    });

    const casesAcc = await d3.csv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto3/CasosTotalesCumulativo.csv')
    this.dataCovid['casesAcc'] = {'labels':Object.keys(casesAcc[0]).slice(4).map(d => dayjs(d, 'YYYY-MM-DD').format('DD-MM-YYYY'))}
    casesAcc.forEach(d=>{
      if(d['Region']=='Total'){
      let region = d['Region'] == 'Total'? 'Chile':d['Region'] 
      let values = derivate(Object.values(d).slice(3).map(i=>Number(i)))
      let mean = meanWeek(values).map(i => Math.round(i))
      this.dataCovid.casesAcc[region] = {
      'values':values,
      'late':values.map((v,i)=> {return v-this.dataCovid['ChileCases'][i]}),
      'meanWeek':mean,
      'variation':derivate(mean)
      }
      }
    })

  

    // fetching vaccine by region
    const vaccine = await d3.csv(
      "https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto76/vacunacion.csv"
    );
    this.dataCovid.labelsVaccine = Object.keys(vaccine[0])
      .slice(2)
      .map((date) => dayjs(date, "YYYY-MM-DD").format("DD-MM-YYYY"));

    let firstDoses = [];
    let secondDoses = [];
    let uniqueDoses = [];
    let boostDoses = [];
        let fourthDoses = [];


    vaccine.forEach((region) => {
      if (region["Region"] == "Total") {
        if (region["Dosis"] == "Primera") {
          firstDoses = Object.values(region)
            .slice(2)
            .map((i) => Number(i));
        } else if (region["Dosis"] == "Segunda") {
          secondDoses = Object.values(region)
            .slice(2)
            .map((i) => Number(i));
        } else if (region["Dosis"] == "Unica") {
          uniqueDoses = Object.values(region)
            .slice(2)
            .map((i) => Number(i));
        } else if (region["Dosis"] == "Refuerzo"){
          boostDoses = Object.values(region)
            .slice(2)
            .map((i) => Number(i));
        } else if (region["Dosis"] == "Cuarta"){
          fourthDoses = Object.values(region)
            .slice(2)
            .map((i) => Number(i));
        } 
      }
    });

    this.dataCovid.ChileVaccine.firstDoses = sumArray(
      firstDoses,
      uniqueDoses
    ).map((d) => Math.round((d / this.populationChile["Total"]) * 1000) / 10);

    this.dataCovid.ChileVaccine.secondDoses = sumArray(
      secondDoses,
      uniqueDoses
    ).map((d) => Math.round((d / this.populationChile["Total"]) * 1000) / 10);

    this.dataCovid.ChileVaccine.boostDoses = boostDoses.map((d) => Math.round((d / this.populationChile["Total"]) * 1000) / 10);
    this.dataCovid.ChileVaccine.fourthDoses = fourthDoses.map((d) => Math.round((d / this.populationChile["Total"]) * 1000) / 10);

  // fetching DEIS deaths in Chile
  let deis = await d3.csv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto37/Defunciones_deis.csv')
  let deisLabels = Object.keys(deis.slice(-1)[0]).slice(3).map(d=> dayjs(d, "YYYY-MM-DD").format("DD-MM-YYYY")) 
  let deisConfirmed
  let deisSuspected
  deis.forEach(d => {
    if(d['Serie'] == 'confirmados'){
       deisConfirmed = Object.values(d).slice(3).map(i => Number(i))
    } else if (d['Serie'] == 'sospechosos'){
       deisSuspected = Object.values(d).slice(3).map(i => Number(i))
    }
  })
  let mediaMovilDeis = meanWeek(sumArray(deisConfirmed, deisSuspected)).map(d => Math.round(d))

  let deisConfirmedCumulative = deisConfirmed.reduce((tot,curent) => {return tot+curent})
  let deisSuspectedCumulative = deisSuspected.reduce((tot,curent) => {return tot+curent})
  let total = [deisConfirmedCumulative+ deisSuspectedCumulative]
  this.dataCovid.deis = {'Chile':{'labels':deisLabels, 'confirmed': deisConfirmed, 'suspected': deisSuspected, 'mediaMovil': mediaMovilDeis, 'total':total }}


   // ingreso UCI en chile
    const ingresoUCI = await d3.csv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto91/Ingresos_UCI.csv');

    this.dataCovid.labelsIngresoUCI = Object.keys(ingresoUCI[0]).slice(1).map(d =>   dayjs(d, "YYYY-MM-DD").format("DD-MM-YYYY"))
    this.dataCovid.ChileIngresoUCI = Object.values(ingresoUCI[0]).slice(1).map(i =>  Math.round(Number(i)))

       // ingreso hostpital
    const ingresoHospi = await d3.csv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto92/Ingresos_Hospital.csv')


    this.dataCovid['ingresoHospi']={
      labels : Object.keys(ingresoUCI[0]).slice(1).map(d => dayjs(d,'YYYY-MM-DD').format('DD-MM-YYYY')),
      hospi: Object.values(ingresoHospi[0]).slice(9).map(i=> Math.round(Number(i))),
      uci : Object.values(ingresoUCI[0]).slice(1).map(i =>  Math.round(Number(i)))
    }
    // console.log('ingreso UCI',ingresoUCI)
    // console.log('ingreso Hospi', ingresoHospi)
    //     console.log('ingreso UCI',Object.keys(ingresoUCI[0]).slice(-1)[0])
    // console.log('ingreso Hospi', Object.keys(ingresoHospi[0]).slice(-1)[0])
    // console.log(Object.keys(ingresoHospi[0]).slice(9))



    // mecanical ventilation
    const vm = await d3.csv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto30/PacientesVMI.csv')

    const vmi = vm[0] // invasive mecanical ventilation
    const noVm = vm[1] // not in mecanical ventilation
    const vmNotI = vm[2] // mecanical ventilation not invasive

    this.dataCovid.vm = {
      'labels': Object.keys(vmi).slice(1).map(d=> dayjs(d,'YYYY-MM-DD').format('DD-MM-YYYY')),  
      'vmi': Object.values(vmi).slice(1).map(i=>Number(i)),
      'noVm': Object.values(noVm).slice(1).map(i=>Number(i)),
      'vmNotI': Object.values(vmNotI).slice(1).map(i=>Number(i))
    }

      // hospitalization

    const hospitalization = await d3.csv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto24/CamasHospital_Diario.csv')
    this.dataCovid['hospitalization'] = {'labels': Object.keys(hospitalization[0]).slice(1).map(d => dayjs(d, 'YYYY-MM-DD').format('DD-MM-YYYY'))}
    hospitalization.forEach(d=>{
      this.dataCovid.hospitalization[d['Tipo de cama']] = Object.values(d).slice(1).map(i => Number(i))
    })


 

    // Case fatality rate in Chile
    let CFR = []
    let labelsCFR = []
    const delayCaseDeaths = 20;
    let timeSerieDeaths = toTimeSerie(deisLabels.slice(6),mediaMovilDeis)
    let timeSerieCases = toTimeSerie(this.dataCovid.labelsCases.slice(6), this.dataCovid.ChileMeanCases)
    Object.keys(timeSerieDeaths).forEach((label) => {
      const labelDelayed = dayjs(label,"DD-MM-YYYY").add(-delayCaseDeaths,"d").format("DD-MM-YYYY")
      // console.log(timeSerieDeaths[label])
      // console.log(timeSerieCases[labelDelayed])
      // if(timeSerieCases[labelDelayed]!=undefined){
      if(dayjs(label, "DD-MM-YYYY").isAfter(dayjs("30-04-2020","DD-MM-YYYY"))){
        labelsCFR.push(label)
        CFR.push(Math.round(timeSerieDeaths[label]/timeSerieCases[labelDelayed]*1000)/10)
      }
      })
    // mediaMovilDeis.forEach((_,index)=> CFR.unshift(mediaMovilDeis[mediaMovilDeis.length-index-1-delayCaseDeaths]/this.dataCovid.ChileMeanCases[this.dataCovid.ChileMeanCases.length-index-1]*100))
    this.dataCovid.CFR = {labels:labelsCFR.sort((a, b) => (dayjs(a,'DD-MM-YYYY').isAfter(dayjs(b, 'DD-MM-YYYY')) ? 1 : -1)), values: CFR }


    // plan paso a paso
    let paso = await d3.csv("https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto74/paso_a_paso.csv");
    let population = await d3.json("populationComunasChile.json");
    let pop = population["Poblacion 2021"];
    this.dataCovid.pasoAPaso.labels = Object.keys(paso[0])
      .slice(5)
      .map((d) => {
        return dayjs(d, "YYYY-MM-DD").format("DD-MM-YYYY");
      });
    let fase1 = new Array(this.dataCovid.pasoAPaso.labels.length).fill(0);
    let fase2 = new Array(this.dataCovid.pasoAPaso.labels.length).fill(0);
    let fase3 = new Array(this.dataCovid.pasoAPaso.labels.length).fill(0);
    let fase4 = new Array(this.dataCovid.pasoAPaso.labels.length).fill(0);
        let fase5 = new Array(this.dataCovid.pasoAPaso.labels.length).fill(0);

    paso.forEach((comuna) => {
      let comunaName = comuna["comuna_residencia"];
      let comunaValuesPasoAPaso = Object.values(comuna).slice(5);
      if (!(pop[comunaName] == undefined)) {
        comunaValuesPasoAPaso.forEach((value, index) => {
          if (value === "1") {
            fase1[Number(index)] += pop[comunaName];
          } else if (value === "2") {
            fase2[Number(index)] += pop[comunaName];
          } else if (value === "3") {
            fase3[Number(index)] += pop[comunaName];
          } else if (value === "4") {
            fase4[Number(index)] += pop[comunaName];
          }else if (value ==="5"){
            fase5[Number(index)] += pop[comunaName];
          }
        });
      }
    });

    this.dataCovid.pasoAPaso["fase1"] = fase1.map((value, index) => {
      return (
        Math.round(
          (value /
            (fase1[index] + fase2[index] + fase3[index] + fase4[index]+ fase5[index])) *
            1000
        ) / 10
      );
    });
    this.dataCovid.pasoAPaso["fase2"] = fase2.map((value, index) => {
      return (
        Math.round(
          (value /
            (fase1[index] + fase2[index] + fase3[index] + fase4[index]+fase5[index])) *
            1000
        ) / 10
      );
    });
    this.dataCovid.pasoAPaso["fase3"] = fase3.map((value, index) => {
      return (
        Math.round(
          (value /
            (fase1[index] + fase2[index] + fase3[index] + fase4[index]+fase5[index])) *
            1000
        ) / 10
      );
    });
    this.dataCovid.pasoAPaso["fase4"] = fase4.map((value, index) => {
      return (
        Math.round(
          (value /
            (fase1[index] + fase2[index] + fase3[index] + fase4[index]+fase5[index])) *
            1000
        ) / 10
      );
    });
        this.dataCovid.pasoAPaso["fase5"] = fase5.map((value, index) => {
      return (
        Math.round(
          (value /
            (fase1[index] + fase2[index] + fase3[index] + fase4[index]+fase5[index])) *
            1000
        ) / 10
      );
    });


    // all deaths
    const response = await fetch('https://raw.githubusercontent.com/AntoineBraultChile/deathsChile/main/output/deathsChileFrom2015.json')
    const deaths = await response.json()

// const years = ['2015','2016','2017','2018','2019','2020','2021']
    // let allDeathsChile={}
    // years.forEach(y =>{
    //   allDeathsChile[y]={}
    // })
    // deaths.forEach(d => {
    //   for(let y of years){
    //     let label = dayjs(y+'-'+d['date'], 'YYYY-MM-DD').format('DD-MM-YYYY')
    //     allDeathsChile[y][label] = Number(d[y])==0?undefined:Number(d[y])
    //   }
    // })
    const years = Object.keys(deaths['Chile'])
  
      let deathsGoodName = {'Chile':{}}
      years.forEach(y => {
        let february29 = deaths['Chile'][y].values[59]
        let deathsValues = deaths['Chile'][y].values.map(i=> Number(i))
        let meanValues = []
        if (isNaN(february29)){
          deathsValues.splice(59,1)
          meanValues = meanWeek(deathsValues).map(i => Math.round(i))
          meanValues.splice(59-6,0,NaN)
        } else {
          meanValues = meanWeek(deathsValues).map(i => Math.round(i))
        }
        deathsGoodName['Chile'][y] = {'labels':deaths['Chile'][y].labels.map(d => dayjs(d,'YYYY-MM-DD').format('DD-MM-YYYY')).slice(6),
         'values': meanValues}
      });
    //  deathsRGoodName[r] = deathsR[this.dicRegions[r]]

    this.dataCovid.allDeaths = deathsGoodName

},
};
</script>
