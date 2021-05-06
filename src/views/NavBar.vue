<template >
  <div class="NavBar">
    <header>
    <!-- <div class="d-flex justify-content-between"> -->
    <div class='container-title'>
    <div class="title">
      <router-link to="/">

  <font-awesome-icon icon="virus" style="color:black" />
  <span style='font-weight:bold; color:black;font-family:Avenir'> Sigue </span>
  <span style='color:black;opacity:0.4;font-weight:300;'>Covid </span> <span style='color:black;font-weight:350;font-size:30px;'> en Chile</span>
  </router-link>
    </div>

  <div id="nav">
    <router-link to="/">Chile</router-link>
    <router-link to="/regions">Por región</router-link>
    <router-link to="/edad">Por edad</router-link>
    <router-link to="/vacuna">Vacunación</router-link>
    <router-link to="/about">Contacto</router-link>
  </div>
</div>
</header>
</div>
</template>

<script>
export default {
  name:'NavBar',
}
</script>

<style lang="css" scoped>
.NavBar{
  display:flex;
  justify-content: space-between;
}
/* .container-title{
  width:100%;
  border:solid;

  display:flex;
  justify-content: space-between;
  align-items: space-between;
} */
.container-title{
  width:100%;
  padding:5px 20px  0px 20px;
  display:flex;
  justify-content: space-between;
  align-items: space-between;

}
header{
  position: fixed;
  top:0px;
  width:100%;
  display:flex;
  justify-content: space-between;
  align-items: space-between;
  /* border-bottom:solid 0.5px; */
  /* border-color: white; */
  box-shadow: 1px 1px 1px 1px #e8e8e8;
  /* background-color: #FFFACD; */
  /* background-color:#f9f9f9; */
  background-color: white;
  z-index:100;
}
#nav {
  display:flex;
  align-items:center;
}
.title{
  /* padding-top:7px; */
  /* display:flex;
  flex-direction:row;
  justify-content:space-between;
  align-items:center; */
}
.title, font-awesome-icon{
  font-size:35px;
}

header a  , header a:hover{
  text-decoration:none;
  color: #2c3e50;
}
#nav a {
  color:black;

  display:flex;
  justify-content:center;
  align-items: center;
  height:100%;
  /* border: solid 0.5px ;
   border-radius: 25px;
   border-color:white; */
   /* background-color:white; */
  text-decoration:none;
  font-weight: normal;
  font-size:25px;
  /* color: #2c3e50; */
  padding: 0px 10px 0px 10px;
}

a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active, #nav a:hover{
  /* color: #42b983; */
  /* border: solid 0.5px ;
   border-radius: 25px; */
   /* background-color:#ecebeb; */
  /* color: #B22222; */
   color:#4285F4;


}
</style>
