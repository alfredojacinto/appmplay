/*****************************
Autor:Jose Carlos Ruiz
Fecha Modificacion: 07/07/2018
Archivo JS
******************************/
var $$ = Dom7;

var app7 = new Framework7({
  // App root element
  root: '#app',
  // App Name
  name: 'My App',
  // App id
  id: 'com.myapp.test',
  // Enable swipe panel
  /*panel: {
    swipe: 'left',
  },*/
  // Add default routes
  routes: routes
  // ... other parameters
});


var mainView = app7.views.create('.view-main'); 


var app = {

    autenticado: false,
    usuario:"",
    password:"",
    name:"",
    hostname: "http://localhost",
    urlVideo:"",
    tituloVideo:"",

    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');


 console.log("VARIABLE AUTENTICADO:"+window.localStorage.getItem("autenticado"));


         if(window.localStorage.getItem("autenticado")=="true"){

                mainView.router.navigate('/home/',{animate:false});
         }
        
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
       /* var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);*/
    },
    loginAccess:function(){


      this.usuario = $$('#usuario').val();
      this.password = $$('#password').val();


      if(this.usuario == "" || this.password == ""){
         
         app7.dialog.alert('Debes de ingresar usuario y/o contraseña');
           
      }else{

        app7.preloader.show();
        

        app7.request({
           url: this.hostname+'/mplay/api/login.php',
           data:{username:this.usuario,password:this.password},
           method:'POST',
           crossDomain: true,
           success:function(data){
            
            app7.preloader.hide();

            var objson = JSON.parse(data);
            if(objson.data =="AUTENTICADO"){

            
            window.localStorage.setItem("autenticado", "true");
            this.autenticado = window.localStorage.getItem("autenticado");
            
            mainView.router.navigate('/home/',{animate:true});
            }else{
               app7.dialog.alert("Usuario o Password incorrecto");
            }
            
           
           },
           error:function(error){

            app7.preloader.hide();
            app7.dialog.alert("Hubo un error por favor intenta nuevamente");
            console.log(data);
           }
           
        });
             
          

      }

    },
    
    RegisterAccess:function(){

      mainView.router.navigate('/register/',{animate:true});
    
    },

    RegisterUser:function(){
      
      this.name = $$('#frm_name').val();
      this.usuario = $$('#frm_username').val();
      this.password = $$('#frm_password').val();

      app7.request({
           url: this.hostname+'/mplay/api/users.php',
           data:{name:this.name,username:this.usuario,password:this.password},
           method:'POST',
           crossDomain: true,
           success:function(data){
            
            app7.preloader.hide();

            var objson = JSON.parse(data);
           
            
           
           },
           error:function(error){

            app7.preloader.hide();
            app7.dialog.alert("Hubo un error por favor intenta nuevamente");
            console.log(data);
           }
           
        });

    

    },
    sendComments:function(){
           
           var nombre = $$('#ctc_nombre').val();
           var email = $$('#ctc_email').val();
           var asunto = $$('#ctc_asunto').val();
           var comentarios = $$('#ctc_comentarios').val();


          app7.preloader.show();

          app7.request({
           url: this.hostname+'/mplay/api/contacto.php',
           data:{nombre:nombre,email:email,asunto:asunto,comentarios:comentarios},
           method:'POST',
           crossDomain: true,
           success:function(data){
            
            app7.preloader.hide();

            var objson = JSON.parse(data);
            app7.dialog.alert("Hemos recibido su mensaje correctamente"); 
            mainView.router.navigate('/home/',{animate:true});
           
           },
           error:function(error){

            app7.preloader.hide();
            app7.dialog.alert("Hubo un error por favor intenta nuevamente");
            console.log(data);
           }
           
        });



    },

    loginClose:function(){
     

        app7.panel.close();
        app7.dialog.confirm('¿Seguro, deseas salir de la aplicación?', function () {
            
        window.localStorage.setItem("autenticado", "false");
        mainView.router.navigate('/login/',{animate:true});
    
      });

    }
};


function showMenu(){

   app7.panel.open('left', true);

}


$$(document).on('page:init', '.page[data-name="home"]', function (e) {
      console.log('View Home load Init!');
      app7.panel.allowOpen = true;
      app7.panel.enableSwipe('left');

      var $ptrContent = app7.ptr.create('.ptr-content');

      $ptrContent.on('refresh', function (e) {
          RefreshVideos();
      });


      
      getVideos();


   /*   var mySwiper = new Swiper('.swiper-container', {
  autoplay: {
    delay: 1000,
  }
});*/

});

