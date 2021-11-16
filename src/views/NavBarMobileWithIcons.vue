<template>
  <div class="NavBarMobile">
    <header :class="{ 'add-margin': fixedNavBar }">
      <div class="title">
        <router-link to="/" v-on:click.native="navBar = false">
          <font-awesome-icon class="icon" icon="virus" style="color:black" />
          <span style="font-weight:bold; color:black;font-family:Avenir;">
            Sigue
          </span>
          <span style="color:black;opacity:0.4;font-weight:300;">Covid </span>
          <span style="color:black;font-weight:350;"> en Chile</span>
        </router-link>
      </div>
      <div class="bottom-bar" :class="{ 'fixed-nav-bar': fixedNavBar }">
        <router-link to="/"> <font-awesome-icon class="icon" icon="home"/></router-link>
        <router-link to="/regions"><font-awesome-icon class="icon" icon="flag"/></router-link>
        <router-link to="/comunas"><font-awesome-icon class="icon" icon="map-marker"/></router-link>
        <router-link to="/edad"> <font-awesome-icon class="icon" icon="users"/></router-link>
        <router-link to="/vacuna"><font-awesome-icon class="icon" icon="syringe"/></router-link>
        <router-link to="/impacto"><font-awesome-icon class="icon" icon="fist-raised"/></router-link>
        <router-link to="/variantes"><font-awesome-icon class="icon" icon="dna"/></router-link>

        <router-link to="/about">
          <font-awesome-icon class="icon" icon="envelope" />
        </router-link>
      </div>
    </header>
  </div>
</template>

<script>
export default {
  name: "NavBarMobileWithIcons",
  data: () => {
    return {
      fixedNavBar: false,
    };
  },
  created() {
    window.addEventListener("scroll", () => {
      // or window.addEventListener("scroll"....
      // var st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
      if (document.documentElement.scrollTop > 40) {
        this.fixedNavBar = true;
      } else {
        this.fixedNavBar = false;
      }
    });
  },
};
</script>

<style lang="css" scoped>
.NavBarMobile {
  margin: 0px;
}

.fixed-nav-bar {
  position: fixed;
  top: 0px;
}

.bottom-bar {
  z-index: 10;
  width: 100%;
  height: 50px;
  display: flex;
  /* position:fixed; */
  /* top:100px; */
  flex-direction: row;
  justify-content: space-around;
  align-items: space-around;
  background-color: white;
  border-top: solid 0.5px #e8e8e8;
  box-shadow: 1px 1px 1px 1px #e8e8e8;
}
.add-margin {
  margin-bottom: 60px;
}

.bottom-bar a {
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px 0px 10px 0px;
  color: black;
  /* font-size:20px; */
  font-size: 1.2rem;
}

.bottom-bar a.router-link-exact-active {
  color: #4285f4;
}

.title {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
}

header {
  /* position: fixed; */
  width: 100%;
  /* top:0px; */
  box-shadow: 1px 1px 1px 1px #e8e8e8;
  /* padding:5px 10px 5px 10px; */
  background-color: white;
  z-index: 10;
}

.title a,
.title a:hover {
  text-decoration: none;
  color: #2c3e50;
}

@media (hover: hover) and (pointer: fine) {
  .bottom-bar a:hover {
    color: #4285f4;
  }
}
</style>
