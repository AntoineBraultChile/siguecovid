<template lang="html">
  <div class="ChartsEpidemic">
    <div class="graph" v-if="dataCovid.labelsCases.length > 0">
      <title-graphic> {{ title["Cases"] }} en {{ region }} </title-graphic>
      <span style="font-size:1rem"
        >Los casos se detectan por PCR o prueba antigénica.
      </span>
      <br />

      <update :labels="dataCovid.labelsCases"> </update>
      <bar-chart
        :chartData="plotBarChartWithMean(region, 'Cases')"
        :options="chartOptions('Cases')"
      >
      </bar-chart>
    </div>

    <div class="graph" v-if="dataCovid.labelsPcr.length > 0">
      <title-graphic> {{ title["Pcr"] }} en {{ region }} </title-graphic>
      <span style="font-size:1rem"
        >La positividad es el porcentaje de casos detectados sobre el numero de
        test PCR y de antigenos realizados cada día.</span
      >
      <br />

      <update :labels="dataCovid.labelsPcr"> </update>
      <bar-chart
        :chartData="getChartPosPcr(region)"
        :options="chartOptions('Pcr')"
      >
      </bar-chart>
    </div>

    <div class="graph" v-if="dataCovid.labelsUci.length > 0">
      <title-graphic> {{ title["Uci"] }} en {{ region }} </title-graphic>
      <span style="font-size:1rem">
        La UCI es la sigla de unidad de cuidados intensivos.</span
      >
      <br />

      <update :labels="dataCovid.labelsUci"> </update>
      <bar-chart
        :chartData="plotBar(region, 'Uci')"
        :options="chartOptions('Uci')"
      >
      </bar-chart>
    </div>

    <div class="graph" v-if="dataCovid.labelsDeaths.length > 0">
      <title-graphic> {{ title["Deaths"] }} en {{ region }} </title-graphic>
      <span style="font-size:1rem"
        >Son los fallecidos por Covid-19 confirmados con un test PCR.</span
      >
      <br />

      <update :labels="dataCovid.labelsDeaths"> </update>
      <bar-chart
        :chartData="plotBarChartWithMean(region, 'Deaths')"
        :options="chartOptions('Deaths')"
      >
      </bar-chart>
    </div>

    <div class="graph" v-if="dataCovid.incidence.lastUpdate.length > 0">
      <title-graphic v-if="region == 'Chile'">
        Incidencia en las regiones de Chile</title-graphic
      >
      <title-graphic v-else>
        Incidencia en las comunas de la región {{ region }}
      </title-graphic>
      <span style="font-size:1rem"
        >Incidencia: número semanal de casos por cada 100.000 habitantes</span
      >
      <br />
      <update :labels="dataCovid.incidence.lastUpdate"> </update>
      <div class="legend" v-if="!(region == 'Chile')">
        <div class="rectangle red"></div>
        <span>Paso 1</span>
        <div class="rectangle orange"></div>
        <span>Paso 2</span>
        <div class="rectangle blue"></div>
        <span>Paso 3</span>
        <div class="rectangle green"></div>
        <span>Paso 4</span>
      </div>
      <horizontal-bar-chart
        :height="600"
        :chartData="getChartIncidence(region)"
        :options="chartOptions('Incidence')"
      ></horizontal-bar-chart>
    </div>

    <div class="graph" v-if="dataCovid.incidence.lastUpdate.length > 0">
      <title-graphic v-if="region == 'Chile'">
        Variación de la incidencia en las regiones de Chile</title-graphic
      >
      <title-graphic v-else>
        Variación de la incidencia en las comunas de la región
        {{ region }}</title-graphic
      >
      <span style="font-size:1rem"
        >Variación de la incidencia corresponde a la incidencia de hoy menos la
        incidencia 7 días atras</span
      >
      <br />
      <update :labels="dataCovid.incidence.lastUpdate"> </update>
      <horizontal-bar-chart
        :height="600"
        :chartData="getChartIncidence(region, 'variations')"
        :options="chartOptions('Incidence')"
      ></horizontal-bar-chart>
    </div>
    <div class="graph" v-if="region == 'Chile'">
      <title-graphic> {{ title["IngresoUCI"] }} en {{ region }} </title-graphic>
      <span style="font-size:1rem">
        La UCI es la sigla de unidad de cuidados intensivos.</span
      >
      <br />

      <update :labels="dataCovid.labelsIngresoUCI"> </update>
      <bar-chart
        :chartData="getChartIngresoUCI(region)"
        :options="chartOptions('IngresoUCI')"
      >
      </bar-chart>
    </div>

    <div class="graph" v-if="dataCovid.labelsVaccine.length > 0">
      <title-graphic>
        Proporción de la población vacunada en {{ region }}</title-graphic
      >
      <update :labels="dataCovid.labelsVaccine"> </update>
      <line-chart
        :chartData="getChartVaccine(region)"
        :options="chartOptions('Paso')"
      ></line-chart>
    </div>

    <div class="graph" v-if="region == 'Chile'">
      <title-graphic>
        Proporción de la población chilena en las diferentes fases del plan Paso
        a Paso</title-graphic
      >
      <update :labels="dataCovid.pasoAPaso.labels"> </update>
      <bar-chart
        :chartData="getChartPasoAPaso()"
        :options="chartOptions('Paso')"
      ></bar-chart>
    </div>
  </div>
