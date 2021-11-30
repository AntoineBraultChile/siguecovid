<template>
  <div class="ChartVacuna">
    <div class="containerSection">
      <box-container>
        <title-container titleName="Avances de la campaña de vacunación contra el Covid-19 en Chile" />
      </box-container>

      <box-container class="explication">
        <p style="font-size:1.1rem;max-width:800px;text-align:justify;line-height: 150%;margin:20px 20px 20px 20px">
          Actualmente hay cuatro vacunas autorizadas en Chile. Las vacunas de Sinovac, Pfizer y AstraZeneca requieren dos inyecciones, mientras que CanSino sólo requieren una. Se considerará que una
          persona está parcialmente vacunada si ha recibido sólo una dosis de Sinovac, Pfizer o AstraZeneca, y completamente vacunada si ha recibido dos dosis con Sinovac, Pfizer o AstraZeneca, o una
          dosis de CanSino.
        </p>
      </box-container>

      <div id="block_graph" v-if="vacunaChile.labels.length > 0 && listOfMonths.length > 0">
        <indicators
          :labels="vacunaChile.labels"
          :cases="vacunaChile['primera dosis']"
          :positivity="vacunaChile['segunda dosis']"
          :uci="vacunaChile['total primera dosis']"
          :deaths="vacunaChile['total segunda dosis']"
          :propRefuerzo="vacunaChile['Dosis de refuerzo']"
          :refuerzo="vacunaChile['total dosis de refuerzo']"
          :colors="colorsIndicator"
          type="vaccin"
        />

        <slide-bar :listOfMonths="listOfMonths" :fromMonth="fromMonth" v-on:newdate="updateCurrentDate" />
        <div class="wrapper">
          <title-graphic> Proporción de la población chilena vacunada</title-graphic>
          <update :labels="vacunaChile.labels"> </update>
          <line-chart :chartData="renderChartVacuna()" :options="options('vertical')"> </line-chart>
          <signature />
        </div>

        <div class="wrapper">
          <title-graphic> Número de personas vacunadas cada dia en Chile</title-graphic>
          <update :labels="vacunaChile.labels"> </update>
          <bar-chart :chartData="renderChartVacunaPorDia()" :options="optionsPorDia"> </bar-chart>
          <signature />
        </div>

        <!-- vaccination coverage by age  -->
        <div class="wrapper">
          <chart-vaccination-coverage-by-age :vacunaChile="vacunaChile" :fromDate="fromDate" :pointRadius="pointRadius" :pointHoverRadius="pointHoverRadius" />
          <signature />
        </div>

        <!-- By age -->
        <div class="wrapper" v-if="vacunaChile.labelsByAge.length > 0">
          <chart-vaccine-by-age :vacunaChile="vacunaChile" :fromDate="fromDate" :pointRadius="pointRadius" :pointHoverRadius="pointHoverRadius" />
          <signature />
        </div>

        <!-- daily by vaccine type  -->
        <div class="wrapper" v-if="vaccineType.labels.length > 0">
          <chart-vaccine-by-type :data="vaccineType" :fromDate="fromDate" />
          <signature />
        </div>

        <!-- Doughnut Chart proportion of vaccine type -->
        <div class="wrapper" v-if="vaccineType.labels.length > 0">
          <chart-proportion-vaccine :data="vaccineType" :fromDate="fromDate" />
          <signature />
        </div>

        <div class="wrapper" v-if="vacunaChile.labelsByAge.length > 0">
          <title-graphic> Proporción de población vacunada en las regiones de Chile</title-graphic>
          <update :labels="vacunaChile.labels"> </update>
          <horizontal-bar-chart v-if="vacunaChile.labelsByAge.length > 0" :chartData="renderChartVacunaPorRegion()" :options="options('horizontal')"> </horizontal-bar-chart>
          <signature />
        </div>

        <div class="wrapper" v-if="vacunaChile.paseMovilidad.labels.length > 0">
          <chart-pase-movilidad :vacunaChile="vacunaChile" :fromDate="fromDate" :pointRadius="pointRadius" :pointHoverRadius="pointHoverRadius" />
          <signature />
        </div>
      </div>

      <spinner size="massive" v-else></spinner>
    </div>
    <footer-indicators>
      <p>
        Los datos vienen del repository github

        <!-- de
        <a href="https://github.com/juancri/covid19-vaccination">COVID-19 Vaccination (JC Olivares)</a>
        y  -->

        del
        <a href="https://www.minciencia.gob.cl/covid19/">Ministerio de Ciencia, Technología, Conocimiento e Innovación</a>.
      </p>
      <p>
        Calculamos los porcentajes a partir de las proyecciones de población del
        <a
          href="https://www.ine.cl/docs/default-source/proyecciones-de-poblacion/cuadros-estadisticos/base-2017/ine_estimaciones-y-proyecciones-2002-2035_base-2017_region_base.csv?sfvrsn=1c01d705_8&download=true"
          >INE</a
        >
        para el año 2021. Se calcula que la población chilena es de
        {{ populationChile["Total"] }}.
      </p>
    </footer-indicators>
  </div>
