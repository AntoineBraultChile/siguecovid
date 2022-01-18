<template lang="html">
  <div class="ChartRatioByAge">
    <button-choice :tabs="tabs" :currentTab="picked" v-on:newtab="updatePicked" />

    <title-graphic v-if="picked != 'Total'"> Proporción de personas vacunadas en cada categoria entre el {{ updateWeek }} y el {{ updateSaturday }} en el grupo de edad {{ picked }}</title-graphic>
    <title-graphic v-else> Proporción de personas vacunadas en cada categoria entre el {{ updateWeek }} y el {{ updateSaturday }}</title-graphic>

    <br />
    <bar-chart :chartData="plotVaccinalSchemeByAge(picked, updateWeek)" :options="chartOptions()"></bar-chart>
    <!-- <bar-chart v-if="picked == 'uci'" :chartData="plotVaccinalSchemeByAge('uci', updateWeek)" :options="chartOptions()"></bar-chart>
    <bar-chart v-if="picked == 'deaths'" :chartData="plotVaccinalSchemeByAge('deaths', updateWeek)" :options="chartOptions()"></bar-chart> -->
    <div class="slidecontainer">
      <input type="range" :min="0" :max="weekSundayDates.length - 1" v-model="numberCurrentWeek" class="slider" id="myRange" />
    </div>
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
import TitleGraphic from "@/components/TitleGraphic";
import ButtonChoice from "@/components/ButtonChoice";

export default {
  name: "ChartRatioByAge",
  props: ["fromDate", "title", "dataCovid", "backgroundColor", "pointRadius", "colorsPasoAPaso"],
  components: {
    "bar-chart": BarChart,
    "title-graphic": TitleGraphic,
    // "radio-choice": RadioChoice,
    "button-choice": ButtonChoice,
  },
  data() {
    return {
      // picked: "80 años o más",
      picked: "Total",

      tabs: [
        { id: "Total", name: "Total" },
        { id: "12 - 20 años", name: "12-20 años" },
        { id: "21 - 30 años", name: "21-30 años" },
        { id: "31 - 40 años", name: "31-40 años" },
        { id: "41 - 50 años", name: "41-50 años" },
        { id: "51 - 60 años", name: "51-60 años" },
        { id: "61 - 70 años", name: "61-70 años" },
        { id: "71 - 80 años", name: "71-80 años" },
        { id: "81 años o más", name: "81 años o más" },
      ],
      weekSundayDates: [],
      currentWeek: "",
      numberCurrentWeek: 0,
    };
  },
  computed: {
    updateWeek() {
      return this.weekSundayDates[this.numberCurrentWeek];
    },
    updateSaturday() {
      let saturday = dayjs(this.weekSundayDates[this.numberCurrentWeek], "DD-MM-YYYY")
        .add(6, "d")
        .format("DD-MM-YYYY");
      return saturday;
    },
  },
  methods: {
    updatePicked(payload) {
      this.picked = payload;
    },
    plotVaccinalSchemeByAge(age, week) {
      //   const labels = Object.keys(this.dataCovid.ratioVaccinatedByAge);
      const labels = ["Población", "Casos", "Ingresos en UCI", "Fallecidos por Covid-19"];
      const esquema = Object.keys(this.dataCovid.ratioVaccinatedByAge["population"][week][age]);
      let values = [];
      esquema.forEach((e) => {
        values.push([
          this.dataCovid.ratioVaccinatedByAge["population"][week][age][e],
          this.dataCovid.ratioVaccinatedByAge["cases"][week][age][e],
          this.dataCovid.ratioVaccinatedByAge["uci"][week][age][e],
          this.dataCovid.ratioVaccinatedByAge["deaths"][week][age][e],
        ]);
      });
      return {
        labels: labels,
        datasets: [
          {
            type: "bar",
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "Sin esquema completo",
            borderColor: this.colorsPasoAPaso[1],
            backgroundColor: this.colorsPasoAPaso[1],
            fill: false,
            data: values[0],
          },
          {
            type: "bar",
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "Con esquema completo",
            borderColor: this.colorsPasoAPaso[3],
            backgroundColor: this.colorsPasoAPaso[3],
            fill: false,
            data: values[1],
          },

          {
            type: "bar",
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "Con dosis refuerzo > 14 dias",
            borderColor: this.colorsPasoAPaso[2],
            backgroundColor: this.colorsPasoAPaso[2],
            fill: false,
            data: values[2],
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
              return data.datasets[tooltipItem.datasetIndex].label + ": " + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] + "%";
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
              stacked: true,
              ticks: {
                max: 100,
                beginAtZero: true,
                callback: function(tick) {
                  return tick.toString() + "%";
                },
              },
            },
          ],
          xAxes: [
            {
              stacked: true,
            },
          ],
        },
        responsive: true,
        maintainAspectRatio: false,
      };
      return options;
    },
  },
  async created() {
    this.weekSundayDates = Object.keys(this.dataCovid.ratioVaccinatedByAge["population"]);
    this.currentWeek = this.weekSundayDates.slice(-1)[0];
    this.numberCurrentWeek = this.weekSundayDates.indexOf(this.currentWeek);
  },
};
</script>

<style lang="css" scoped>
.slidecontainer {
  width: 100%; /* Width of the outside container */
}

/* The slider itself */
.slider {
  -webkit-appearance: none; /* Override default CSS styles */
  appearance: none;
  width: 90%; /* Full-width */
  height: 15px; /* Specified height */
  background: #f0f0f0; /* Grey background */
  outline: none; /* Remove outline */
  opacity: 0.7; /* Set transparency (for mouse-over effects on hover) */
  -webkit-transition: 0.2s; /* 0.2 seconds transition on hover */
  transition: opacity 0.2s;
}

/* Mouse-over effects */
.slider:hover {
  opacity: 1; /* Fully shown on mouse-over */
}

/* The slider handle (use -webkit- (Chrome, Opera, Safari, Edge) and -moz- (Firefox) to override default look) */
.slider::-webkit-slider-thumb {
  -webkit-appearance: none; /* Override default look */
  appearance: none;
  width: 15px; /* Set a specific slider handle width */
  height: 15px; /* Slider handle height */
  background: #82cffd; /* Green background */
  cursor: pointer; /* Cursor on hover */
}

.slider::-moz-range-thumb {
  width: 15px; /* Set a specific slider handle width */
  height: 15px; /* Slider handle height */
  background: #82cffd; /* Green background */
  cursor: pointer; /* Cursor on hover */
}
</style>
