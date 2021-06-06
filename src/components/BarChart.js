import { Bar, mixins } from 'vue-chartjs'
import 'chartjs-adapter-dayjs';

const { reactiveProp } = mixins

export default {
  extends: Bar,
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
