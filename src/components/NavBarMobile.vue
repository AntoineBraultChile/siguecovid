<template >
  <div class="NavBarMobile">

    <header>
    <div class="d-flex  justify-content-between">
    <div class="title">
        <router-link to="/" v-on:click.native='navBar=false'>
          <!-- <i class="fas fa-user-secret"></i> Sigue Covid Chile -->
          <h1><i class="fas fa-user-secret" style="color:black"></i>  <span style='font-weight:bold; color:black;font-family:Avenir;'>  Sigue</span>
            <span style='color:black;opacity:0.4;font-weight:300;'>Covid </span>
            <span style='color:black;font-weight:350;font-size:20px;'>   en Chile</span></h1>
        </router-link>
        <!-- <hr> -->
    </div>
    <div id='icons'>
    <i class='fas fa-bars' v-on:click='navBar=true' v-if='!navBar'></i>
    <i class='fas fa-times' v-on:click='navBar=false' v-if='navBar'></i>
  </div>
    <div id="nav" v-if='navBar'>
    <router-link to="/" v-on:click.native='navBar=false'> Chile</router-link>
    <router-link to="/regions" v-on:click.native='navBar=false'>Por región</router-link>
    <router-link to="/uci" v-on:click.native='navBar=false'>UCI por edad</router-link>
    <router-link to="/vacuna" v-on:click.native='navBar=false'>Vacunación</router-link>

    <router-link to="/about" v-on:click.native='navBar=false'>A propósito</router-link>
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
#icons i{
    font-size:30px;
    padding-left:20px;
}
  i{
    font-size:30px;
  padding:10px 0px 10px 0px;
}
/* div i{
  font-size:25px;
} */
header{
  position: fixed;
  width:100%;
  top:0px;
  /* border-bottom:solid 0.5px;
  border-color: gray; */
  box-shadow: 1px 1px 1px 1px #e8e8e8;

  padding:0px 10px 0px 10px;
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
  height:150px;
  display:flex;
  flex-direction:column;
  justify-content: space-between;
  background-color: white;

  /* background-color:#f9f9f9; */
  /* background-color: #FFFACD; */
}
h1, i{

  font-size:30px;
  margin-bottom:0px;
}

.title a, .title a:hover{
  text-decoration:none;
  color: #2c3e50;
}
#nav a {
  height:100%;
  display:flex;
  justify-content: center;
  align-items: center;
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
  /* color:#4285F4; */
  color:white;
  background-color:#2c3e50;

}
</style>
