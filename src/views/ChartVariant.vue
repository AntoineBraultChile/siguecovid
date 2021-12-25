<template>
  <div class="ChartVariant">
    <div class="containerSection">
      <box-container>
        <title-container titleName="Variantes del SARS-CoV-2 secuenciadas en Chile" />
      </box-container>

      <box-container class="explication">
        <p style="font-size:1.1rem;max-width:800px;text-align:justify;line-height: 150%;margin:20px 20px 20px 20px">
          Gráficos que representan las variantes del SARS-CoV-2 secuenciadas en Chile. La actualización se hace cada dos semanas. Cada punto de los gráficos corresponde a los datos de secuenciación de
          las dos semanas anteriores.
        </p>
      </box-container>

      <div id="block_graph" v-if="variantChile.labels.length > 0 && listOfMonths.length > 0">
        <slide-bar :listOfMonths="listOfMonths" :fromMonth="fromMonth" v-on:newdate="updateCurrentDate" />

        <div class="wrapper">
          <title-graphic> Variantes secuenciadas cada dos semanas en Chile</title-graphic>
          <update :labels="variantChile.labels"> </update>
          <line-chart :chartData="getChartVariant(variantChile.valuesForTheVariants)" :options="chartOptions()"> </line-chart>
          <signature type="variant" />
        </div>

        <div class="wrapper">
          <title-graphic> Proporción de cada variante secuenciada cada dos semanas en Chile</title-graphic>
          <update :labels="variantChile.labels"> </update>
          <line-chart :chartData="getChartVariant(variantChile.proportionVariants)" :options="chartOptions((percentage = false), (NoLegend = false), (max100 = true))"> </line-chart>
          <signature type="variant" />
        </div>

        <!-- <div class="wrapper">
          <title-graphic> Casos de la variante Delta detectados cada dos semanas en Chile</title-graphic>
          <update :labels="variantChile.labels"> </update>
          <bar-chart :chartData="getChart(variantChile.valuesForTheVariants.Delta, colorsVariant[3], 'line')" :options="chartOptions((percentage = false), (NoLegend = true))"> </bar-chart>
        </div>

        <div class="wrapper">
          <title-graphic> Número total de secuencias realizadas cada dos semanas en Chile</title-graphic>
          <update :labels="variantChile.labels"> </update>
          <bar-chart :chartData="getChart(variantChile.totalSequences, colorsVariant[7], 'line')" :options="chartOptions((percentage = false), (NoLegend = true))"> </bar-chart>
        </div>
        <div class="wrapper">
          <title-graphic> Porcentaje de casos detectados secuenciados cada dos semanas en Chile</title-graphic>
          <update :labels="variantChile.labels"> </update>
          <bar-chart :chartData="getChart(variantChile.proportionSequencedByCases, colorsVariant[7], 'line')" :options="chartOptions((percentage = true), (NoLegend = true))"> </bar-chart>
        </div> -->
      </div>
      <spinner size="massive" v-else></spinner>
    </div>
    <footer-indicators>
      <p>
        Los datos son proporcionados por Emma B. Hodcroft. 2021. "CoVariants: SARS-CoV-2 Mutations and Variants of Interest."
        <a href="https://covariants.org/">https://covariants.org/ </a>.
      </p>
    </footer-indicators>
  </div>
</template>

<style src="../assets/chartChileAndRegion.css"></style>

