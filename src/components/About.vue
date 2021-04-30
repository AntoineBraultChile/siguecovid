<template >
  <div class="about">
    <div class="aboutMe">
        <h1 id='slogan'>A propósito</h1>
      <p>
        Me llamo Antoine Brault y soy investigador en matemáticas aplicadas en Chile.
        Puede ponerse en contacto conmigo por correo electronico abrault@dim.uchile.cl.
      </p>

      <p>
        Sigue Covid  permite una visualización sencilla y clara  sobre el estado de la pandemia de Covid-19
        y el progreso de la vacunación en Chile. Los datos proceden del
        <a  href='https://www.minciencia.gob.cl/covid19/' target="_blank"> Ministerio de Ciencia, Tecnología, Conocimiento e Innovacíon</a>.
      </p>
    </div>


  </div>
</template>

<script>
export default {
  metaInfo() {
       return {
           title: "A propósito de Sigue Covid",
           meta: [
               { name: 'description', content: `Sigue Covid  permite una visualización del estado de la pandemia de Covid-19 en Chile`},
               {name: 'robots', content: 'index,follow'}
           ]
       }},
}
</script>

<style lang="css" scoped>
#slogan{
  font-size:25px;
  padding-left:0px;
}
.about{
  display:flex;
  flex-direction:row;
  justify-content: center;
  height:100%;
  padding:5px 10px 0px 10px;

}
.aboutMe{
  text-align:left;
  max-width:800px;
  height:100%;
  /* margin-top:20px; */
  /* padding:0px 10px 0px 10px; */
  padding:10px 20px 10px 20px;
  border-radius:7px;

  /* box-shadow: 1px 1px 2px 2px #e8e8e8; */
  /* box-shadow: 0px 3px 8px #e8e8e8; */
  box-shadow: 0px 0px 2px 2px #e8e8e8;
  background-color: white;
}

 .about p{
  text-align:justify;
  font-size:20px;

}
@media all and (max-width: 1100px) {
 .about p{
   font-size:15px;
 }
 #slogan{

   font-size:20px;
 }
}
</style>
