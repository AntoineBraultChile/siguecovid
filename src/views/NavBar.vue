<template>
  <div class="NavBar">
    <header>
      <!-- <div class="d-flex justify-content-between"> -->
      <div class="container-title">
        <div class="title">
          <div class="title-container">
            <router-link to="/">
              <font-awesome-icon icon="virus" style="color:black" />
              <span style="font-weight:bold; color:black;font-family:Avenir">
                Sigue
              </span>
              <span style="color:black;opacity:0.4;font-weight:300;">Covid </span>
              <span style="color:black;font-weight:350;font-size:1.5rem;"> en Chile</span>
            </router-link>
          </div>
        </div>

        <div id="nav">
          <router-link to="/">Chile</router-link>
          <router-link to="/regions">Por región</router-link>
          <router-link to="/comunas">Por comuna</router-link>
          <router-link to="/edad">Por edad</router-link>
          <router-link to="/vacuna">Vacunación</router-link>
          <router-link to="/variantes">Variantes</router-link>

          <router-link to="/about">Contacto</router-link>
        </div>
      </div>
    </header>
  </div>
</template>

<script>
export default {
  name: "NavBar",
};
</script>

<style lang="css" scoped>
.NavBar {
  display: flex;
  justify-content: space-between;
}
.container-title {
  width: 100%;
  height: 100%;
  padding: 5px 20px 0px 20px;
  display: flex;
  justify-content: space-between;
}
header {
  position: fixed;
  top: 0px;
  width: 100%;
  height: 4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 1px 1px 1px 1px #e8e8e8;
  background-color: white;
  z-index: 1000;
}
#nav {
  display: flex;
  align-items: stretch;
}
.title {
  display: flex;
  align-items: center;
  /* padding-top:7px; */
  /* display:flex;
  flex-direction:row;
  justify-content:space-between;
  align-items:center; */
}

.title,
font-awesome-icon {
  /* font-size:35px; */
  font-size: 1.6rem;
}

header a,
header a:hover {
  margin: 0px 0px 0px 0px;
  display: block;
  height: 100%;
  text-decoration: none;
  color: #2c3e50;
}
#nav a {
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-decoration: none;
  font-weight: normal;
  /* font-size:25px; */
  font-size: 1.3rem;
  padding: 0px 10px 0px 10px;
}

a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active,
#nav a:hover {
  /* color: #42b983; */
  /* border: solid 0.5px ;
   border-radius: 25px; */
  /* background-color:#ecebeb; */
  /* color: #B22222; */
  color: #4285f4;
  transition: color ease 200ms;
}
</style>
