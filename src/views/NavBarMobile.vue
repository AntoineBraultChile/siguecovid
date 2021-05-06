<template >
  <div class="NavBarMobile">

    <header>
    <div class="title-container">
    <div class="title">
        <router-link to="/" v-on:click.native='navBar=false'>
            <font-awesome-icon class='icon' icon="virus" style="color:black" />
            <span style='font-weight:bold; color:black;font-family:Avenir;'>  Sigue </span>
              <span style='color:black;opacity:0.4;font-weight:300;'>Covid </span>
              <span style='color:black;font-weight:350;font-size:20px;'>   en Chile</span>
        </router-link>
    </div>
    <div id='icons'>
      <font-awesome-icon class='icon' icon="times" v-on:click='navBar=false' v-if='navBar'/>
      <font-awesome-icon class='icon' icon="bars" v-on:click='navBar=true' v-if='!navBar'/>

  </div>
  </div>

</header>

<transition name="slideNavMenu">
      <div class="routeNavMobile" v-if='navBar'>
        <router-link to="/" v-on:click.native='navBar=false'> Chile</router-link>
        <router-link to="/regions" v-on:click.native='navBar=false'>Por región</router-link>
        <router-link to="/edad" v-on:click.native='navBar=false'> Por edad</router-link>
        <router-link to="/vacuna" v-on:click.native='navBar=false'>Vacunación</router-link>
        <router-link to="/about" v-on:click.native='navBar=false'>Contacto</router-link>
      </div>
  </transition>

  <div class="blurred" v-on:click='navBar=false' v-if='navBar'>
</div>
<!-- </div> -->

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

.slideNavMenu-enter-active, .slideNavMenu-leave-active {
  z-index:400;
  transition: transform 100ms;

}
.slideNavMenu-enter, .slideNavMenu-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform: translateX(500px);
}

.slideNavMenu-enter-to {
  z-index:400;

}


#icons{
  display:flex;
  align-items:center;
}
#icons .icon{
    font-size:30px;
    color:black;
     /* padding-top:20px;  */
}

header{
  position: fixed;
  width:100%;
  top:0px;
  box-shadow: 1px 1px 1px 1px #e8e8e8;
  padding:5px 10px 5px 10px;
  background-color:white;
  z-index:10;
}

#nav {
  /* position: fixed; */

  position:fixed;
  right:0px;
  top:49px;
  height:100%;
  width:100%;
  display:flex;
  flex-direction:row-reverse;
  justify-content: flex-start;
  align-items: flex-end;
  z-index:300;
}

.routeNavMobile{
  position:fixed;
  top:49px;

  right: 0px;

  height:100%;
  display:flex-end;
  flex-direction:column;
  width:50%;
  background-color: white;
  border-left:solid 1px;
  border-top:solid 1px;
  border-color:#e8e8e8;
  box-shadow: -2px 0px 2px 1px #e8e8e8;
  z-index:400;
}

.blurred{
  position:fixed;
  /* height:100%; */
  display:flex;
  flex-direction:column;
  /* width:50%; */
  top:49px;
  left: 0px;
  width:100%;
  height:100%;
  opacity:0.3;
  background-color: black;
  z-index:350;

}


.title, font-awesome-icon{
  font-size:25px;
}

  .title a, .title a:hover{
    height:50%;
    text-decoration:none;
    color: #2c3e50;
  }
.routeNavMobile a {

  display:flex;
  border-bottom:solid 1px #2c3e50;
  justify-content: center;
  align-items: center;
  text-decoration:none;
  font-weight: normal;
  font-size:20px;
  color: #2c3e50;
  padding-top:10px;
  padding-bottom:10px;
}

a {
  font-weight: bold;
  color: #2c3e50;
}

.routeNavMobile a.router-link-exact-active, .routeNavMobile a:hover{
  color:white;
  background-color: rgb(0,0,0,0.8);
}
</style>
