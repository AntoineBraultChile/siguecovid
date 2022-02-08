<template lang="html">
  <box-container>
    <router-link to="/about" tag="button" class="donacion"> Apoya Sigue Covid !</router-link>
  </box-container>
</template>

<script>
import BoxContainer from "../components/BoxContainer.vue";

export default {
  name: "Apoyo",
  components: {
    "box-container": BoxContainer,
  },
};
</script>

<style lang="css" scoped>
.donacion {
  background-color: #eba434; /* Green */
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
</style>
