<template lang="html">
  <div class="ChartVaccineByAge">
    <button-choice :tabs="tabs" :currentTab="picked" v-on:newtab="updatePicked" />

    <title-graphic v-if="picked == 'first'"> Personas con al menos una dosis por edad en Chile</title-graphic>
    <title-graphic v-if="picked == 'second'"> Personas completamente vacunadas por edad en Chile </title-graphic>
    <title-graphic v-if="picked == 'third'"> Personas con dosis de refuerzo por edad en Chile</title-graphic>

    <!-- <span style='font-size:1rem'> Estar parcialmente vacunado significa tener una dosis de Sinovac, Astra-Zeneca, Pfizer.</span> <br> -->
    <update :labels="vacunaChile.labels"> </update>
    <line-chart v-if="picked == 'first'" :chartData="renderChileVaccineByAge('firstDosesByAgeGroup')" :options="options()"> </line-chart>
    <line-chart v-if="picked == 'second'" :chartData="renderChileVaccineByAge('secondDosesByAgeGroup')" :options="options()"> </line-chart>
    <line-chart v-if="picked == 'third'" :chartData="renderChileVaccineByAge('boostDosesByAgeGroup')" :options="options()"> </line-chart>
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
  name: "ChartVaccineByAge",
  props: ["vacunaChile", "pointRadius", "pointHoverRadius", "fromDate"],
  components: {
    "line-chart": LineChart,
    update: Update,
    "title-graphic": TitleGraphic,
    // "radio-choice": RadioChoice,
    "button-choice": ButtonChoice,
  },
  data() {
    return {
      picked: "first",
      tabs: [
        { id: "first", name: "Al menos una dosis" },
        { id: "second", name: "Completamente vacunados" },
        { id: "third", name: "Dosis de refuerzo" },
      ],
    };
  },
  methods: {
    updatePicked(payload) {
      this.picked = payload;
    },
    renderChileVaccineByAge(dosesType) {
      let indexDate = this.vacunaChile.labelsByAge.indexOf(this.fromDate);

      return {
        labels: this.vacunaChile.labelsByAge.filter((x) => {
          return dayjs(x, "DD-MM-YYYY") >= dayjs(this.fromDate, "DD-MM-YYYY");
        }),
        datasets: [
          {
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "6-11",
            borderColor: "#D2E6EE",
            backgroundColor: "#D2E6EE",
            fill: false,
            data: this.vacunaChile[dosesType]["12"].slice(indexDate),
          },
          {
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "12-17",

            borderColor: "#82CFFD",
            backgroundColor: "#82CFFD",
            fill: false,
            data: this.vacunaChile[dosesType]["18"].slice(indexDate),
          },
          {
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "18-29",

            borderColor: "#FFCD01",
            backgroundColor: "#FFCD01",
            fill: false,
            data: this.vacunaChile[dosesType]["30"].slice(indexDate),
          },
          {
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "30-39",
            borderColor: "#eba434",
            backgroundColor: "#eba434",
            fill: false,
            data: this.vacunaChile[dosesType]["40"].slice(indexDate),
          },
          {
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "40-49",
            borderColor: "#93DB70",
            backgroundColor: "#93DB70",
            fill: false,
            data: this.vacunaChile[dosesType]["50"].slice(indexDate),
          },
          {
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "50-59",
            borderColor: "#f87979",
            backgroundColor: "#f87979",
            fill: false,
            data: this.vacunaChile[dosesType]["60"].slice(indexDate),
          },
          {
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "60-69",
            borderColor: "#845EC2",
            backgroundColor: "#845EC2",
            fill: false,
            data: this.vacunaChile[dosesType]["70"].slice(indexDate),
          },
          {
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: ">=70",
            borderColor: "#232b2b",
            backgroundColor: "#232b2b",
            fill: false,
            data: this.vacunaChile[dosesType]["300"].slice(indexDate),
          },
        ],
      };
    },
    options() {
      let opt = {
        animation: {
          duration: 0,
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                callback: function(tick) {
                  return tick.toString() + "%";
                },
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
        tooltips: {
          mode: "index",
          intersect: true,
          callbacks: {
            label: function(tooltipItem, data) {
              return data.datasets[tooltipItem.datasetIndex].label + " (" + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] + "%)";
            },
          },
        },
        hover: {
          mode: "index",
          intersect: true,
        },
        lineTension: 1,
        responsive: true,
        maintainAspectRatio: false,
      };
      return opt;
    },
  },
};
</script>
