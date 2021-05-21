<template lang="html">
  <div class="region-choice" >
    <h2 class='subtitle'>Elija comuna</h2>
    <div >
      <div class="search">
        <input type="text" id='comunas' name="comunas" v-model='comunaResearched'  @focus="setFocus" @blur='setBlur'
        autocomplete='off' v-on:keyup.enter='handleSubmit($event)' v-on:keyup.down='nextElement()' v-on:keyup.up='nextPrevious()'>
        <font-awesome-icon class='icon' icon="search" ></font-awesome-icon>
        <!-- <button type="submit" @click="handleSubmit"> <font-awesome-icon class='icon' icon="search" /></button> -->
      </div>
      <div class='listSearch' v-if='searchList'>
        <ul id="myUL" v-for="comuna in filtered"  :key='comuna' >
          <li > <a href="#" v-on:mousedown='emitregion($event)' :class="{selectedStyle:(selected===comuna)}" >{{comuna}}</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name:'ComunaChoice',
  props:['currentComuna', 'comunaNames'],
  data(){
    return{
      comunaResearched:'',
      searchList:false,
      filtered:[],
      counter:0,
      selected:'Arica',
    }
  },
  methods:{
    nextElement(){
      if(this.counter < 300){
      this.counter+=1;
      this.selected = this.filtered[this.counter]
    }
    },
    nextPrevious(){
      if(this.counter > 0){
      this.counter-=1;
      this.selected = this.filtered[this.counter]
    }
    },
    handleSubmit(event){
      // console.log(event.target.blur)
      // event.target.blur = true;
      event.target.blur()
      this.comunaResearched = this.selected;
      return this.$emit('new-comuna', this.selected)
    },
    emitregion(event){
      this.searchList = false;
      this.comunaResearched = event.target.innerText;
      return this.$emit('new-comuna', this.comunaResearched)
    },
    setFocus(){
      this.searchList = true
      this.comunaResearched = ''
    },
    setBlur(){
      this.searchList = false
      this.comunaResearched = this.currentComuna
    }
  },

  watch:{
    comunaResearched(value){
      let results = this.comunaNames.filter(comuna => {
        return comuna.toLowerCase().includes(value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase());
      });
      this.filtered = (results.length>0) ? results: ['No hay resultados']
      this.selected = this.filtered[0]
    },

  },
created(){
  this.comunaResearched= this.currentComuna
}
}
</script>

<style lang="css" scoped>
.search{
  position:relative;
  display:flex;
  flex-direction:column;
  padding:10px 0px 10px 0px;
  margin-bottom:0px;
}
.icon{
  position:absolute;
  top:25px;
  left:10px;
  /* top:190px;
  left:770px; */
  opacity:0.5;
  /* z-index:100; */
}

#comunas {
  /* background-image: url('/css/searchicon.png'); */
  background-position: 10px 12px; /* Position the search icon */
  background-repeat: no-repeat; /* Do not repeat the icon image */
  width: 100%; /* Full-width */
  font-size: 1.2rem; /* Increase font-size */
  padding: 12px 10px 12px 40px; /* Add some padding */
  border: 1px solid #ddd; /* Add a grey border */
  width:220px;
  border-radius: 5px;
  /* margin-bottom: 12px;  */
}
#comunas:focus{
  outline: none !important;
  border: 1px solid #2c3e50;
}

.listSearch{
  position:absolute;
  /* top:228px; */
  z-index:200;
  height:240px;
  overflow: scroll;
  overflow-x: hidden;
}

#myUL {
  width:270px;
  /* Remove default list styling */
  list-style-type: none;
  padding: 0;
  margin: 0;
}

#myUL li a{
  border: 1px solid #ddd; /* Add a border to all links */
  margin-top: -1px; /* Prevent double borders */
  background-color: #f6f6f6; /* Grey background color */
  padding: 12px;
  text-decoration: none; /* Remove default text underline */
  font-size: 1.2rem; /* Increase the font-size */
  color: black; /* Add a black text color */
  display: block; /* Make it into a block element to fill the whole list */
}

#myUL li a:hover:not(.header) {
  background-color: #eee; /* Add a hover effect to all links, except for headers */
}
#myUL .selectedStyle{
  background-color: #eee; /* Add a hover effect to all links, except for headers */
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
  }
  .region-choice .subtitle{
    text-align:center;
    font-size:1.3rem;
    font-weight:normal;
    margin-bottom:0px;
    margin-top:10px;
  }

  @media all and (max-width: 1100px) {
    .listSearch{
      /* top:274px; */
    }

}
</style>
