<template lang="html">
  <div class="ChartIncidenceAdjustedByAge">
    <button-choice :tabs="tabs" :currentTab="picked" v-on:newtab="updatePicked" />

    <title-graphic v-if="picked == 'cases'"> Incidencia de casos según esquema de vacunación ajustada por edad </title-graphic>
    <title-graphic v-if="picked == 'uci'"> Incidencia en UCI según esquema de vacunación ajustada por edad </title-graphic>
    <title-graphic v-if="picked == 'deaths'"> Incidencia de fallecidos según esquema de vacunación ajustada por edad </title-graphic>
    <!-- <br v-if="picked == 'cases' || picked == 'uci'" /> -->

    <span v-if="picked == 'cases'" style="font-size:1rem">Número de casos detectados cada semana epidemiológica por cada 100.000 personas en cada grupo ajustada por edad.</span>
    <span v-if="picked == 'uci'" style="font-size:1rem">Número de personas que ingresaron cada semana epidemiológica por cada 100.000 personas en cada grupo ajustada por edad. </span>
    <span v-if="picked == 'deaths'" style="font-size:1rem">Número de personas que fallecieron cada semana epidemiológica por cada 100.000 personas en cada grupo ajustada por edad. </span>

    <br />
    <update :labels="Object.keys(dataCovid.incidenceVaccinalAjustedByAge.cases['sin esquema completo'])"> </update>
    <line-chart v-if="picked == 'cases'" :chartData="plotIncidenceVaccinalByAge('cases')" :options="chartOptions()"></line-chart>
    <line-chart v-if="picked == 'uci'" :chartData="plotIncidenceVaccinalByAge('uci')" :options="chartOptions()"></line-chart>
    <line-chart v-if="picked == 'deaths'" :chartData="plotIncidenceVaccinalByAge('deaths')" :options="chartOptions()"></line-chart>
  </div>
</template>

<script>
import * as dayjs from "dayjs";
var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);
import "dayjs/locale/es"; // load on demand
dayjs.locale("es"); // use Spanish locale globally

import LineChart from "@/components/LineChart";
// import LineChart from "../components/LineChart";
// import RadioChoice from "@/components/RadioChoice";
import Update from "@/components/Update";
import TitleGraphic from "@/components/TitleGraphic";
import ButtonChoice from "@/components/ButtonChoice";

export default {
  name: "ChartIncidenceAdjustedByAge",
  props: ["fromDate", "title", "dataCovid", "backgroundColor", "pointRadius", "colorsPasoAPaso"],
  components: {
    "line-chart": LineChart,
    update: Update,
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
    plotIncidenceVaccinalByAge(type) {
      let labels = Object.keys(this.dataCovid.incidenceVaccinalAjustedByAge[type]["sin esquema completo"]);
      return {
        labels: labels,
        datasets: [
          {
            type: "line",
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "Sin esquema completo",
            borderColor: this.colorsPasoAPaso[1],
            backgroundColor: this.colorsPasoAPaso[1],
            fill: false,
            data: Object.values(this.dataCovid.incidenceVaccinalAjustedByAge[type]["sin esquema completo"]),
          },
          {
            type: "line",
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "Con esquema completo",
            borderColor: this.colorsPasoAPaso[3],
            backgroundColor: this.colorsPasoAPaso[3],
            fill: false,
            data: Object.values(this.dataCovid.incidenceVaccinalAjustedByAge[type]["con esquema completo"]),
          },
          {
            type: "line",
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "Con dosis refuerzo > 14 días",
            borderColor: this.colorsPasoAPaso[2],
            backgroundColor: this.colorsPasoAPaso[2],
            fill: false,
            data: Object.values(this.dataCovid.incidenceVaccinalAjustedByAge[type]["con dosis refuerzo > 14 dias"]),
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
          xAxes: [
            {
              type: "time",
              time: {
                parser: "DD-MM-YYYY",
                unit: "month",
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
