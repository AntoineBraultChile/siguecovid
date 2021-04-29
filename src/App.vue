<template>
  <div id="app">

  <nav-bar v-if='!mobileMode'></nav-bar>
  <nav-bar-mobile navBar='navBar' v-if='mobileMode'> </nav-bar-mobile>

<div class="vues">
  <router-view/>
</div>
  </div>
</template>

<style>
#app {
  font-family: 'Roboto', Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-size:20px;
}
/* body{
  margin:0px;
  padding:0px;
  /* background-color:red; */
  /* background-color:  #fcfbef; */
/* } */


.vues{
  margin-top:70px;
  /* padding-top:20px; */
}

@media all and (max-width: 1100px) {
  .vues{

  margin-top:55px;
}
}
</style>

<script>
import NavBar from './components/NavBar'
import NavBarMobile from './components/NavBarMobile'

  export default{
    components:{'nav-bar':NavBar, 'nav-bar-mobile':NavBarMobile},
    data:()=>{
      return{
        mobileMode:false
      }
    },
    methods:{
      setMobileMode(){
      this.mobileMode = window.innerWidth <= 1100
    }
    },
    mounted() {
      window.addEventListener('resize', () => {
        this.mobileMode = window.innerWidth <= 1100
      })
    },
    created(){
      this.setMobileMode();
    }
  }
</script>
