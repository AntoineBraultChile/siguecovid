<template lang="html">
  <div class="ChartVaccineByType">
    <button-choice :tabs="tabs" :currentTab="picked" v-on:newtab="updatePicked" />

    <title-graphic v-if="picked == 'first'"> Personas partialmente vacunadas cada por tipo de vacuna día en Chile</title-graphic>
    <title-graphic v-if="picked == 'second'"> Personas completamente vacunadas cada día por tipo de vacuna en Chile </title-graphic>
    <title-graphic v-if="picked == 'third'"> Dosis de refuerzo inyectados cada día por tipo de vacuna en Chile</title-graphic>
    <title-graphic v-if="picked == 'fourth'"> Cuarta dosis inyectados cada día por tipo de vacuna en Chile</title-graphic>

    <!-- <span style='font-size:1rem'> Estar parcialmente vacunado significa tener una dosis de Sinovac, Astra-Zeneca, Pfizer.</span> <br> -->
    <update :labels="data.labels"> </update>
    <bar-chart v-if="picked == 'first'" :chartData="renderChartTypeVaccine('first')" :options="options"> </bar-chart>
    <bar-chart v-if="picked == 'second'" :chartData="renderChartTypeVaccine('second')" :options="options"> </bar-chart>
    <bar-chart v-if="picked == 'third'" :chartData="renderChartTypeVaccine('boost')" :options="options"> </bar-chart>
    <bar-chart v-if="picked == 'fourth'" :chartData="renderChartTypeVaccine('fourth')" :options="options"> </bar-chart>
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
  name: "ChartVaccineByType",
  props: ["data", "fromDate"],
  components: {
    "bar-chart": BarChart,
    update: Update,
    "title-graphic": TitleGraphic,
    // "radio-choice": RadioChoice,
    "button-choice": ButtonChoice,
  },
  data() {
    return {
      picked: "first",
      tabs: [
        { id: "first", name: "Al menos una dosis" },
        { id: "second", name: "Completamente vacunados" },
        { id: "third", name: "Dosis de refuerzo" },
        { id: "fourth", name: "Cuarta dosis" },
      ],
      options: {
        animation: {
          duration: 0,
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
        scales: {
          xAxes: [
            {
              stacked: true,
            },
          ],
          yAxes: [
            {
              stacked: true,
            },
          ],
        },
      },
    };
  },
  methods: {
    updatePicked(payload) {
      this.picked = payload;
    },
    renderChartTypeVaccine(doses) {
      let indexDate = this.data.labels.indexOf(this.fromDate);
      let datasets = [
        {
          label: "Pfizer",
          backgroundColor: "#f87979",
          borderColor: "#f87979",
          data: this.data[doses + "Doses"]["Pfizer"].slice(indexDate),
        },
        {
          label: "Sinovac",
          backgroundColor: "#93DB70",
          borderColor: "#93DB70",
          data: this.data[doses + "Doses"]["Sinovac"].slice(indexDate),
        },
        {
          label: "AstraZeneca",
          backgroundColor: "#eba434",
          borderColor: "#eba434",
          data: this.data[doses + "Doses"]["AstraZeneca"].slice(indexDate),
        },
        {
          label: "Moderna",
          backgroundColor: "#82CFFD",
          borderColor: "#82CFFD",
          data: this.data[doses + "Doses"]["Moderna"].slice(indexDate),
        },
      ];
      if (doses == "second") {
        datasets.push(
          {
            label: "CanSino",
            backgroundColor: "#845EC2",
            borderColor: "#845EC2",
            data: this.data.secondDoses["CanSino"].slice(indexDate),
          }
          // {
          //   label: "Janssen",
          //   backgroundColor: "#845EC2",
          //   data: this.vaccineType.secondDoses["Janssen"].slice(indexDate),
          // }
        );
      }
      return {
        labels: this.data.labels.filter((x) => {
          return dayjs(x, "DD-MM-YYYY") >= dayjs(this.fromDate, "DD-MM-YYYY");
        }),
        datasets: datasets,
      };
    },
  },
};
</script>
