<template lang="html">
  <footer>
    <slot ></slot>

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
