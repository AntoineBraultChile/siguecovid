<template lang="html">
  <div class="ChartUci">
    <button-choice v-if="region == 'Chile'" :tabs="tabs" :currentTab="picked" v-on:newtab="updatePicked" />

    <title-graphic v-if="picked == 'uci'"> {{ title["Uci"] }} en {{ region }} </title-graphic>
    <title-graphic v-if="(picked == 'ingresoUCI') & (region == 'Chile')"> {{ title["IngresoUCI"] }} en {{ region }} </title-graphic>

    <span style="font-size:1rem"> La UCI es la sigla de unidad de cuidados intensivos.</span>
    <br />
    <update v-if="picked == 'uci'" :labels="dataCovid.labelsUci"> </update>
    <update v-if="(picked == 'ingresoUCI') & (region == 'Chile')" :labels="dataCovid.labelsIngresoUCI"> </update>

    <bar-chart v-if="picked == 'uci'" :chartData="plotBar(region, 'Uci')" :options="chartOptions('Uci')"> </bar-chart>
    <bar-chart
      v-if="(picked == 'ingresoUCI') & (region == 'Chile')"
      :chartData="plotLine(dataCovid.labelsIngresoUCI, dataCovid['ChileIngresoUCI'], this.colorsPasoAPaso[1])"
      :options="chartOptions('IngresoUCI')"
    >
    </bar-chart>
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
  name: "ChartUci",
  props: ["region", "fromDate", "title", "dataCovid", "backgroundColor", "pointRadius", "colorsPasoAPaso"],
  components: {
    "bar-chart": BarChart,
    update: Update,
    "title-graphic": TitleGraphic,
    "button-choice": ButtonChoice,
  },
  data() {
    return {
      picked: "uci",
      tabs: [
        { id: "uci", name: "UCI" },
        { id: "ingresoUCI", name: "Ingresos a UCI" },
      ],
    };
  },
  methods: {
    updatePicked(payload) {
      this.picked = payload;
    },
    plotBar(name, type) {
      let fromDate = this.fromDate;
      // console.log(Math.max(this.dataCovid['labels'+type].reduce(function (a, b) { return a < b ? a : b; })))
      let indexDate = this.dataCovid["labels" + type].indexOf(fromDate);
      indexDate = indexDate > 0 ? indexDate : 0;
      return {
        labels: this.dataCovid["labels" + type].filter((x) => {
          return dayjs(x, "DD-MM-YYYY") >= dayjs(fromDate, "DD-MM-YYYY");
        }),
        datasets: [
          {
            label: this.title[type] + " en " + name,
            backgroundColor: this.backgroundColor[type],
            fill: false,
            data: this.dataCovid[name + type].slice(indexDate),
          },
        ],
      };
    },
    plotLine(labels, values, color) {
      let fromDate = this.fromDate;
      let indexDate = labels.indexOf(fromDate);
      indexDate = indexDate > 0 ? indexDate : 0;

      return {
        labels: labels.filter((x) => {
          return dayjs(x, "DD-MM-YYYY") >= dayjs(fromDate, "DD-MM-YYYY");
        }),
        datasets: [
          {
            type: "line",
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "",
            borderColor: color,
            backgroundColor: color,
            fill: false,
            data: values.slice(indexDate),
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
      if (type == "IngresoUCI") {
        options.scales["xAxes"] = [
          {
            type: "time",
            time: {
              parser: "DD-MM-YYYY",
              unit: "month",
            },
          },
        ];
      }
      if (type == "Cases") {
        options.legend = { display: true };
      }
      return options;
    },
  },
};
</script>
