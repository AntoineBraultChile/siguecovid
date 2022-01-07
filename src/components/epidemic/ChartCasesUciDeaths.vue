<template lang="html">
  <div class="ChartCasesUciDeaths">
    <title-graphic> Casos, UCI y fallecidos por Covid-19 en {{ region }} </title-graphic>
    <update :labels="dataCovid.labelsCases"> </update>

    <bar-chart :chartData="plot(region)" :options="chartOptions('Cases')"> </bar-chart>
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
// import ButtonChoice from "@/components/ButtonChoice";

export default {
  name: "ChartCasesUciDeaths",
  props: ["region", "fromDate", "title", "dataCovid", "backgroundColor", "pointRadius"],
  components: {
    "bar-chart": BarChart,
    update: Update,
    "title-graphic": TitleGraphic,
    // "button-choice": ButtonChoice,
  },
  data() {
    return {};
  },
  methods: {
    plot(name) {
      let fromDate = this.fromDate;
      const limit = "12-04-2020";
      fromDate = dayjs(fromDate, "DD-MM-YYYY").isBefore(dayjs(limit, "DD-MM-YYYY")) ? limit : fromDate;
      let indexDateUci = this.dataCovid["labelsUci"].indexOf(fromDate);
      indexDateUci = indexDateUci > 0 ? indexDateUci : 0;
      let indexDateCases = this.dataCovid["labelsCases"].indexOf(fromDate);
      indexDateCases = indexDateCases > 0 ? indexDateCases : 0;

      let indexDateDeaths = this.dataCovid["labelsDeaths"].indexOf(fromDate);
      indexDateDeaths = indexDateDeaths > 0 ? indexDateDeaths : 0;

      let datasets = [
        {
          type: "line",
          pointRadius: this.pointRadius,
          pointHoverRadius: this.pointHoverRadius,
          yAxisID: "Cases",
          label: "Casos (media móvil de 7  días)",
          borderColor: this.backgroundColor["Cases"],
          backgroundColor: this.backgroundColor["Cases"],
          fill: false,
          data: this.dataCovid[name + "MeanCases"].slice(indexDateCases - 6),
        },
        {
          type: "line",
          pointRadius: this.pointRadius,
          pointHoverRadius: this.pointHoverRadius,
          yAxisID: "UCI",
          label: "UCI",
          borderColor: "#dd4b39",
          backgroundColor: "#dd4b39",
          fill: false,
          data: this.dataCovid[name + "Uci"].slice(indexDateUci),
        },

        {
          type: "line",
          pointRadius: this.pointRadius,
          pointHoverRadius: this.pointHoverRadius,
          yAxisID: "Muertos",

          label: "Muertos (media móvil de 7  días)",
          borderColor: this.backgroundColor["Deaths"],
          backgroundColor: this.backgroundColor["Deaths"],
          fill: false,
          data: this.dataCovid[name + "MeanDeaths"].slice(indexDateDeaths - 6),
        },
      ];
      if (name == "Chile") {
        let indexDateVM = this.dataCovid.vm.labels.indexOf(fromDate);
        indexDateVM = indexDateVM > 0 ? indexDateVM : 0;
        datasets.push({
          type: "line",
          pointRadius: this.pointRadius,
          pointHoverRadius: this.pointHoverRadius,
          yAxisID: "UCI",
          label: "Ventilación mecánica",
          borderColor: "#750227",
          backgroundColor: "#750227 ",
          fill: false,
          data: this.dataCovid.vm.vmi.slice(indexDateVM),
        });
      }
      // let indexDateMean = this.dataCovidChile['labelsMean'+type].indexOf(fromDate)
      return {
        labels: this.dataCovid["labelsUci"].slice(indexDateUci),
        datasets: datasets,
      };
    },
    chartOptions(type) {
      let options = {
        animation: {
          duration: 0,
        },
        scales: {
          // yAxes: [
          //   {
          //     ticks: {
          //       beginAtZero: true,
          //     },
          //   },
          // ],
          yAxes: [
            {
              id: "Cases",
              type: "linear",
              position: "left",
              ticks: {
                beginAtZero: true,
                // callback: function(tick) {
                //   return tick.toString() + "%";
                // },
              },
            },
            {
              id: "UCI",
              type: "linear",
              position: "right",
              // stacked: true,
            },
            {
              id: "Muertos",
              type: "linear",
              position: "right",
              // stacked: true,
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
