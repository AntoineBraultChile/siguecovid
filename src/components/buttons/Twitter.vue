<template lang="html">
  <a href="https://twitter.com/datos_19" target="_blank" tag="button" class="donacion"> <img :src="mySVG" class="svg" />Seguir </a>
</template>

<script>
export default {
  name: "Twitter",
  components: {},
  data() {
    return {
      mySVG: require("@/assets/twitter.svg"),
    };
  },
};
</script>

<style lang="css" scoped>
.donacion {
  background-color: #4285f4; /* Green */
  border: none;
  margin: 5px 0px 5px 0px;
  color: white;
  padding: 10px 25px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 1.1rem;
  cursor: pointer;
  border-radius: 10px;
  font-weight: bold;
}

.donacion:hover {
  filter: brightness(95%);
}

.box-container {
  display: flex;
  align-items: center;
}

.svg {
  filter: brightness(0) invert(1);
  width: 1.1rem;
  margin: 0px 10px -2px 0px;
}
</style>