</template>

<script>
import * as dayjs from "dayjs";
var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);
import "dayjs/locale/es"; // load on demand
dayjs.locale("es"); // use Spanish locale globally

import { order } from "../assets/mathFunctions";

import BarChart from "../components/BarChart";
import LineChart from "../components/LineChart";
import HorizontalBarChart from "../components/HorizontalBarChart";
import Update from "../components/Update";

import TitleGraphic from "../components/TitleGraphic";
export default {
  name: "ChartsEpidemic",
  props: ["region", "fromDate", "dataCovid"],
  components: {
    "line-chart": LineChart,
    "bar-chart": BarChart,
    "horizontal-bar-chart": HorizontalBarChart,
    update: Update,
    "title-graphic": TitleGraphic,
  },
  data() {
    return {
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
      title: {
        IngresoUCI: "Media móvil 7 días de ingresos a UCI por Covid-19",
        Uci: "Personas en UCI por Covid-19",
        Pcr: "Positividad y PCR en ",
        Cases: "Nuevos casos diarios",
        Deaths: "Fallecidos por Covid-19",
      },
    };
  },
  methods: {
    getChartIngresoUCI(region) {
      let fromDate = this.fromDate;
      let indexDate = this.dataCovid["labelsIngresoUCI"].indexOf(fromDate);
      indexDate = indexDate > 0 ? indexDate : 0;

      return {
        labels: this.dataCovid["labelsIngresoUCI"].filter((x) => {
          return dayjs(x, "DD-MM-YYYY") >= dayjs(fromDate, "DD-MM-YYYY");
        }),
        datasets: [
          {
            type: "line",
            label: "",
            borderColor: this.colorsPasoAPaso[1],
            backgroundColor: this.colorsPasoAPaso[1],
            fill: false,
            data: this.dataCovid[region + "IngresoUCI"].slice(indexDate),
          },
        ],
      };
    },
    getChartVaccine(region) {
      // console.log(this.dataCovid[region + "Vaccine"].firstDoses);
      let fromDate = this.fromDate;
      let indexDate = this.dataCovid["labelsVaccine"].indexOf(fromDate);
      indexDate = indexDate > 0 ? indexDate : 0;

      return {
        labels: this.dataCovid["labelsVaccine"].filter((x) => {
          return dayjs(x, "DD-MM-YYYY") >= dayjs(fromDate, "DD-MM-YYYY");
        }),
        datasets: [
          {
            type: "line",
            label: "al menos una dosis",
            borderColor: this.colorsPasoAPaso[3],
            backgroundColor: this.colorsPasoAPaso[3],
            fill: false,
            data: this.dataCovid[region + "Vaccine"].firstDoses.slice(
              indexDate
            ),
          },
          {
            type: "line",
            label: "completamente vacunado",
            borderColor: this.colorsPasoAPaso[2],
            backgroundColor: this.colorsPasoAPaso[2],
            fill: false,
            data: this.dataCovid[region + "Vaccine"].secondDoses.slice(
              indexDate
            ),
          },
        ],
      };
    },
    getChartPasoAPaso() {
      let fromDate = this.fromDate;
      let indexDate = this.dataCovid.pasoAPaso.labels.indexOf(fromDate);
      indexDate = indexDate > 0 ? indexDate : 0;
      // let indexDateMean = this.dataCovidChile['labelsMean'+type].indexOf(fromDate)
      let datasets = [];
      let labels = [
        "Cuarentena (Fase 1)",
        "Transición (Fase 2)",
        "Preparación (Fase 3)",
        "Apertura inicial (Fase 4)",
      ];
      let pasos = Object.keys(this.colorsPasoAPaso);
      pasos.forEach((paso, index) => {
        datasets.push({
          type: "line",
          label: labels[index],
          borderColor: this.colorsPasoAPaso[paso],
          backgroundColor: this.colorsPasoAPaso[paso],
          fill: false,
          data: this.dataCovid.pasoAPaso["fase" + paso].slice(indexDate),
        });
      });
      return {
        labels: this.dataCovid.pasoAPaso.labels.slice(indexDate),
        datasets: datasets,
      };
    },
    getChartIncidence(region, type) {
      let values =
        type == "variations"
          ? this.dataCovid.incidence[region].variations
          : this.dataCovid.incidence[region].values;
      let [labelsSort, valuesSort] = order(
        this.dataCovid.incidence[region].names,
        values
      );
      let colors = [];
      let label = "";
      if (type == "variations") {
        valuesSort.forEach((d) => {
          d < 0
            ? colors.push(this.backgroundColor["Cases"])
            : colors.push(this.backgroundColor["Uci"]);
        });
        label = "Variación incidencia";
      } else {
        label = "Incidencia";
        if (this.region == "Chile") {
          colors = this.backgroundColor["Pcr"];
        } else {
          labelsSort.forEach((comuna) => {
            colors.push(this.colorsPasoAPaso[this.dataCovid.pasoAPaso[comuna]]);
          });
        }
      }
      return {
        labels: labelsSort,
        datasets: [
          {
            type: "horizontalBar",
            label: label,
            borderColor: colors,
            backgroundColor: colors,
            data: valuesSort,
          },
        ],
        borderWidth: 1,
      };
    },
    plotBar(name, type) {
      let fromDate = this.fromDate;
      // console.log(Math.max(this.dataCovid['labels'+type].reduce(function (a, b) { return a < b ? a : b; })))
      let indexDate = this.dataCovid["labels" + type].indexOf(fromDate);
      return {
        labels: this.dataCovid["labels" + type].filter((x) => {
          return dayjs(x, "DD-MM-YYYY") >= dayjs(fromDate, "DD-MM-YYYY");
        }),
        datasets: [
          {
            label: this.title[type] + " en " + name,
            backgroundColor: this.backgroundColor[type],
            fill: false,
            data: this.dataCovid[name + type].slice(indexDate),
          },
        ],
      };
    },
    plotBarChartWithMean(name, type) {
      let fromDate = this.fromDate;
      let indexDate = this.dataCovid["labels" + type].indexOf(fromDate);
      // let indexDateMean = this.dataCovidChile['labelsMean'+type].indexOf(fromDate)
      return {
        labels: this.dataCovid["labels" + type].filter((x) => {
          return dayjs(x, "DD-MM-YYYY") >= dayjs(fromDate, "DD-MM-YYYY");
        }),
        datasets: [
          {
            type: "line",
            label: "Media móvil de 7  días",
            borderColor: "#dd4b39",
            backgroundColor: "#dd4b39",
            fill: false,
            data: this.dataCovid[name + "Mean" + type].slice(indexDate - 6),
          },
          {
            type: "bar",
            label: this.title[type] + " diarios",
            backgroundColor: this.backgroundColor[type],
            fill: false,
            data: this.dataCovid[name + type].slice(indexDate),
          },
        ],
      };
    },

    getChartPosPcr(name) {
      let fromDate = this.fromDate;
      let indexDate = this.dataCovid["labelsPcr"].indexOf(fromDate);
      let indexDatePos = indexDate - 6;
      return {
        labels: this.dataCovid["labelsPcr"].filter((x) => {
          return dayjs(x, "DD-MM-YYYY") >= dayjs(fromDate, "DD-MM-YYYY");
        }),
        datasets: [
          {
            type: "line",
            label: "Positividad (media móvil de 7 días)",
            yAxisID: "Pos",
            borderColor: "#dd4b39",
            backgroundColor: "#dd4b39",
            fill: false,
            data: this.dataCovid[name + "Pos"].slice(indexDatePos),
          },
          {
            type: "bar",
            label: "Numero de test PCR ",
            yAxisID: "Pcr",
            backgroundColor: this.backgroundColor["Pcr"],
            fill: false,
            data: this.dataCovid[name + "Pcr"].slice(indexDate),
          },
          {
            type: "bar",
            label: "Numero de test de antigenos",
            yAxisID: "Pcr",
            backgroundColor: this.colorsPasoAPaso[2],
            fill: false,
            data: this.dataCovid[name + "Antigeno"].slice(indexDate),
          },
        ],
      };
    },
    chartOptions(type) {
      let options = {
        animation: {
          duration: 0,
        },
        scales: {
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
      if (type == "Incidence") {
        options.responsive = true;
        options.maintainAspectRatio = false;
        options.scales["xAxes"] = [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ];
      }
      if (type == "IngresoUCI") {
        options.scales["xAxes"] = [
          {
            type: "time",
            time: {
              parser: "DD-MM-YYYY",
              unit: "month",
            },
          },
        ];
      }
      if (type == "Paso") {
        options.scales.yAxes[0].ticks = {
          beginAtZero: true,
          callback: function(tick) {
            return tick.toString() + "%";
          },
        };
        options.legend.display = true;
        options.scales["xAxes"] = [
          {
            type: "time",
            time: {
              parser: "DD-MM-YYYY",
              unit: "month",
            },
          },
        ];
      }

      if (type == "Pcr") {
        options.scales = {
          xAxes: [
            {
              stacked: true,
            },
          ],
          yAxes: [
            {
              id: "Pos",
              type: "linear",
              position: "left",
              ticks: {
                beginAtZero: true,
                callback: function(tick) {
                  return tick.toString() + "%";
                },
              },
            },
            {
              id: "Pcr",
              type: "linear",
              position: "right",
              stacked: true,
            },
          ],
        };
      }
      if (type == "Pcr" || type == "Cases" || type == "Deaths") {
        options.legend = { display: true };
      }
      return options;
    },
  },
};
</script>

<style lang="css" scoped>
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
  background-color: #dd4b39;
}
.orange {
  background-color: #eba434;
}
.blue {
  background-color: #82cffd;
}
.green {
  background-color: #93db70;
}

@media all and (max-width: 1100px) {
  .graph {
    width: 100%;
    margin: 5px 0px 5px 0px;
  }
}
</style>
