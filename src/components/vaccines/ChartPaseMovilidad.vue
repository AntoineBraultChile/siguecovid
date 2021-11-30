<template lang="html">
  <div class="ChartPaseMovilidad">
    <button-choice :tabs="tabs" :currentTab="picked" v-on:newtab="updatePicked" />

    <title-graphic v-if="picked == 'proportion'"> Proporción de adultos con pase de movilidad activo en Chile</title-graphic>
    <title-graphic v-if="picked == 'absolute'"> Número de adultos con pase de movilidad activo en Chile </title-graphic>

    <update :labels="vacunaChile.paseMovilidad.labels"> </update>
    <line-chart v-if="picked == 'proportion'" :chartData="plotPaseMovilidad('proportion')" :options="options('proportion')"> </line-chart>
    <line-chart v-if="picked == 'absolute'" :chartData="plotPaseMovilidad('absolute')" :options="options()"> </line-chart>
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
  name: "ChartPaseMovilidad",
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
    plotPaseMovilidad(type) {
      let labels = this.vacunaChile.paseMovilidad.labels;
      let indexDate = labels.indexOf(this.fromDate);
      indexDate = indexDate > 0 ? indexDate : 0;

      let values = this.vacunaChile.paseMovilidad[type];

      return {
        labels: labels.filter((x) => {
          return dayjs(x, "DD-MM-YYYY") >= dayjs(this.fromDate, "DD-MM-YYYY");
        }),
        datasets: [
          {
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "",
            borderColor: "#82CFFD",
            backgroundColor: "rgb(130,207,253,0.5)",
            fill: true,
            data: values.slice(indexDate),
          },
        ],
      };
    },
    options(type) {
      let opt = {
        animation: {
          duration: 0,
        },
        legend: {
          display: false,
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
          intersect: false,
          mode: "index",
          callbacks: {
            label: function(tooltipItem, data) {
              return data.datasets[tooltipItem.datasetIndex].label + " " + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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

      if (type == "proportion") {
        opt["tooltips"] = {
          mode: "index",
          intersect: false,
          callbacks: {
            label: function(tooltipItem, data) {
              return data.datasets[tooltipItem.datasetIndex].label + " " + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] + "%";
            },
          },
        };
        opt.scales.yAxes = [
          {
            ticks: {
              beginAtZero: true,
              callback: function(tick) {
                return tick.toString() + "%";
              },
            },
          },
        ];
      }
      return opt;
    },
  },
};
</script>
