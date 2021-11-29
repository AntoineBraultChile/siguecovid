<template lang="html">
  <div class="slideBarContainer">
    <div class="slideBar">
      <vue-slider :data="labels" v-model="mydate" :hideLabel="true" :tooltip="'hover'" :use-keyboard="false" v-on:change="emitdate($event)" />
    </div>
  </div>
</template>

<script>
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/default.css";

export default {
  name: "slideBar",
  components: {
    "vue-slider": VueSlider,
  },
  props: ["labels", "date"],
  data() {
    return {
      mydate: this.date,
    };
  },
  methods: {
    emitdate(event) {
      return this.$emit("newdate", event);
    },
  },
};
</script>

<style lang="css" scoped>
.slideBarContainer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  box-shadow: 0px 0px 2px 2px #e8e8e8;
  border-radius: 7px;
  background-color: white;
  padding-top: 5px;
  margin-top: 5px;
  margin-bottom: 5px;
}

.slideBar {
  display: flex;
  flex-direction: column;
  width: 90%;
  padding: 0px 0px 10px 0px;
  z-index: 0;
}
</style>
