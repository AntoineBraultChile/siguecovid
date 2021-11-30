<template lang="html">
  <div class="ChartsEpidemic">
    <!-- Chart Cases -->
    <div class="graph" v-if="dataCovid.labelsCases.length > 0">
      <cases-chart :region="region" :fromDate="fromDate" :title="title" :dataCovid="dataCovid" :backgroundColor="backgroundColor" :pointRadius="pointRadius" />
      <signature />
    </div>

    <!-- Chart Positivity -->
    <div class="graph" v-if="dataCovid.labelsPcr.length > 0">
      <title-graphic> {{ title["Pcr"] }} en {{ region }} </title-graphic>
      <span style="font-size:1rem">La positividad es el porcentaje de casos detectados sobre el numero de test PCR y de antigenos realizados cada día.</span>
      <br />
      <update :labels="dataCovid.labelsPcr"> </update>
      <bar-chart :chartData="getChartPosPcr(region)" :options="chartOptions('Pcr')"> </bar-chart>
      <signature />
    </div>

    <!-- Chart UCI -->
    <div class="graph" v-if="dataCovid.labelsUci.length > 0">
      <chart-uci :region="region" :fromDate="fromDate" :title="title" :dataCovid="dataCovid" :backgroundColor="backgroundColor" :pointRadius="pointRadius" :colorsPasoAPaso="colorsPasoAPaso" />
      <signature />
    </div>

    <!-- Chart Deaths -->
    <div class="graph" v-if="dataCovid.labelsDeaths.length > 0">
      <chart-deaths :region="region" :fromDate="fromDate" :title="title" :dataCovid="dataCovid" :backgroundColor="backgroundColor" :pointRadius="pointRadius" :colorsPasoAPaso="colorsPasoAPaso" />
      <signature />
    </div>

    <!-- Chart Vaccine -->
    <div class="graph" v-if="dataCovid.labelsVaccine.length > 0">
      <title-graphic> Proporción de la población vacunada en {{ region }}</title-graphic>
      <update :labels="dataCovid.labelsVaccine"> </update>
      <line-chart :chartData="getChartVaccine(region)" :options="chartOptions('Vaccine')"></line-chart>
      <signature />
    </div>

    <!-- Chart Incidence by Region -->
    <div class="graph" v-if="dataCovid.incidence.lastUpdate.length > 0">
      <incidence-bar-chart :region="region" :fromDate="fromDate" :title="title" :dataCovid="dataCovid" :backgroundColor="backgroundColor" :colorsPasoAPaso="colorsPasoAPaso" />
      <signature />
    </div>

    <!-- Case fatality rate -->
    <div class="graph" v-if="region == 'Chile'">
      <title-graphic> Tasa de letalidad por Covid-19 en Chile </title-graphic>
      <span style="font-size:1rem">
        Tasa de casos detectados que fallecieron.
      </span>
      <br />
      <update :labels="dataCovid.CFR.labels"> </update>
      <bar-chart :chartData="plotLine(this.dataCovid.CFR.labels, this.dataCovid.CFR.values, this.backgroundColor['Deaths'])" :options="chartOptions('CFR')"> </bar-chart>
      <signature />
    </div>

    <!-- chart plan Paso a Paso  -->
    <div class="graph" v-if="region == 'Chile'">
      <title-graphic> Proporción de la población chilena en las diferentes fases del plan Paso a Paso</title-graphic>
      <update :labels="dataCovid.pasoAPaso.labels"> </update>
      <bar-chart :chartData="getChartPasoAPaso()" :options="chartOptions('Paso')"></bar-chart>
      <signature />
    </div>

    <!-- --------------------------------------------------------------------------------------------------------------------------------------- -->
    <!-- <box-container v-if="region == 'Chile'">
      <h2 id="description" style="font-size:1.5rem;">
        Impacto de la vacunación en la epidemia de Covid-19 en Chile
      </h2>
      <p style="text-align: justify;padding:10px">
        Los graficos sobre el impacto de la vacunación en Chile no están disponible por el momento. Esta semana hubo errores de formato en la publicación de los datos por parte de MinCiencia. Pero
        volverán muy pronto !
      </p>
    </box-container> -->

    <!-- <box-container v-if="region == 'Chile'">
      <h2 id="description" style="font-size:1.5rem;">
        Impacto de la vacunación en la epidemia de Covid-19 en Chile
      </h2>
      <p class="two-columns">
        Una persona tiene un esquema completo de vacunación 14 días después de una segunda dosis o 28 días después de una dosis única. Los gráficos deben interpretarse teniendo en cuenta que puede
        haber sesgos significativos. De hecho, la cobertura de vacunación y las tasas de infección no son uniformes en toda la población. La situación económica, el lugar de residencia y los factores
        de riesgo de Covid-19 son variables importantes para medir adecuadamente la eficacia de la vacunación. Por el momento, sólo la estratificación por edad está disponible en los datos abiertos.
      </p>
    </box-container> -->

    <!-- <div class="graph" v-if="region == 'Chile' && Object.keys(dataCovid.incidenceVaccinalAjustedByAge.cases).length > 0">
      <chart-incidence-adjusted-by-age
        :region="region"
        :fromDate="fromDate"
        :title="title"
        :dataCovid="dataCovid"
        :backgroundColor="backgroundColor"
        :pointRadius="pointRadius"
        :colorsPasoAPaso="colorsPasoAPaso"
      />
    </div> -->

    <!-- <div class="graph" v-if="region == 'Chile'">
      <chart-incidence-by-age
        :region="region"
        :fromDate="fromDate"
        :title="title"
        :dataCovid="dataCovid"
        :backgroundColor="backgroundColor"
        :pointRadius="pointRadius"
        :colorsPasoAPaso="colorsPasoAPaso"
      />
    </div> -->

    <!-- <div class="graph" v-if="(region == 'Chile') & (dataCovid.ve.cases.vaccinated != undefined)">
      <chart-vaccine-effectiveness
        :region="region"
        :fromDate="fromDate"
        :title="title"
        :dataCovid="dataCovid"
        :backgroundColor="backgroundColor"
        :pointRadius="pointRadius"
        :colorsPasoAPaso="colorsPasoAPaso"
      />
    </div> -->
  </div>