$$(document).on('page:init', '.page[data-name="home"]', function (e) {

});


$$(document).on('page:init', '.page[data-name="search"]', function (e) {

  $$('#search').on('keyup', function (e) {

    var KeyCode = e.KeyCode || e.which;

    if(KeyCode == 13){
      buscar ($$('#search').val());
      e.preventDefault();
    return false;
    }else{

    }

    });

});

function buscar(buscar){

  var buscar = buscar;

  $$('#list-search').html(""); /*para limpiar consulta*/

  app7.preloader.show();
 
   app7.request({
            url: app.hostname+'/mplay/api/search.php?buscar='+buscar,
            method:'GET',
            crossDomain: true,
            success:function(data){
             
             app7.preloader.hide();
 
             var objson = JSON.parse(data);
             var video = "";
             if(objson.data == "NO_ENCONTRADOS"){
               
              app7.dialog.alert("Ningun resultado de busqueda");
             }else{

            for(x in objson.data){
                   console.log(objson.data[x].titulo);

                   video = '<li><a href="#" class="item-link item-content"><div class="item-media"><img src="./img/post2.jpg" width = "80"/></div><div class="item-inner"><div class="item-title-row"><div class="item-title">'+objson.data[x].titulo+'</div><div class="item-after">$15</div></div><div class="item-subtitle">'+objson.data[x].autor+'</div></div></a></li><li>';
                  
                  $$('#list-search').append(video);
                }
              }
            
            },
            error:function(error){
 
             app7.preloader.hide();
             app7.dialog.alert("Hubo un error por favor intenta nuevamente");
             console.log(error);
            }
            
         });
 
 }





function getVideos(){


 app7.preloader.show();

  app7.request({
           url: app.hostname+'/mplay/api/videos.php',
           method:'GET',
           crossDomain: true,
           success:function(data){
            
            app7.preloader.hide();

            var objson = JSON.parse(data);
            var video = "";
            var img ="";
             
             for(x in objson.data){
                  console.log(objson.data[x].titulo);

                  img = app.hostname+'/mplay/img/'+objson.data[x].imagen;
                  video = '<div class="item"><div class="post"><img src="img/post2.jpg" onClick="goVideo(\''+objson.data[x].titulo+'\',\''+objson.data[x].url+'\')"><div class="time">10:06</div></div><h5>'+objson.data[x].titulo+'</h5><p>'+objson.data[x].autor+'</p><p>25 Visitas | 20 Agosto</p></div>';

                   $$('#content-videos').append(video);

             }
           
           },
           error:function(error){

            app7.preloader.hide();
            app7.dialog.alert("Hubo un error por favor intenta nuevamente");
            console.log(error);
           }
           
        });


}


function RefreshVideos(){

   app7.request({
           url: app.hostname+'/mplay/api/videos.php',
           method:'GET',
           crossDomain: true,
           success:function(data){
            
            app7.ptr.done();
            $$('#content-videos').html("");
            var objson = JSON.parse(data);
            var video = "";
             
             for(x in objson.data){
                  console.log(objson.data[x].titulo);

                  video = '<div class="item"><div class="post"><img src="img/post2.jpg"><div class="time">10:06</div></div><h5>'+objson.data[x].titulo+'</h5><p>'+objson.data[x].autor+'</p><p>25 Visitas | 20 Agosto</p></div>';

                   $$('#content-videos').append(video);

             }
           
           },
           error:function(error){

            app7.preloader.hide();
            app7.dialog.alert("Hubo un error por favor intenta nuevamente");
            console.log(error);
           }
           
        });
}

  function goVideo(titulo,url){
    app.tituloVideo = titulo;
    app.urlVideo = url
    alert(url);
    mainView.router.navigate('/videos/',{animate:true});


}

$$(document).on('page:init','.page[data-name="videos"]',function(e){

  console.log(app.urlVideo);
  $$('.videoyoutube iframe').remove();
  $$('<iframe width="100%" height="200" frameborder="0" allowfullscreen></iframe>').attr('src',app.urlVideo).appendTo('.videoyoutube');
});