<style lang="css" scoped>
.ChartVariant {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.wrapper {
  width: 49.65%;
  /* width: 100%; */
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
import { sumArray, derivate } from "@/assets/mathFunctions";
// import DoughnutChart from "../components/DoughnutChart";
import LineChart from "../components/LineChart";
// import BarChart from "../components/BarChart";
// import HorizontalBarChart from "../components/HorizontalBarChart";
import Update from "../components/Update";
import TitleContainer from "@/components/TitleContainer";
// import Indicators from "@/components/Indicators";
import TitleGraphic from "@/components/TitleGraphic";
import FooterIndicators from "@/components/FooterIndicators";
import SlideBar from "../components/SlideBar";

import * as d3 from "d3-fetch";

import * as dayjs from "dayjs";
var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);
import "dayjs/locale/es"; // load on demand
dayjs.locale("es"); // use Spanish locale globally

export default {
  name: "ChartVacuna",
  components: {
    "line-chart": LineChart,
    // "bar-chart": BarChart,
    // "horizontal-bar-chart": HorizontalBarChart,
    // "doughnut-chart": DoughnutChart,
    "title-container": TitleContainer,
    "title-graphic": TitleGraphic,
    // indicators: Indicators,
    "footer-indicators": FooterIndicators,
    update: Update,
    "slide-bar": SlideBar,
    // 'choose-date': ChooseDate
  },
  metaInfo() {
    return {
      title: "Variantes secuenciadas en Chile",
      meta: [
        {
          name: "description",
          content: `Gráficos que representan las variantes secuenciadas en Chile cada
          semana.`,
        },
        { name: "robots", content: "index,follow" },
      ],
    };
  },
  data() {
    return {
      pointRadius: 1.5,
      pointHoverRadius: 4,
      colorsVariant: [
        "rgba(210,230,238,1.0)",
        "rgba(130,207,253,1.0)",
        "rgba(147,219,112,1.0)",
        "rgba(248,121,121,1.0)",
        "rgba(235,164,52,1.0)",
        "rgba(36,129,156,1.0)",
        "rgba(160,82,45,1)",
        "rgba(132,94,194,1.0)",
        "rgba(160,139,74,1.0)",
        "rgba(35,43,43,1.0)",
      ],
      colorsVariantTransparent: [
        "rgba(210,230,238,1)",
        "rgba(130,207,253,1)",
        "rgba(147,219,112,1)",
        "rgba(248,121,121,1)",
        "rgba(235,164,52,1)",
        "rgba(36,129,156,1)",
        "rgba(160,82,45,1)",
        "rgba(132,94,194,1)",
        "rgba(160,139,74)",
        "rgba(35,43,43,1)",
      ],
      variantChile: {
        labels: [],
        valuesForTheVariants: {},
        proportionVariants: [],
        totalSequences: [],
        proportionSequencedByCases: [],
      },
      fromDate: "01-02-2021",
      fromMonth: "",
      listOfMonths: [],
      dicMonth: {},
    };
  },
  methods: {
    updateCurrentDate(payload) {
      this.fromMonth = payload;
      this.fromDate = dayjs(payload, "MMMM YYYY").format("01-MM-YYYY");
    },
    getChartVariant(dataVariant) {
      let indexDate = this.variantChile.labels.indexOf(this.dicMonth[this.fromDate]);
      indexDate = indexDate > 0 ? indexDate : 0;

      let datasets = [];

      let nameVariant = Object.keys(dataVariant);
      nameVariant.forEach((name, index) => {
        datasets.push({
          type: "line",
          pointRadius: 2,
          pointHoverRadius: this.pointHoverRadius,
          label: name,
          borderColor: this.colorsVariant[index],
          backgroundColor: this.colorsVariantTransparent[index],
          fill: true,
          data: dataVariant[name].slice(indexDate),
        });
      });
      return {
        labels: this.variantChile.labels.slice(indexDate),
        datasets: datasets,
      };
    },
    getChart(data, color, type) {
      let indexDate = this.variantChile.labels.indexOf(this.dicMonth[this.fromDate]);
      indexDate = indexDate > 0 ? indexDate : 0;
      const datasets = [
        {
          type: type,
          pointRadius: 2,
          pointHoverRadius: this.pointHoverRadius,
          borderColor: color,
          backgroundColor: color,
          fill: false,
          data: data.slice(indexDate),
        },
      ];
      return {
        labels: this.variantChile.labels.slice(indexDate),
        datasets: datasets,
      };
    },

    chartOptions(percentage = false, NoLegend = false, max100 = false) {
      let options = {
        scales: {
          xAxes: [
            {
              type: "time",
              time: {
                parser: "DD-MM-YYYY",
                unit: "month",
              },
            },
          ],
          yAxes: [
            {
              stacked: true,
              ticks: {},
              title: {
                display: true,
                text: "Value",
              },
            },
          ],
        },
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
        responsive: true,
        maintainAspectRatio: false,
      };

      options["interaction"] = {
        mode: "nearest",
        axis: "x",
        intersect: false,
      };
      if (max100) {
        options.tooltips["callbacks"] = {
          label: function(tooltipItem, data) {
            return data.datasets[tooltipItem.datasetIndex].label + " (" + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] + "%)";
          },
        };
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
          },
        ];
      }
      if (percentage) {
        options.tooltips["callbacks"] = {
          label: function(tooltipItem, data) {
            return data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] + "%";
          },
        };
        options.scales["yAxes"] = [
          {
            stacked: true,
            ticks: {
              beginAtZero: true,
              callback: function(tick) {
                return tick.toString() + "%";
              },
            },
          },
        ];
      }
      if (NoLegend) {
        options.legend = {
          display: false,
        };
      }
      return options;
    },
  },

  async created() {
    // fromDate 3 months before today
    this.fromDate = dayjs()
      .subtract(3, "month")
      .format("01-MM-YYYY");
    this.fromMonth = dayjs(this.fromDate, "01-MM-YYYY").format("MMMM YYYY");

    //  Covid variant
    const response = await fetch("https://raw.githubusercontent.com/hodcroftlab/covariants/master/cluster_tables/EUClusters_data.json");
    const variant = await response.json();
    const variantChile = variant.countries["Chile"];
    // console.log(variantChile);
    const totalSequences = variantChile.total_sequences;
    this.variantChile.totalSequences = totalSequences;
    let allLabels = variantChile.week.map((d) => dayjs(d, "YYYY-MM-DD").format("DD-MM-YYYY"));
    const firstDate = allLabels[0];
    const lastDate = allLabels[allLabels.length - 1];

    allLabels.push(
      dayjs(lastDate, "DD-MM-YYYY")
        .add(14, "d")
        .format("DD-MM-YYYY")
    ); // add 2 weeks

    const labelsWihtoutFirstTwoWeeks = allLabels.slice(1);

    this.variantChile.labels = labelsWihtoutFirstTwoWeeks;

    const dicVariant = {
      "20I (Alpha, V1)": "Alpha",
      "20H (Beta, V2)": "Beta",
      "20J (Gamma, V3)": "Gamma",
      "21A (Delta)": "Delta",
      "21I (Delta)": "Delta",
      "21J (Delta)": "Delta",
      "21C (Epsilon)": "Epsilon",
      "21G (Lambda)": "Lambda",
      "21F (Iota)": "Iota",
      "21H (Mu)": "Mu",
      "21K (Omicron)": "Omicron",
    };

    const nameVariant = Object.keys(variantChile).slice(2);

    let sumVariant = [];
    nameVariant.forEach((name) => {
      if (dicVariant[name] != undefined) {
        if (this.variantChile.valuesForTheVariants[dicVariant[name]] != undefined) {
          this.variantChile.valuesForTheVariants[dicVariant[name]] = sumArray(this.variantChile.valuesForTheVariants[dicVariant[name]], variantChile[name]);
          this.variantChile.proportionVariants[dicVariant[name]] = sumArray(
            this.variantChile.proportionVariants[dicVariant[name]],
            variantChile[name].map((number, index) => (number / totalSequences[index]) * 100)
          );
        } else {
          this.variantChile.valuesForTheVariants[dicVariant[name]] = variantChile[name];
          this.variantChile.proportionVariants[dicVariant[name]] = variantChile[name].map((number, index) => Math.round((number / totalSequences[index]) * 1000) / 10);
        }
        sumVariant = sumArray(sumVariant, variantChile[name]);
      }
    });
    this.variantChile.proportionVariants["Delta"] = this.variantChile.proportionVariants["Delta"].map((d) => Math.round(d * 10) / 10);
    const otherVariants = sumArray(
      sumVariant.map((v) => -v),
      totalSequences
    );

    this.variantChile.valuesForTheVariants["Otras"] = otherVariants;
    this.variantChile.proportionVariants["Otras"] = otherVariants.map((d, index) => Math.round((d / totalSequences[index]) * 1000) / 10);

    // list of months and dictionary between date and months
    labelsWihtoutFirstTwoWeeks.forEach((d) => {
      if (!this.listOfMonths.includes(dayjs(d, "DD-MM-YYYY").format("MMMM YYYY"))) {
        this.listOfMonths.push(dayjs(d, "DD-MM-YYYY").format("MMMM YYYY"));
        if (!Object.values(this.dicMonth).includes(dayjs(d, "DD-MM-YYYY").format("DD-MM-YYYY"))) {
          this.dicMonth[dayjs(d, "DD-MM-YYYY").format("01-MM-YYYY")] = dayjs(d, "DD-MM-YYYY").format("DD-MM-YYYY");
        }
      }
    });

    // compute number of cases detected each 2 weeks
    let casesCumultative = await d3.csv("https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto3/CasosTotalesCumulativo.csv");
    let labelsCases = [];
    let cases = [];
    casesCumultative.forEach((d) => {
      if (d["Region"] == "Total") {
        labelsCases = Object.keys(d)
          .slice(2)
          .map((date) => dayjs(date, "YYYY-MM-DD").format("DD-MM-YYYY"));

        cases = derivate(
          Object.values(d)
            .slice(1)
            .map((values) => Number(values))
        );
      }
    });

    // group cases by 2 weeks

    const lastDate2 = allLabels[allLabels.length - 1];
    const indexFirstDate = labelsCases.indexOf(firstDate);
    const indexLastDate = labelsCases.indexOf(lastDate2);
    const labelsFirstLastDate = labelsCases.slice(indexFirstDate, indexLastDate + 1);
    const casesFirstLastDate = cases.slice(indexFirstDate, indexLastDate + 1);

    let casesByTwoWeeks = [];

    let week = 0;
    while (week < allLabels.length - 1) {
      let indexLabels = labelsFirstLastDate.indexOf(allLabels[week]);
      let indexLabels2 = labelsFirstLastDate.indexOf(allLabels[week + 1]);
      casesByTwoWeeks.push(casesFirstLastDate.slice(indexLabels, indexLabels2).reduce((value, res) => value + res));
      week += 1;
    }
    const proportionSequencedByCases = casesByTwoWeeks.map((d, index) => Math.round((this.variantChile.totalSequences[index] / d) * 1000) / 10);
    this.variantChile["proportionSequencedByCases"] = proportionSequencedByCases;
  },
};
</script>
