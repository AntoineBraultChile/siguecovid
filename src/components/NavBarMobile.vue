<template >
  <div class="NavBarMobile">
    <link rel="stylesheet"
        href="https://use.fontawesome.com/releases/v5.2.0/css/all.css"
        integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ"
        crossorigin="anonymous">
    <header>
    <div class="d-flex  justify-content-between">
    <div class="title">
        <router-link to="/"> <i class="fas fa-user-secret"></i> Sigue Covid Chile</router-link>
    </div>
    <div>
    <i class='fas fa-bars' v-on:click='navBar=!navBar' v-if='!navBar'></i>
    <i class='fas fa-times' v-on:click='navBar=!navBar' v-if='navBar'></i>
  </div>
    <div id="nav" v-if='navBar'>
    <router-link to="/"> <span  v-on:click='navBar=!navBar'>Chile</span></router-link>
    <router-link to="/regions"><span  v-on:click='navBar=!navBar'>Por region</span></router-link>
    <router-link to="/uci"><span  v-on:click='navBar=!navBar'>UCI por edad</span></router-link>
    <router-link to="/vacuna"><span  v-on:click='navBar=!navBar'>Vacunación</span></router-link>

    <router-link to="/about"><span  v-on:click='navBar=!navBar'>A propósito</span></router-link>
  </div>
</div>
</header>
</div>
</template>

<script>
export default {
  name:'NavBarMobile',
  data:()=>{
    return{
      navBar:false
    }
  }
}
</script>

<style lang="css" scoped>
header{
  position: fixed;
  width:100%;
  top:0px;
  /* border-bottom:solid 0.5px;
  border-color: gray; */
  box-shadow: 1px 1px 1px 1px #e8e8e8;

    padding:10px 20px 10px 20px;
  /* background-color: #FFFACD; */
  background-color:white;
}
#nav {
  /* border:solid 0.5px;
  border-color:gray; */
  border-left:solid 1px;
  border-top:solid 1px;

  border-color:#e8e8e8;
  box-shadow: 1px 1px 1px 1px #e8e8e8;

  position:absolute;
  right:0px;
  top:50px;
  display:flex;
  flex-direction:column;
  align-items:center;
  background-color: white;

  /* background-color:#f9f9f9; */
  /* background-color: #FFFACD; */
}
.title{
  display:flex;
  align-items:center;
  font-size:20px;
}

.title a, .title a:hover{
  text-decoration:none;
  color: #2c3e50;
}
#nav a {
  text-decoration:none;
  font-weight: bold;
  font-size:15px;
  color: #2c3e50;
  padding: 0px 10px 0px 10px;
}

a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active, #nav a:hover{
  /* color: #42b983; */
  color:#4285F4;

}
</style>
