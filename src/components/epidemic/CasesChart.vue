<template lang="html">
  <div class="CasesChat">
    <!-- <button-choice
      :tabs="[
        { id: 'diario', name: 'Diario' },
        { id: 'variacion', name: 'Variación' },
      ]"
      :currentTab="picked"
      v-on:newtab="updatePicked"
    /> -->
    <button-choice
      :tabs="[
        { id: 'diario', name: 'Diario' },
        { id: 'late', name: 'Con casos retrasados' },
      ]"
      :currentTab="picked"
      v-on:newtab="updatePicked"
    />
    <div class="withVar">
      <input type="checkbox" id="checkbox" v-model="checked" />
      <label for="checkbox" style="font-size:0.9rem;text-align:right">Variación</label>
    </div>
    <title-graphic v-if="picked == 'diario'"> {{ title["Cases"] }} en {{ region }} </title-graphic>
    <title-graphic v-if="picked == 'late'"> Nuevos casos y casos notificados con retraso en {{ region }} </title-graphic>

    <!-- <title-graphic v-else> Variación semanal de los nuevos casos detectados en {{ region }} </title-graphic> -->
    <span style="font-size:1rem" v-if="picked == 'diario'">Casos detectados en las últimas 24h por PCR o prueba antigénica. </span>
    <span style="font-size:1rem" v-if="picked == 'late'">Casos detectados en las últimas 24h y casos notificados con retraso. </span>

    <br />

    <update :labels="dataCovid.labelsCases"> </update>

    <bar-chart
      v-if="(picked == 'diario') & !checked"
      :chartData="plotBarChartWithMean(dataCovid['labelsCases'], dataCovid[region + 'Cases'], dataCovid[region + 'MeanCases'])"
      :options="chartOptions('Cases')"
    >
    </bar-chart>
    <bar-chart v-if="(picked == 'diario') & checked" :chartData="plotVariantions(this.dataCovid['labelsCases'].slice(5), this.dataCovid[region + 'MeanCases'])" :options="chartOptions('Variations')">
    </bar-chart>
    <bar-chart
      v-if="(picked == 'late') & !checked"
      :chartData="plotBarChartWithMean(dataCovid.casesAcc.labels, dataCovid.casesAcc[region].values, dataCovid.casesAcc[region].meanWeek)"
      :options="chartOptions('Cases')"
    >
    </bar-chart>
    <bar-chart v-if="(picked == 'late') & checked" :chartData="plotVariantions(dataCovid.casesAcc.labels.slice(5), dataCovid.casesAcc[region].meanWeek)" :options="chartOptions('Variations')">
    </bar-chart>

    <!-- <bar-chart v-else :chartData="plotVariantions(this.dataCovid['labelsCases'].slice(5), this.dataCovid[region + 'MeanCases'])" :options="chartOptions('Variations')"> </bar-chart> -->

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
// import LineChart from "../components/LineChart";
// import RadioChoice from "@/components/RadioChoice";
import Update from "@/components/Update";
import TitleGraphic from "@/components/TitleGraphic";
import ButtonChoice from "@/components/ButtonChoice";

export default {
  name: "CasesChat",
  props: ["region", "fromDate", "title", "dataCovid", "backgroundColor", "pointRadius"],
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
      tabs: ["diario", "late"],
      checked: false,
    };
  },
  methods: {
    updatePicked(payload) {
      this.picked = payload;
    },
    plotBarChartWithMean(labels, values, mean) {
      let fromDate = this.fromDate;
      let indexDate = labels.indexOf(fromDate);
      indexDate = indexDate > 0 ? indexDate : 0;

      // let indexDateMean = this.dataCovidChile['labelsMean'+type].indexOf(fromDate)
      return {
        labels: this.dataCovid["labelsCases"].filter((x) => {
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
            data: mean.slice(indexDate - 6),
          },
          {
            type: "bar",
            label: this.title["Cases"] + " diarios",
            borderColor: this.backgroundColor["Cases"],
            backgroundColor: this.backgroundColor["Cases"],
            fill: false,
            data: values.slice(indexDate),
          },
        ],
      };
    },
    // plotCasesAcc(name) {
    //   let fromDate = this.fromDate;
    //   let indexDate = this.dataCovid.casesAcc.labels.indexOf(fromDate);
    //   indexDate = indexDate > 0 ? indexDate : 0;

    //   // let indexDateMean = this.dataCovidChile['labelsMean'+type].indexOf(fromDate)
    //   return {
    //     labels: this.dataCovid.casesAcc.labels.filter((x) => {
    //       return dayjs(x, "DD-MM-YYYY") >= dayjs(fromDate, "DD-MM-YYYY");
    //     }),
    //     datasets: [
    //       {
    //         type: "line",
    //         pointRadius: this.pointRadius,
    //         pointHoverRadius: this.pointHoverRadius,
    //         label: "Media móvil de 7  días",
    //         borderColor: "#dd4b39",
    //         backgroundColor: "#dd4b39",
    //         fill: false,
    //         data: this.dataCovid.casesAcc[name].mean.slice(indexDate - 6),
    //       },
    //       {
    //         type: "bar",
    //         label: this.title["Cases"] + " diarios",
    //         backgroundColor: this.backgroundColor["Cases"],
    //         fill: false,
    //         data: this.dataCovid.casesAcc[name].values.slice(indexDate),
    //       },
    //     ],
    //   };
    // },
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

<style lang="css" scoped>
.withVar {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  margin: 10px 10px -25px 1px;
}
</style>
