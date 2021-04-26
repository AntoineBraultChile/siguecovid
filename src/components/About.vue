<template >
  <div class="about">
    <p>
      Datos Covid Chile permite una visualización sencilla y clara de los datos de Covid-19 en Chile. Los datos proceden del
      <a  href='https://www.minciencia.gob.cl/covid19/' target="_blank"> Ministerio de Ciencia, Tecnología, Conocimiento e Innovacíon</a>.
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
  padding:10px 20px 10px 20px;
  /* box-shadow: 1px 1px 2px 2px #e8e8e8; */
  box-shadow: 0px 3px 8px #e8e8e8;

  border-radius:45px;
  background-color: white;

}
@media all and (max-width: 960px) {
 .about p{
   font-size:15px;
 }
}
</style>
