<template lang="html">
  <div class="ChartProportionVaccine">
    <button-choice :tabs="tabs" :currentTab="picked" v-on:newtab="updatePicked" />

    <title-graphic v-if="picked == 'second'"> Proporción de cada tipo de vacuna utilizada en Chile </title-graphic>
    <title-graphic v-if="picked == 'third'"> Proporción de cada tipo de vacuna utilizada por la dosis de refuerzo en Chile</title-graphic>
    <title-graphic v-if="picked == 'fourth'"> Proporción de cada tipo de vacuna utilizada por la cuarta dosis en Chile</title-graphic>

    <span v-if="picked == 'second'" style="font-size:1rem">
      Sólo se tienen en cuenta las personas completamente (dosis dosis o dosis única) vacunadas.
    </span>
    <br />
    <!-- <span style='font-size:1rem'> Estar parcialmente vacunado significa tener una dosis de Sinovac, Astra-Zeneca, Pfizer.</span> <br> -->
    <update :labels="data.labels"> </update>
    <doughnut-chart v-if="picked == 'second'" :chartData="renderChartDoughnut('second')" :options="options"> </doughnut-chart>
    <doughnut-chart v-if="picked == 'third'" :chartData="renderChartDoughnut('boost')" :options="options"> </doughnut-chart>
    <doughnut-chart v-if="picked == 'fourth'" :chartData="renderChartDoughnut('fourth')" :options="options"> </doughnut-chart>
  </div>
</template>

<script>
import * as dayjs from "dayjs";
var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);
import "dayjs/locale/es"; // load on demand
dayjs.locale("es"); // use Spanish locale globally
import DoughnutChart from "@/components/DoughnutChart";

// import BarChart from "./BarChart";
// import LineChart from "../components/LineChart";
// import RadioChoice from "@/components/RadioChoice";
import Update from "@/components/Update";
import TitleGraphic from "@/components/TitleGraphic";
import ButtonChoice from "@/components/ButtonChoice";

export default {
  name: "ChartProportionVaccine",
  props: ["data", "fromDate"],
  components: {
    // "bar-chart": BarChart,
    update: Update,
    "title-graphic": TitleGraphic,
    // "radio-choice": RadioChoice,
    "button-choice": ButtonChoice,
    "doughnut-chart": DoughnutChart,
  },
  data() {
    return {
      picked: "second",
      tabs: [
        { id: "second", name: "Completamente vacunados" },
        { id: "third", name: "Dosis de refuerzo" },
        { id: "fourth", name: "Cuarta dosis" },
      ],

      options: {
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              //get the concerned dataset
              var dataset = data.datasets[tooltipItem.datasetIndex];
              //calculate the total of this data set
              var total = dataset.data.reduce(function(previousValue, currentValue) {
                return previousValue + currentValue;
              });
              //get the current items value
              var currentValue = dataset.data[tooltipItem.index];
              //calculate the precentage based on the total and current item, also this does a rough rounding to give a whole number
              // var percentage = Math.floor(((currentValue/total) * 100)+0.5);
              var percentage = Math.round((currentValue / total) * 1000) / 10;
              return " " + percentage + "%";
            },
          },
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },
  methods: {
    updatePicked(payload) {
      this.picked = payload;
    },
    renderChartDoughnut(dose) {
      return {
        // labels: ["AstraZeneca", "Pfizer", "Sinovac", "CanSino", "Janssen"],
        labels: dose === "second" ? ["AstraZeneca", "Moderna", "Pfizer", "Sinovac", "Cansino"] : ["AstraZeneca", "Moderna", "Pfizer", "Sinovac"],
        datasets: [
          {
            label: "",
            data: this.data[dose + "Doses"].proportion,
            backgroundColor: dose === "second" ? ["#eba434", "#82CFFD", "#f87979", "#93DB70", "#845EC2"] : ["#eba434", "#82CFFD", "#f87979", "#93DB70"],
            hoverOffset: 4,
          },
        ],
      };
    },
  },
};
</script>
