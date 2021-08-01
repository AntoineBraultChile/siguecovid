<template lang="html">
  <div class="ChartComunas">
    <div class="containerSection">
      <box-container>
        <title-container
          titleName="La pandemia de Covid-19 en las comunas de Chile"
        >
        </title-container>
      </box-container>
      <div id="block_graph" v-if="firstDoses.labels.length > 0">
        <comuna-choice
          :currentComuna="currentComuna"
          :comunaNames="comunaNames"
          v-on:new-comuna="changeCurrentComuna"
          v-if="comunaNames.length > 0"
        />
        <slide-bar
          v-if="listOfMonths.length > 0"
          :listOfMonths="listOfMonths"
          :fromMonth="fromMonth"
          v-on:newdate="updateCurrentDate"
        />
        <div
          class="graph"
          v-if="
            (cases.labels.length > 0) &
              (pasoAPaso.Arica.dateChangePaso.length > 0)
          "
        >
          <title-graphic
            >Incidencia en la comuna de {{ currentComuna }}</title-graphic
          >
          <span style="font-size:1rem"
            >Incidencia: número de casos en 7 días por cada 100.000
            habitantes</span
          >
          <br />
          <div class="legend">
            <div class="rectangle red"></div>
            <span>Paso 1</span>
            <div class="rectangle orange"></div>
            <span>Paso 2</span>
            <div class="rectangle blue"></div>
            <span>Paso 3</span>
            <div class="rectangle green"></div>
            <span>Paso 4</span>
          </div>
          <update :labels="cases.labels"> </update>
          <line-chart
            :chartData="ChartIncidence(currentComuna)"
            :options="options('cases', currentComuna)"
          />
        </div>

        <div
          class="graph"
          v-if="
            (positivity.labels.length > 0) &
              (pasoAPaso.Arica.dateChangePaso.length > 0)
          "
        >
          <title-graphic
            >Positividad semanal de los test PCR en la comuna de
            {{ currentComuna }}</title-graphic
          >
          <update :labels="positivity.labels"> </update>
          <div class="legend">
            <div class="rectangle red"></div>
            <span>Paso 1</span>
            <div class="rectangle orange"></div>
            <span>Paso 2</span>
            <div class="rectangle blue"></div>
            <span>Paso 3</span>
            <div class="rectangle green"></div>
            <span>Paso 4</span>
          </div>
          <line-chart
            :chartData="ChartPositivity(currentComuna)"
            :options="options('positivity', currentComuna)"
          />
        </div>
        <div class="graph" v-if="cases.labels.length > 0">
          <title-graphic
            >Fallecidos semanal por Covid-19 en la comuna de
            {{ currentComuna }}</title-graphic
          >
          <span style="font-size:1rem"
            >Son sólo los fallecidos confirmados con un test PCR positivo</span
          >
          <br />
          <update :labels="deaths.labels"> </update>
          <bar-chart
            :chartData="ChartDeaths(currentComuna)"
            :options="options('deaths')"
          ></bar-chart>
        </div>
        <div class="graph" v-if="positivity.labels.length > 0">
          <title-graphic
            >Proporción de la población vacunada en la comuna de
            {{ currentComuna }}</title-graphic
          >
          <update :labels="firstDoses.labels"> </update>
          <line-chart
            :chartData="ChartVaccin(currentComuna)"
            :options="options('vaccine')"
          />
        </div>
      </div>
      <spinner size="massive" v-else></spinner>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3-fetch";
import * as dayjs from "dayjs";
var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);
import "dayjs/locale/es"; // load on demand
dayjs.locale("es"); // use Spanish locale globally
import { derivate, derivateEachTwoDays } from "../assets/mathFunctions";
import LineChart from "@/components/LineChart";
import BarChart from "@/components/BarChart";
import Update from "../components/Update";
import TitleGraphic from "@/components/TitleGraphic";
import TitleContainer from "@/components/TitleContainer";
import BoxContainer from "@/components/BoxContainer";
import SlideBar from "@/components/SlideBar";
import ComunaChoice from "@/components/ComunaChoice";

