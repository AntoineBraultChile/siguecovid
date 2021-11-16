<template>
  <div id="app">
    <nav-bar-mobile-with-icons v-if="mobileMode"> </nav-bar-mobile-with-icons>

    <nav-bar v-else></nav-bar>
    <!-- <nav-bar-mobile  v-if='mobileMode'> </nav-bar-mobile> -->

    <div class="vues">
      <router-view />
    </div>
    <!-- <bottom-bar v-if='mobileMode'></bottom-bar> -->
  </div>
</template>

<style>
#app {
  font-family: "Roboto", Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* font-size:20px; */
  font-size: 1.1rem;
}
a,
a:hover {
  color: #4285f4;
  text-decoration: none;
}

.vues {
  margin-top: 70px;
  /* padding-top:20px; */
}

@media all and (max-width: 1100px) {
  .vues {
    /* margin-top:55px; */
    /* padding-bottom:10px;
    margin-top:10px; */
    margin: 10px 10px 10px 10px;
  }
}
</style>

<script>
import NavBar from "./views/NavBar";
// import NavBarMobile from './views/NavBarMobile'
import NavBarMobileWithIcons from "./views/NavBarMobileWithIcons";

export default {
  components: {
    "nav-bar": NavBar,
    // 'nav-bar-mobile':NavBarMobile,
    "nav-bar-mobile-with-icons": NavBarMobileWithIcons,

    // 'bottom-bar': BottomBar
  },
  data: () => {
    return {
      mobileMode: false,
    };
  },
  // methods:{
  //   setMobileMode(){
  //   this.mobileMode = window.innerWidth <= 1100
  // }
  // },
  mounted() {
    this.mobileMode = window.innerWidth <= 1100;
    window.addEventListener("resize", () => {
      this.mobileMode = window.innerWidth <= 1100;
    });
  },
  // created(){
  //   this.mobileMode = window.innerWidth <= 1100
  //   // this.setMobileMode();
  // }
};
</script>
