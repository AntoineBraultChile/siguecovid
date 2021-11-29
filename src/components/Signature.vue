<template lang="html">
  <div class="signature">
    <span v-if="type == 'minciencia'"> Fuente: siguecovid.cl con la base de datos Covid-19 de MinCiencia </span>
    <span v-if="type == 'variant'">Fuente: siguecovid.cl con los datos de covariants.org </span>
  </div>
</template>

<script>
export default {
  name: "Signature",
  props: {
    type: {
      default: "minciencia",
      type: String,
    },
  },
};
</script>

<style lang="css" scoped>
.signature {
  display: flex;
  text-align: left;
  justify-content: flex-end;
  align-items: end;
  padding: 0px 5px 0px 5px;
  font-weight: normal;
  font-size: 0.9rem;
  color: gray;
}
</style>
