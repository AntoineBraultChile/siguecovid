<template>
  <div class="ChartAge">
    <div class="containerSection">
      <box-container>
        <title-container titleName='La pandemia de Covid-19 por edad en Chile' />
      </box-container>

        <box-container style='flex-direction:row; justify-content:space-evenly'>
      <twitter/>
      <!-- <apoyo/>  -->
</box-container>
      <!-- <div id='block_graph' class='d-flex flex-row flex-wrap justify-content-between' v-if="uciChile.labels.length > 0"> -->
      <div
        id='block_graph'
        v-if="casesChile.labels.length > 0"
      >
        <slide-bar
          v-if="listOfMonths.length > 0"
          :listOfMonths='listOfMonths'
          :fromMonth='fromMonth'
          v-on:newdate='updateCurrentDate'
        />
        <div class='graphUci'>
          <title-graphic>Incidencia por edad en Chile</title-graphic>
          <span style='font-size:1rem'>Incidencia: número semanal de casos por cada 100.000 habitantes</span> <br>
          <update :labels="casesChile.labels"> </update>
          <line-chart
            :chartData="renderChileCases()"
            :options='optionsByAge(true,true,false, true)'
          > </line-chart>
                    <signature/>

        </div>
        <div class='graphUci'>
          <title-graphic>Personas en UCI por Covid-19 por edad en Chile</title-graphic>
          <span style='font-size:1rem'>La UCI es la sigla de unidad de cuidados intensivos</span> <br>

          <update :labels="uciChile.labels"> </update>
          <line-chart
            :chartData="renderChileUciChart()"
            :options='optionsByAge(true,true,false,true)'
          > </line-chart>
                    <signature/>

        </div>

        <div class='graphUci'>
          <title-graphic>Fallecidos diarios por Covid-19 y por edad en Chile</title-graphic>
          <span style='font-size:1rem'>Los fallecidos confirmados por PCR en media móvil de 7 días</span> <br>

          <update :labels="uciChile.labels"> </update>
          <line-chart
            :chartData="renderChartDeathsByAge()"
            :options='optionsByAge(true,true,false,true)'
          > </line-chart>
                    <signature/>

        </div>
        <div class='graphUci'>
          <title-graphic> Edad media de las personas en UCI y fallecidos por Covid-19 en Chile</title-graphic>
          <span style='font-size:1rem'>La UCI es la sigla de unidad de cuidados intensivos</span> <br>
          <update :labels="meanAgeDeathsChile.labels"> </update>
          <line-chart
            :chartData="renderChartMeanAgeUciChile()"
            :options='optionsByAge(true,false,true,true)'
          > </line-chart>
                    <signature/>

        </div>
        <div class='graphUci'>
          <title-graphic>Total fallecidos por Covid-19 por edad en Chile</title-graphic>
          <update :labels="uciChile.labels"> </update>
          <bar-chart
            :chartData="renderChileDeaths()"
            :options='optionsByAge(false,true,false)'
          > </bar-chart>
                    <signature/>

        </div>
      </div>
      <spinner
        size='massive'
        v-else
      ></spinner>

    </div>
    <footer-indicators>
      <p>
        Como se calculan los indicatores :
      <ul>
        <li> El número de muertes corresponde únicamente al número de muertes confirmadas por la prueba PCR. El <a href="https://deis.minsal.cl/">Departamento de Estadiscticas e Informacion de Salud</a>
          da el número de fallecidos por Covid-19 sospechosos. </li>
        <li>
          Tenemos datos de edad en la UCI sólo para los grupos de edad
          &lt;=39, 40-49, 50-59, 60-69, >=70. La edad media en la UCI se calcula asignando el valor 30 al grupo de edad &lt;=39,
          el valor 45 al grupo de edad 40-49, 55 al grupo de edad 50-59, 65 al grupo de edad 60-69, 75 al grupo de edad >=70.
          No es la media real que calculamos por falta de datos. Pero da una idea de la evolución de la edad media en UCI.
        </li>
        <li>
          Tenemos datos de edad de los fallecidos por Covid-19 sólo para los grupos de edad
          &lt;=39, 40-49, 50-59, 60-69, 70-79, 80-89, >=90. La edad media de los fallecidos se calcula asignando el valor 30 al grupo de edad &lt;=39,
          el valor 45 al grupo de edad 40-49, 55 al grupo de edad 50-59, 65 al grupo de edad 60-69, 75 al grupo de edad 70-79, 85 al grupo de edad 80-89
          y 95 al grupo de edad >=90.
          No es la media real que calculamos por falta de datos. Pero da una idea de la evolución de la edad media de los fallecidos por Covid-19.
        </li>
      </ul>
      </p>
    </footer-indicators>

  </div>
