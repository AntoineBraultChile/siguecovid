<template lang="html">
  <div class="subtitle">
    <h2><slot></slot></h2>
  </div>
</template>

<script>
export default {
  name:'subtitle'
}
</script>

<style lang="css" scoped>
h2{
  font-weight:normal;
  font-size:25px;
  margin-bottom:5px;
}

@media all and (max-width: 1100px) {

h2{
    font-size:18px;

  }
}
</style>
