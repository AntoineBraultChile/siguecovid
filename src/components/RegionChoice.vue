<template lang="html">
  <div class="region-choice" >
    <h2 class='subtitle'>Región {{currentRegion}}</h2>
    <div class="optionsGraph">
      <p>
        <label for="region">Elija otra región  </label>
        <!-- <select name="region" id="region" v-on:change="changeCurrentRegion($event)"> -->
        <select name="region" id="region" v-on:change="emitregion($event)">
          <option v-for="region in regionName"  :key='region' :value='region' :selected='currentRegion==region'> {{region}}
          </option>
        </select>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name:'RegionChoice',
  props:['currentRegion', 'regionName'],
  methods:{
    emitregion(event){
      return this.$emit('new-region', event)
    }
  }
}
</script>

<style lang="css" scoped>
select {
  font-size: 20px;
}

.region-choice{
    display:flex;
    flex-direction:column;
    justify-content: center;
    align-items: center;
    width:100%;
    box-shadow: 0px 0px 2px 2px #e8e8e8;
    border-radius: 7px;
    background-color: white;
    margin-top:5px;
    margin-bottom:5px;
    /* padding:15px 10px 0px 10px; */
    /* margin-bottom:5px;
    margin-top:5px; */
  }
  .region-choice .subtitle{
    text-align:center;
    font-size:25px;
    font-weight:normal;
    margin-bottom:0px;
    margin-top:10px;

    /* border:solid; */
  }
  @media all and (max-width: 1100px) {
    .subtitleContainer{
      margin-top:5px;
    }

    .region-choice .subtitle{
      font-size: 20px;
      font-weight:normal;
    }

}
</style>
