<template >
  <div class="NavBar">
    <header>
    <div class="d-flex justify-content-between">
    <div class="title">
        <router-link to="/">Covid Rastreador Chile</router-link>
    </div>
  <div id="nav">
    <router-link to="/">Chile</router-link> |
    <router-link to="/regions">Por region</router-link> |
    <router-link to="/uci">UCI por edad</router-link> |
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
  border-bottom:solid 1px;
  padding:0px 20px 0px 20px;
  background-color: #FFFACD;
}
#nav {
  display:flex;
  align-items:center;
}
.title{
  font-size:35px;
}

.title a, .title a:hover{
  text-decoration:none;
  color: #2c3e50;
}
#nav a {
  text-decoration:none;
  font-weight: bold;
  font-size:25px;
  color: #2c3e50;
  padding: 0px 10px 0px 10px;
}

a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active, #nav a:hover{
  /* color: #42b983; */
  color: #B22222;

}
</style>