</template>

<style src="../assets/chartChileAndRegion.css"></style>

<style lang="css" scoped>
.ChartVacuna {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.wrapper {
  width: 49.65%;
  margin: 5px 0px 5px 0px;
  box-shadow: 0px 0px 2px 2px #e8e8e8;
  border-radius: 7px;
  background-color: white;
  padding: 0px 0px 10px 0px;
}
.explication {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

@media all and (max-width: 1100px) {
  .wrapper {
    width: 100%;
    margin: 5px 0px 5px 0px;
  }
}
</style>

<script>
import { derivate, sumArray, order } from "@/assets/mathFunctions";
// import DoughnutChart from "../components/DoughnutChart";
import LineChart from "../components/LineChart";
import BarChart from "../components/BarChart";
import HorizontalBarChart from "../components/HorizontalBarChart";
import Update from "../components/Update";
import TitleContainer from "@/components/TitleContainer";
import Indicators from "@/components/Indicators";
import TitleGraphic from "@/components/TitleGraphic";
import FooterIndicators from "@/components/FooterIndicators";
import SlideBar from "../components/SlideBar";

import ChartVaccineByAge from "@/components/vaccines/ChartVaccineByAge";
import ChartVaccineByType from "@/components/vaccines/ChartVaccineByType";
import ChartProportionVaccine from "@/components/vaccines/ChartProportionVaccine";
import ChartVaccinationCoverageByAge from "@/components/vaccines/ChartVaccinationCoverageByAge";
import ChartPaseMovilidad from "@/components/vaccines/ChartPaseMovilidad";

import * as d3 from "d3-fetch";

import * as dayjs from "dayjs";
var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);
var isSameOrAfter = require("dayjs/plugin/isSameOrAfter");
dayjs.extend(isSameOrAfter);
import "dayjs/locale/es"; // load on demand
dayjs.locale("es"); // use Spanish locale globally

export default {
  name: "ChartVacuna",
  components: {
    "line-chart": LineChart,
    "bar-chart": BarChart,
    "horizontal-bar-chart": HorizontalBarChart,
    // "doughnut-chart": DoughnutChart,
    "title-container": TitleContainer,
    "title-graphic": TitleGraphic,
    indicators: Indicators,
    "footer-indicators": FooterIndicators,
    update: Update,
    "slide-bar": SlideBar,
    "chart-vaccine-by-age": ChartVaccineByAge,
    "chart-vaccine-by-type": ChartVaccineByType,
    "chart-proportion-vaccine": ChartProportionVaccine,
    "chart-vaccination-coverage-by-age": ChartVaccinationCoverageByAge,
    "chart-pase-movilidad": ChartPaseMovilidad,
    // 'choose-date': ChooseDate
  },
  metaInfo() {
    return {
      title: "Campaña de vacunación en Chile",
      meta: [
        {
          name: "description",
          content: `Avances de la campaña de vacunación en Chile: proporción de la población chilena
              vacunada con una o dos dosis, numero de primera dosis y segunda sosis administrada cada dia y en total. Graficos de la proporción
              de la población vacunada por edad con una o dos dosis.`,
        },
        { name: "robots", content: "index,follow" },
      ],
    };
  },
  data() {
    return {
      pointRadius: 1.5,
      pointHoverRadius: 4,
      colorsIndicator: ["blue", "orange", "blue", "orange"],
      vaccineType: {
        labels: [],
        firstDoses: {
          Pfizer: [],
          Sinovac: [],
          AstraZeneca: [],
          CanSino: [],
          // Janssen: [],
          proportion: [],
        },
        secondDoses: {
          Pfizer: [],
          Sinovac: [],
          AstraZeneca: [],
          CanSino: [],
          // Janssen: [],
          proportion: [],
        },
        boostDoses: {
          Pfizer: [],
          Sinovac: [],
          AstraZeneca: [],
          CanSino: [],
          proportion: [],
        },
      },
      vacunaRegions: {
        regionName: [],
        firstDoses: [],
        secondDoses: [],
      },
      populationChile: {
        // projection 2021 https://es.wikipedia.org/wiki/Anexo:Regiones_de_Chile_por_poblaci%C3%B3n
        Total: 19678363,
        Metropolitana: 8242459,
        Aysén: 107158,
        Antofagasta: 703534,
        "Arica y Parinacota": 255068,
        Atacama: 316168,
        Coquimbo: 848079,
        Araucanía: 1019548,
        "Los Lagos": 897708,
        "Los Ríos": 407837,
        Magallanes: 179533,
        Tarapacá: 391558,
        Valparaíso: 1979373,
        Ñuble: 514609,
        Biobío: 1670590,
        "O’Higgins": 1000959,
        Maule: 1143012,
      },
      vacunaChile: {
        labels: [],
        "primera dosis": [],
        "segunda dosis": [],
        "primera dosis por dia": [],
        "segunda dosis por dia": [],
        "total primera dosis": "",
        "total segunda dosis": "",
        labelsByAge: [],
        populationByAge: {
          12: 1549683, // 6 to 11
          18: 1495162, // 12 to 17
          30: 3614461, // 18 to 39
          40: 3031451, // 40 to 49
          50: 2618520,
          60: 2369901,
          70: 1804002,
          300: 1544008,
        },
        adultPopulation: 15200840,
        firstDosesByAgeGroup: {
          12: [],
          18: [],
          30: [],
          40: [],
          50: [],
          60: [],
          70: [],
          300: [],
        },
        secondDosesByAgeGroup: {
          12: [],
          18: [],
          30: [],
          40: [],
          50: [],
          60: [],
          70: [],
          300: [],
        },
        uniqueDosesByAgeGroup: {
          12: [],
          18: [],
          30: [],
          40: [],
          50: [],
          60: [],
          70: [],
          300: [],
        },
        boostDosesByAgeGroup: {
          12: [],
          18: [],
          30: [],
          40: [],
          50: [],
          60: [],
          70: [],
          300: [],
        },
        paseMovilidad: { labels: [], absolute: [], proportion: [] },
      },
      fromDate: "01-02-2021",
      listOfMonths: [],
      optionsDoughnut: {
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

      optionsPorDia: {
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
    options(position) {
      let opt = {
        animation: {
          duration: 0,
        },
        scales: {
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
        },
        tooltips: {
          mode: "index",
          intersect: false,
          callbacks: {
            label: function(tooltipItem, data) {
              return data.datasets[tooltipItem.datasetIndex].label + " (" + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] + "%)";
            },
          },
        },
        hover: {
          mode: "index",
          intersect: true,
        },
        lineTension: 1,
        responsive: true,
        maintainAspectRatio: false,
      };
      if (position == "horizontal") {
        opt["scales"] = {
          xAxes: [
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
      } else if (position == "vertical") {
        opt["scales"] = {
          yAxes: [
            {
              ticks: {
                callback: function(tick) {
                  return tick.toString() + "%";
                },
              },
            },
          ],
        };
      }
      return opt;
    },
    updateCurrentDate(payload) {
      this.fromMonth = payload;
      this.fromDate = dayjs(payload, "MMMM YYYY").format("01-MM-YYYY");
    },
    barChartVacunaPorEdad() {
      let atLeastOneDose = [];
      let completeVaccination = [];
      let boost = [];
      Object.keys(this.vacunaChile.firstDosesByAgeGroup).forEach((age) => {
        atLeastOneDose.push(this.vacunaChile.firstDosesByAgeGroup[age].slice(-1)[0]);
        completeVaccination.push(this.vacunaChile.secondDosesByAgeGroup[age].slice(-1)[0]);
        boost.push(this.vacunaChile.boostDosesByAgeGroup[age].slice(-1)[0]);
      });

      return {
        labels: ["6-11 años", "12-17 años", "18-29 años", "30-39 años", "40-49 años", "50-59 años", "60-69 años", ">= 70 años"],
        datasets: [
          {
            label: "Al menos una dosis",
            data: atLeastOneDose,
            backgroundColor: "#82CFFD",
            hoverOffset: 4,
          },
          {
            label: "Completamente vacunado",
            data: completeVaccination,
            backgroundColor: "#eba434",
            hoverOffset: 4,
          },
          {
            label: "Dosis de refuerzo",
            data: boost,
            backgroundColor: "#232b2b",
            hoverOffset: 4,
          },
        ],
      };
    },
    renderChartVacuna() {
      let indexDate = this.vacunaChile.labels.indexOf(this.fromDate);
      return {
        labels: this.vacunaChile.labels.filter((x) => {
          return dayjs(x, "DD-MM-YYYY") >= dayjs(this.fromDate, "DD-MM-YYYY");
        }),
        datasets: [
          {
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "Al menos una dosis",
            borderColor: "#82CFFD",
            backgroundColor: "rgb(130,207,253,0.5)",
            fill: 1,
            data: this.vacunaChile["primera dosis"].slice(indexDate),
          },
          {
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "Completamente vacunado",
            borderColor: "#eba434",
            backgroundColor: "rgb(235,164,52,0.5)",
            fill: 2,
            data: this.vacunaChile["segunda dosis"].slice(indexDate),
          },
          {
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "Dosis de refuerzo",
            borderColor: "#232b2b",
            backgroundColor: "rgb(35,43,43,0.5)",
            fill: true,
            data: this.vacunaChile["Dosis de refuerzo"].slice(indexDate),
          },
        ],
      };
    },
    renderChartVacunaPorDia() {
      let indexDate = this.vacunaChile.labels.indexOf(this.fromDate);
      return {
        labels: this.vacunaChile.labels
          .filter((x) => {
            return dayjs(x, "DD-MM-YYYY") >= dayjs(this.fromDate, "DD-MM-YYYY");
          })
          .slice(1),
        datasets: [
          {
            label: "Primera dosis",
            backgroundColor: "#82CFFD",
            data: this.vacunaChile["primera dosis por dia"].slice(indexDate),
          },
          {
            label: "Ùnica o segunda dosis",
            backgroundColor: "#eba434",
            data: this.vacunaChile["segunda dosis por dia"].slice(indexDate),
          },
          {
            label: "Dosis de refuerzo",
            backgroundColor: "#232b2b",
            data: this.vacunaChile["Dosis de refuerzo por dia"].slice(indexDate),
          },
        ],
      };
    },
    renderChartVacunaPorRegion() {
      return {
        labels: this.vacunaRegions.regionName,
        datasets: [
          {
            label: "Con al menos una dosis",
            backgroundColor: "#82CFFD",
            data: this.vacunaRegions.firstDoses,
          },
          {
            label: "Completamente",
            backgroundColor: "#eba434",
            data: this.vacunaRegions.secondDoses,
          },
          {
            label: "Dosis de refuerzo",
            backgroundColor: "#232b2b",
            data: this.vacunaRegions.boostDoses,
          },
        ],
      };
    },
    renderChileVaccineByAge(dosesType) {
      let indexDate = this.vacunaChile.labelsByAge.indexOf(this.fromDate);

      return {
        labels: this.vacunaChile.labelsByAge.filter((x) => {
          return dayjs(x, "DD-MM-YYYY") >= dayjs(this.fromDate, "DD-MM-YYYY");
        }),
        datasets: [
          {
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "6-11",
            borderColor: "#D2E6EE",
            backgroundColor: "#D2E6EE",
            fill: false,
            data: this.vacunaChile[dosesType]["12"].slice(indexDate),
          },
          {
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "12-17",

            borderColor: "#82CFFD",
            backgroundColor: "#82CFFD",
            fill: false,
            data: this.vacunaChile[dosesType]["18"].slice(indexDate),
          },
          {
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "18-29",

            borderColor: "#FFCD01",
            backgroundColor: "#FFCD01",
            fill: false,
            data: this.vacunaChile[dosesType]["30"].slice(indexDate),
          },
          {
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "30-39",
            borderColor: "#eba434",
            backgroundColor: "#eba434",
            fill: false,
            data: this.vacunaChile[dosesType]["40"].slice(indexDate),
          },
          {
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "40-49",
            borderColor: "#93DB70",
            backgroundColor: "#93DB70",
            fill: false,
            data: this.vacunaChile[dosesType]["50"].slice(indexDate),
          },
          {
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "50-59",
            borderColor: "#f87979",
            backgroundColor: "#f87979",
            fill: false,
            data: this.vacunaChile[dosesType]["60"].slice(indexDate),
          },
          {
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "60-69",
            borderColor: "#845EC2",
            backgroundColor: "#845EC2",
            fill: false,
            data: this.vacunaChile[dosesType]["70"].slice(indexDate),
          },
          {
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: ">=70",
            borderColor: "#232b2b",
            backgroundColor: "#232b2b",
            fill: false,
            data: this.vacunaChile[dosesType]["300"].slice(indexDate),
          },
        ],
      };
    },
  },

  async created() {
    // fromDate 3 months before today
    this.fromDate = dayjs()
      .subtract(3, "month")
      .format("01-MM-YYYY");

    // fetching datas vaccination first and second doses in Chile
    let data = await d3.csv("https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto76/vacunacion.csv");

    // let  data = await d3.csv('https://raw.githubusercontent.com/juancri/covid19-vaccination/master/output/chile-vaccination.csv')
    let firstDoses = [];
    let secondDoses = [];
    let uniqueDoses = [];

    let boostDoses = [];

    data.forEach((d) => {
      !this.vacunaRegions.regionName.includes(d["Region"]) ? this.vacunaRegions.regionName.push(d["Region"]) : "";
      let value = Math.round((Object.values(d).slice(-1)[0] / this.populationChile[d["Region"]]) * 1000) / 10;
      if (d["Dosis"] == "Primera") {
        firstDoses.push(value);
      } else if (d["Dosis"] == "Segunda") {
        secondDoses.push(value);
      } else if (d["Dosis"] == "Unica") {
        uniqueDoses.push(value);
      } else if (d["Dosis"] == "Refuerzo") {
        boostDoses.push(value);
      }
      // (d['Dosis']=='Primera' )?this.vacunaRegions.firstDoses.push(value):this.vacunaRegions.secondDoses.push(value);
    });
    this.vacunaRegions.firstDoses = sumArray(firstDoses, uniqueDoses).map((d) => Math.round(d * 100) / 100);
    this.vacunaRegions.secondDoses = sumArray(secondDoses, uniqueDoses).map((d) => Math.round(d * 100) / 100);

    // order percentage vaccined by region
    let [labelsSort, firstDosesSort] = order(this.vacunaRegions.regionName, this.vacunaRegions.firstDoses);
    let secondDosesSort = [];
    let boostDosesSort = [];
    firstDosesSort.forEach((value) => {
      let index = this.vacunaRegions.firstDoses.indexOf(value);
      secondDosesSort.push(this.vacunaRegions.secondDoses[index]);
      boostDosesSort.push(boostDoses[index]);
    });
    this.vacunaRegions.regionName = labelsSort;
    this.vacunaRegions.firstDoses = firstDosesSort;
    this.vacunaRegions.secondDoses = secondDosesSort;
    this.vacunaRegions.boostDoses = boostDosesSort;

    // time serie vacuna Chile
    this.vacunaChile.labels = Object.keys(data[0])
      .slice(2)
      .map((d) => {
        return dayjs(d, "YYYY-MM-DD").format("DD-MM-YYYY");
      });
    let firstDosesChile = [];
    let secondDosesChile = [];
    let uniqueDosesChile = [];
    let boostDosesChile = [];

    Object.values(data[0])
      .slice(2)
      .map((i) => Number(i))
      .forEach((d) => {
        firstDosesChile.push(d);
      });
    Object.values(data[1])
      .slice(2)
      .map((i) => Number(i))
      .forEach((d) => {
        secondDosesChile.push(d);
      });
    Object.values(data[2])
      .slice(2)
      .map((i) => Number(i))
      .forEach((d) => {
        uniqueDosesChile.push(d);
      });
    Object.values(data[3])
      .slice(2)
      .map((i) => Number(i))
      .forEach((d) => {
        boostDosesChile.push(d);
      });
    this.vacunaChile["primera dosis"] = sumArray(firstDosesChile, uniqueDosesChile).map((d) => Math.round((d / this.populationChile["Total"]) * 1000) / 10);
    this.vacunaChile["segunda dosis"] = sumArray(secondDosesChile, uniqueDosesChile).map((d) => Math.round((d / this.populationChile["Total"]) * 1000) / 10);
    this.vacunaChile["Dosis de refuerzo"] = boostDosesChile.map((d) => Math.round((d / this.populationChile["Total"]) * 1000) / 10);

    this.vacunaChile["total primera dosis"] = sumArray(firstDosesChile, uniqueDosesChile)
      .slice(1)
      .slice(-2);
    this.vacunaChile["total segunda dosis"] = sumArray(secondDosesChile, uniqueDosesChile)
      .slice(1)
      .slice(-2);

    this.vacunaChile["total dosis de refuerzo"] = boostDosesChile.slice(1).slice(-2);

    this.vacunaChile["primera dosis por dia"] = derivate(firstDosesChile);
    this.vacunaChile["segunda dosis por dia"] = derivate(sumArray(secondDosesChile, uniqueDosesChile));
    this.vacunaChile["Dosis de refuerzo por dia"] = derivate(boostDosesChile);

    // feching data vaccination by age in chile
    const [firstDosesByAge, secondDosesByAge, uniqueDosesByAge] = await Promise.all([
      d3.csv("https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto78/vacunados_edad_fecha_1eraDosis.csv"),
      d3.csv("https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto78/vacunados_edad_fecha_2daDosis.csv"),
      d3.csv("https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto78/vacunados_edad_fecha_UnicaDosis.csv"),
    ]);

    this.vacunaChile.labelsByAge = Object.keys(firstDosesByAge[0])
      .slice(1)
      .map((d) => {
        return dayjs(d, "YYYY-MM-DD").format("DD-MM-YYYY");
      });
    // let ageGroup = ["12"];
    let ageGroup = ["6"];

    Object.keys(this.vacunaChile.firstDosesByAgeGroup).forEach((d) => ageGroup.push(d));

    let getVaccinByAge = async (dosis, typeDosis) => {
      dosis.map((data) => {
        for (let i = 0; i < ageGroup.length - 1; i++) {
          if (Number(ageGroup[i]) <= Number(data.Edad) && Number(data.Edad) < Number(ageGroup[i + 1])) {
            this.vacunaChile[typeDosis][ageGroup[i + 1]] = sumArray(
              this.vacunaChile[typeDosis][ageGroup[i + 1]],
              Object.values(data)
                .slice(1)
                .map((i) => (i == "" ? 0 : Number(i)))
            );
          }
        }
      });
      for (let i = 0; i < ageGroup.length - 1; i++) {
        let cumulSum = [];
        this.vacunaChile[typeDosis][ageGroup[i + 1]].reduce(function(a, b, j) {
          return (cumulSum[j] = a + b);
        }, 0);
        this.vacunaChile[typeDosis][ageGroup[i + 1]] = cumulSum;
        this.vacunaChile[typeDosis][ageGroup[i + 1]] = cumulSum.map((d) => {
          return Math.round((d / this.vacunaChile.populationByAge[ageGroup[i + 1]]) * 1000) / 10;
        });
      }
    };

    getVaccinByAge(firstDosesByAge, "firstDosesByAgeGroup");
    getVaccinByAge(secondDosesByAge, "secondDosesByAgeGroup");
    getVaccinByAge(uniqueDosesByAge, "uniqueDosesByAgeGroup");

    // add unique doses and second doses in second doses
    Object.keys(this.vacunaChile.firstDosesByAgeGroup).forEach((age) => {
      this.vacunaChile["firstDosesByAgeGroup"][age] = sumArray(this.vacunaChile["uniqueDosesByAgeGroup"][age], this.vacunaChile["firstDosesByAgeGroup"][age]).map((i) => Math.round(i * 10) / 10);
      this.vacunaChile["secondDosesByAgeGroup"][age] = sumArray(this.vacunaChile["uniqueDosesByAgeGroup"][age], this.vacunaChile["secondDosesByAgeGroup"][age]).map((i) => Math.round(i * 10) / 10);
    });

    // boost
    const boostDosesByAge = await d3.csv("https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto78/vacunados_edad_fecha_Refuerzo.csv");
    getVaccinByAge(boostDosesByAge, "boostDosesByAgeGroup");

    // function to generate list of months
    let generateListOfMonths = async (labels) => {
      let currentDate = dayjs("02-2021", "MM-YYYY");
      let listOfMonths = [];
      while (currentDate < dayjs(labels[labels.length - 1], "DD-MM-YYYY")) {
        listOfMonths.push(currentDate.format("MMMM YYYY"));
        currentDate = dayjs(currentDate, "MM-YYYY").add(1, "M");
      }
      return listOfMonths;
    };
    this.listOfMonths = await generateListOfMonths(this.vacunaChile.labels);
    this.fromMonth = dayjs(this.fromDate, "01-MM-YYYY").format("MMMM YYYY");

    // vaccine type
    let vaccineTypeFirstDoses = await d3.csv("https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto83/vacunacion_fabricantes_1eraDosis.csv");
    let vaccineTypeSecondDoses = await d3.csv("https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto83/vacunacion_fabricantes_2daDosis.csv");
    let vaccineTypeUniqueDoses = await d3.csv("https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto83/vacunacion_fabricantes_UnicaDosis.csv");
    let vaccineTypeBoost = await d3.csv("https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto83/vacunacion_fabricantes_Refuerzo.csv");

    const dicVac = {
      "Campaña SARS-CoV-2 (AstraZeneca)": "AstraZeneca",
      CanSino: "CanSino",
      // "Campaña SARS-CoV-2 (Janssen)": "Janssen",
      "Campaña SARS-CoV-2 (Pfizer)": "Pfizer",
      "Campaña SARS-CoV-2 (Sinovac)": "Sinovac",
    };

    this.vaccineType.labels = Object.keys(vaccineTypeFirstDoses[0])
      .slice(1)
      .map((d) => {
        return dayjs(d, "YYYY-MM-DD").format("DD-MM-YYYY");
      });

    vaccineTypeFirstDoses.forEach((d) => {
      if (d["Fabricante"] != "CanSino" && d["Fabricante"] != "Campaña SARS-CoV-2 (Janssen)") {
        this.vaccineType.firstDoses.proportion.push(
          Object.values(d)
            .slice(1)
            .map((i) => Number(i))
            .reduce((total, element) => total + element)
        );
        this.vaccineType.firstDoses[dicVac[d["Fabricante"]]] = Object.values(d)
          .slice(1)
          .map((i) => {
            return Number(i);
          });
      }
    });

    vaccineTypeSecondDoses.forEach((d) => {
      if (d["Fabricante"] != "CanSino" && d["Fabricante"] != "Campaña SARS-CoV-2 (Janssen)") {
        this.vaccineType.secondDoses.proportion.push(
          Object.values(d)
            .slice(1)
            .map((i) => Number(i))
            .reduce((total, element) => total + element)
        );
        this.vaccineType.secondDoses[dicVac[d["Fabricante"]]] = Object.values(d)
          .slice(1)
          .map((i) => {
            return Number(i);
          });
      }
    });

    vaccineTypeUniqueDoses.forEach((d) => {
      if (d["Fabricante"] == "CanSino" || d["Fabricante"] == "Campaña SARS-CoV-2 (Janssen)") {
        this.vaccineType.secondDoses.proportion.push(
          Object.values(d)
            .slice(1)
            .map((i) => Number(i))
            .reduce((total, element) => total + element)
        );
        this.vaccineType.secondDoses[dicVac[d["Fabricante"]]] = Object.values(d)
          .slice(1)
          .map((i) => {
            return Number(i);
          });
      }
    });

    vaccineTypeBoost.forEach((d) => {
      this.vaccineType.boostDoses[dicVac[d["Fabricante"]]] = Object.values(d)
        .slice(1)
        .map((i) => {
          return Number(i);
        });

      this.vaccineType.boostDoses.proportion.push(
        Object.values(d)
          .slice(1)
          .map((i) => Number(i))
          .reduce((total, element) => total + element)
      );
    });

    let sum = this.vaccineType.firstDoses.proportion.reduce((total, element) => {
      return total + element;
    });
    this.vaccineType.firstDoses.proportion = this.vaccineType.firstDoses.proportion.map((d) => {
      return Math.round((d / sum) * 1000) / 10;
    });
    sum = this.vaccineType.secondDoses.proportion.reduce((total, element) => {
      return total + element;
    });
    this.vaccineType.secondDoses.proportion = this.vaccineType.secondDoses.proportion.map((d) => {
      return Math.round((d / sum) * 1000) / 10;
    });

    this.vaccineType.boostDoses.proportion = this.vaccineType.boostDoses.proportion.map((d) => {
      return Math.round((d / sum) * 1000) / 10;
    });
    this.vaccineType.boostDoses.proportion = [
      this.vaccineType.boostDoses.proportion[0],
      this.vaccineType.boostDoses.proportion[2],
      this.vaccineType.boostDoses.proportion[3],
      this.vaccineType.boostDoses.proportion[1],
    ];

    // compute number of people with pase de movilidad mayor de 45 años en Chile
    // const ageLimitBoost = 45;
    let delayShotPase = 14;
    const ageLimitPase = 18;
    const ageLimitBoost = 45;
    const validityPase = 6; // months
    const dateStart = "2021-05-26";
    const dateBoost = "2021-12-01";

    function vaccinatedWith14days(ageLimit) {
      // compute all people 18 year old or older with vaccines
      let peopleVaccinatedWith14days = {};
      secondDosesByAge.forEach((el, index) => {
        let age = Number(el["Edad"]);
        if (age >= ageLimit) {
          const labelsElement = Object.keys(el).slice(1);
          labelsElement.forEach((d) => {
            const labelWith14days = dayjs(d, "YYYY-MM-DD")
              .add(delayShotPase, "day")
              .format("DD-MM-YYYY");
            if (peopleVaccinatedWith14days[labelWith14days] == undefined) {
              peopleVaccinatedWith14days[labelWith14days] = Number(el[d]) + Number(uniqueDosesByAge[index][d]);
            } else {
              peopleVaccinatedWith14days[labelWith14days] += Number(el[d]) + Number(uniqueDosesByAge[index][d]);
            }
          });
        }
      });
      const cumulativeSum = ((sum) => (value) => (sum += value))(0);
      let valueCumulative = Object.values(peopleVaccinatedWith14days).map(cumulativeSum);
      Object.keys(peopleVaccinatedWith14days).forEach((d, index) => {
        peopleVaccinatedWith14days[d] = valueCumulative[index];
      });
      return peopleVaccinatedWith14days;
    }

    let adultVaccinatedWith14days = vaccinatedWith14days(ageLimitPase);
    let moreThan45yearsWith14days = vaccinatedWith14days(ageLimitBoost);

    const labelsVaccination = Object.keys(adultVaccinatedWith14days);

    // people with age >= ageLimitBoost
    let peopleWithBoost14days = {};
    boostDosesByAge.forEach((el) => {
      let age = Number(el["Edad"]);
      if (age >= ageLimitBoost) {
        const labelsElement = Object.keys(el).slice(1);
        labelsElement.forEach((d) => {
          const labelWith14days = dayjs(d, "YYYY-MM-DD")
            .add(delayShotPase, "day")
            .format("DD-MM-YYYY");
          if (peopleWithBoost14days[labelWith14days] == undefined) {
            peopleWithBoost14days[labelWith14days] = Number(el[d]);
          } else {
            peopleWithBoost14days[labelWith14days] += Number(el[d]);
          }
        });
      }
    });
    const cumulativeSum = ((sum) => (value) => (sum += value))(0);
    let valueCumulative = Object.values(peopleWithBoost14days).map(cumulativeSum);
    Object.keys(peopleWithBoost14days).forEach((d, index) => {
      peopleWithBoost14days[d] = valueCumulative[index];
    });

    // people lossing pase
    let peopleLossingPase = {};
    labelsVaccination.forEach((d) => {
      let sixMonthsBefore = dayjs(d, "DD-MM-YYYY")
        .add(-validityPase, "month")
        .format("DD-MM-YYYY");
      if (moreThan45yearsWith14days[sixMonthsBefore] != undefined) {
        peopleLossingPase[d] = peopleWithBoost14days[d] + adultVaccinatedWith14days[d] - moreThan45yearsWith14days[sixMonthsBefore];
      }
    });

    // people with pase en Chile
    let peopleWithPase = {};
    labelsVaccination.forEach((d) => {
      if (dayjs(d, "DD-MM-YYYY").isSameOrAfter(dateStart) && dayjs(d, "DD-MM-YYYY").isBefore(dateBoost)) {
        peopleWithPase[d] = adultVaccinatedWith14days[d];
      } else if (dayjs(d, "DD-MM-YYYY").isSameOrAfter(dateBoost)) {
        peopleWithPase[d] = peopleLossingPase[d];
      }
    });
    let proportion = Object.values(peopleWithPase).map((val) => Math.round((val / this.vacunaChile.adultPopulation) * 1000) / 10);

    this.vacunaChile.paseMovilidad = {
      labels: Object.keys(peopleWithPase),
      absolute: Object.values(peopleWithPase),
      proportion: proportion,
    };
  },
};
</script>
