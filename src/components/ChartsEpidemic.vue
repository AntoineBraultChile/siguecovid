<template lang="html">
  <div class="ChartsEpidemic">
    <div class="graph" v-if="dataCovid.labelsCases.length > 0">
      <title-graphic> {{ title["Cases"] }} en {{ region }} </title-graphic>
      <span style="font-size:1rem">Los casos se detectan por PCR o prueba antigénica. </span>
      <br />
      <update :labels="dataCovid.labelsCases"> </update>
      <bar-chart :chartData="plotBarChartWithMean(region, 'Cases')" :options="chartOptions('Cases')"> </bar-chart>
    </div>

    <div class="graph" v-if="dataCovid.labelsCases.length > 0">
      <title-graphic> Variación semanal de los nuevos casos detectados en {{ region }} </title-graphic>
      <span style="font-size:1rem">Los casos se detectan por PCR o prueba antigénica. </span>
      <br />
      <update :labels="dataCovid.labelsCases"> </update>
      <bar-chart :chartData="plotVariantions(this.dataCovid['labelsCases'].slice(5), this.dataCovid[region + 'MeanCases'])" :options="chartOptions('Variations')"> </bar-chart>
    </div>

    <div class="graph" v-if="dataCovid.labelsPcr.length > 0">
      <title-graphic> {{ title["Pcr"] }} en {{ region }} </title-graphic>
      <span style="font-size:1rem">La positividad es el porcentaje de casos detectados sobre el numero de test PCR y de antigenos realizados cada día.</span>
      <br />
      <update :labels="dataCovid.labelsPcr"> </update>
      <bar-chart :chartData="getChartPosPcr(region)" :options="chartOptions('Pcr')"> </bar-chart>
    </div>

    <div class="graph" v-if="dataCovid.labelsUci.length > 0">
      <title-graphic> {{ title["Uci"] }} en {{ region }} </title-graphic>
      <span style="font-size:1rem"> La UCI es la sigla de unidad de cuidados intensivos.</span>
      <br />

      <update :labels="dataCovid.labelsUci"> </update>
      <bar-chart :chartData="plotBar(region, 'Uci')" :options="chartOptions('Uci')"> </bar-chart>
    </div>

    <div class="graph" v-if="dataCovid.labelsDeaths.length > 0">
      <title-graphic> {{ title["Deaths"] }} en {{ region }} </title-graphic>
      <span style="font-size:1rem">Son los fallecidos por Covid-19 confirmados con un test PCR o antigénico. La fecha de notificación puede ser diferente de la fecha de muerte.</span>
      <br />

      <update :labels="dataCovid.labelsDeaths"> </update>
      <bar-chart :chartData="plotBarChartWithMean(region, 'Deaths')" :options="chartOptions('Deaths')"> </bar-chart>
    </div>

    <div class="graph" v-if="dataCovid.labelsVaccine.length > 0">
      <title-graphic> Proporción de la población vacunada en {{ region }}</title-graphic>
      <update :labels="dataCovid.labelsVaccine"> </update>
      <line-chart :chartData="getChartVaccine(region)" :options="chartOptions('Vaccine')"></line-chart>
    </div>

    <div class="graph" v-if="dataCovid.incidence.lastUpdate.length > 0">
      <title-graphic v-if="region == 'Chile'"> Incidencia en las regiones de Chile</title-graphic>
      <title-graphic v-else> Incidencia en las comunas de la región {{ region }} </title-graphic>
      <span style="font-size:1rem">Incidencia: número semanal de casos por cada 100.000 habitantes</span>
      <br />
      <update :labels="dataCovid.incidence.lastUpdate"> </update>
      <div class="legend" v-if="!(region == 'Chile')">
        <span class="label">
          <div class="rectangle red"></div>
          <span>Paso 1</span>
        </span>
        <span class="label">
          <div class="rectangle orange"></div>
          <span>Paso 2</span>
        </span>
        <span class="label">
          <div class="rectangle blue"></div>
          <span>Paso 3</span>
        </span>
        <span class="label">
          <div class="rectangle green"></div>
          <span>Paso 4</span>
        </span>
      </div>
      <horizontal-bar-chart :height="600" :chartData="getChartIncidence(region)" :options="chartOptions('Incidence')"></horizontal-bar-chart>
    </div>

    <div class="graph" v-if="dataCovid.incidence.lastUpdate.length > 0">
      <title-graphic v-if="region == 'Chile'"> Variación de la incidencia en las regiones de Chile</title-graphic>
      <title-graphic v-else>
        Variación de la incidencia en las comunas de la región
        {{ region }}</title-graphic
      >
      <span style="font-size:1rem">Variación de la incidencia corresponde a la incidencia de hoy menos la incidencia 7 días atras</span>
      <br />
      <update :labels="dataCovid.incidence.lastUpdate"> </update>
      <horizontal-bar-chart :height="600" :chartData="getChartIncidence(region, 'variations')" :options="chartOptions('Incidence')"></horizontal-bar-chart>
    </div>

    <!-- Chart ICU entries en Chile -->
    <div class="graph" v-if="region == 'Chile'">
      <title-graphic> {{ title["IngresoUCI"] }} en {{ region }} </title-graphic>
      <span style="font-size:1rem"> La UCI es la sigla de unidad de cuidados intensivos.</span>
      <br />
      <update :labels="dataCovid.labelsIngresoUCI"> </update>
      <bar-chart :chartData="getChartIngresoUCI(region)" :options="chartOptions('IngresoUCI')"> </bar-chart>
    </div>

    <!-- Chart DEIS deaths -->
    <div class="graph" vv-if="region == 'Chile'">
      <title-graphic> Muertes por Covid-19 en Chile por fecha de fallecimiento </title-graphic>
      <span style="font-size:1rem">A diferencia de las muertes sospechosas, las muertes confirmadas son las que se confirman mediante PCR o pruebas antigénicas. </span>
      <br />
      <update :labels="dataCovid.deis.labels"> </update>
      <bar-chart :chartData="plotDeis()" :options="chartOptions('Deis')"> </bar-chart>
    </div>

    <!-- chart plan Paso a Paso  -->
    <div class="graph" v-if="region == 'Chile'">
      <title-graphic> Proporción de la población chilena en las diferentes fases del plan Paso a Paso</title-graphic>
      <update :labels="dataCovid.pasoAPaso.labels"> </update>
      <bar-chart :chartData="getChartPasoAPaso()" :options="chartOptions('Paso')"></bar-chart>
    </div>
    <!-- --------------------------------------------------------------------------------------------------------------------------------------- -->
    <box-container v-if="region == 'Chile'">
      <h2 id="description" style="font-size:1.5rem;">
        Impacto de la vacunación en la epidemia de Covid-19 en Chile
      </h2>
      <p style="text-align: justify;padding:10px">
        Los graficos sobre el impacto de la vacunación en Chile no están disponible por el momento. Esta semana hubo errores de formato en la publicación de los datos por parte de MinCiencia. Pero
        volverán muy pronto !
      </p>
    </box-container>

    <!-- <box-container v-if="region == 'Chile'">
      <h2 id="description" style="font-size:1.5rem;">
        Impacto de la vacunación en la epidemia de Covid-19 en Chile
      </h2>
      <p class="two-columns">
        Una persona tiene un esquema completo de vacunación 14 días después de una segunda dosis o 28 días después de una dosis única. Los gráficos deben interpretarse teniendo en cuenta que puede
        haber sesgos significativos. De hecho, la cobertura de vacunación y las tasas de infección no son uniformes en toda la población. La situación económica, el lugar de residencia y los factores
        de riesgo de Covid-19 son variables importantes para medir adecuadamente la eficacia de la vacunación. Por el momento, sólo la estratificación por edad está disponible en los datos abiertos.
      </p>
    </box-container> -->

    <!-- <div class="graph" v-if="region == 'Chile'">
      <title-graphic> Incidencia semanal con respecto al esquema de vacunación en {{ region }}</title-graphic>
      <span style="font-size:1rem"> Número de casos detectados cada semana epidemiológica por cada 100.000 personas en cada grupo.</span>
      <br />
      <update :labels="Object.keys(dataCovid.incidenceCompleteVaccinalScheme)"> </update>
      <line-chart :chartData="plotVaccinalSchemes(dataCovid.incidenceCompleteVaccinalScheme, dataCovid.incidenceUncompleteVaccinalScheme)" :options="chartOptions('vaccinalSchemes')"></line-chart>
    </div> -->

    <!-- <div class="graph" v-if="region == 'Chile'">
      <title-graphic> Incidencia semanal de ingreso a UCI con respecto al esquema de vacunación en {{ region }}</title-graphic>
      <span style="font-size:1rem"> Número de casos detectados cada semana epidemiológica que van a ingresar en unidad de cuidados intensivos por cada 100.000 personas en cada grupo.</span>
      <br />
      <update :labels="Object.keys(dataCovid.uciCompleteVaccinalScheme)"> </update>
      <line-chart :chartData="plotVaccinalSchemes(dataCovid.uciCompleteVaccinalScheme, dataCovid.uciUncompleteVaccinalScheme)" :options="chartOptions('vaccinalSchemes')"></line-chart>
    </div> -->

    <!-- <div class="graph" v-if="region == 'Chile'">
      <title-graphic> Incidencia de los fallecidos con respecto al esquema de vacunación en {{ region }}</title-graphic>
      <update :labels="dataCovid.labelsVaccine"> </update>
      <line-chart
        :chartData="plotVaccinalSchemes(this.dataCovid.fallecidosCompleteVaccinalScheme, this.dataCovid.fallecidosUncompleteVaccinalScheme)"
        :options="chartOptions('vaccinalSchemes')"
      ></line-chart>
    </div> -->

    <!-- <div class="graph" v-if="region == 'Chile'">
      <title-graphic> Incidencia por estado de vacunación y grupo de edad en Chile</title-graphic>
      <span style="font-size:1rem">
        Número de casos detectados entre el {{ dataCovid.incidenceByVaccinalSchemeByAge["week"][0] }} y el {{ dataCovid.incidenceByVaccinalSchemeByAge["week"][1] }} por cada 100.000 personas en cada
        grupo.</span
      >
      <br />
      <bar-chart :chartData="plotVaccinalSchemeByAge('cases')" :options="chartOptions('IncidenceByVaccinalScheme')"></bar-chart>
    </div>

    <div class="graph" v-if="region == 'Chile'">
      <title-graphic> Incidencia de los ingresos a UCI por estado de vacunación y grupo de edad en Chile</title-graphic>
      <span style="font-size:1rem">
        Número de personas que ingresaron a UCI por Covid-19 entre el {{ dataCovid.incidenceByVaccinalSchemeByAge["week"][0] }} y el {{ dataCovid.incidenceByVaccinalSchemeByAge["week"][1] }} por cada
        100.000 personas en cada grupo.</span
      >
      <br />
      <bar-chart :chartData="plotVaccinalSchemeByAge('uci')" :options="chartOptions('IncidenceByVaccinalScheme')"></bar-chart>
    </div>
    <div class="graph" v-if="region == 'Chile'">
      <title-graphic> Incidencia de fallecidos por estado de vacunación y grupo de edad en Chile</title-graphic>
      <span style="font-size:1rem">
        Número de personas fallecidas por Covid-19 entre el {{ dataCovid.incidenceByVaccinalSchemeByAge["week"][0] }} y el {{ dataCovid.incidenceByVaccinalSchemeByAge["week"][1] }} por cada 100.000
        personas en cada grupo.</span
      >
      <br />
      <bar-chart :chartData="plotVaccinalSchemeByAge('deaths')" :options="chartOptions('IncidenceByVaccinalScheme')"></bar-chart>
    </div> -->
  </div>