</template>

<script>
import * as dayjs from "dayjs";
var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);
import "dayjs/locale/es"; // load on demand
dayjs.locale("es"); // use Spanish locale globally

import BarChart from "@/components/BarChart";
import LineChart from "@/components/LineChart";
// import HorizontalBarChart from "../components/HorizontalBarChart";
import Update from "@/components/Update";

import CasesChart from "@/components/epidemic/CasesChart";
import ChartUci from "@/components/epidemic/ChartUCI";
import ChartDeaths from "@/components/epidemic/ChartDeaths";
import IncidenceBarChart from "@/components/epidemic/IncidenceBarChart";

// import ChartIncidenceAdjustedByAge from "@/components/ChartIncidenceAdjustedByAge";
// import ChartIncidenceByAge from "@/components/ChartIncidenceByAge";
// import ChartVaccineEffectiveness from "@/components/ChartVaccineEffectiveness";

import TitleGraphic from "@/components/TitleGraphic";
export default {
  name: "ChartsEpidemic",
  props: ["region", "fromDate", "dataCovid"],
  components: {
    "line-chart": LineChart,
    "bar-chart": BarChart,
    "incidence-bar-chart": IncidenceBarChart,
    update: Update,
    "title-graphic": TitleGraphic,
    "cases-chart": CasesChart,
    "chart-deaths": ChartDeaths,
    "chart-uci": ChartUci,
    // "chart-incidence-adjusted-by-age": ChartIncidenceAdjustedByAge,
    // "chart-incidence-by-age": ChartIncidenceByAge,
    // "chart-vaccine-effectiveness": ChartVaccineEffectiveness,
  },
  data() {
    return {
      pointRadius: 1.5,
      pointHoverRadius: 4,
      colorsPasoAPaso: {
        1: "#dd4b39",
        2: "#eba434",
        3: "rgb(235, 216, 45)",
        4: "#82CFFD",
        5: "#93DB70",
      },
      colorsPasoAPasoTransparent: {
        1: "rgb(221,75,57,0.5)",
        2: "rgb(235,164,52,0.5)",
        3: "rgb(235, 216, 45,0.5)",
        4: "rgb(130,207,253,0.5)",
        5: "rgb(147,219,112,0.5)",
      },
      backgroundColor: {
        Uci: "#dd4b39",
        Pcr: "#82CFFD",
        Cases: "#93DB70",
        Deaths: "#232b2b",
      },
      backgroundColorTransparent: {
        Uci: "rgb(221,75,57,0.5)",
        Pcr: "rgb(130,207,253,0.5)",
        Cases: "rgb(147,219,112,0.5)",
        Deaths: "rgb(35,43,43,0.5)",
      },
      title: {
        IngresoUCI: "Media móvil 7 días de ingresos a UCI por Covid-19",
        Uci: "Personas en UCI por Covid-19",
        Pcr: "Positividad y PCR ",
        Cases: "Nuevos casos diarios",
        Deaths: "Fallecidos confirmados por Covid-19 por fecha de notificación",
      },
    };
  },
  methods: {
    plotVaccinalSchemeByAge(type) {
      const labels = Object.keys(this.dataCovid.incidenceByVaccinalSchemeByAge[type]["con esquema completo"]);
      const vaccinated = Object.values(this.dataCovid.incidenceByVaccinalSchemeByAge[type]["con esquema completo"]);
      const nonVaccinated = Object.values(this.dataCovid.incidenceByVaccinalSchemeByAge[type]["sin esquema completo"]);
      const boostedVaccinated = Object.values(this.dataCovid.incidenceByVaccinalSchemeByAge[type]["con dosis refuerzo > 14 dias"]);

      return {
        labels: labels,
        datasets: [
          {
            type: "bar",
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "Con esquema completo",
            borderColor: this.colorsPasoAPaso[3],
            backgroundColor: this.colorsPasoAPaso[3],
            fill: false,
            data: vaccinated,
          },
          {
            type: "bar",
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "Sin esquema completo",
            borderColor: this.colorsPasoAPaso[1],
            backgroundColor: this.colorsPasoAPaso[1],
            fill: false,
            data: nonVaccinated,
          },
          {
            type: "bar",
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "Con dosis refuerzo > 14 dias",
            borderColor: this.colorsPasoAPaso[2],
            backgroundColor: this.colorsPasoAPaso[2],
            fill: false,
            data: boostedVaccinated,
          },
        ],
      };
    },
    plotLine(labels, values, color) {
      let fromDate = this.fromDate;
      let indexDate = labels.indexOf(fromDate);
      indexDate = indexDate > 0 ? indexDate : 0;

      return {
        labels: labels.filter((x) => {
          return dayjs(x, "DD-MM-YYYY") >= dayjs(fromDate, "DD-MM-YYYY");
        }),
        datasets: [
          {
            type: "line",
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "",
            borderColor: color,
            backgroundColor: color,
            fill: false,
            data: values.slice(indexDate),
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
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "Al menos una dosis",
            borderColor: this.colorsPasoAPaso[4],
            backgroundColor: this.colorsPasoAPasoTransparent[4],
            fill: 1,
            data: this.dataCovid[region + "Vaccine"].firstDoses.slice(indexDate),
          },
          {
            type: "line",
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "Completamente vacunado",
            borderColor: this.colorsPasoAPaso[2],
            backgroundColor: this.colorsPasoAPasoTransparent[2],
            fill: 2,
            data: this.dataCovid[region + "Vaccine"].secondDoses.slice(indexDate),
          },
          {
            type: "line",
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "Dosis de refuerzo",
            borderColor: this.backgroundColor["Deaths"],
            backgroundColor: this.backgroundColorTransparent["Deaths"],
            fill: true,
            data: this.dataCovid[region + "Vaccine"].boostDoses.slice(indexDate),
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
      let labels = ["Fase 1", "Fase 2", "Fase 3", "Fase 4", "Fase 5"];
      let pasos = Object.keys(this.colorsPasoAPaso);
      pasos.forEach((paso, index) => {
        datasets.push({
          type: "line",
          pointRadius: this.pointRadius,
          pointHoverRadius: this.pointHoverRadius,
          label: labels[index],
          borderColor: this.colorsPasoAPaso[paso],
          backgroundColor: this.colorsPasoAPaso[paso],
          fill: true,
          data: this.dataCovid.pasoAPaso["fase" + paso].slice(indexDate),
        });
      });
      return {
        labels: this.dataCovid.pasoAPaso.labels.slice(indexDate),
        datasets: datasets,
      };
    },

    getChartPosPcr(name) {
      let fromDate = this.fromDate;
      let indexDate = this.dataCovid["labelsPcr"].indexOf(fromDate);
      indexDate = indexDate > 0 ? indexDate : 0;
      let indexDatePos = indexDate - 0;
      return {
        labels: this.dataCovid["labelsPcr"].filter((x) => {
          return dayjs(x, "DD-MM-YYYY") >= dayjs(fromDate, "DD-MM-YYYY");
        }),
        datasets: [
          {
            type: "line",
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
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
      if (type == "CFR") {
        options.scales["xAxes"] = [
          {
            type: "time",
            time: {
              parser: "DD-MM-YYYY",
              unit: "month",
            },
          },
        ];
        options.tooltips["callbacks"] = {
          label: function(tooltipItem, data) {
            return data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] + "%";
          },
        };
        options.scales.yAxes[0].ticks = {
          beginAtZero: true,
          callback: function(tick) {
            return tick.toString() + "%";
          },
        };
      }
      if (type == "Vaccine") {
        options.tooltips = {
          mode: "index",
          intersect: false,
          callbacks: {
            label: function(tooltipItem, data) {
              return data.datasets[tooltipItem.datasetIndex].label + ": " + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] + "%";
            },
          },
        };
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
      if (type == "Paso") {
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
        options.scales["yAxes"] = [
          {
            stacked: true,
            ticks: {
              max: 100,
              beginAtZero: true,
              callback: function(tick) {
                return tick.toString() + "%";
              },
            },
            title: {
              display: true,
              text: "Value",
            },
          },
        ];
        options.tooltips = {
          mode: "index",
          intersect: false,
          callbacks: {
            label: function(tooltipItem, data) {
              return data.datasets[tooltipItem.datasetIndex].label + " (" + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] + "%)";
            },
          },
        };
        options.hover = {
          mode: "index",
          intersect: false,
        };
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
        options["tooltips"] = {
          mode: "index",
          intersect: true,
          callbacks: {
            label: function(tooltipItem, data) {
              if (tooltipItem.datasetIndex == 0) {
                return data.datasets[tooltipItem.datasetIndex].label + ": " + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] + "%";
              } else {
                return data.datasets[tooltipItem.datasetIndex].label + ": " + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
              }
            },
          },
        };
      }
      if (type == "Pcr" || type == "Cases" || type == "Deaths" || type == "Variant") {
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

/* .legend {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  font-size: 0.9rem;
  color: gray;
} */

/* .label {
  display: flex;
  flex-direction: row;
  align-items: center;
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
} */

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
}
</style>
