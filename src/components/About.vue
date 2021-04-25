<template >
  <div class="about">
    <p>
      Covid Rastreador Chile permite una visualización sencilla y clara de los datos de Covid-19 en Chile. Los datos proceden del
      <a href='https://www.minciencia.gob.cl/covid19/'> Ministerio de Ciencia, Tecnología, Conocimiento e Innovacíon</a>.
  Puede ponerse en contacto conmigo por correo electronico abrault@dim.uchile.cl.
    </p>

  </div>
</template>

<script>
export default {
}
</script>

<style lang="css" scoped>
.about{
  display:flex;
  justify-content: center;
  margin-top:20px;
  padding:0px 10px 0px 10px;
}
.about p{
  width:800px;
  text-align:justify;
  font-size:20px;
}
@media all and (max-width: 960px) {
 .about p{
   font-size:15px;
 }
}
</style>
