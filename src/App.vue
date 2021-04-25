<template>
  <div id="app">
    <header>
      <h1> Covid Ratreador Chile</h1>
    <div id="nav">
      <router-link to="/">Chile</router-link> |
      <router-link to="/regions">Por regions</router-link> |
      <router-link to="/uci">UCI por edad</router-link> |
      <router-link to="/about">A propósito</router-link>
    </div>
  </header>
<div class="vues">
  <router-view/>

</div>
  </div>
</template>

<style>
#app {


  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-size:20px;
}
body{
  margin:0px;
  padding:0px;
}

h1{
  margin:0px;
}

header{
  border:solid;
  padding:0px 20px 0px 20px;
  display:flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #FFFACD;
}
#nav {
  padding: 0px;
}

#nav a {
  font-weight: bold;
  font-size:25px;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  /* color: #42b983; */
  color: black;

}

body{
  background-color:  #fcfbef;
}
</style>
<script>

  export default{

  }
</script>
