<template>
  <div id="app">

  <nav-bar v-if='!mobileMode'></nav-bar>
  <nav-bar-mobile  v-if='mobileMode'> </nav-bar-mobile>

<div class="vues">
  <router-view/>

</div>
   <bottom-bar v-if='mobileMode'></bottom-bar>

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

.vues{
  margin-top:70px;
  /* padding-top:20px; */
}

@media all and (max-width: 1100px) {
  .vues{
    margin-top:55px;
    padding-bottom:60px
  }

}
</style>

<script>
import NavBar from './views/NavBar'
import NavBarMobile from './views/NavBarMobile'
import BottomBar from './views/BottomBar'

  export default{
    components:{'nav-bar':NavBar,
    'nav-bar-mobile':NavBarMobile,
    'bottom-bar': BottomBar
  },
    data:()=>{
      return{
        mobileMode:false,
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
