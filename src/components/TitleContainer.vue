<template lang="html">
  <div class="titleContainer">
<h1  id='slogan'>{{titleName}}</h1>
  </div>
</template>

<script>

export default {
  name:'title-container',

  props:['titleName']
}
</script>

<style lang="css" scoped>
 .titleContainer{
  width:100%;
  /* box-shadow: 0px 0px 2px 2px #e8e8e8;
  border-radius: 7px;
  background-color: white; */
}

#slogan{
  font-size:30px;
  font-weight:normal;
  margin:0px;
  padding:10px 0px 10px 0px;

}
@media all and (max-width: 1100px) {
  .Title{
    width:100%;
    /* margin:0px 20px 5px 20px; */
  }

  #slogan{
    font-size:20px;
  }
}

</style>
