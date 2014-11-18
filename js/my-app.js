// Initialize your app
var myApp = new Framework7({

   

});




// Export selectors engine
var $$ = Dom7;

var template = document.getElementById('template').innerHTML; 
var compiledTemplate = Template7.compile(template);

// Add view
var mainView = myApp.addView('.view-main', {
    
    swipePanel: 'left',
    
});

function getTime(){



var d = new Date();


var curr_hour = d.getHours();
    
var curr_min = (d.getMinutes()<10?'0':'') + d.getMinutes();

var curr_sec = (d.getSeconds()<10?'0':'') + d.getSeconds();    

  

var timenow = curr_hour + ":" + curr_min + ":" + curr_sec;
     //window.plugins.toast.showShortBottom(timenow);
    return timenow;

}

// CHAT
var conversationStarted = false;

function gomessage() {

    var textarea = $$('.messagebar textarea');
    // Message text
    var messageText = textarea.val().trim();
    // Exit if empy message
    if (messageText.length === 0) return;

    // Empty textarea
    textarea.val('').trigger('change');




    // Random message type
    var messageType = 'sent'; //(['sent', 'received'])[Math.round(Math.random())];

    // Avatar and name for received message
    var avatar, name;

    

    if (messageType === 'sent') {
        avatar = window.localStorage.getItem("avatar");
        name = window.localStorage.getItem("name");
    }

    myApp.hidePreloader();
    
    
    $$.getJSON("http://illuminante.org.br/app/services/nm.php?idevento=1&avatar=" + avatar + "&nome=" + name + "&message=" + messageText + "&stat=1", function(dados){


        if(dados.RETORNO != "FAIL"){
            // Add message
            myApp.addMessage({
                // Message text
                text: messageText,
                // Random message type
                type: messageType,
                // Avatar and name:
                avatar: avatar,
                name: name,
                // Day
                day: !conversationStarted ? 'Hoje' : false,
                time: !conversationStarted ? (new Date()).getHours() + ':' + (new Date()).getMinutes() : false
            })
            
            
            
        }else{
        
            window.plugins.toast.showShortBottom("Erro ao enviar pergunta!");
        
        }

    }) 
}





//Callbacks to run specific code for specific pages, for example for About page//
myApp.onPageInit('login', function (page) {



});
myApp.onPageInit('index', function (page) {




});

function updatemess(rws){
   
    setTimeout(function(){getNewDados(rws);},7000);
}


function getNewDados(rws){

   
var idevento = 1;//window.localStorage.getItem("idevento");

   var nom = window.localStorage.getItem("name");
    
    $$.getJSON("http://illuminante.org.br/app/services/pg2.php?idevento=" + idevento + "&stat=1&rws=" + rws + "&nome=" + nom, function (dados){

        
        if( dados.pergunta != null ){
            var nbr;
            
            $$.getJSON("http://illuminante.org.br/app/services/pg2count.php?idevento=1&stat=1", function (dados2){
            
                
                   
                    nbr = dados2.number;
           
            
            
               
        var nrows = nbr;
        var content =   $("#msg-content");  
        var pergs = content.html();
           
        pergs += compiledTemplate(dados);
        content.html(" "); 
        content.html(pergs);
        
         updatemess(nrows);
                  })
            
        }else{
        
         updatemess(rws);
        
        }
        
       
                
    });
    
   
}


function getDados(){

   
var idevento = 1;//window.localStorage.getItem("idevento");

    $.getJSON("http://illuminante.org.br/app/services/pg.php?idevento=" + idevento + "&stat=1", function (dados){
      
       
       
        var rws = dados.pergunta.length;
       
       //$.cookie("rows", dados.pergunta.length);
        
       var pergs = compiledTemplate(dados);
       $("#msg-content").html(pergs);
       
        updatemess(rws);
        

    });
    
    

}




myApp.onPageAfterAnimation('messages', function (page) {

 getDados();
    
    
});

myApp.onPageInit('enquetes', function (page) {



});

myApp.onPageInit('feedback', function (page) {



});






//############################################NAVIGATION



