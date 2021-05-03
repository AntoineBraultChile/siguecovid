<template lang="html">
  <footer>
    <p>
      Como se calculan los indicatores :
      <ul>
        <li> La media móvil de 7 días de una cantidad (casos, positividad...) del día n es la medía de la cantidad entre los días n y n-7. </li>
      </ul>
    </p>
  </footer>
</template>

<style lang="css" scoped>
footer{
  display:flex;
  width:80%;
  border-top: 1px solid;
  margin-top: 10px;
  padding-top: 10px;
}

footer p{
  text-align:left;
  font-size:16px;
}
@media all and (max-width: 1100px) {

  footer{
    width:100%;
    padding-left: 10px;
    padding-right: 10px;
  }
  footer p{
    text-align:left;
    font-size:14px;
  }

}
</style>
