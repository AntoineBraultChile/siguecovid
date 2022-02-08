<template>
  <div class="about">
    <div class="aboutMe">
      <h1 id="slogan">Contacto</h1>
      <h2>Donación</h2>
      <p>
        Sigue Covid es un sitio web gratuito. Pero tiene un coste de mantenimiento, especialmente para el servidor que aloja el sitio. Puede ayudar a financiarlo haciendo una transferencia. Gracias
        por su apoyo.
      </p>
      <div style="border:solid rgb(235,164,52,0.2) 2px;border-radius:10px;background:rgb(235,164,52,0.2); padding:10px">
        Antoine Brault<br />
        27.049.232-0 <br />
        Cuenta Corriente 00-170-09577-00<br />
        Banco De Chile - Edwards<br />
        abrault@dim.uchile.cl
      </div>

      <h2>Información sobre Sigue Covid</h2>
      <p>
        Sigue Covid permite una visualización sencilla y clara sobre el estado de la pandemia de Covid-19 y el progreso de la vacunación en Chile. Los datos epidemiológicos proceden del
        <a href="https://www.minciencia.gob.cl/covid19/" target="_blank"> Ministerio de Ciencia, Tecnología, Conocimiento e Innovacíon</a>
        y los datos demográficos del
        <a href="https://www.ine.cl/" target="_blank"> Instituto Nacional de Estadísticas</a>. Los datos sobre los variantes en Chile son proporcionados por Emma B. Hodcroft. 2021. "CoVariants:
        SARS-CoV-2 Mutations and Variants of Interest." <a href="https://covariants.org/">https://covariants.org/ </a>.
      </p>

      <p>
        Los gráficos tienen licencia <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank">CC BY</a>. Lo que significa que puede distribuir y adaptar los graficos incluso
        comercialmente, siempre que le acrediten la creación original (<a href="siguecovid.cl">siguecovid.cl</a>).
      </p>

      <p>
        Si está interesado en visualizar los datos de Covid-19, existen otros visualizadores con indicadores complementarios a esta página web. En particular, recomiendo el visualizador del
        <a href="http://covid-19vis.cmm.uchile.cl/geo" target="_blank"> Centro de Modelamiento Matemático</a>
        y <a href="https://www.icovidchile.cl/" target="_blank">icovid</a>.
      </p>

      <p>
        El código fuente de este sitio web está disponible
        <a href="https://github.com/AntoineBraultChile/siguecovid">aquí</a>.
      </p>

      <h2>Quién soy</h2>
      <p>
        Me llamo Antoine Brault y soy investigador en matemáticas aplicadas en Chile. Puede ponerse en contacto conmigo por correo electronico abrault@dim.uchile.cl. Estoy abierto a sus comentarios y
        observaciones para mejorar la página web.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  metaInfo() {
    return {
      title: "Contacto",
      meta: [
        {
          name: "description",
          content: `Sigue Covid permite una visualización del estado de la pandemia de Covid-19 en Chile`,
        },
        { name: "robots", content: "index,follow" },
      ],
    };
  },
};
</script>

<style lang="css" scoped>
h2 {
  font-weight: normal;
  /* font-size:25px; */
  font-size: 1.3rem;
}
#slogan {
  /* font-size:30px; */
  font-size: 1.5rem;
  padding-left: 0px;
  font-weight: normal;
}
.about {
  display: flex;
  flex-direction: row;
  justify-content: center;
  height: 100%;
  margin-top: 75px;
  /* padding:5px 10px 0px 10px; */
}
.aboutMe {
  text-align: left;
  max-width: 700px;
  height: 100%;
  padding: 10px 20px 10px 20px;
  border-radius: 7px;
  box-shadow: 0px 0px 2px 2px #e8e8e8;
  background-color: white;
}

.about p {
  text-align: justify;
  /* font-size:20px; */
  font-size: 1.2rem;
  line-height: 150%;
}

h2 {
  color: black;
  font-weight: 200;
}

/* a, a:hover{
  color: #4285F4;
  text-decoration:none;
} */

@media all and (max-width: 1100px) {
  .about {
    margin-top: 15px;
  }
  /*
 #slogan{
   font-size:20px;
 }

 h2{
   font-weight:normal;
   font-size:20px;
 } */
}
</style>
