<template>
  <div id="app">

  <nav-bar v-if='!mobileMode'></nav-bar>
  <nav-bar-mobile v-if='mobileMode'> </nav-bar-mobile>

<div class="vues">
  <router-view/>

</div>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-size:20px;
}
body{
  margin:0px;
  padding:0px;
  background-color:  #fcfbef;

}

.vues{
  padding-top:20px;
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
      this.mobileMode = window.innerWidth <= 960
    }
    },
    mounted() {
      window.addEventListener('resize', () => {
        this.mobileMode = window.innerWidth <= 960
      })
    },
    created(){
      this.setMobileMode();
    }
  }
</script>
