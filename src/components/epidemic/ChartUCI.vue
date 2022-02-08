<template lang="html">
  <div class="ChartUci">
    <button-choice v-if="region == 'Chile'" :tabs="tabs" :currentTab="picked" v-on:newtab="updatePicked" />

    <title-graphic v-if="picked == 'uci'"> {{ title["Uci"] }} en {{ region }} </title-graphic>
    <!-- <title-graphic v-if="(picked == 'ingresoUCI') & (region == 'Chile')"> {{ title["IngresoUCI"] }} en {{ region }} </title-graphic> -->
    <title-graphic v-if="(picked == 'hospitalization') & (region == 'Chile')"> Pacientes en hospitalización con diagnóstico Covid-19 en {{ region }} </title-graphic>
    <title-graphic v-if="(picked == 'ingresoHospi') & (region == 'Chile')"> Ingresos hospilatarios de pacientes Covid-19 en {{ region }} </title-graphic>

    <!-- <title-graphic v-if="(picked == 'vmi') & (region == 'Chile')"> Pacientes Covid-19 en UCI por estado de gravedad </title-graphic> -->

    <span style="font-size:1rem" v-if="(picked == 'hospitalization') & (region == 'Chile')"> La UCI es la sigla de unidad de cuidados intensivos y UTI la sigla de unidad de terapia intenisva.</span>
    <span style="font-size:1rem" v-if="(picked != 'hospitalization') & (picked != 'ingresoHospi')"> La UCI es la sigla de unidad de cuidados intensivos.</span>

    <br />

    <update v-if="(picked == 'uci') & (region == 'Chile')" :labels="dataCovid.vm.labels"> </update>
    <update v-if="(picked == 'uci') & (region != 'Chile')" :labels="dataCovid.labelsUci"> </update>
    <!-- <update v-if="(picked == 'ingresoUCI') & (region == 'Chile')" :labels="dataCovid.labelsIngresoUCI"> </update> -->
    <update v-if="(picked == 'hospitalization') & (region == 'Chile')" :labels="dataCovid.hospitalization.labels"> </update>
    <update v-if="(picked == 'ingresoHospi') & (region == 'Chile')" :labels="dataCovid.ingresoHospi.labels"> </update>

    <bar-chart v-if="(picked == 'uci') & (region == 'Chile')" :chartData="plotVm()" :options="chartOptions('VM')"> </bar-chart>
    <bar-chart v-if="(picked == 'uci') & (region != 'Chile')" :chartData="plotBar(region, 'Uci')" :options="chartOptions('Uci')"> </bar-chart>
    <!-- <bar-chart
      v-if="(picked == 'ingresoUCI') & (region == 'Chile')"
      :chartData="plotLine(dataCovid.labelsIngresoUCI, dataCovid['ChileIngresoUCI'], this.colorsPasoAPaso[1], 'line')"
      :options="chartOptions('IngresoUCI')"
    >
    </bar-chart> -->

    <bar-chart v-if="(picked == 'hospitalization') & (region == 'Chile')" :chartData="plotHospi()" :options="chartOptions('Hospi')"> </bar-chart>
    <bar-chart v-if="(picked == 'ingresoHospi') & (region == 'Chile')" :chartData="plotIngresosHospi()" :options="chartOptions('Hospi')"> </bar-chart>
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
        { id: "hospitalization", name: "Hospitalizados" },
        // { id: "ingresoUCI", name: "Ingresos UCI" },

        { id: "ingresoHospi", name: "Ingresos Hospitalarios" },
        // { id: "vmi", name: "UCI por estado" },
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
    // plotLine(labels, values, color, type) {
    //   let fromDate = this.fromDate;
    //   let indexDate = labels.indexOf(fromDate);
    //   indexDate = indexDate > 0 ? indexDate : 0;

    //   return {
    //     labels: labels.filter((x) => {
    //       return dayjs(x, "DD-MM-YYYY") >= dayjs(fromDate, "DD-MM-YYYY");
    //     }),
    //     datasets: [
    //       {
    //         type: type,
    //         pointRadius: this.pointRadius,
    //         pointHoverRadius: this.pointHoverRadius,
    //         label: "",
    //         borderColor: color,
    //         backgroundColor: color,
    //         fill: false,
    //         data: values.slice(indexDate),
    //       },
    //     ],
    //   };
    // },
    plotHospi() {
      let fromDate = this.fromDate;
      const labels = this.dataCovid.hospitalization.labels;
      let indexDate = labels.indexOf(fromDate);
      indexDate = indexDate > 0 ? indexDate : 0;
      const colors = { Basica: "#250740", Media: "#750227", UCI: this.colorsPasoAPaso[1], UTI: this.colorsPasoAPaso[2] };

      let datasets = [];
      const typeOfHospi = Object.keys(this.dataCovid.hospitalization).slice(1);
      typeOfHospi.forEach((t) => {
        datasets.push({
          type: "line",
          pointRadius: this.pointRadius,
          pointHoverRadius: this.pointHoverRadius,
          label: t,
          borderColor: colors[t],
          backgroundColor: colors[t],
          fill: false,
          data: this.dataCovid.hospitalization[t].slice(indexDate),
        });
      });
      return {
        labels: labels.filter((x) => {
          return dayjs(x, "DD-MM-YYYY") >= dayjs(fromDate, "DD-MM-YYYY");
        }),
        datasets: datasets,
      };
    },
    plotVm() {
      let fromDate = this.fromDate;
      const labels = this.dataCovid.vm.labels;
      let indexDate = labels.indexOf(fromDate);
      indexDate = indexDate > 0 ? indexDate : 0;
      return {
        labels: labels.filter((x) => {
          return dayjs(x, "DD-MM-YYYY") >= dayjs(fromDate, "DD-MM-YYYY");
        }),
        datasets: [
          {
            type: "bar",
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "Ventilación mecánica invasiva",
            borderColor: "#250740",
            backgroundColor: "#250740",
            fill: false,
            data: this.dataCovid.vm.vmi.slice(indexDate),
          },
          {
            type: "bar",
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "Ventilación mecánica no invasiva",
            borderColor: "#750227",
            backgroundColor: "#750227",
            fill: false,
            data: this.dataCovid.vm.vmNotI.slice(indexDate),
          },

          {
            type: "bar",
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "Sin ventilación mecánica",
            borderColor: this.colorsPasoAPaso[1],
            backgroundColor: this.colorsPasoAPaso[1],
            fill: false,
            data: this.dataCovid.vm.noVm.slice(indexDate),
          },
        ],
      };
    },
    plotIngresosHospi() {
      let fromDate = this.fromDate;
      const labels = this.dataCovid.ingresoHospi.labels;
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
            label: "Ingresos en UCI (media móvil 7 días)",
            borderColor: this.colorsPasoAPaso[1],
            backgroundColor: this.colorsPasoAPaso[1],
            fill: false,
            data: this.dataCovid.ingresoHospi.uci.slice(indexDate),
          },
          {
            type: "line",
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "Ingresos hospitalatarios (media móvil 7 días)",
            borderColor: "#250740",
            backgroundColor: "#250740",
            fill: false,
            data: this.dataCovid.ingresoHospi.hospi.slice(indexDate),
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
      if (type == "IngresoUCI" || type == "Hospi") {
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
      if (type == "VM") {
        options.scales = {
          yAxes: [
            {
              stacked: true,
              ticks: {
                beginAtZero: true,
              },
            },
          ],
          xAxes: [
            {
              stacked: true,
            },
          ],
        };
      }
      if (type == "Cases" || type == "VM" || type == "Hospi") {
        options.legend = { display: true };
      }
      return options;
    },
  },
};
</script>
