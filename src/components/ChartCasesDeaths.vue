<template lang="html">
  <div class="ChartCasesDeaths">
    <title-graphic> Casos contra fallecidos por Covid-19 en Chile</title-graphic>
    <span style="font-size:1rem">Las muertes se enumeran por fecha de fallecimiento y corresponden a muertes confirmadas o sospechosas de Covid-19. </span>

    <br />
    <update :labels="dataCovid.newCases.labels"> </update>
    <line-chart :chartData="plot()" :options="chartOptions()"></line-chart>
  </div>
</template>

<script>
import * as dayjs from "dayjs";
var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);
import "dayjs/locale/es"; // load on demand
dayjs.locale("es"); // use Spanish locale globally

import LineChart from "./LineChart";
// import LineChart from "../components/LineChart";
// import RadioChoice from "@/components/RadioChoice";
import Update from "@/components/Update";
import TitleGraphic from "@/components/TitleGraphic";

export default {
  name: "ChartCasesDeaths",
  props: ["fromDate", "title", "dataCovid", "backgroundColor", "pointRadius", "colorsPasoAPaso"],
  components: {
    "line-chart": LineChart,
    update: Update,
    "title-graphic": TitleGraphic,
    // "radio-choice": RadioChoice,
  },
  data() {
    return {};
  },
  methods: {
    plot() {
      //   let fromDate = this.fromDate;
      //   let indexDate = this.dataCovid["labelsDeaths"].indexOf(fromDate);
      //   indexDate = indexDate > 0 ? indexDate : 0;

      // let indexDateMean = this.dataCovidChile['labelsMean'+type].indexOf(fromDate)
      return {
        // labels: this.dataCovid.newCases.labels.filter((x) => {
        //   return dayjs(x, "DD-MM-YYYY") >= dayjs(fromDate, "DD-MM-YYYY");
        // }),
        labels: this.dataCovid.newCases.labels,
        datasets: [
          //   {
          //     type: "line",
          //     pointRadius: this.pointRadius,
          //     pointHoverRadius: this.pointHoverRadius,
          //     label: "Media móvil de 7  días",
          //     borderColor: "#dd4b39",
          //     backgroundColor: "#dd4b39",
          //     fill: false,
          //     data: this.dataCovid[name + "MeanDeaths"].slice(indexDate - 6),
          //   },
          {
            type: "line",
            // yAxisID: "Cases",
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "Media móvil 7 días de los casos diarios",
            backgroundColor: "rgb(147,219,112,0.5)",
            borderColor: this.backgroundColor["Cases"],
            fill: true,
            data: this.dataCovid.newCases.values,
          },
          {
            type: "line",
            // yAxisID: "Deaths",
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "Media móvil 7 días de los fallecidos diarios",
            backgroundColor: "rgb(35,43,43,0.5)",
            borderColor: this.backgroundColor["Deaths"],
            fill: true,
            data: this.dataCovid.deaths.values,
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
          callbacks: {
            label: function(tooltipItem, data) {
              let value = Number(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]);
              return value > 0 ? data.datasets[tooltipItem.datasetIndex].label + ": " + Math.round(value) : data.datasets[tooltipItem.datasetIndex].label + ": " + Math.round(-value / 20);
            },
          },
        },

        // tooltips: {

        // },
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
                // Include a dollar sign in the ticks
                callback: function(value) {
                  return value > 0 ? Math.round(value) : Math.round(-value / 20);
                },
              },
            },
          ],
          //   yAxes: [
          //     {
          //       id: "Cases",
          //       type: "linear",
          //       position: "left",
          //     },
          //     {
          //       id: "Deaths",
          //       type: "linear",
          //       position: "right",
          //       stacked: true,
          //     },
          //   ],
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
