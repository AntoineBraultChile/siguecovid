<template>
  <div class="ChartRegion">
    <div class="containerSection">
      <box-container>

        <title-container
          titleName='La pandemia de Covid-19 en las regiones de Chile'
          :update='false'
        />
      </box-container>

        <box-container style='flex-direction:row; justify-content:space-evenly'>
      <twitter/><apoyo/> 
</box-container>

      <region-choice
        :currentRegion='currentRegion'
        :regionName='regionName'
        v-on:new-region="changeCurrentRegion"
        v-if='regionName.length>0'
      />

      <div
        id='block_graph'
        v-if="this.dataCovid.deis['Metropolitana'] != undefined"
      >

        <indicators v-if="this.dataCovid.deis['Metropolitana'] != undefined"
          :labels="dataCovid['labelsCases']"
          :cases="dataCovid[currentRegion+'MeanCases']"
          :positivity="dataCovid[currentRegion+'Pos']"
          :uci="dataCovid[currentRegion+'Uci']"
          :deaths="dataCovid[currentRegion+'TotalDeaths']"
          :deathsDeis="this.dataCovid.deis[currentRegion].total"
          type='epidemic'
          :region='currentRegion'
        />
        <slide-bar
          v-if="fromMonth.length > 0"
          :listOfMonths='listOfMonths'
          :fromMonth='fromMonth'
          v-on:newdate='updateCurrentDate'
        />

        <charts-epidemic
          :region="currentRegion"
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

<script>
import Indicators from "@/components/Indicators";
import ChartsEpidemic from "@/components/epidemic/ChartsEpidemic";
import TitleContainer from "@/components/TitleContainer";
import FooterIndicators from "@/components/FooterIndicators";
import SlideBar from "@/components/SlideBar";

import RegionChoice from "@/components/RegionChoice";

import { meanWeek, derivate} from "@/assets/mathFunctions";

import * as d3 from "d3-fetch";

import * as dayjs from "dayjs";
var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);
import "dayjs/locale/es"; // load on demand
import { sumArray } from "../assets/mathFunctions";
dayjs.locale("es"); // use Spanish locale globally

