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
          >datos del Ministerio de Ciencia</a>.</p>
      </box-container>

      <div
        id='block_graph'
        v-if="dataCovid.labelsCases.length > 0"
      >
        <indicators
          v-if="dataCovid.labelsUci.length > 0"
          :labels='dataCovid.labelsCases'
          :cases='dataCovid.ChileMeanCases'
          :positivity='dataCovid.ChilePos'
          :uci='dataCovid.ChileUci'
          :deaths='dataCovid.ChileTotalDeaths'
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
        <li> El número de muertes corresponde únicamente al número de muertes confirmadas por la prueba PCR. El <a href="https://deis.minsal.cl/">Departamento de Estadiscticas e Informacion de Salud</a>
          da el número de fallecidos por Covid-19 sospechosos. </li>
      </ul>
      </p>

    </footer-indicators>
  </div>
</template>


<style src='../assets/chartChileAndRegion.css'></style>


<style >
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

  font-size: 20px;
  text-align: justify;
  line-height: 150%;
  padding: 0px 10px 0px 10px;
}

@media all and (max-width: 1100px) {
  .description {
    font-size: 16px;
  }
}
</style>

<script>
import { meanWeek, derivate, sumArray , removeSenselessValues} from "@/assets/mathFunctions";

import Indicators from "@/components/Indicators";
import ChartsEpidemic from "@/components/ChartsEpidemic";
import TitleContainer from "@/components/TitleContainer";
import FooterIndicators from "@/components/FooterIndicators";
import SlideBar from "@/components/SlideBar";
import * as d3 from "d3-fetch";

