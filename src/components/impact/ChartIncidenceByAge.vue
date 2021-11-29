<template lang="html">
  <div class="ChartIncidenceyByAge">
    <button-choice :tabs="tabs" :currentTab="picked" v-on:newtab="updatePicked" />

    <title-graphic v-if="picked == 'cases'"> Incidencia por estado de vacunación y grupo de edad </title-graphic>
    <title-graphic v-if="picked == 'uci'"> Incidencia de los ingresos a UCI por estado de vacunación y grupo de edad </title-graphic>
    <title-graphic v-if="picked == 'deaths'"> Incidencia de fallecidos por estado de vacunación y grupo de edad en Chile </title-graphic>
    <!-- <br v-if="picked == 'cases' || picked == 'uci'" /> -->

    <span v-if="picked == 'cases'" style="font-size:1rem">Número de casos detectados entre el {{ updateWeek }} y el {{ updateSaturday }} por cada 100.000 personas en cada grupo.</span>
    <span v-if="picked == 'uci'" style="font-size:1rem">
      Número de personas que ingresaron a UCI por Covid-19 entre el {{ updateWeek }} y el {{ updateSaturday }} por cada 100.000 personas en cada grupo.
    </span>
    <span v-if="picked == 'deaths'" style="font-size:1rem"
      >Número de personas fallecidas por Covid-19 entre el {{ updateWeek }} y el {{ updateSaturday }} por cada 100.000 personas en cada grupo.
    </span>

    <br />
    <bar-chart v-if="picked == 'cases'" :chartData="plotVaccinalSchemeByAge('cases', updateWeek)" :options="chartOptions()"></bar-chart>
    <bar-chart v-if="picked == 'uci'" :chartData="plotVaccinalSchemeByAge('uci', updateWeek)" :options="chartOptions()"></bar-chart>
    <bar-chart v-if="picked == 'deaths'" :chartData="plotVaccinalSchemeByAge('deaths', updateWeek)" :options="chartOptions()"></bar-chart>
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
  name: "ChartIncidenceyByAge",
  props: ["fromDate", "title", "dataCovid", "backgroundColor", "pointRadius", "colorsPasoAPaso"],
  components: {
    "bar-chart": BarChart,
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
    plotVaccinalSchemeByAge(type, week) {
      const labels = Object.keys(this.dataCovid.incidenceByVaccinalSchemeByAge[type][week]["con esquema completo"]);
      const vaccinated = Object.values(this.dataCovid.incidenceByVaccinalSchemeByAge[type][week]["con esquema completo"]);
      const nonVaccinated = Object.values(this.dataCovid.incidenceByVaccinalSchemeByAge[type][week]["sin esquema completo"]);
      const boostedVaccinated = Object.values(this.dataCovid.incidenceByVaccinalSchemeByAge[type][week]["con dosis refuerzo > 14 dias"]);

      return {
        labels: labels,
        datasets: [
          {
            type: "bar",
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "Con esquema completo",
            borderColor: this.colorsPasoAPaso[3],
            backgroundColor: this.colorsPasoAPaso[3],
            fill: false,
            data: vaccinated,
          },
          {
            type: "bar",
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "Sin esquema completo",
            borderColor: this.colorsPasoAPaso[1],
            backgroundColor: this.colorsPasoAPaso[1],
            fill: false,
            data: nonVaccinated,
          },
          {
            type: "bar",
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "Con dosis refuerzo > 14 dias",
            borderColor: this.colorsPasoAPaso[2],
            backgroundColor: this.colorsPasoAPaso[2],
            fill: false,
            data: boostedVaccinated,
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
  async created() {
    this.weekSundayDates = Object.keys(this.dataCovid.incidenceByVaccinalSchemeByAge["cases"]);
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