export default {
  name: "ChartRegions",
  components: {
    "charts-epidemic": ChartsEpidemic,
    "title-container": TitleContainer,
    indicators: Indicators,
    "slide-bar": SlideBar,
    "region-choice": RegionChoice,
    "footer-indicators": FooterIndicators,
  },
  metaInfo() {
    return {
      title: "Evolución de la pandemia de Covid-19 en las regiones de Chile",
      meta: [
        {
          name: "description",
          content: `Graficos y indicatores de los casos nuevos, positividad, numero de test Pcr, numero de personas actualmente en unidad de cuidados intensivos,
            fallecidos en las regiones de Chile `,
        },
        { name: "robots", content: "index,follow" },
      ],
    };
  },
  data() {
    return {
      currentRegion: "Metropolitana",
      regionName: [],
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
      dicRegions:{
        Metropolitana: "Metropolitana de Santiago",
        Aysén: "Aysén del General Carlos Ibáñez del Campo",
        Antofagasta: "Antofagasta",
        "Arica y Parinacota": "Arica y Parinacota",
        Atacama: "Atacama",
        Coquimbo: "Coquimbo",
        Araucanía: "La Araucanía",
        "Los Lagos": "Los Lagos",
        "Los Ríos":  "Los Ríos",
        Magallanes: "Magallanes y de la Antártica Chilena",
        Tarapacá: "Tarapacá",
        Valparaíso: "Valparaíso",
        Ñuble: "Ñuble",
        Biobío: "Biobío",
        "O’Higgins": "Libertador General Bernardo O'Higgins",
        Maule: "Maule",

      },
      dicRegions2:{
        Metropolitana: "Metropolitana",
        Aysen:"Aysén",
        Antofagasta:"Antofagasta",
       "Arica y Parinacota": "Arica y Parinacota",
        Atacama: "Atacama",
        Coquimbo:"Coquimbo",
        "La Araucania": "Araucanía",
        "Los Lagos": "Los Lagos",
        "Los Rios": "Los Ríos",
        "Magallanes y la Antartica":"Magallanes",
        Tarapaca:"Tarapacá",
        Valparaiso: "Valparaíso",
       Nuble: "Ñuble",
        Biobio:"Biobío",
        "Del Libertador General Bernardo O’Higgins": "O’Higgins",
        Maule: "Maule",

      },
      dataCovid: {
        labelsUci: [],
        labelsPcr: [],
        labelsCases: [],
        labelsDeaths: [],
        labelsAntigeno: [],
        labelsVaccine: [],
        MetropolitanaUci: [],
        MetropolitanaPcr: [],
        MetropolitanaCases: [],
        MetropolitanaDeaths: [],
        MetropolitanaMeanCases: [],
        MetropolitanaPos: [],
        MetropolitanaAntigeno: [],
        MetropolitanaVaccine: {
          // unica dosis are in both first and second doses
          firstDoses: [],
          secondDoses: [],
        },
        casesAcc:{Metropolitana:{labels:[],values:[], late:[],meanWeek:[]}},

        incidence: {
          lastUpdate: [],
          Metropolitana: {
            names: [],
            values: [],
            variations: [],
          },
        },
        pasoAPaso: {},
        deis:{}
      },
      fromDate: "01-02-2021",
      fromMonth: "",
      listOfMonths: [],
    };
  },
  methods: {
    // variationCases(region){
    //   return Math.round(-(1-this.dataCovid[region+'MeanCases'].slice(-1)[0]/this.dataCovid[region+'MeanCases'].slice(-8)[0])*1000)/10;
    // },
    changeCurrentRegion(payload) {
      this.currentRegion = payload.target.value;
    },
    // changeFromDate(event){
    //   this.fromDate = dayjs(event.target.value, 'MMMM-YYYY').format('01-MM-YYYY')
    // },
    updateCurrentDate(payload) {
      this.fromMonth = payload;
      this.fromDate = dayjs(payload, "MMMM YYYY").format("01-MM-YYYY");
    },
  },

  async created() {
    // fromDate 3 months before today
    this.fromDate = dayjs().subtract(3, "month").format("01-MM-YYYY");

    //fetching data
    const getDataCsv = async (
      path,
      type,
      derivative,
      initializeRegionName = false,
      initializeMonths = false,
      mean = false
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
        generateListOfMonths();
      }

      // get data for each region
      for (let index = 0; index < data.length; index++) {
        if (
          initializeRegionName == true &&
          data[index].Region != undefined &&
          data[index].Region != "Total"
        ) {
          this.regionName.push(data[index].Region);
        }
        if (type == "Deaths") {
          this.$set(
            this.dataCovid,
            data[index].Region + "TotalDeaths",
            Object.values(data[index]).map((i) => Number(i))
          );
        }
        // if we ask the derivative of the time serie (use to convert cumulative time serie to daily time serie)
        if (derivative == true) {
          let dayCases = derivate(
            Object.values(data[index])
              .slice(3)
              .map((i) => Number(i))
          );
          // dayCases = removeSenselessValues(dayCases,100);
          this.$set(this.dataCovid, data[index].Region + type, dayCases);
          // chileValues = sumArray(chileValues,dayCases)
          if (mean == true) {
            this.$set(
              this.dataCovid,
              data[index].Region + "Mean" + type,
              meanWeek(dayCases).map((d) => {
                return Math.round(d);
              })
            );
          }
        } else {
          let values = Object.values(data[index])
              .slice(3)
              .map((i) => Number(i))
          this.$set(
            this.dataCovid,
            data[index].Region + type,values
            
          );

          if (mean == true) {
            this.$set(
              this.dataCovid,
              data[index].Region + "Mean" + type,
              meanWeek(values).map((d) => {
                return Math.round(d);
              })
            );
          }
        }
      }
      if (type == "Cases" || type == "Pcr" || type == "Antigeno") {
        return this.dataCovid;
      }
    };

    // function to generate list of months
    let generateListOfMonths = () => {
      let currentDate = dayjs("04-2020", "MM-YYYY");
      while (
        currentDate <
        dayjs(
          this.dataCovid.labelsCases[this.dataCovid.labelsCases.length - 1],
          "DD-MM-YYYY"
        )
      ) {
        this.listOfMonths.push(currentDate.format("MMMM YYYY"));
        currentDate = dayjs(currentDate, "MM-YYYY").add(1, "M");
      }
    };

    // Uci
    getDataCsv(
      "https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto8/UCI.csv",
      "Uci",
      false,
      false,
      false
    );
    // Deaths
    getDataCsv(
      "https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto14/FallecidosCumulativo.csv",
      "Deaths",
      true,
      false,
      false,
      true
    );
    // PCR number each day
    let dataPcr = await getDataCsv(
      "https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto7/PCR.csv",
      "Pcr",
      false
    );

    // // Cases
    // let dataCases = await getDataCsv(
    //   "https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto3/CasosTotalesCumulativo.csv",
    //   "Cases",
    //   true,
    //   true,
    //   true,
    //   true
    // );
      let dataCases = await getDataCsv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto13/CasosNuevosCumulativo.csv',   "Cases",
      false,
      true,
      true,
      true);



    //Antigeno
    let dataAntigeno = await getDataCsv(
      "https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto87/Ag.csv",
      "Antigeno",
      false
    );

    // update fromMonth from fromDate
    this.fromMonth = dayjs(this.fromDate, "01-MM-YYYY").format("MMMM YYYY");

    // compute the positivity
    for (let region of this.regionName) {
      let antigeno = [];
      let count = 0;
      this.dataCovid["labelsPcr"].forEach((d) => {
        // console.log(this.dataCovid['labelsAntigeno'])
        if (!this.dataCovid["labelsAntigeno"].includes(d)) {
          antigeno.push(0);
        } else {
          antigeno.push(dataAntigeno[region + "Antigeno"][count]);
          count += 1;
        }
      });
      this.dataCovid[region + "Antigeno"] = antigeno;

      const Cases = dataCases[region + "Cases"];
      const Pcr = dataPcr[region + "Pcr"];
      let Pos = [];
      for (let i = 0; i < Pcr.length; i++) {
        Pos.push(
          (Cases[Cases.length - i - 1] /
            (Pcr[Pcr.length - i - 1] + antigeno[antigeno.length - i - 1])) *
            100
        );
      }
      Pos = meanWeek(Pos.reverse()).map((d) => {
        return Math.round(d * 100) / 100;
      });
      const firstNullValues = [null,null,null,null,null,null]

      this.$set(this.dataCovid, region + "Pos", [...firstNullValues,...Pos]);
    }

    // cases con retrado
      const casesAcc = await d3.csv('https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto3/CasosTotalesCumulativo.csv')
    this.dataCovid['casesAcc'] = {'labels':Object.keys(casesAcc[0]).slice(4).map(d => dayjs(d, 'YYYY-MM-DD').format('DD-MM-YYYY'))}
    casesAcc.forEach(d=>{
      let region = d['Region'] == 'Total'? 'Chile':d['Region'] 
      let values = derivate(Object.values(d).slice(3).map(i=>Number(i)))
      let mean = meanWeek(values).map(i => Math.round(i))
      this.dataCovid.casesAcc[region] = {
      'values':values,
      'late':values.map((v,i)=> {return v-this.dataCovid[d['Region']+'Cases'][i]}),
      'meanWeek':mean,
      'variation':derivate(mean)
      }
    })

    // deis 
    let deisConfirmed = await d3.csv('https://raw.githubusercontent.com/AntoineBraultChile/deathsChile/main/output/deisRegionConfirmedDeaths.csv')
    let deisSuspected = await d3.csv('https://raw.githubusercontent.com/AntoineBraultChile/deathsChile/main/output/deisRegionSuspectedDeaths.csv')
    this.dataCovid['deis'] = {
    }

    deisConfirmed.forEach((d,index) => {
      let labels = Object.keys(d).slice(1).map(date => dayjs(date, 'YYYY-MM-DD').format('DD-MM-YYYY'))
      let confirmed =  Object.values(d).slice(1).map(i=> Number(i))
      let suspected = Object.values(deisSuspected[index]).slice(1).map(i => Number(i))
      let mediaMovil = meanWeek(sumArray(confirmed,suspected))
      let total = [confirmed.reduce((tot,cur) => tot+cur)+suspected.reduce((tot,cur)=> tot+cur)]
      this.dataCovid.deis[this.dicRegions2[d['Region']]] ={
        'labels': labels,
        'confirmed': confirmed,
        'suspected': suspected,
        'mediaMovil':mediaMovil,
        'total': total
      }
    })

    // excess mortality by region
    let response = await fetch('https://raw.githubusercontent.com/AntoineBraultChile/deathsChile/main/output/deathsRegionsFrom2015.json')
    let deathsR =  await response.json()
    const regions = Object.keys(this.dicRegions)
    const years = Object.keys(deathsR[this.dicRegions['Maule']])

    let deathsRGoodName = {}
    regions.forEach(r =>{
      deathsRGoodName[r] = {}
      years.forEach(y => {
        deathsRGoodName[r][y] = {'labels':deathsR[this.dicRegions[r]][y].labels.map(d => dayjs(d,'YYYY-MM-DD').format('DD-MM-YYYY')).slice(6),
         'values': meanWeek(deathsR[this.dicRegions[r]][y].values.map(i=> Number(i))).map(i => Math.round(i))}
      });
    //  deathsRGoodName[r] = deathsR[this.dicRegions[r]]
    })
    this.dataCovid.allDeaths = deathsRGoodName

    // function to delete accent
    function deleteAccent(string) {
      return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    // datos plan paso a paso
    const pasoAPaso = await d3.csv(
      "https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto74/paso_a_paso.csv"
    );
    pasoAPaso.forEach((d) => {
      this.dataCovid.pasoAPaso[deleteAccent(d["comuna_residencia"])] =
        Object.values(d).slice(-1);
    });
this.dataCovid.pasoAPaso['Tiltil'] = this.dataCovid.pasoAPaso['Til Til']
this.dataCovid.pasoAPaso['Calera'] = this.dataCovid.pasoAPaso['La Calera']
this.dataCovid.pasoAPaso['Llaillay'] = this.dataCovid.pasoAPaso['Llay-Llay']
this.dataCovid.pasoAPaso['Paiguano'] = this.dataCovid.pasoAPaso['Paihuano']

    // fetching data cases by comune in Chile
    const casesComunas = await d3.csv(
      "https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto1/Covid-19.csv"
    );
    const allLabels = Object.keys(casesComunas[0])
      .slice(5, -1)
      .map((date) => {
        return dayjs(date, "YYYY-MM-DD").format("DD-MM-YYYY");
      });
    this.dataCovid.incidence.lastUpdate.push(allLabels.pop());

casesComunas.forEach((comuna) => {
      if (this.dataCovid.incidence[comuna["Region"]] === undefined) {
          let last4Values = Object.values(comuna)
            .slice(-5, -1)
            .map((i) => {
              return Number(i);
            });
          let values = last4Values[3] - last4Values[1];
          let variation = values - (last4Values[2] - last4Values[0]);
        this.dataCovid.incidence[comuna["Region"]] = {
          names: [comuna["Comuna"]],
          values: [Math.round((values / comuna["Poblacion"]) * 100000)],
          variations: [Math.round((variation / comuna["Poblacion"]) * 100000)],
        };
      } else {
        if (!comuna["Comuna"].includes("Desconocido")) {
          // console.log(Object.values(comuna));
          let last4Values = Object.values(comuna)
            .slice(-5, -1)
            .map((i) => {
              return Number(i);
            });
          let values = (last4Values[3] - last4Values[1]) > 0 ? (last4Values[3] - last4Values[1]) :0;
          let variation = values - (last4Values[2] - last4Values[0]);
          
          // console.log(comuna["Comuna"]);
          // console.log("last4values", last4Values)
          // console.log("value", values);
          // console.log("variation", variation);

          this.dataCovid.incidence[comuna["Region"]]["names"].push(
            comuna["Comuna"]
          );
          this.dataCovid.incidence[comuna["Region"]].values.push(
            Math.round((values / comuna["Poblacion"]) * 100000)
          );
          this.dataCovid.incidence[comuna["Region"]].variations.push(
            Math.round((variation / comuna["Poblacion"]) * 100000)
          );
        }
      }
    });

    // fetching vaccine by region
    const vaccine = await d3.csv(
      "https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto76/vacunacion.csv"
    );
    this.dataCovid.labelsVaccine = Object.keys(vaccine[0])
      .slice(2)
      .map((date) => dayjs(date, "YYYY-MM-DD").format("DD-MM-YYYY"));

    let firstDoses = {};
    let secondDoses = {};
    let uniqueDoses = {};
    let boostDoses = {};
    let fourthDoses = {};

    vaccine.forEach((region) => {
      if(region['Region']!=''){

      if (region["Dosis"] == "Primera") {
        firstDoses[region["Region"]] = Object.values(region)
          .slice(2)
          .map((i) => Number(i));
      } else if (region["Dosis"] == "Segunda") {
        secondDoses[region["Region"]] = Object.values(region)
          .slice(2)
          .map((i) => Number(i));
      } else if (region["Dosis"] == "Unica") {
        uniqueDoses[region["Region"]] = Object.values(region)
          .slice(2)
          .map((i) => Number(i));
      }else if (region["Dosis"] == "Refuerzo") {
        boostDoses[region["Region"]] = Object.values(region)
          .slice(2)
          .map((i) => Number(i));
      }else if (region["Dosis"] == "Cuarta") {
        fourthDoses[region["Region"]] = Object.values(region)
          .slice(2)
          .map((i) => Number(i));
      }
      }
    });
 

    Object.keys(firstDoses).forEach((region) => {

      const firstValues = firstDoses[region];
      const uniqueValues = uniqueDoses[region];
      const secondValues = secondDoses[region];
      const boostValues = boostDoses[region];
      const fourthValues = fourthDoses[region];


      this.dataCovid[region + "Vaccine"] = {
        firstDoses: sumArray(firstValues, uniqueValues).map(
          (d) => Math.round((d / this.populationChile[region]) * 1000) / 10
        ),
        secondDoses: sumArray(secondValues, uniqueValues).map(
          (d) => Math.round((d / this.populationChile[region]) * 1000) / 10
        ),
        boostDoses: boostValues.map(
          (d) => Math.round((d / this.populationChile[region]) * 1000) / 10
        ),
        fourthDoses:fourthValues.map(
          (d) => Math.round((d / this.populationChile[region]) * 1000) / 10
        ),
      };
    });


  },
};
</script>


<style lang="css" scoped>
.ChartRegion {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.optionsGraph label {
  padding-right: 5px;
}

@media all and (max-width: 1100px) {
  .subtitleContainer {
    margin-top: 5px;
  }

  .subtitle {
    font-size: 20px;
    font-weight: normal;
  }

  .optionsGraph p {
    font-size: 16px;
  }
}
</style>


<style src='../assets/chartChileAndRegion.css'></style>