</template>

<script>
import * as dayjs from "dayjs";
var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);
import "dayjs/locale/es"; // load on demand
dayjs.locale("es"); // use Spanish locale globally

import { order } from "../assets/mathFunctions";

import BarChart from "../components/BarChart";
import LineChart from "../components/LineChart";
import HorizontalBarChart from "../components/HorizontalBarChart";
import Update from "../components/Update";

import TitleGraphic from "../components/TitleGraphic";
export default {
  name: "ChartsEpidemic",
  props: ["region", "fromDate", "dataCovid"],
  components: {
    "line-chart": LineChart,
    "bar-chart": BarChart,
    "horizontal-bar-chart": HorizontalBarChart,
    update: Update,
    "title-graphic": TitleGraphic,
  },
  data() {
    return {
      pointRadius: 1.5,
      pointHoverRadius: 4,
      colorsPasoAPaso: {
        1: "#dd4b39",
        2: "#eba434",
        3: "#82CFFD",
        4: "#93DB70",
      },
      backgroundColor: {
        Uci: "#dd4b39",
        Pcr: "#82CFFD",
        Cases: "#93DB70",
        Deaths: "#232b2b",
      },
      title: {
        IngresoUCI: "Media móvil 7 días de ingresos a UCI por Covid-19",
        Uci: "Personas en UCI por Covid-19",
        Pcr: "Positividad y PCR en ",
        Cases: "Nuevos casos diarios",
        Deaths: "Fallecidos confirmados por Covid-19 por fecha de notificación",
      },
    };
  },
  methods: {
    plotVaccinalSchemeByAge(type) {
      const labels = Object.keys(this.dataCovid.incidenceByVaccinalSchemeByAge[type]["con esquema completo"]);
      const vaccinated = Object.values(this.dataCovid.incidenceByVaccinalSchemeByAge[type]["con esquema completo"]);
      const nonVaccinated = Object.values(this.dataCovid.incidenceByVaccinalSchemeByAge[type]["sin esquema completo"]);
      const boostedVaccinated = Object.values(this.dataCovid.incidenceByVaccinalSchemeByAge[type]["con dosis refuerzo > 14 dias"]);

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
    plotVaccinalSchemes(vaccinated, nonVaccinated) {
      let labels = Object.keys(vaccinated);
      let indexDate = labels.indexOf(this.fromDate);
      indexDate = indexDate > 0 ? indexDate : 0;
      return {
        labels: labels.slice(indexDate),
        datasets: [
          {
            type: "line",
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "Con esquema completo",
            borderColor: this.colorsPasoAPaso[3],
            backgroundColor: this.colorsPasoAPaso[3],
            fill: false,
            data: Object.values(vaccinated).slice(indexDate),
          },
          {
            type: "line",
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "Sin esquema completo",
            borderColor: this.colorsPasoAPaso[1],
            backgroundColor: this.colorsPasoAPaso[1],
            fill: false,
            data: Object.values(nonVaccinated).slice(indexDate),
          },
        ],
      };
    },

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
    getChartIngresoUCI(region) {
      let fromDate = this.fromDate;
      let indexDate = this.dataCovid["labelsIngresoUCI"].indexOf(fromDate);
      indexDate = indexDate > 0 ? indexDate : 0;

      return {
        labels: this.dataCovid["labelsIngresoUCI"].filter((x) => {
          return dayjs(x, "DD-MM-YYYY") >= dayjs(fromDate, "DD-MM-YYYY");
        }),
        datasets: [
          {
            type: "line",
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "",
            borderColor: this.colorsPasoAPaso[1],
            backgroundColor: this.colorsPasoAPaso[1],
            fill: false,
            data: this.dataCovid[region + "IngresoUCI"].slice(indexDate),
          },
        ],
      };
    },
    getChartVaccine(region) {
      // console.log(this.dataCovid[region + "Vaccine"].firstDoses);
      let fromDate = this.fromDate;
      let indexDate = this.dataCovid["labelsVaccine"].indexOf(fromDate);
      indexDate = indexDate > 0 ? indexDate : 0;

      return {
        labels: this.dataCovid["labelsVaccine"].filter((x) => {
          return dayjs(x, "DD-MM-YYYY") >= dayjs(fromDate, "DD-MM-YYYY");
        }),
        datasets: [
          {
            type: "line",
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "Al menos una dosis",
            borderColor: this.colorsPasoAPaso[3],
            backgroundColor: this.colorsPasoAPaso[3],
            fill: false,
            data: this.dataCovid[region + "Vaccine"].firstDoses.slice(indexDate),
          },
          {
            type: "line",
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "Completamente vacunado",
            borderColor: this.colorsPasoAPaso[2],
            backgroundColor: this.colorsPasoAPaso[2],
            fill: false,
            data: this.dataCovid[region + "Vaccine"].secondDoses.slice(indexDate),
          },
          {
            type: "line",
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "Dosis de refuerzo",
            borderColor: this.backgroundColor["Deaths"],
            backgroundColor: this.backgroundColor["Deaths"],
            fill: false,
            data: this.dataCovid[region + "Vaccine"].boostDoses.slice(indexDate),
          },
        ],
      };
    },
    getChartPasoAPaso() {
      let fromDate = this.fromDate;
      let indexDate = this.dataCovid.pasoAPaso.labels.indexOf(fromDate);
      indexDate = indexDate > 0 ? indexDate : 0;
      // let indexDateMean = this.dataCovidChile['labelsMean'+type].indexOf(fromDate)
      let datasets = [];
      let labels = ["Fase 1", "Fase 2", "Fase 3", "Fase 4"];
      let pasos = Object.keys(this.colorsPasoAPaso);
      pasos.forEach((paso, index) => {
        datasets.push({
          type: "line",
          pointRadius: this.pointRadius,
          pointHoverRadius: this.pointHoverRadius,
          label: labels[index],
          borderColor: this.colorsPasoAPaso[paso],
          backgroundColor: this.colorsPasoAPaso[paso],
          fill: true,
          data: this.dataCovid.pasoAPaso["fase" + paso].slice(indexDate),
        });
      });
      return {
        labels: this.dataCovid.pasoAPaso.labels.slice(indexDate),
        datasets: datasets,
      };
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
            type: "horizontalBar",
            label: label,
            borderColor: colors,
            backgroundColor: colors,
            data: valuesSort,
          },
        ],
        borderWidth: 1,
      };
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
    plotBarChartWithMean(name, type) {
      let fromDate = this.fromDate;
      let indexDate = this.dataCovid["labels" + type].indexOf(fromDate);
      indexDate = indexDate > 0 ? indexDate : 0;

      // let indexDateMean = this.dataCovidChile['labelsMean'+type].indexOf(fromDate)
      return {
        labels: this.dataCovid["labels" + type].filter((x) => {
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
            data: this.dataCovid[name + "Mean" + type].slice(indexDate - 6),
          },
          {
            type: "bar",
            label: this.title[type] + " diarios",
            backgroundColor: this.backgroundColor[type],
            fill: false,
            data: this.dataCovid[name + type].slice(indexDate),
          },
        ],
      };
    },
    plotDeis() {
      let fromDate = this.fromDate;
      let indexDate = this.dataCovid.deis.labels.indexOf(fromDate);
      indexDate = indexDate > 0 ? indexDate : 0;

      // let indexDateMean = this.dataCovidChile['labelsMean'+type].indexOf(fromDate)
      return {
        labels: this.dataCovid.deis.labels.filter((x) => {
          return dayjs(x, "DD-MM-YYYY") >= dayjs(fromDate, "DD-MM-YYYY");
        }),
        datasets: [
          {
            type: "line",
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "Total muertes (media móvil de 7 días)",
            borderColor: "#dd4b39",
            backgroundColor: "#dd4b39",
            fill: false,
            data: this.dataCovid.deis.mediaMovil.slice(indexDate - 6),
          },
          {
            type: "bar",
            label: "Fallecidos confirmados",
            backgroundColor: this.backgroundColor["Deaths"],
            fill: false,
            data: this.dataCovid.deis.confirmed.slice(indexDate),
          },
          {
            type: "bar",
            label: "Fallecidos sospechosos",
            backgroundColor: this.colorsPasoAPaso[2],
            fill: false,
            data: this.dataCovid.deis.suspected.slice(indexDate),
          },
        ],
      };
    },

    getChartPosPcr(name) {
      let fromDate = this.fromDate;
      let indexDate = this.dataCovid["labelsPcr"].indexOf(fromDate);
      indexDate = indexDate > 0 ? indexDate : 0;
      let indexDatePos = indexDate - 0;
      return {
        labels: this.dataCovid["labelsPcr"].filter((x) => {
          return dayjs(x, "DD-MM-YYYY") >= dayjs(fromDate, "DD-MM-YYYY");
        }),
        datasets: [
          {
            type: "line",
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "Positividad (media móvil de 7 días)",
            yAxisID: "Pos",
            borderColor: "#dd4b39",
            backgroundColor: "#dd4b39",
            fill: false,
            data: this.dataCovid[name + "Pos"].slice(indexDatePos),
          },
          {
            type: "bar",
            label: "Numero de test PCR ",
            yAxisID: "Pcr",
            backgroundColor: this.backgroundColor["Pcr"],
            fill: false,
            data: this.dataCovid[name + "Pcr"].slice(indexDate),
          },
          {
            type: "bar",
            label: "Numero de test de antigenos",
            yAxisID: "Pcr",
            backgroundColor: this.colorsPasoAPaso[2],
            fill: false,
            data: this.dataCovid[name + "Antigeno"].slice(indexDate),
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
      if (type == "Incidence") {
        options.responsive = true;
        options.maintainAspectRatio = false;
        options.scales["xAxes"] = [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ];
      }
      // if (type == "IncidenceByVaccinalScheme") {
      //   options.responsive = true;
      //   options.maintainAspectRatio = false;
      //   options.scales["xAxes"] = [
      //     {
      //       ticks: {
      //         beginAtZero: true,
      //       },
      //     },
      //   ];
      // }
      if (type == "vaccinalSchemes") {
        options["tooltips"] = {
          mode: "index",
          intersect: false,
        };
        options["hover"] = {
          mode: "index",
          intersect: false,
        };
        options["interaction"] = {
          mode: "nearest",
          axis: "x",
          intersect: false,
        };
        options.scales["xAxes"] = [
          {
            type: "time",
            time: {
              parser: "DD-MM-YYYY",
              unit: "month",
            },
          },
        ];
        options.legend = { display: true };
        options.scales["yAxes"] = [
          {
            stacked: false,
            title: {
              display: true,
              text: "Value",
            },
          },
        ];
      }
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
      if (type == "Vaccine") {
        options.tooltips["callbacks"] = {
          label: function(tooltipItem, data) {
            return data.datasets[tooltipItem.datasetIndex].label + " (" + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] + "%)";
          },
        };
        options.scales.yAxes[0].ticks = {
          beginAtZero: true,
          callback: function(tick) {
            return tick.toString() + "%";
          },
        };
        options.legend.display = true;
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
      if (type == "Paso") {
        options.legend.display = true;
        options.scales["xAxes"] = [
          {
            type: "time",
            time: {
              parser: "DD-MM-YYYY",
              unit: "month",
            },
          },
        ];
        options.scales["yAxes"] = [
          {
            stacked: true,
            ticks: {
              max: 100,
              beginAtZero: true,
              callback: function(tick) {
                return tick.toString() + "%";
              },
            },
            title: {
              display: true,
              text: "Value",
            },
          },
        ];
        options.tooltips = {
          mode: "index",
          intersect: false,
          callbacks: {
            label: function(tooltipItem, data) {
              return data.datasets[tooltipItem.datasetIndex].label + " (" + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] + "%)";
            },
          },
        };
        options.hover = {
          mode: "index",
          intersect: false,
        };
      }
      if (type == "Deis") {
        options.scales = {
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
        };
      }
      if (type == "Pcr") {
        options.scales = {
          xAxes: [
            {
              stacked: true,
            },
          ],
          yAxes: [
            {
              id: "Pos",
              type: "linear",
              position: "left",
              ticks: {
                beginAtZero: true,
                callback: function(tick) {
                  return tick.toString() + "%";
                },
              },
            },
            {
              id: "Pcr",
              type: "linear",
              position: "right",
              stacked: true,
            },
          ],
        };
      }
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
      if (type == "Pcr" || type == "Cases" || type == "Deaths" || type == "Variant" || type == "IncidenceByVaccinalScheme" || type == "Deis") {
        options.legend = { display: true };
      }
      return options;
    },
  },
};
</script>

<style lang="css" scoped>
.ChartsEpidemic {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}
.horizontalBar {
  width: 200px;
  height: 4000px;
}
.graph {
  width: 49.65%;
  margin: 5px 0px 5px 0px;
  box-shadow: 0px 0px 2px 2px #e8e8e8;
  border-radius: 7px;
  background-color: white;
  padding: 0px 0px 10px 0px;
}

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

.two-columns {
  display: inline-block;
  column-count: 2;
  font-size: 1.1rem;

  text-align: justify;
  line-height: 150%;
  padding: 0px 10px 0px 10px;
}
@media all and (max-width: 1100px) {
  .graph {
    width: 100%;
    margin: 5px 0px 5px 0px;
  }

  .two-columns {
    column-count: 1;
  }
}</style
>641
