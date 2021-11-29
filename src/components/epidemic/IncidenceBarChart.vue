<template lang="html">
  <div class="IncidenceBarChart">
    <button-choice
      :tabs="[
        { id: 'diario', name: 'Diario' },
        { id: 'variacion', name: 'Variación' },
      ]"
      :currentTab="picked"
      v-on:newtab="updatePicked"
    />
    <title-graphic v-if="(region == 'Chile') & (picked == 'diario')"> Incidencia en las regiones de Chile</title-graphic>
    <title-graphic v-else-if="(region != 'Chile') & (picked == 'diario')"> Incidencia en las comunas de la región {{ region }} </title-graphic>
    <title-graphic v-else-if="(region == 'Chile') & (picked == 'variacion')"> Variación de la incidencia en las regiones de Chile</title-graphic>
    <title-graphic v-else>
      Variación de la incidencia en las comunas de la región
      {{ region }}</title-graphic
    >
    <span v-if="picked == 'diario'" style="font-size:1rem">Incidencia: número semanal de casos por cada 100.000 habitantes</span>
    <span v-else style="font-size:1rem">Variación de la incidencia corresponde a la incidencia de hoy menos la incidencia 7 días atras</span>
    <br />
    <update :labels="dataCovid.incidence.lastUpdate"> </update>
    <div class="legend" v-if="!(region == 'Chile')">
      <span class="label">
        <div class="rectangle red"></div>
        <span>Fase 1</span>
      </span>
      <span class="label">
        <div class="rectangle orange"></div>
        <span>Fase 2</span>
      </span>
      <span class="label">
        <div class="rectangle blue"></div>
        <span>Fase 3</span>
      </span>
      <span class="label">
        <div class="rectangle green"></div>
        <span>Fase 4</span>
      </span>
    </div>
    <!-- <horizontal-bar-chart v-if="picked == 'diario'" :height="500" :chartData="getChartIncidence(region)" :options="options" />
    <horizontal-bar-chart v-else :height="500" :chartData="getChartIncidence(region, 'variations')" :options="options" /> -->
    <bar-chart v-if="picked == 'diario'" :chartData="getChartIncidence(region)" :options="options" />
    <bar-chart v-else :chartData="getChartIncidence(region, 'variations')" :options="options" />
    <!-- <radio-choice :picked="picked" v-on:newpicked="updatePicked" /> -->
  </div>
</template>

<script>
import * as dayjs from "dayjs";
var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);
import "dayjs/locale/es"; // load on demand
dayjs.locale("es"); // use Spanish locale globally

// import HorizontalBarChart from "../components/HorizontalBarChart";
import BarChart from "@/components/BarChart";

// import LineChart from "../components/LineChart";
// import RadioChoice from "@/components/RadioChoice";
import ButtonChoice from "@/components/ButtonChoice";

import Update from "@/components/Update";
import TitleGraphic from "@/components/TitleGraphic";

import { order } from "@/assets/mathFunctions";

export default {
  name: "IncidenceBarChart",
  props: ["region", "fromDate", "title", "dataCovid", "backgroundColor", "colorsPasoAPaso"],
  components: {
    // "horizontal-bar-chart": HorizontalBarChart,
    "bar-chart": BarChart,
    update: Update,
    "title-graphic": TitleGraphic,
    // "radio-choice": RadioChoice,
    "button-choice": ButtonChoice,
  },
  data() {
    return {
      picked: "diario",
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: false,
        scales: {
          xAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
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
    getChartIncidence(region, type) {
      let values = type == "variations" ? this.dataCovid.incidence[region].variations : this.dataCovid.incidence[region].values;
      let [labelsSort, valuesSort] = order(this.dataCovid.incidence[region].names, values);
      let colors = [];
      let label = "";
      if (type == "variations") {
        valuesSort.forEach((d) => {
          d < 0 ? colors.push(this.backgroundColor["Cases"]) : colors.push(this.backgroundColor["Uci"]);
        });
        label = "Variación incidencia";
      } else {
        label = "Incidencia";
        if (this.region == "Chile") {
          colors = this.backgroundColor["Pcr"];
        } else {
          labelsSort.forEach((comuna) => {
            colors.push(this.colorsPasoAPaso[this.dataCovid.pasoAPaso[comuna]]);
          });
        }
      }
      return {
        labels: labelsSort,
        datasets: [
          {
            // type: "horizontalBar",
            type: "bar",
            label: label,
            borderColor: colors,
            backgroundColor: colors,
            data: valuesSort,
          },
        ],
        borderWidth: 1,
      };
    },
  },
};
</script>

<style lang="css" scoped>
.legend {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  font-size: 0.9rem;
  color: gray;
}
.label {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.rectangle {
  height: 15px;
  width: 40px;
  margin: 5px 10px 5px 10px;
}
.red {
  background-color: #dd4b39;
}
.orange {
  background-color: #eba434;
}
.blue {
  background-color: #82cffd;
}
.green {
  background-color: #93db70;
}
</style>
