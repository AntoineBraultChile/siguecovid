<template lang="html">
  <div class="ChatDeaths">
    <button-choice v-if="region == 'Chile'" :tabs="tabs" :currentTab="picked" v-on:newtab="updatePicked" />
    <title-graphic v-if="picked == 'notification'"> {{ title["Deaths"] }} en {{ region }} </title-graphic>
    <title-graphic v-if="picked == 'fallecimiento'"> Muertes por Covid-19 en Chile por fecha de fallecimiento </title-graphic>

    <span v-if="picked == 'notification'" style="font-size:1rem">Son los fallecidos por Covid-19 confirmados con un test PCR o antigénico. </span>
    <span v-if="picked == 'fallecimiento'" style="font-size:1rem">A diferencia de las muertes sospechosas, las muertes confirmadas son las que se confirman mediante PCR o pruebas antigénicas. </span>
    <br />

    <update v-if="picked == 'notification'" :labels="dataCovid.labelsDeaths"> </update>
    <update v-if="picked == 'fallecimiento'" :labels="dataCovid.deis.labels"> </update>

    <br v-if="(picked == 'notification') & (region == 'Chile')" />
    <br />

    <bar-chart v-if="picked == 'notification'" :chartData="plotBarChartWithMean(region)" :options="chartOptions('Cases')"> </bar-chart>
    <bar-chart v-if="picked == 'fallecimiento'" :chartData="plotDeis()" :options="chartOptions('Deis')"> </bar-chart>
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
import Update from "@/components/Update";
import TitleGraphic from "@/components/TitleGraphic";
import ButtonChoice from "@/components/ButtonChoice";

export default {
  name: "ChatDeaths",
  props: ["region", "fromDate", "title", "dataCovid", "backgroundColor", "pointRadius", "colorsPasoAPaso"],
  components: {
    "bar-chart": BarChart,
    update: Update,
    "title-graphic": TitleGraphic,
    // "radio-choice": RadioChoice,
    "button-choice": ButtonChoice,
  },
  data() {
    return {
      picked: "notification",
      tabs: [
        { id: "notification", name: "Por fecha de notification" },
        { id: "fallecimiento", name: "Por fecha de fallecimiento" },
      ],
    };
  },
  methods: {
    updatePicked(payload) {
      this.picked = payload;
    },
    plotBarChartWithMean(name) {
      let fromDate = this.fromDate;
      let indexDate = this.dataCovid["labelsDeaths"].indexOf(fromDate);
      indexDate = indexDate > 0 ? indexDate : 0;

      // let indexDateMean = this.dataCovidChile['labelsMean'+type].indexOf(fromDate)
      return {
        labels: this.dataCovid["labelsDeaths"].filter((x) => {
          return dayjs(x, "DD-MM-YYYY") >= dayjs(fromDate, "DD-MM-YYYY");
        }),
        datasets: [
          {
            type: "line",
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "Media móvil de 7  días",
            borderColor: "#dd4b39",
            backgroundColor: "#dd4b39",
            fill: false,
            data: this.dataCovid[name + "MeanDeaths"].slice(indexDate - 6),
          },
          {
            type: "bar",
            label: this.title["Deaths"] + " diarios",
            backgroundColor: this.backgroundColor["Deaths"],
            fill: false,
            data: this.dataCovid[name + "Deaths"].slice(indexDate),
          },
        ],
      };
    },
    plotDeis() {
      let fromDate = this.fromDate;
      let indexDate = this.dataCovid.deis.labels.indexOf(fromDate);
      indexDate = indexDate > 0 ? indexDate : 0;

      // let indexDateMean = this.dataCovidChile['labelsMean'+type].indexOf(fromDate)
      return {
        labels: this.dataCovid.deis.labels.filter((x) => {
          return dayjs(x, "DD-MM-YYYY") >= dayjs(fromDate, "DD-MM-YYYY");
        }),
        datasets: [
          {
            type: "line",
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "Total muertes (media móvil de 7 días)",
            borderColor: "#dd4b39",
            backgroundColor: "#dd4b39",
            fill: false,
            data: this.dataCovid.deis.mediaMovil.slice(indexDate - 6),
          },
          {
            type: "bar",
            label: "Fallecidos confirmados",
            backgroundColor: this.backgroundColor["Deaths"],
            fill: false,
            data: this.dataCovid.deis.confirmed.slice(indexDate),
          },
          {
            type: "bar",
            label: "Fallecidos sospechosos",
            backgroundColor: this.colorsPasoAPaso[2],
            fill: false,
            data: this.dataCovid.deis.suspected.slice(indexDate),
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
          display: true,
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
      if (type == "Deis") {
        options.scales = {
          xAxes: [
            {
              stacked: true,
            },
          ],
          yAxes: [
            {
              stacked: true,
            },
          ],
        };
      }

      return options;
    },
  },
};
</script>
