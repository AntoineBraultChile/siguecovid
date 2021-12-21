<template lang="html">
  <div class="ChartIncidenceTimeByAge">
    <button-choice :tabs="tabs" :currentTab="picked" v-on:newtab="updatePicked" />

    <title-graphic v-if="picked == 'cases'"> Incidencia de casos según esquema de vacunación {{ currentAge }} </title-graphic>
    <title-graphic v-if="picked == 'uci'"> Incidencia en UCI según esquema de vacunación {{ currentAge }} </title-graphic>
    <title-graphic v-if="picked == 'deaths'"> Incidencia de fallecidos según esquema de vacunación {{ currentAge }} </title-graphic>
    <!-- <br v-if="picked == 'cases' || picked == 'uci'" /> -->

    <span v-if="picked == 'cases'" style="font-size:1rem">Número de casos detectados cada semana epidemiológica por cada 100.000 personas en cada grupo.</span>
    <span v-if="picked == 'uci'" style="font-size:1rem">Número de personas que ingresaron cada semana epidemiológica por cada 100.000 personas en cada grupo. </span>
    <span v-if="picked == 'deaths'" style="font-size:1rem">Número de personas que fallecieron cada semana epidemiológica por cada 100.000 personas en cada grupo. </span>

    <br />
    <update :labels="Object.keys(dataCovid.incidenceTimeByAge.cases[currentAge]['sin esquema completo'])"> </update>
    <line-chart v-if="picked == 'cases'" :chartData="plotIncidenceVaccinalByAge('cases', currentAge)" :options="chartOptions()"></line-chart>
    <line-chart v-if="picked == 'uci'" :chartData="plotIncidenceVaccinalByAge('uci', currentAge)" :options="chartOptions()"></line-chart>
    <line-chart v-if="picked == 'deaths'" :chartData="plotIncidenceVaccinalByAge('deaths', currentAge)" :options="chartOptions()"></line-chart>
    <div class="slidecontainer">
      <!-- <input type="range" :min="0" :max="age.length - 1" v-model="currentNumberAge" class="slider" id="myRange" name="age" /> -->
      <ul class="range-labels">
        <li v-for="a in age" :key="a" :class="{ activeage: a == currentAge }" @click="currentAge = a">{{ a.replace("años", "") }}</li>
      </ul>
      <!-- <output for="age" :left="currentNumberAge">{{ updateAge }}</output> -->
    </div>
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
  name: "ChartIncidenceTimeByAge",
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
      age: [],
      currentAge: "12 - 20 años",
      currentNumberAge: 0,
    };
  },
  //   computed: {
  //     // updateAge() {
  //     //   return this.age[this.currentNumberAge];
  //     // },
  //   },
  methods: {
    updateAge(event) {
      console.log(event.target.key);
    },
    updatePicked(payload) {
      this.picked = payload;
    },
    plotIncidenceVaccinalByAge(type, age) {
      let labels = Object.keys(this.dataCovid.incidenceTimeByAge[type][age]["sin esquema completo"]);
      return {
        labels: labels,
        datasets: [
          {
            type: "line",
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "Sin esquema completo",
            borderColor: this.colorsPasoAPaso[1],
            backgroundColor: this.colorsPasoAPaso[1],
            fill: false,
            data: Object.values(this.dataCovid.incidenceTimeByAge[type][age]["sin esquema completo"]),
          },
          {
            type: "line",
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "Con esquema completo",
            borderColor: this.colorsPasoAPaso[3],
            backgroundColor: this.colorsPasoAPaso[3],
            fill: false,
            data: Object.values(this.dataCovid.incidenceTimeByAge[type][age]["con esquema completo"]),
          },
          {
            type: "line",
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "Con dosis refuerzo > 14 días",
            borderColor: this.colorsPasoAPaso[2],
            backgroundColor: this.colorsPasoAPaso[2],
            fill: false,
            data: [undefined, undefined, undefined, ...Object.values(this.dataCovid.incidenceTimeByAge[type][age]["con dosis refuerzo > 14 dias"])],
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
  async created() {
    this.age = Object.keys(this.dataCovid.incidenceTimeByAge["cases"]).slice(1);
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

.range-labels {
  /* margin: 18px -41px 0; */
  padding: 0;
  margin: 0 10px 10px 10px;
  /* border: 0.5px solid gray;
  border-radius: 10px; */
  list-style: none;
  display: flex;
  flex-direction: row;
  font-size: 0.9rem;
  /* background: #f0f0f0; */
  justify-content: space-between;
}

li {
  width: 100%;
  border: 0.5px solid gray;
  border-radius: 10px;
  background: #f0f0f0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0.1rem;
  padding: 0.1rem;
}
li:hover:not(.activeage) {
  /* color: #82cffd; */
  /* color: #4285f4; */
  border: 0.5px solid gray;
  border-radius: 10px;
  background: #f8f8f8;
}
li.activeage {
  /* color: #82cffd; */
  /* color: #4285f4; */
  /* font-weight: bold; */
  background: #ffffff;
}
/* li {
  position: relative;
  float: left;
  width: 90.25px;
  text-align: center;
  color: #b2b2b2;
  font-size: 14px;
  cursor: pointer;
} */
/* &::before {
      position: absolute;
      top: -25px;
      right: 0;
      left: 0;
      content: "";
      margin: 0 auto;
      width: 9px;
      height: 9px;
      background: #b2b2b2;
      border-radius: 50%;
    } */
</style>
