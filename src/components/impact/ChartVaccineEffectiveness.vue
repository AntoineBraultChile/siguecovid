<template lang="html">
  <div class="ChartVaccineEffectiveness">
    <button-choice :tabs="tabs" :currentTab="picked" v-on:newtab="updatePicked" />

    <title-graphic v-if="picked == 'cases'"> Efectividad de las vacunas contra los casos en Chile</title-graphic>
    <title-graphic v-if="picked == 'uci'"> Efectividad de las vacunas contra el ingreso en UCI en Chile </title-graphic>
    <title-graphic v-if="picked == 'deaths'"> Efectividad de las vacunas contra el fallecimiento en Chile </title-graphic>
    <!-- <br v-if="picked == 'cases' || picked == 'uci'" /> -->

    <span style="font-size:1rem">La efectividad se estima por el método de tamizaje, teniendo en cuenta la edad como variable de confusión.</span>

    <br />
    <update :labels="Object.keys(dataCovid.ve.cases['vaccinated'])"> </update>
    <line-chart v-if="picked == 'cases'" :chartData="plotVE('cases')" :options="chartOptions()"></line-chart>
    <line-chart v-if="picked == 'uci'" :chartData="plotVE('uci')" :options="chartOptions()"></line-chart>
    <line-chart v-if="picked == 'deaths'" :chartData="plotVE('deaths')" :options="chartOptions()"></line-chart>
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
  name: "ChartVaccineEffectiveness",
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
    plotVE(type) {
      let fromDate = this.fromDate;
      let labels = Object.keys(this.dataCovid.ve[type]["vaccinated"]);
      let indexDate = labels.indexOf(fromDate);
      indexDate = indexDate > 0 ? indexDate : 0;

      let boostVE = [];
      let boostVE_lb = [];
      let boostVE_ub = [];
      labels.forEach((label) => {
        let ve = this.dataCovid.ve[type]["boost"][label];
        if (ve != undefined) {
          boostVE.push(ve.mean);
          boostVE_lb.push(ve.lb);
          boostVE_ub.push(ve.ub);
        } else {
          boostVE.push(undefined);
          boostVE_lb.push(undefined);
          boostVE_ub.push(undefined);
        }
      });

      return {
        labels: labels.filter((x) => {
          return dayjs(x, "DD-MM-YYYY") >= dayjs(fromDate, "DD-MM-YYYY");
        }),
        datasets: [
          {
            type: "line",
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "Con esquema completo",
            borderColor: this.colorsPasoAPaso[3],
            backgroundColor: this.colorsPasoAPaso[3],
            fill: false,
            data: Object.values(this.dataCovid.ve[type]["vaccinated"])
              .map((d) => d.mean)
              .slice(indexDate),
          },
          {
            label: "Intervalo de confianza del 95%",
            type: "line",
            backgroundColor: "rgb(130,207,253,0.5)",
            borderColor: "transparent",
            pointRadius: 0,
            fill: 0,
            // tension: 0,
            data: Object.values(this.dataCovid.ve[type]["vaccinated"])
              .map((d) => d.lb)
              .slice(indexDate),
            // yAxisID: "y",
            // xAxisID: "x",
          },
          {
            label: "upper",
            type: "line",
            backgroundColor: "rgb(130,207,253,0.5)",
            borderColor: "transparent",
            pointRadius: 0,
            fill: 0,
            // tension: 0,
            data: Object.values(this.dataCovid.ve[type]["vaccinated"])
              .map((d) => d.ub)
              .slice(indexDate),
            // yAxisID: "y",
            // xAxisID: "x",
          },

          {
            type: "line",
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "Con dosis refuerzo > 14 días",
            borderColor: this.colorsPasoAPaso[2],
            backgroundColor: this.colorsPasoAPaso[2],
            fill: false,
            data: boostVE.slice(indexDate),
          },
          {
            type: "line",
            pointRadius: 0,
            fill: 3,
            // tension: 0,
            label: "Intervalo de confianza del 95%",
            borderColor: "transparent",
            backgroundColor: "rgb(235,164,52,0.5)",
            data: boostVE_lb.slice(indexDate),
          },
          {
            type: "line",
            pointRadius: 0,
            fill: 3,
            // tension: 0,
            label: "upper",
            borderColor: "transparent",
            backgroundColor: "rgb(235,164,52,0.5)",
            data: boostVE_ub.slice(indexDate),
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
          labels: {
            filter: function(item) {
              // Logic to remove a particular legend item goes here
              return !item.text.includes("upper");
            },
          },
        },
        tooltips: {
          mode: "index",
          intersect: false,
          callbacks: {
            label: function(tooltipItem, data) {
              if (data.datasets[tooltipItem.datasetIndex].label != "upper") {
                if (data.datasets[tooltipItem.datasetIndex].label == "Intervalo de confianza del 95%") {
                  return (
                    data.datasets[tooltipItem.datasetIndex].label +
                    ": " +
                    data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] +
                    "%" +
                    " - " +
                    data.datasets[tooltipItem.datasetIndex + 1].data[tooltipItem.index] +
                    "%"
                  );
                } else {
                  return data.datasets[tooltipItem.datasetIndex].label + ": " + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] + "%";
                }
              }
            },
          },
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
        responsive: true,
        maintainAspectRatio: false,
      };
      return options;
    },
  },
};
</script>
