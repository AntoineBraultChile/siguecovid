// import VueCharts from 'vue-chartjs'
import {Line, mixins} from 'vue-chartjs'
import chartjsPluginAnnotation from 'chartjs-plugin-annotation';

const { reactiveProp } = mixins

export default {
  extends: Line,
  // mixins: [VueCharts.mixins.reactiveProp],
  mixins: [reactiveProp],
  props:['options'],
  // props:{
  //   options:{
  //     type: Object,
  //     default:null
  //   }
  // },
  // watch: {
  //   chartData: function() {
  //       this.renderChart(this.chartData, this.options);
  //   }
  // },
  mounted(){
    this.addPlugin([chartjsPluginAnnotation]),
    this.renderChart(this.chartData,this.options)
  }
}

// export default {
//   extends: Line,
//   mounted(){
//     this.renderChart({
//       labels:['jan','feb','march'],
//       datasets:[
//         {label:'my activities', backgroundColor:'#dd4b39', data:[13,4,19]}
//       ]
//     },
//     {responsive:true, maintainAspectRatio:false}
//   )
//   }
// }