</template>

<script>
import {
  derivate,
  sumArray,
  meanWeek,
  // derivateEachTwoDays,
} from "@/assets/mathFunctions";

import LineChart from "../components/LineChart";
import BarChart from "../components/BarChart";
// import ChooseDate from '../components/ChooseDate'
import Update from "../components/Update";
import TitleContainer from "../components/TitleContainer";
import SlideBar from "../components/SlideBar";
import TitleGraphic from "../components/TitleGraphic";
import FooterIndicators from "../components/FooterIndicators";
// import VueSlider from 'vue-slider-component'
// import 'vue-slider-component/theme/default.css'

import * as d3 from "d3-fetch";
// import moment from 'moment';

// const moment = require('moment');
// require('moment/locale/es');
// moment.locale('es');

import * as dayjs from "dayjs";
var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);
import "dayjs/locale/es"; // load on demand
dayjs.locale("es"); // use Spanish locale globally

export default {
  name: "ChartAge",
  components: {
    "line-chart": LineChart,
    "bar-chart": BarChart,
    "slide-bar": SlideBar,
    "footer-indicators": FooterIndicators,
    // 'vue-slider': VueSlider,
    "title-container": TitleContainer,
    "title-graphic": TitleGraphic,
    // 'choose-date': ChooseDate,
    update: Update,
  },
  metaInfo() {
    return {
      title: "La pandemia de Covid-19 por edad en Chile.",
      meta: [
        {
          name: "description",
          content: `Graficos de la incidencia por edad,  del numero de personas en unidad de cuidados intensivos por edad,
          de la edad media de los personas en UCI y de los fallecidos por Covid-19 y del numero total de fallecidos por edad en Chile`,
        },
        { name: "robots", content: "index,follow" },
      ],
    };
  },
  data() {
    return {
      pointRadius: 1.5,
      pointHoverRadius: 4,
      // colors:['#82CFFD','#eba434','#93DB70','#232b2b', '#f87979', 'rgb(153, 102, 255)', 'rgb(255, 205, 86)'],
      // backgroundColor: ["rgb(35, 43, 100)","rgb(35, 43, 43)","rgb(35, 43, 43)","rgb(35, 43, 43)", "rgb(35, 43, 43)", "rgb(35, 43, 43)", "rgb(35, 43, 43)"],
      colors: "rgb(35, 43, 100)",
      backgroundColors: "rgb(35, 43, 43,0.4)",
      deathsChile: {
        // labels:[],
        ageGroup: [],
        values: [],
      },
      casesChile: {
        colors: [
          "#D2E6EE",
          "#82CFFD",
          "#93DB70",
          "#f87979",
          "#eba434",
          "#24819C",
          "#845EC2",
          "#232b2b",
        ],
        ageGroup: [],
        agePopulation: [
          2472769, 2525331, 3092328, 3031451, 2618520, 2369901, 1804002,
          1544008,
        ],
        labels: [],
        values: [],
      },
      meanAgeDeathsChile: {
        labels: [],
        mean: [],
        "<=39": [],
        "40-49": [],
        "50-59": [],
        "60-69": [],
        "70-79": [],
        "80-89": [],
        ">=90": [],
      },
      uciChile: {
        labels: [],
        "<=39": [],
        "40-49": [],
        "50-59": [],
        "60-69": [],
        ">=70": [],
      },
      meanAgeUciChile: {
        labels: [],
        values: [],
      },
      fromDate: "01-02-2021",
      listOfMonths: [],
      dicMonth: [],
    };
  },
  methods: {
    optionsByAge(legend, beginAtZero, annotate, time = false) {
      let options = {
        animation: {
          duration: 0,
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: beginAtZero,
              },
            },
          ],
        },
        legend: {
          display: legend,
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
      if (time) {
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
      if (annotate == true) {
        options.annotation = {
          annotations: [
            {
              drawTime: "afterDraw",
              type: "line",
              mode: "vertical",
              scaleID: "x-axis-0",
              value: "01-02-2021",
              borderColor: "#f87979",
              borderWidth: 3,
              label: {
                content: "Inicio vacunación",
                color: "#fff",
                backgroundColor: "#f87979",
                enabled: true,
                position: "center",
                xAdjust: 60,
                yAdjust: -25,
              },
            },{
              drawTime: "afterDraw",
              type: "line",
              mode: "vertical",
              scaleID: "x-axis-0",
              value: "11-08-2021",
              borderColor: "#f87979",
              borderWidth: 3,
              label: {
                content: "Inicio refuerzo",
                color: "#fff",
                backgroundColor: "#f87979",
                enabled: true,
                position: "end",
                xAdjust: -50,
                yAdjust: -30,
              },
            }
          ],
        };
      }
      return options;
    },
    updateCurrentDate(payload) {
      this.fromMonth = payload;
      this.fromDate = dayjs(payload, "MMMM YYYY").format("01-MM-YYYY");
    },
    renderChileUciChart() {
      let indexDate = this.uciChile.labels.indexOf(this.fromDate);
      indexDate = indexDate > 0 ? indexDate : 0;
      return {
        labels: this.uciChile.labels.filter((x) => {
          return dayjs(x, "DD-MM-YYYY") >= dayjs(this.fromDate, "DD-MM-YYYY");
        }),
        datasets: [
          {
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "<=39",
            borderColor: "#82CFFD",
            backgroundColor: "#82CFFD",
            fill: false,
            data: this.uciChile["<=39"].slice(indexDate),
          },
          {
                        pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "40-49",
            borderColor: "#eba434",
            backgroundColor: "#eba434",
            fill: false,
            data: this.uciChile["40-49"].slice(indexDate),
          },
          {
                        pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "50-59",
            borderColor: "#93DB70",
            backgroundColor: "#93DB70",
            fill: false,
            data: this.uciChile["50-59"].slice(indexDate),
          },
          {            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "60-69",
            borderColor: "#232b2b",
            backgroundColor: "#232b2b",
            fill: false,
            data: this.uciChile["60-69"].slice(indexDate),
          },
          {            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: ">=70",
            borderColor: "#f87979",
            backgroundColor: "#f87979",
            fill: false,
            data: this.uciChile[">=70"].slice(indexDate),
          },
        ],
      };
    },
    renderChartMeanAgeUciChile() {
      let indexDate = this.meanAgeUciChile.labels.indexOf(this.fromDate);
      indexDate = indexDate > 0 ? indexDate : 0;
      let indexDateDeath = this.meanAgeDeathsChile.labels.indexOf(
        this.fromDate
      );
      indexDateDeath = indexDateDeath > 0 ? indexDateDeath : 0;
      return {
        labels: this.meanAgeUciChile.labels.filter((x) => {
          return dayjs(x, "DD-MM-YYYY") >= dayjs(this.fromDate, "DD-MM-YYYY");
        }),
        datasets: [
          {
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "Uci",
            borderColor: "#dd4b39",
            backgroundColor: "#dd4b39",
            fill: false,
            data: this.meanAgeUciChile.values.slice(indexDate),
          },
          {
            pointRadius: this.pointRadius,
            pointHoverRadius: this.pointHoverRadius,
            label: "Fallecidos",
            borderColor: "#232b2b",
            backgroundColor: "#232b2b",
            fill: false,
            data: this.meanAgeDeathsChile.mean.slice(indexDateDeath),
          },
        ],
      };
    },
    renderChartDeathsByAge() {
      let indexDate = this.meanAgeDeathsChile.labels.indexOf(this.fromDate);
      indexDate = indexDate > 0 ? indexDate : 0;
      let ageGroup = Object.keys(this.meanAgeDeathsChile).slice(2);
      let myDataSet = [];
      let index = 0;
      for (let age of ageGroup) {
        myDataSet.push({
          pointRadius: this.pointRadius,
          pointHoverRadius: this.pointHoverRadius,
          label: age,
          borderColor: this.casesChile.colors[index],
          backgroundColor: this.casesChile.colors[index],
          fill: false,
          data: this.meanAgeDeathsChile[age].slice(indexDate),
        });
        index += 1;
      }
      return {
        labels: this.meanAgeDeathsChile.labels.filter((x) => {
          return dayjs(x, "DD-MM-YYYY") >= dayjs(this.fromDate, "DD-MM-YYYY");
        }),
        datasets: myDataSet,
      };
    },
    renderChileDeaths() {
      return {
        labels: this.deathsChile.ageGroup,
        datasets: [
          {
            type: "bar",
            label: "",
            borderColor: this.colors,
            backgroundColor: this.backgroundColors,
            data: this.deathsChile.values,
          },
        ],
        borderWidth: 1,
      };
    },
    renderChileCases() {
      let indexDate = this.casesChile.labels.indexOf(
        this.dicMonth[this.fromDate]
      );
      indexDate = indexDate > 1 ? indexDate : 1;

      let mydatasets = [];
      this.casesChile.values.forEach((d, indx) => {
        mydatasets.push({
          pointRadius: this.pointRadius,
          pointHoverRadius: this.pointHoverRadius,
          label: this.casesChile.ageGroup[indx],
          borderColor: this.casesChile.colors[indx],
          backgroundColor: this.casesChile.colors[indx],
          fill: false,
          data: d.slice(indexDate),
          // data:d
        });
      });
      return {
        labels: this.casesChile.labels.filter((x) => {
          return (
            dayjs(x, "DD-MM-YYYY") >=
            dayjs(this.dicMonth[this.fromDate], "DD-MM-YYYY")
          );
        }),
        // labels:this.casesChile.labels,
        datasets: mydatasets,
      };
    },
  },

  async created() {
    // fromDate 3 months before today
    this.fromDate = dayjs().subtract(3, "month").format("01-MM-YYYY");

    // UCI by age
    d3.csv(
      "https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto9/HospitalizadosUCIEtario.csv"
    ).then((data) => {
      this.uciChile.labels = Object.keys(data[0])
        .slice(1)
        .map((d) => {
          return dayjs(d, "YYYY-MM-DD").format("DD-MM-YYYY");
        });
      for (let index in data) {
        if (index != "columns") {
          let age = Object.values(data[index])[0];
          let valuesUci = Object.values(data[index])
            .slice(1)
            .map((i) => Number(i));
          this.$set(this.uciChile, age, valuesUci);
        }
      }
      //  compute average age in UCI en chile
      this.meanAgeUciChile.labels = this.uciChile.labels;
      for (let i = 0; i < this.uciChile.labels.length; i++) {
        this.meanAgeUciChile.values.push(
          Math.round(
            ((30 * this.uciChile["<=39"][i] +
              45 * this.uciChile["40-49"][i] +
              55 * this.uciChile["50-59"][i] +
              65 * this.uciChile["60-69"][i] +
              75 * this.uciChile[">=70"][i]) /
              (this.uciChile["<=39"][i] +
                this.uciChile["40-49"][i] +
                this.uciChile["50-59"][i] +
                this.uciChile["60-69"][i] +
                this.uciChile[">=70"][i])) *
              10
          ) / 10
        );
      }
      //generate list of months
      generateListOfMonths();
    });
    // function to generate list of months
    let generateListOfMonths = () => {
      let currentDate = dayjs("04-2020", "MM-YYYY");
      while (
        currentDate <
        dayjs(
          this.uciChile.labels[this.uciChile.labels.length - 1],
          "DD-MM-YYYY"
        )
      ) {
        this.listOfMonths.push(currentDate.format("MMMM YYYY"));
        currentDate = dayjs(currentDate, "MM-YYYY").add(1, "M");
      }
    };
    this.fromMonth = dayjs(this.fromDate, "01-MM-YYYY").format("MMMM YYYY");

    // fetch deaths y age in chile
    let dataDeaths = await d3.csv(
      "https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto10/FallecidosEtario.csv"
    );
    // this.deathsChile.labels = Object.keys(dataDeaths[0]).slice(1).map(d=>  {return dayjs(d, "YYYY-MM-DD").format("DD-MM-YYYY")});
    for (let deaths of dataDeaths) {
      this.deathsChile.ageGroup.push(deaths["Grupo de edad"]);
      this.deathsChile.values.push(Number(Object.values(deaths).slice(-1)[0]));
    }
    // compute mean death age time service
    this.meanAgeDeathsChile.labels = Object.keys(dataDeaths[0])
      .slice(10)
      .map((d) => {
        return dayjs(d, "YYYY-MM-DD").format("DD-MM-YYYY");
      });
    dataDeaths.map((d) => {
      this.meanAgeDeathsChile[d["Grupo de edad"]] = meanWeek(
        derivate(
          Object.values(d)
            .slice(2)
            .map((i) => Number(i))
        )
      ).map((d) => {
        return Math.round(d * 10) / 10;
      });
    });
    for (let i = 0; i < this.meanAgeDeathsChile.labels.length; i++) {
      this.meanAgeDeathsChile.mean.push(
        Math.round(
          ((30 * this.meanAgeDeathsChile["<=39"][i] +
            45 * this.meanAgeDeathsChile["40-49"][i] +
            55 * this.meanAgeDeathsChile["50-59"][i] +
            65 * this.meanAgeDeathsChile["60-69"][i] +
            75 * this.meanAgeDeathsChile["70-79"][i] +
            85 * this.meanAgeDeathsChile["80-89"][i] +
            95 * this.meanAgeDeathsChile[">=90"][i]) /
            (this.meanAgeDeathsChile["<=39"][i] +
              this.meanAgeDeathsChile["40-49"][i] +
              this.meanAgeDeathsChile["50-59"][i] +
              this.meanAgeDeathsChile["60-69"][i] +
              this.meanAgeDeathsChile["70-79"][i] +
              this.meanAgeDeathsChile["80-89"][i] +
              this.meanAgeDeathsChile[">=90"][i])) *
            10
        ) / 10
      );
    }

    // fetch cases by age and gender, we want to convert it to cases by age groups
    let dataCases = await d3.csv(
      "https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto16/CasosGeneroEtario.csv"
    );
    let allLabels = Object.keys(dataCases[0])
      .slice(2)
      .map((d) => {
        return dayjs(d, "YYYY-MM-DD").format("DD-MM-YYYY");
      });

    // initialize value cases by age and group age and sum Male and Female
    for (let cases of dataCases) {
      let age = cases["Grupo de edad"];
      if (this.casesChile.ageGroup.includes(age)) {
        let indexAge = this.casesChile.ageGroup.indexOf(age);
        this.casesChile.values[indexAge] = sumArray(
          this.casesChile.values[indexAge],
          Object.values(cases)
            .slice(2)
            .map((i) => Number(i))
        );
      } else {
        this.casesChile.ageGroup.push(cases["Grupo de edad"]);
        this.casesChile.values.push(
          Object.values(cases)
            .slice(2)
            .map((i) => Number(i))
        );
      }
    }

    // group time serie by age two by two
    let casesByTenYears = [];
    for (let i = 0; i < this.casesChile.values.length - 1; i += 2) {
      casesByTenYears.push(
        sumArray(this.casesChile.values[i], this.casesChile.values[i + 1])
      );
    }
    let cases80Older = this.casesChile.values.slice(-1)[0]
    let cases7079old = casesByTenYears.slice(-1)[0]

    casesByTenYears.pop()
    casesByTenYears.push(cases80Older.map((d,i) => {return cases7079old[i]+d}))
      
    this.casesChile.values = casesByTenYears;

    // create age group 10 20 30 40 50 60 70 80 200(max age)
    this.casesChile.ageGroup = [...Array(7).keys()].map((i) =>
      String((i + 1) * 10)
    );
    this.casesChile.ageGroup.push(">=70");

    // fill value cases only monday and friday
    let allValues = this.casesChile.values;
    this.casesChile.values = [];
    allValues.forEach((casesAge, indexCasesAge) => {
      let selectMondayAndFridayValues = [];
      casesAge.forEach((value, ind) => {
        // // if monday or friday
        // if (
        //   dayjs(allLabels[ind], "DD-MM-YYYY").get("day") === 1 ||
        //   dayjs(allLabels[ind], "DD-MM-YYYY").get("day") === 5
        // ) 
                // if monday
        if (dayjs(allLabels[ind], "DD-MM-YYYY").get("day") === 1) 
        {
          selectMondayAndFridayValues.push(value);
        }
      });
      // this.casesChile.values.push(
      //   derivate(selectMondayAndFridayValues).map((d) =>
      //     Math.round(
      //       (d / this.casesChile.agePopulation[indexCasesAge]) * 100000
      //     )
      //   )
      // );
            this.casesChile.values.push(
        derivate(selectMondayAndFridayValues).map((d) =>
          Math.round(
            (d / this.casesChile.agePopulation[indexCasesAge]) * 100000
          )
        )
      );
    });

    // fill labels only monday and friday
    allLabels.forEach((date) => {
      if (
        dayjs(date, "DD-MM-YYYY").get("day") === 1 
      ) {
        this.casesChile.labels.push(date);
      }
    });


    // because we compute a derivative each two days, we delete the first two date in labels
    this.casesChile.labels = this.casesChile.labels.slice(1);


    // create a dictionary between first day of each month in listOfMonths and first day of a month in casesChile.labels
    let dic = {};
    for (let month of this.listOfMonths) {
      for (let date of this.casesChile.labels) {
        if (
          dayjs(date, "DD-MM-YYYY").format("MM-YYYY") ==
          dayjs(month, "MMMM YYYY").format("MM-YYYY")
        ) {
          if (
            !Object.keys(dic).includes(
              dayjs(month, "MMMM YYYY").format("01-MM-YYYY")
            )
          ) {
            dic[dayjs(month, "MMMM YYYY").format("01-MM-YYYY")] = date;
          }
        }
      }
    }
    this.dicMonth = dic;

    this.casesChile.ageGroup = [
      "0-9",
      "10-19",
      "20-29",
      "30-39",
      "40-49",
      "50-59",
      "60-69",
      ">=70",
    ];
  },
};
</script>


  <style lang="css" scoped>
.ChartAge {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.containerSection {
  max-width: 1400px;
  padding: 0px 10px 0px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.graphUci {
  margin-top: 5px;
  margin-bottom: 5px;
  width: 49.65%;
  box-shadow: 0px 0px 2px 2px #e8e8e8;
  border-radius: 7px;
  background-color: white;
}

#block_graph {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
  justify-content: space-between;
}

@media all and (max-width: 1100px) {
  .containerSection {
    width: 100%;
  }

  #block_graph {
    flex-direction: column;
    padding: 0px 0px 0px 0px;
    font-size: 16px;
  }

  .graphUci {
    width: 100%;
    margin-top: 5px;
  }
  .optionsGraph {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}
</style>