import * as dayjs from "dayjs";
var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);
import "dayjs/locale/es"; // load on demand
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
        incidenceByVaccinalSchemeByAge:{'week':[], 'cases':{'con esquema completo':{},'sin esquema completo':{}},'uci':{'con esquema completo':{},'sin esquema completo':{}},'deaths':{'con esquema completo':{},'sin esquema completo':{}}},
        incidenceCompleteVaccinalScheme:{'09-01-2021':0},
        incidenceUncompleteVaccinalScheme:{'09-01-2021':0},
        uciCompleteVaccinalScheme:{'09-01-2021':0},
        uciUncompleteVaccinalScheme:{'09-01-2021':0},
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
        },
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
      chileValues = removeSenselessValues(chileValues);
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
      dayCases = removeSenselessValues(dayCases,10);

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
        return Math.round(d * 10) / 10;
      });
      const firstNullValues = [null,null,null,null,null,null]

      this.dataCovid.ChilePos = [...firstNullValues,...Pos];



      // update fromMonth
      this.fromMonth = dayjs(this.fromDate, "01-MM-YYYY").format("MMMM YYYY");
    });



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

    // ---------- incidence by vaccinated or non-vaccinated groups --------------------
    let incidenceVaccinated = await d3.csv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto90/incidencia_en_vacunados.csv')
    const numberWeekEpidemiological = incidenceVaccinated.length

    // dictionary between epidemiological week and date in 2021
    // each epidemiogical week start sunday and finish saturday
    let dicEpiWeek = {1:'09-01-2021'}
    let k = 1
    while(k < numberWeekEpidemiological){
      dicEpiWeek[k+1] = dayjs(dicEpiWeek[k], "DD-MM-YYYY").add(7, "d").format("DD-MM-YYYY")
      k+=1
    }
    const saturdayEpiWeek = Object.values(dicEpiWeek).map(i=> String(i))


    // compute vaccinated by epidemiological week

    let completeVaccinalSchemeByEpiWeek = {} // two dosis + two weeks or unica dosis + two weeks
    let uncompleteVaccinalSchemeByEpiWeek = {} // others
    
    saturdayEpiWeek.forEach(date => {
      const index = this.dataCovid.labelsVaccine.indexOf(date)
       if(index>= 28){
         completeVaccinalSchemeByEpiWeek[date] = secondDoses[index-14]+ uniqueDoses[index-28]
         uncompleteVaccinalSchemeByEpiWeek[date] = this.populationChile['Total'] - completeVaccinalSchemeByEpiWeek[date]
       }else if(index>= 14){
        completeVaccinalSchemeByEpiWeek[date] = secondDoses[index-14]
        uncompleteVaccinalSchemeByEpiWeek[date] = this.populationChile['Total'] - completeVaccinalSchemeByEpiWeek[date]
       }
       else {
        completeVaccinalSchemeByEpiWeek[date] = 0
        uncompleteVaccinalSchemeByEpiWeek[date] = this.populationChile['Total'] - completeVaccinalSchemeByEpiWeek[date]
       }
    })

    let incidenceCompleteVaccinalScheme = {}
    let incidenceUncompleteVaccinalScheme = {}
    let uciCompleteVaccinalScheme = {}
    let uciUncompleteVaccinalScheme = {}
    let fallecidosCompleteVaccinalScheme = {}
    let fallecidosUncompleteVaccinalScheme = {}

    incidenceVaccinated.forEach(d =>{
      let date = dicEpiWeek[Number(d['semana_epidemiologica'])]
      incidenceCompleteVaccinalScheme[date] = (Number(d['dos_dosis_comp_casos'])+Number(d['dosis_unica_comp_casos']))/completeVaccinalSchemeByEpiWeek[date]*100000
      incidenceUncompleteVaccinalScheme[date] =(Number(d['dos_dosis_casos'])+Number(d['dosis_unica_casos'])+Number(d['una_dosis_casos'])+ Number(d['sin_vac_casos']))/uncompleteVaccinalSchemeByEpiWeek[date]*100000
      uciCompleteVaccinalScheme[date] = (Number(d['dos_dosis_comp_uci'])+Number(d['dosis_unica_comp_uci']))/completeVaccinalSchemeByEpiWeek[date]*100000
      uciUncompleteVaccinalScheme[date] =(Number(d['dos_dosis_uci'])+Number(d['dosis_unica_uci'])+Number(d['una_dosis_uci'])+Number(d['sin_vac_uci']))/uncompleteVaccinalSchemeByEpiWeek[date]*100000
      fallecidosCompleteVaccinalScheme[date] = (Number(d['dos_dosis_comp_fall'])+Number(d['dosis_unica_comp_fall']))/completeVaccinalSchemeByEpiWeek[date]*100000
      fallecidosUncompleteVaccinalScheme[date] =(Number(d['dos_dosis_fall'])+Number(d['dosis_unica_fall'])+Number(d['una_dosis_fall'])+ Number(d['sin_vac_fall']))/uncompleteVaccinalSchemeByEpiWeek[date]*100000
    })

    this.dataCovid["incidenceCompleteVaccinalScheme"] = incidenceCompleteVaccinalScheme
    this.dataCovid['incidenceUncompleteVaccinalScheme'] = incidenceUncompleteVaccinalScheme
    this.dataCovid["uciCompleteVaccinalScheme"] = uciCompleteVaccinalScheme
    this.dataCovid['uciUncompleteVaccinalScheme'] = uciUncompleteVaccinalScheme
    this.dataCovid["fallecidosCompleteVaccinalScheme"] = fallecidosCompleteVaccinalScheme
    this.dataCovid['fallecidosUncompleteVaccinalScheme'] = fallecidosUncompleteVaccinalScheme


  // ---------------------------------------------------------------------------------------


  // // --------------------------------   incidence by by vaccinated or non-vaccinated groups and by age ---------------------
  let incidenceByAgeByVaccinalScheme = await d3.csv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto89/incidencia_en_vacunados_edad.csv')
  let saturdaySemana = dicEpiWeek[Number(incidenceByAgeByVaccinalScheme.slice(-1)[0]['semana_epidemiologica'])]
  let sundaySemana = dayjs(saturdaySemana, "DD-MM-YYYY").add(-6, "d").format("DD-MM-YYYY")

  let incidenceCasesByVaccinalScheme = {'con esquema completo':{},'sin esquema completo':{} }
  let incidenceUciByVaccinalScheme = {'con esquema completo':{},'sin esquema completo':{} }
  let incidenceDeathsByVaccinalScheme = {'con esquema completo':{},'sin esquema completo':{} }

  incidenceByAgeByVaccinalScheme.forEach(d => {
    if(d['grupo_edad']!='Total'){
    incidenceCasesByVaccinalScheme[d['estado_vacunacion']][d['grupo_edad']] = Number(d['incidencia_casos'])
    incidenceUciByVaccinalScheme[d['estado_vacunacion']][d['grupo_edad']] = Number(d['incidencia_uci'])
    incidenceDeathsByVaccinalScheme[d['estado_vacunacion']][d['grupo_edad']] = Number(d['incidencia_def'])
    }
  })

  this.dataCovid.incidenceByVaccinalSchemeByAge["cases"] = incidenceCasesByVaccinalScheme
  this.dataCovid.incidenceByVaccinalSchemeByAge["uci"] = incidenceUciByVaccinalScheme
  this.dataCovid.incidenceByVaccinalSchemeByAge["deaths"] = incidenceDeathsByVaccinalScheme
  this.dataCovid.incidenceByVaccinalSchemeByAge['week'] = [sundaySemana, saturdaySemana]

  // -------------------------------------------------------------------------------------------

    // ingreso UCI en chile
    const ingresoUCI = await d3.csv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto91/Ingresos_UCI.csv');

    this.dataCovid.labelsIngresoUCI = Object.keys(ingresoUCI[0]).slice(1).map(d =>   dayjs(d, "YYYY-MM-DD").format("DD-MM-YYYY"))
    this.dataCovid.ChileIngresoUCI = Object.values(ingresoUCI[0]).slice(1).map(i =>  Number(i))

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
          }
        });
      }
    });

    this.dataCovid.pasoAPaso["fase1"] = fase1.map((value, index) => {
      return (
        Math.round(
          (value /
            (fase1[index] + fase2[index] + fase3[index] + fase4[index])) *
            1000
        ) / 10
      );
    });
    this.dataCovid.pasoAPaso["fase2"] = fase2.map((value, index) => {
      return (
        Math.round(
          (value /
            (fase1[index] + fase2[index] + fase3[index] + fase4[index])) *
            1000
        ) / 10
      );
    });
    this.dataCovid.pasoAPaso["fase3"] = fase3.map((value, index) => {
      return (
        Math.round(
          (value /
            (fase1[index] + fase2[index] + fase3[index] + fase4[index])) *
            1000
        ) / 10
      );
    });
    this.dataCovid.pasoAPaso["fase4"] = fase4.map((value, index) => {
      return (
        Math.round(
          (value /
            (fase1[index] + fase2[index] + fase3[index] + fase4[index])) *
            1000
        ) / 10
      );
    });
  },

  
};
</script>
