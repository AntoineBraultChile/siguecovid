<template >
  <div class="NavBar">
    <link rel="stylesheet"
        href="https://use.fontawesome.com/releases/v5.2.0/css/all.css"
        integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ"
        crossorigin="anonymous">
    <header>
    <div class="d-flex justify-content-between">
        <router-link to="/">
    <div class="title">
       <i class="fas fa-user-secret"></i>

 Sigue Covid en Chile
    </div>
</router-link>
  <div id="nav">
    <router-link to="/">Chile</router-link>
    <router-link to="/regions">Por region</router-link>
    <router-link to="/uci">UCI por edad</router-link>
    <router-link to="/vacuna">Vacunación</router-link>
    <router-link to="/about">A propósito</router-link>
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

header{
  position: fixed;
  top:0px;
  width:100%;
  /* border-bottom:solid 0.5px; */
  /* border-color: white; */
  box-shadow: 1px 1px 1px 1px #e8e8e8;
  padding:0px 20px  0px 20px;
  /* background-color: #FFFACD; */
  /* background-color:#f9f9f9; */
  background-color: white;

}
#nav {
  display:flex;
  align-items:center;
}
.title{
  font-size:35px;
}

a .title , header a:hover{
  text-decoration:none;
  color: #2c3e50;
}
#nav a {
  display:flex;
  justify-content:center;
  align-items: center;
  height:100%;
  /* border: solid 0.5px ;
   border-radius: 25px;
   border-color:white; */
   /* background-color:white; */
  text-decoration:none;
  font-weight: bold;
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
