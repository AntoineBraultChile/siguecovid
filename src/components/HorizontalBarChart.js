import { HorizontalBar, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: HorizontalBar,
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
