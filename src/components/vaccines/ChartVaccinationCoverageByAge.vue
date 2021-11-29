<template lang="html">
  <div class="ChartVaccinationCoverageByAge">
    <button-choice :tabs="tabs" :currentTab="picked" v-on:newtab="updatePicked" />

    <title-graphic v-if="picked == 'proportion'"> Cobertura de vacunación por edad en Chile</title-graphic>
    <title-graphic v-if="picked == 'absolute'"> Número de personas vacunadas por edad en Chile </title-graphic>

    <!-- <span style='font-size:1rem'> Estar parcialmente vacunado significa tener una dosis de Sinovac, Astra-Zeneca, Pfizer.</span> <br> -->
    <update :labels="vacunaChile.labels"> </update>
    <bar-chart v-if="picked == 'proportion'" :chartData="barChartVacunaPorEdad('proportion')" :options="options('proportion')"> </bar-chart>
    <bar-chart v-if="picked == 'absolute'" :chartData="barChartVacunaPorEdad('absolute')" :options="options('absolute')"> </bar-chart>
  </div>
</template>

<script>
import * as dayjs from "dayjs";
var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);
import "dayjs/locale/es"; // load on demand
dayjs.locale("es"); // use Spanish locale globally

import BarChart from "@/components/BarChart";
// import LineChart from "../components/LineChart";
// import RadioChoice from "@/components/RadioChoice";
import Update from "@/components/Update";
import TitleGraphic from "@/components/TitleGraphic";
import ButtonChoice from "@/components/ButtonChoice";

export default {
  name: "ChartVaccinationCoverageByAge",
  props: ["vacunaChile", "pointRadius", "pointHoverRadius", "fromDate"],
  components: {
    "bar-chart": BarChart,
    update: Update,
    "title-graphic": TitleGraphic,
    // "radio-choice": RadioChoice,
    "button-choice": ButtonChoice,
  },
  data() {
    return {
      picked: "proportion",
      tabs: [
        { id: "proportion", name: "Proporción" },
        { id: "absolute", name: "Valores absolutos" },
      ],
    };
  },
  methods: {
    updatePicked(payload) {
      this.picked = payload;
    },
    barChartVacunaPorEdad(type) {
      let atLeastOneDose = [];
      let completeVaccination = [];
      let boost = [];
      Object.keys(this.vacunaChile.firstDosesByAgeGroup).forEach((age) => {
        atLeastOneDose.push(this.vacunaChile.firstDosesByAgeGroup[age].slice(-1)[0]);
        completeVaccination.push(this.vacunaChile.secondDosesByAgeGroup[age].slice(-1)[0]);
        boost.push(this.vacunaChile.boostDosesByAgeGroup[age].slice(-1)[0]);
      });
      let datasets = [];
      if (type == "absolute") {
        atLeastOneDose = atLeastOneDose.map((v, i) => Math.round((v * Object.values(this.vacunaChile.populationByAge)[i]) / 100));
        completeVaccination = completeVaccination.map((v, i) => Math.round((v * Object.values(this.vacunaChile.populationByAge)[i]) / 100));
        boost = boost.map((v, i) => Math.round((v * Object.values(this.vacunaChile.populationByAge)[i]) / 100));
        datasets.push({ label: "Población total", data: Object.values(this.vacunaChile.populationByAge), backgroundColor: "#D2E6EE", hoverOffset: 4 });
      }
      datasets.push(
        {
          label: "Al menos una dosis",
          data: atLeastOneDose,
          backgroundColor: "#82CFFD",
          hoverOffset: 4,
        },
        {
          label: "Completamente vacunado",
          data: completeVaccination,
          backgroundColor: "#eba434",
          hoverOffset: 4,
        },
        {
          label: "Dosis de refuerzo",
          data: boost,
          backgroundColor: "#232b2b",
          hoverOffset: 4,
        }
      );
      return {
        labels: ["6-11 años", "12-17 años", "18-29 años", "30-39 años", "40-49 años", "50-59 años", "60-69 años", ">= 70 años"],
        datasets: datasets,
      };
    },
    options(type) {
      let opt = {
        animation: {
          duration: 0,
        },
        tooltips: {
          intersect: true,
          mode: "index",
          callbacks: {
            label: function(tooltipItem, data) {
              return data.datasets[tooltipItem.datasetIndex].label + ": " + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            },
          },
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                callback: function(tick) {
                  return tick.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                },
              },
            },
          ],
        },
        hover: {
          mode: "index",
          intersect: true,
        },
        lineTension: 1,
        responsive: true,
        maintainAspectRatio: false,
      };
      if (type == "proportion") {
        opt["scales"] = {
          yAxes: [
            {
              ticks: {
                callback: function(tick) {
                  return tick.toString() + "%";
                },
              },
            },
          ],
        };
        opt["tooltips"] = {
          mode: "index",
          intersect: true,
          callbacks: {
            label: function(tooltipItem, data) {
              return data.datasets[tooltipItem.datasetIndex].label + " (" + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] + "%)";
            },
          },
        };
      }
      return opt;
    },
  },
};
</script>
