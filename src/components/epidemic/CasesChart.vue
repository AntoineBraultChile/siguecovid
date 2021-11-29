<template lang="html">
  <div class="CasesChat">
    <button-choice
      :tabs="[
        { id: 'diario', name: 'Diario' },
        { id: 'variacion', name: 'Variación' },
      ]"
      :currentTab="picked"
      v-on:newtab="updatePicked"
    />
    <title-graphic v-if="picked == 'diario'"> {{ title["Cases"] }} en {{ region }} </title-graphic>
    <title-graphic v-else> Variación semanal de los nuevos casos detectados en {{ region }} </title-graphic>
    <span style="font-size:1rem">Los casos se detectan por PCR o prueba antigénica. </span>
    <br />
    <update :labels="dataCovid.labelsCases"> </update>
    <bar-chart v-if="picked == 'diario'" :chartData="plotBarChartWithMean(region, 'Cases')" :options="chartOptions('Cases')"> </bar-chart>
    <bar-chart v-else :chartData="plotVariantions(this.dataCovid['labelsCases'].slice(5), this.dataCovid[region + 'MeanCases'])" :options="chartOptions('Variations')"> </bar-chart>
    <!-- <radio-choice :picked="picked" v-on:newpicked="updatePicked" /> -->
  </div>
</template>

<script>
import * as dayjs from "dayjs";
var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);
import "dayjs/locale/es"; // load on demand
dayjs.locale("es"); // use Spanish locale globally

import BarChart from "@/components/BarChart";
import Update from "@/components/Update";
import TitleGraphic from "@/components/TitleGraphic";
import ButtonChoice from "@/components/ButtonChoice";

export default {
  name: "CasesChat",
  props: ["region", "fromDate", "beforeDate", "title", "dataCovid", "backgroundColor", "pointRadius"],
  components: {
    "bar-chart": BarChart,
    update: Update,
    "title-graphic": TitleGraphic,
    // "radio-choice": RadioChoice,
    "button-choice": ButtonChoice,
  },
  data() {
    return {
      picked: "diario",
      tabs: ["diario", "variacion"],
    };
  },
  methods: {
    updatePicked(payload) {
      this.picked = payload;
    },
    plotBarChartWithMean(name) {
      let fromDate = this.fromDate;
      let indexDate = this.dataCovid["labelsCases"].indexOf(fromDate);
      let indexBeforeDate = this.dataCovid["labelsCases"].indexOf(this.beforeDate);
      indexDate = indexDate > 0 ? indexDate : 0;
      indexBeforeDate = indexBeforeDate > 0 ? indexBeforeDate : 0;

      // let indexDateMean = this.dataCovidChile['labelsMean'+type].indexOf(fromDate)
      return {
        labels: this.dataCovid["labelsCases"].filter((x) => {
          return dayjs(x, "DD-MM-YYYY") >= dayjs(fromDate, "DD-MM-YYYY") && dayjs(x, "DD-MM-YYYY") <= dayjs(this.beforeDate, "DD-MM-YYYY");
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
            data: this.dataCovid[name + "MeanCases"].slice(indexDate - 6, indexBeforeDate - 6),
          },
          {
            type: "bar",
            label: this.title["Cases"] + " diarios",
            backgroundColor: this.backgroundColor["Cases"],
            fill: false,
            data: this.dataCovid[name + "Cases"].slice(indexDate, indexBeforeDate),
          },
        ],
      };
    },
    plotVariantions(labels, data) {
      const labelsDerivative = labels.slice(1);
      let indexDate = labelsDerivative.indexOf(this.fromDate);
      indexDate = indexDate > 0 ? indexDate : 0;

      const variations = data.map((d, index) => (index > 6 ? Math.round(((data[index] - data[index - 7]) / data[index - 7]) * 1000) / 10 : null));
      const colors = variations.map((d) => (d <= 0 ? this.backgroundColor["Cases"] : this.backgroundColor["Uci"]));
      return {
        labels: labelsDerivative.slice(indexDate),
        datasets: [
          {
            type: "bar",
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "",
            borderColor: colors.slice(indexDate),
            backgroundColor: colors.slice(indexDate),
            fill: false,
            data: variations.slice(indexDate),
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
      if (type == "Variations") {
        options.scales = {
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
        };
        options.tooltips = {
          mode: "index",
          intersect: false,
          callbacks: {
            label: function(tooltipItem, data) {
              return data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] + "%";
            },
          },
        };
      }
      if (type == "Cases") {
        options.legend = { display: true };
      }
      return options;
    },
  },
};
</script>
