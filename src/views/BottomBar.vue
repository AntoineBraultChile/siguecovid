<template lang="html">
  <div class='bottom-bar' :class="{'morePaddingBottom':scrollDown}">
    <router-link to="/" > <font-awesome-icon class='icon' icon="home" /></router-link>
    <router-link to="/regions" ><font-awesome-icon class='icon' icon="flag" /></router-link>
    <router-link to="/edad" > <font-awesome-icon class='icon' icon="users" /></router-link>
    <router-link to="/vacuna" ><font-awesome-icon class='icon' icon="syringe" /></router-link>
    <router-link to="/about">  <font-awesome-icon class='icon' icon="envelope" /> </router-link>
  </div>
</template>

<script>


export default {
  name:'bottom-bar',
  data(){
    return{
      scrollDown:false
    }
  },

  created () {
   // // window.addEventListener('scroll', this.handleScroll);
   //  var lastScrollTop = 0;
   // // element should be replaced with the actual target element on which you have applied scroll, use window in case of no target element.
   // window.addEventListener("scroll", ()=> { // or window.addEventListener("scroll"....
   //    var st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
   //    if (st > lastScrollTop || (document.body.scrollHeight ==
   //      document.body.scrollTop +
   //      window.innerHeight) ){
   //      this.scrollDown = true
   //
   //     } else {
   //       this.scrollDown = false
   //    }
   //    lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
   // }, false);

   let startingHeightSize = window.innerHeight;
   window.addEventListener('resize', ()=>{
     if(window.innerHeight > startingHeightSize){
       startingHeightSize = window.innerHeight
       this.scrollDown = true
     }else{
       startingHeightSize = window.innerHeight
       this.scrollDown = false
     }
   })

 },
 // destroyed () {
 //   window.removeEventListener('scroll', this.handleScroll);
 // },
}
</script>

<style lang="css" scoped>
.bottom-bar{
  width:100%;
  display:flex;
  position:fixed;
  bottom:0px;
  flex-direction:row;
  justify-content: space-around;
  align-items: space-around;
  background-color:white;
  border-top:solid 0.5px #e8e8e8;
  box-shadow: 0 -5px 5px -5px  #e8e8e8;
}
.bottom-bar a{
  padding:10px 0px 15px 0px;
  color: black;
  font-size:20px;
}

.morePaddingBottom {
  padding-bottom:30px;
}


  .bottom-bar  a.router-link-exact-active,   .bottom-bar  a:hover{
  /* color: #42b983; */
  /* border: solid 0.5px ;
   border-radius: 25px; */
   /* background-color:#ecebeb; */
  /* color: #B22222; */
   color:#4285F4;


}
</style>
