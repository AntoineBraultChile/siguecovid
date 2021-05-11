<template lang="html">
<div class="box-container">
<slot></slot>
</div>
</template>

<script>
export default {
  name:'BoxContainer'
}
</script>

<style lang="css" scoped>
.box-container{
  display:flex;
  flex-direction:column;
  width:100%;
  box-shadow: 0px 0px 2px 2px #e8e8e8;
  border-radius: 7px;
  background-color: white;
  /* padding:10px 10px 0px 10px; */
  padding:0px 5px 0px 5px;
  margin-bottom:5px;
  margin-top:5px;
}

</style>
