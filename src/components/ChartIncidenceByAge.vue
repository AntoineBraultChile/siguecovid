<template lang="html">
  <div class="ChartIncidenceyByAge">
    <button-choice v-if="region == 'Chile'" :tabs="tabs" :currentTab="picked" v-on:newtab="updatePicked" />

    <title-graphic v-if="picked == 'cases'"> Incidencia por estado de vacunación y grupo de edad </title-graphic>
    <title-graphic v-if="picked == 'uci'"> Incidencia de los ingresos a UCI por estado de vacunación y grupo de edad </title-graphic>
    <title-graphic v-if="picked == 'deaths'"> Incidencia de fallecidos por estado de vacunación y grupo de edad en Chile </title-graphic>
    <!-- <br v-if="picked == 'cases' || picked == 'uci'" /> -->

    <span v-if="picked == 'cases'" style="font-size:1rem"
      >Número de casos detectados entre el {{ dataCovid.incidenceByVaccinalSchemeByAge["week"][0] }} y el {{ dataCovid.incidenceByVaccinalSchemeByAge["week"][1] }} por cada 100.000 personas en cada
      grupo.</span
    >
    <span v-if="picked == 'uci'" style="font-size:1rem">
      Número de personas que ingresaron a UCI por Covid-19 entre el {{ dataCovid.incidenceByVaccinalSchemeByAge["week"][0] }} y el {{ dataCovid.incidenceByVaccinalSchemeByAge["week"][1] }} por cada
      100.000 personas en cada grupo.
    </span>
    <span v-if="picked == 'deaths'" style="font-size:1rem"
      >Número de personas fallecidas por Covid-19 entre el {{ dataCovid.incidenceByVaccinalSchemeByAge["week"][0] }} y el {{ dataCovid.incidenceByVaccinalSchemeByAge["week"][1] }} por cada 100.000
      personas en cada grupo.
    </span>

    <br />
    <bar-chart v-if="picked == 'cases'" :chartData="plotVaccinalSchemeByAge('cases')" :options="chartOptions()"></bar-chart>
    <bar-chart v-if="picked == 'uci'" :chartData="plotVaccinalSchemeByAge('uci')" :options="chartOptions()"></bar-chart>
    <bar-chart v-if="picked == 'deaths'" :chartData="plotVaccinalSchemeByAge('deaths')" :options="chartOptions()"></bar-chart>
  </div>
</template>

<script>
import * as dayjs from "dayjs";
var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);
import "dayjs/locale/es"; // load on demand
dayjs.locale("es"); // use Spanish locale globally

import BarChart from "./BarChart";
// import LineChart from "../components/LineChart";
// import RadioChoice from "@/components/RadioChoice";
import TitleGraphic from "@/components/TitleGraphic";
import ButtonChoice from "@/components/ButtonChoice";

export default {
  name: "ChartIncidenceyByAge",
  props: ["region", "fromDate", "title", "dataCovid", "backgroundColor", "pointRadius", "colorsPasoAPaso"],
  components: {
    "bar-chart": BarChart,
    "title-graphic": TitleGraphic,
    // "radio-choice": RadioChoice,
    "button-choice": ButtonChoice,
  },
  data() {
    return {
      picked: "cases",
      tabs: [
        { id: "cases", name: "Casos" },
        { id: "uci", name: "UCI" },
        { id: "deaths", name: "Fallecidos" },
      ],
    };
  },
  methods: {
    updatePicked(payload) {
      this.picked = payload;
    },
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

    chartOptions() {
      let options = {
        animation: {
          duration: 0,
        },
        legend: {
          display: true,
        },
        tooltips: {
          mode: "index",
          intersect: false,
        },
        hover: {
          mode: "index",
          intersect: false,
        },
        interaction: {
          mode: "nearest",
          axis: "x",
          intersect: false,
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
        responsive: true,
        maintainAspectRatio: false,
      };
      return options;
    },
  },
};
</script>
