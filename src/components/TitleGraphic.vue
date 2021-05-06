<template lang="html">
  <div class="TitleGraphic">
  <h2> <slot></slot></h2>
</div>

</template>

<script>
export default {
  name:'TitleGraphic'
}
</script>

<style lang="css" scoped>
.TitleGraphic{
  text-align:center;
  padding:5px 5px 0px 5px;
}
.TitleGraphic h2{
  font-size:20px;
  margin-bottom:0px;
  font-weight:normal;
}

@media all and (max-width: 1100px) {
  .TitleGraphic h2{
    font-size:20px;
  }
}
</style>
