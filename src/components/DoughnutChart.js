import { Doughnut, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Doughnut,
  mixins: [reactiveProp],
  props:['options'],
  watch: {
    options () {
       this.renderChart(this.chartData, this.options);
    }
  },
  mounted(){
    this.renderChart(this.chartData,this.options)
  }
}
