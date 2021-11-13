<template lang="html">
  <div class="RadioChoice">
    <label class="radio">
      <label :for="contactChoice1">
        <input type="radio" :id="contactChoice1" value="diario" v-model="pickedComponent" v-on:change="emitevent" />
        Diario</label
      >
      <label :for="contactChoice2">
        <input type="radio" :id="contactChoice2" value="variacion" v-model="pickedComponent" v-on:change="emitevent" />
        Variación</label
      >
    </label>
  </div>
</template>

<script>
export default {
  name: "radioChoice",
  props: ["picked"],
  data() {
    return {
      contactChoice1: null,
      contactChoice2: null,
      pickedComponent: this.picked,
    };
  },
  methods: {
    emitevent() {
      return this.$emit("newpicked", this.pickedComponent);
    },
  },
  mounted() {
    this.id = this._uid;
  },
};
</script>

<style lang="css" scoped>
.radio {
  display: flex;
  text-align: right;
  /* align-items: center; */
  padding: 0px 0px 0px 10px;
}
</style>