export default {
  name: "ChartComunas",
  components: {
    "line-chart": LineChart,
    "bar-chart": BarChart,
    update: Update,
    "title-graphic": TitleGraphic,
    "title-container": TitleContainer,
    "box-container": BoxContainer,
    "slide-bar": SlideBar,
    "comuna-choice": ComunaChoice,
  },
  metaInfo() {
    return {
      title: "Evolución de la pandemia de Covid-19 en las comunas de Chile",
      meta: [
        {
          name: "description",
          content: `Visualizacion de la pandemia de Covid-19 por comuna en Chile. Sigue la evolucion de la incidencia.`,
        },
        { name: "robots", content: "index,follow" },
      ],
    };
  },
  data() {
    return {
      backgroundColor: {
        Uci: "#dd4b39",
        Pcr: "#82CFFD",
        Cases: "#93DB70",
        Deaths: "#232b2b",
      },
      // colorsPaso : {'Fase 1':'rgb(221,75,57,0.1)', 'Fase 2': 'rgb( 235, 164, 52, 0.1)', 'Fase 3': 'rgb(130,207,253,0.1)','Fase 4':'rgb(147,219,112,0.1)'},
      colorsPaso: [
        "rgb(221,75,57,0.1)",
        "rgb( 235, 164, 52, 0.1)",
        "rgb(130,207,253,0.1)",
        "rgb(147,219,112,0.1)",
      ],
      fromDate: "01-02-2021",
      fromMonth: "",
      listOfMonths: [],
      dicMonth: {},
      dicMonth2: {},
      currentComuna: "Arica",
      comunaNames: [],
      dicComunaNamesAccentWithoutWith: {},
      population: {},
      cases: {
        labels: [],
        comuna: {
          Arica: [],
        },
      },
      deaths: {
        labels: [],
        comuna: {
          Arica: [],
        },
      },
      positivity: {
        labels: [],
        comuna: {
          Arica: [],
        },
      },
      firstDoses: {
        labels: [],
        comuna: {
          Arica: [],
        },
      },
      secondDoses: {
        labels: [],
        comuna: {
          Arica: [],
        },
      },
      pasoAPaso: {
        Arica: {
          dateChangePaso: [],
          numeroDelPaso: [],
        },
      },
    };
  },
  methods: {
    changeCurrentComuna(payload) {
      this.currentComuna = payload;
    },
    updateCurrentDate(payload) {
      this.fromMonth = payload;
      this.fromDate = dayjs(payload, "MMMM YYYY").format("01-MM-YYYY");
    },
    ChartIncidence(comuna) {
      let index = this.cases.labels.indexOf(this.dicMonth[this.fromDate]);
      index = index > 0 ? index : 0;
      return {
        labels: this.cases.labels.slice(index),
        datasets: [
          {
            label: "",
            borderColor: this.backgroundColor["Cases"],
            backgroundColor: this.backgroundColor["Cases"],
            fill: false,
            data: this.cases.comuna[comuna].slice(index),
          },
        ],
      };
    },
    ChartDeaths(comuna) {
      let index = this.deaths.labels.indexOf(this.dicMonth2[this.fromDate]);
      index = index > 0 ? index : 0;
      return {
        labels: this.deaths.labels.slice(index),
        datasets: [
          {
            label: "Confirmados",
            borderColor: this.backgroundColor["Deaths"],
            backgroundColor: this.backgroundColor["Deaths"],
            fill: false,
            data: this.deaths.comuna[comuna].slice(index),
          },
          // {label:'Sospechosos', borderColor:this.backgroundColor['Deaths'], backgroundColor:this.backgroundColor['Uci'], fill: false, data:this.deathsSuspicious.comuna[comuna].slice(index)},
        ],
      };
    },
    ChartPositivity(comuna) {
      // let index = this.positivity.labels.indexOf(this.dicMonth[this.fromDate])
      let index = this.positivity.labels.indexOf(this.dicMonth2[this.fromDate]);
      index = index > 0 ? index : 0;
      return {
        labels: this.positivity.labels.slice(index),
        datasets: [
          {
            label: "",
            borderColor: this.backgroundColor["Pcr"],
            backgroundColor: this.backgroundColor["Pcr"],
            fill: false,
            data: this.positivity.comuna[comuna].slice(index),
          },
        ],
      };
    },
    ChartVaccin(comuna) {
      let index = this.firstDoses.labels.indexOf(this.fromDate);
      index = index > 0 ? index : 0;
      return {
        labels: this.firstDoses.labels.slice(index),
        datasets: [
          {
            label: "primera dosis",
            borderColor: this.backgroundColor["Pcr"],
            backgroundColor: this.backgroundColor["Pcr"],
            fill: false,
            data: this.firstDoses.comuna[comuna].slice(index),
          },
          {
            label: "segunda dosis",
            borderColor: "#eba434",
            backgroundColor: "#eba434",
            fill: false,
            data: this.secondDoses.comuna[comuna].slice(index),
          },
        ],
      };
    },
    options(type, comuna) {
      let opt = {
        animation: {
          duration: 0,
        },
        scales: {
          xAxes: [
            {
              // offset: true,
              type: "time",
              time: {
                parser: "DD-MM-YYYY",
                unit: "month",
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
        legend: {
          display: false,
        },
        tooltips: {
          mode: "index",
          intersect: true,
        },
        hover: {
          mode: "index",
          intersect: true,
        },
        responsive: true,
        maintainAspectRatio: false,
      };

      if (type === "positivity" || type == "vaccine") {
        opt.scales.yAxes[0].ticks["callback"] = function(tick) {
          return tick.toString() + "%";
        };
      }
      if (type == "vaccine") {
        opt.legend.display = true;
      }
      if (type == "deaths") {
        opt.scales.xAxes[0]["offset"] = true;
      }
      if (type == "cases" || type == "positivity") {
        let annotations = [];
        let dateChangePaso = this.pasoAPaso[comuna].dateChangePaso;
        dateChangePaso.forEach((date, index) => {
          if (index != dateChangePaso.length - 1) {
            annotations.push({
              drawTime: "beforeDatasetsDraw",
              type: "box",
              xScaleID: "x-axis-0",
              // yScaleID: 'y-axis-1',
              xMin: dateChangePaso[index],
              xMax: dateChangePaso[index + 1],
              backgroundColor: this.colorsPaso[
                this.pasoAPaso[comuna].numeroDelPaso[index] - 1
              ],
              //borderColor: 'rgb(255, 0, 0)',
              borderWidth: 1,
            });
          }
        });
        opt.annotation = { annotations: annotations };
        // console.log(annotations)
      }
      return opt;
    },
  },
  async created() {
    // fromDate 3 months before today
    this.fromDate = dayjs()
      .subtract(3, "month")
      .format("01-MM-YYYY");

    //fetch deaths by comuna
    const deathsComunas = await d3.csv(
      "https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto61/serie_fallecidos_comuna.csv"
    );
    let allLabelsDeaths = Object.keys(deathsComunas[0])
      .slice(5)
      .map((date) => {
        return dayjs(date, "YYYY-MM-DD").format("DD-MM-YYYY");
      });
    // we keep only monday date
    allLabelsDeaths.forEach((d) => {
      // if it is a monday

      if (dayjs(d, "DD-MM-YYYY").get("day") === 1) {
        this.deaths.labels.push(dayjs(d, "DD-MM-YYYY").format("DD-MM-YYYY"));
        if (
          !Object.keys(this.dicMonth2).includes(
            dayjs(d, "DD-MM-YYYY").format("01-MM-YYYY")
          )
        ) {
          this.dicMonth2[dayjs(d, "DD-MM-YYYY").format("01-MM-YYYY")] = dayjs(
            d,
            "DD-MM-YYYY"
          ).format("DD-MM-YYYY");
        }
      }
    });
    // we eliminate the first monday because we are going to compute of derivative to get variation of incidence
    this.deaths.labels = this.deaths.labels.slice(1);

    // deaths each week by comune
    deathsComunas.forEach((comuna) => {
      // only deaths confirmed by PCR
      if (comuna["CIE 10"] == "U07.1" || comuna["CIE 10"] == "") {
        if (
          !Object.keys(this.dicComunaNamesAccentWithoutWith).includes(
            comuna["Comuna"]
          )
        ) {
          this.dicComunaNamesAccentWithoutWith[deleteAccent(comuna["Comuna"])] =
            comuna["Comuna"];
        }
        let allValues = Object.values(comuna)
          .slice(5)
          .map((i) => {
            return Number(i);
          });
        let valuesEachMonday = [];
        allValues.forEach((d, index) => {
          if (dayjs(allLabelsDeaths[index], "DD-MM-YYYY").get("day") === 1) {
            valuesEachMonday.push(d);
          }
        });
        this.deaths.comuna[comuna["Comuna"]] = derivate(valuesEachMonday);
      }
    });

    // because Aysen can be written Aisen
    // this.deaths.comuna['Aysen'] = this.deaths.comuna['Aisen']
    delete this.dicComunaNamesAccentWithoutWith["Aisen"];
    this.dicComunaNamesAccentWithoutWith["Aysen"] = "Aisén";

    // accent missing in some comunas
    this.dicComunaNamesAccentWithoutWith["Maria Pinto"] = "María Pinto";
    this.deaths.comuna["María Pinto"] = this.deaths.comuna["Maria Pinto"];
    this.dicComunaNamesAccentWithoutWith["Maria Elena"] = "María Elena";
    this.deaths.comuna["María Elena"] = this.deaths.comuna["Maria Elena"];

    this.dicComunaNamesAccentWithoutWith["Chepica"] = "Chépica";
    this.deaths.comuna["Chépica"] = this.deaths.comuna["Chepica"];

    // we set comuna names with accents
    this.comunaNames = Object.values(this.dicComunaNamesAccentWithoutWith);

    // fetch cases
    const casesComunas = await d3.csv(
      "https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto1/Covid-19.csv"
    );

    const allLabels = Object.keys(casesComunas[0])
      .slice(5, -1)
      .map((date) => {
        return dayjs(date, "YYYY-MM-DD").format("DD-MM-YYYY");
      });

    // we keep only monday date
    allLabels.forEach((d) => {
      // if it is a monday or a friday
      if (
        dayjs(d, "DD-MM-YYYY").get("day") === 1 ||
        dayjs(d, "DD-MM-YYYY").get("day") === 5
      ) {
        this.cases.labels.push(dayjs(d, "DD-MM-YYYY").format("DD-MM-YYYY"));
        if (
          !this.listOfMonths.includes(
            dayjs(d, "DD-MM-YYYY").format("MMMM YYYY")
          )
        ) {
          this.listOfMonths.push(dayjs(d, "DD-MM-YYYY").format("MMMM YYYY"));
          if (
            !Object.values(this.dicMonth).includes(
              dayjs(d, "DD-MM-YYYY").format("DD-MM-YYYY")
            )
          ) {
            this.dicMonth[dayjs(d, "DD-MM-YYYY").format("01-MM-YYYY")] = dayjs(
              d,
              "DD-MM-YYYY"
            ).format("DD-MM-YYYY");
          }
        }
      }
    });

    // we eliminate the first monday because we are going to compute of derivative to get variation of incidence
    this.cases.labels = this.cases.labels.slice(2);
    this.listOfMonths = this.listOfMonths.slice(1);

    // we compute incidence each week
    casesComunas.forEach((comuna) => {
      let allValues = Object.values(comuna)
        .slice(5, -1)
        .map((i) => {
          return Number(i);
        });
      let valuesEachMonday = [];
      allValues.forEach((d, index) => {
        // if monday or friday
        if (
          dayjs(allLabels[index], "DD-MM-YYYY").get("day") === 1 ||
          dayjs(allLabels[index], "DD-MM-YYYY").get("day") === 5
        ) {
          valuesEachMonday.push(Math.round((d / comuna["Poblacion"]) * 100000));
        }
      });
      this.cases.comuna[
        this.dicComunaNamesAccentWithoutWith[comuna["Comuna"]]
      ] = derivateEachTwoDays(valuesEachMonday);
    });

    // this.comunaNames = Object.keys(this.cases.comuna).filter(comuna => !comuna.includes("Desconocido"))
    this.fromMonth = dayjs(this.fromDate, "01-MM-YYYY").format("MMMM YYYY");

    // fetch positivity by comune
    const positivityComunas = await d3.csv(
      "https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto65/PositividadPorComuna.csv"
    );
    this.positivity.labels = Object.keys(positivityComunas[0])
      .slice(5)
      .map((date) => {
        return dayjs(date, "YYYY-MM-DD").format("DD-MM-YYYY");
      });
    positivityComunas.forEach((comuna) => {
      this.positivity.comuna[
        this.dicComunaNamesAccentWithoutWith[comuna["Comuna"]]
      ] = Object.values(comuna)
        .slice(5)
        .map((i) => {
          return Number(i);
        });
    });

    // Plan Paso a Paso en las comunas de Chile from scrapping data covid chile
    let paso = await fetch(
      "https://raw.githubusercontent.com/AntoineBraultChile/scrapping-covid-data-chile/main/output/pasoAPasoComunas.json"
    );
    let pasoObject = await paso.json();
    this.pasoAPaso = pasoObject;

    // // Plan Paso a Paso en las comunas de Chile
    // let paso = await d3.csv(
    //   "https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto74/paso_a_paso.csv"
    // );
    // // this.pasoAPaso.labels = Object.keys(paso[0]).slice(5).map(date => {return dayjs(date,"YYYY-MM-DD").format("DD-MM-YYYY")})
    // paso.forEach((comuna) => {
    //   let date = Object.keys(comuna)
    //     .slice(5)
    //     .map((date) => {
    //       return dayjs(date, "YYYY-MM-DD").format("DD-MM-YYYY");
    //     });
    //   let fases = Object.values(comuna)
    //     .slice(5)
    //     .map((i) => {
    //       return Number(i);
    //     });
    //   let currentFase = fases[0];
    //   this.pasoAPaso[comuna["comuna_residencia"]] = {
    //     dateChangePaso: [date[0]],
    //     numeroDelPaso: [currentFase],
    //   };
    //   fases.forEach((fase, index) => {
    //     if (fase != currentFase) {
    //       currentFase = fase;
    //       this.pasoAPaso[comuna["comuna_residencia"]].dateChangePaso.push(
    //         date[index]
    //       );
    //       this.pasoAPaso[comuna["comuna_residencia"]].numeroDelPaso.push(fase);
    //     }
    //   });
    //   this.pasoAPaso[comuna["comuna_residencia"]].dateChangePaso.push(
    //     date[date.length - 1]
    //   );
    //   this.pasoAPaso[comuna["comuna_residencia"]].numeroDelPaso.push(
    //     fases[fases.length - 1]
    //   );
    // });

    // fetch first vaccine doses by comune
    const firstDosesComunas = await d3.csv(
      "https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto80/vacunacion_comuna_1eraDosis.csv"
    );

    this.firstDoses.labels = Object.keys(firstDosesComunas[0])
      .slice(5)
      .map((date) => {
        return dayjs(date, "YYYY-MM-DD").format("DD-MM-YYYY");
      });

    firstDosesComunas.forEach((comuna) => {
      let valueEachDay = Object.values(comuna)
        .slice(5)
        .map((i) => {
          return Number(i);
        });
      let accumulativeValue = [];
      valueEachDay.reduce((acc, el, i) => (accumulativeValue[i] = acc + el), 0);
      this.firstDoses.comuna[
        this.dicComunaNamesAccentWithoutWith[comuna["Comuna"]]
      ] = accumulativeValue.map((d) => {
        return Math.round((d / comuna["Poblacion"]) * 1000) / 10;
      });
    });

    // fetch second vaccine doses by comune
    const secondDosesComunas = await d3.csv(
      "https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto80/vacunacion_comuna_2daDosis.csv"
    );
    this.secondDoses.labels = Object.keys(secondDosesComunas[0])
      .slice(5)
      .map((date) => {
        return dayjs(date, "YYYY-MM-DD").format("DD-MM-YYYY");
      });
    secondDosesComunas.forEach((comuna) => {
      let valueEachDay = Object.values(comuna)
        .slice(5)
        .map((i) => {
          return Number(i);
        });
      let accumulativeValue = [];
      valueEachDay.reduce((acc, el, i) => (accumulativeValue[i] = acc + el), 0);
      this.secondDoses.comuna[
        this.dicComunaNamesAccentWithoutWith[comuna["Comuna"]]
      ] = accumulativeValue.map((d) => {
        return Math.round((d / comuna["Poblacion"]) * 1000) / 10;
      });
      this.population[this.dicComunaNamesAccentWithoutWith[comuna["Comuna"]]] =
        comuna["Poblacion"];
    });

    // function to delete accent
    function deleteAccent(string) {
      return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
  },
};
</script>

<style lang="css" scoped>
.ChartComunas {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.containerSection {
  max-width: 1400px;
  padding: 0px 10px 0px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.graph {
  width: 49.65%;
  margin: 5px 0px 5px 0px;
  box-shadow: 0px 0px 2px 2px #e8e8e8;
  border-radius: 7px;
  background-color: white;
  padding: 0px 0px 10px 0px;
}
#block_graph {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
  justify-content: space-between;
}
.box-container {
  display: flex;
  align-items: center;
}
.legend {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  font-size: 0.9rem;
  color: gray;
}
.rectangle {
  height: 15px;
  width: 40px;
  margin: 5px 10px 5px 10px;
}
.red {
  background-color: rgb(221, 75, 57, 0.3);
}
.orange {
  background-color: rgb(235, 164, 52, 0.3);
}
.blue {
  background-color: rgb(130, 207, 253, 0.3);
}
.green {
  background-color: rgb(147, 219, 112, 0.3);
}

@media all and (max-width: 1100px) {
  .containerSection {
    width: 100%;
  }
  .graph {
    width: 100%;
    margin: 5px 0px 5px 0px;
  }
  #block_graph {
    flex-direction: column;
    padding: 0px 0px 0px 0px;
  }
}
</style>
