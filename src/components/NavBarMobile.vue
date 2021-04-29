<template >
  <div class="NavBarMobile">

    <header>
    <div class="d-flex  justify-content-between">
    <div class="title">
        <router-link to="/" v-on:click.native='navBar=false'>
          <!-- <i class="fas fa-user-secret"></i> Sigue Covid Chile -->
            <font-awesome-icon class='icon' icon="virus" style="color:black" />

            <span style='font-weight:bold; color:black;font-family:Avenir;'>  Sigue</span>
              <span style='color:black;opacity:0.4;font-weight:300;'>Covid </span>
              <span style='color:black;font-weight:350;font-size:20px;'>   en Chile</span>

        </router-link>
        <!-- <hr> -->
    </div>
    <div id='icons'>
      <font-awesome-icon class='icon' icon="times" v-on:click='navBar=false' v-if='navBar'/>

      <font-awesome-icon class='icon' icon="bars" v-on:click='navBar=true' v-if='!navBar'/>
    <!-- <i class='fas fa-bars' v-on:click='navBar=true' v-if='!navBar'></i>
    <i class='fas fa-times' v-on:click='navBar=false' v-if='navBar'></i> -->
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
#icons{
  display:flex;
  align-items:center;
}
#icons .icon{
    font-size:25px;
    color:black;
    /* padding-left:20px; */
}
/* .icon{
  height:100%;
  border:solid;
  font-size:40px;
} */
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
  border-radius:7px;
  position:absolute;
  right:10px;
  top:38px;
  height:150px;
  display:flex;
  flex-direction:column;
  justify-content: space-between;
  background-color: white;

  /* background-color:#f9f9f9; */
  /* background-color: #FFFACD; */
}

/* .title{
  padding-top:7px;

} */

.title, font-awesome-icon{
  font-size:25px;
}

/* .title a{
  border:solid;
  align-items:center;
  display:inline;
  justify-content: center;
  text-align:center;

  font-size:30px;
  margin-bottom:0px;
} */

.title a, .title a:hover{
  height:100%;
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
  /* background-color:#2c3e50; */
  background-color: rgb(0,0,0,0.8);

}
</style>
