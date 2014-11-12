// Initialize your app
var myApp = new Framework7({

    fastClicks: false

});




// Export selectors engine
var $$ = Dom7;



// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    swipePanel: 'left',
    domCache: true //enable inline pages
});



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
        avatar = 'img/user.png';
        name = 'Usuário';
    }
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
}





//Callbacks to run specific code for specific pages, for example for About page//
myApp.onPageInit('perguntas', function (page) {



});

myApp.onPageInit('enquetes', function (page) {



});

myApp.onPageInit('feedback', function (page) {



});


function login() {


    var email = $$("#emailtx").val();
    var senha = $$("#passwordtx").val();
    var senhasec = calcMD5(senha);

    if (email != "" && senha != "") {

        $$.getJSON("/app/services/lg.php?email=" + email + "&senha=" + senhasec + "", function (dados) {
            //$$.getJSON("/sys/lg.php?email=contato@thiago.ws&senha=123456", function(dados) {

            if (dados.RETORNO != "FAIL") {

                //##### CREATE COOKIE WITH ID  #######///
                document.cookie = "userID=" + dados[0].iduser;
                //console.log(dados[0].idpessoa);

                window.location = "index2.html";

            } else {

                myApp.hidePreloader();
                myApp.alert("E-mail ou senha inválidos", "Erro!");

            }
        })

    } else {
        myApp.hidePreloader();
        myApp.alert("Todos os campos são obrigatórios.", "Erro!");

    }



}


function validate() {
    if ( !this.validity.valid ) {

        myApp.alert(this.getAttribute(this.validity.valueMissing ? "data-required-message" : "data-type-message" ),"Ops!");
        /*this.classList.add( "invalid" );
        this.parentNode.appendChild( span );
        span.classList.add( "error" );*/

    }
};

var form = document.getElementById( "fcadastro" ),
    inputs = form.querySelectorAll( "input" );

for ( var i = 0; i < inputs.length; i++ ) {
    inputs[ i ].addEventListener( "blur", validate );
    inputs[ i ].addEventListener( "invalid", validate );
};

// Turn off the bubbles
form.addEventListener( "invalid", function( event ) {
    event.preventDefault();
}, true );

// Support: Safari, iOS Safari, default Android browser
document.querySelector( "form" ).addEventListener( "submit", function( event ) {
    if ( this.checkValidity() ) {
        return true;
    } else {
        event.preventDefault();
    }
});

function newcadastro() {

    var nome = $$("#nometx").val();
    var email = $$("#emailtx").val();
    var senha = $$("#passwordtx").val();
    var senha2 = $$("#confpasswordtx").val();


    if(senha != senha2){
        myApp.hidePreloader();
        $$("#passwordtx").val("");
        $$("#confpasswordtx").val("");

        myApp.alert("Senha não confirmada!", "Ops!");

        return false;
    }

    var senhasec = calcMD5(senha);

    $$.getJSON("/app/services/cd.php?nome=" + nome + "&email=" + email + "&senha=" + senhasec + "&avatar=/img/user.png&tipo=normal", function (dados) {
        //$$.getJSON("/sys/lg.php?email=contato@thiago.ws&senha=123456", function(dados) {

        if (dados.RETORNO != "FAIL") {

            //##### CREATE COOKIE WITH ID  #######///
            document.cookie = "userID=" + dados[0].iduser;
            //console.log(dados[0].idpessoa);
            mainView.router.back();
            window.location = "index2.html";

        } else {

            myApp.hidePreloader();
            myApp.alert("E-mail ou senha inválidos", "Ops!");

        }
    })

} 




function sendpass() {
    var emailf = $$("#emailf").val();

    if (emailf != ""){
        myApp.hidePreloader();
        myApp.alert("Senha enviada com sucesso para: " + emailf, "Terça da Inovação", function () {
            mainView.router.back()
        });
    }else{

        myApp.hidePreloader();
        myApp.alert("Email inválido.", "Ops!");
    }

}


//############################################SOCIAL

$$(document).on('deviceready', function () {
    OAuth.initialize('VASu5JaUudJ0zG2ar-1j1duUYso');

    $$('#fb-connect').on('touchstart', function () {
        $$('#result').html("");

        OAuth.popup('facebook', {
            cache: true
        })
        .done(function (r) {
            // the access_token is available via r.access_token
            // but the http functions automagically wrap the jquery calls
            r.me().done(function (data) {
                myApp.alert("id" + data.id + " " + data.firstname + " " + data.lastname + " " + data.email);
                // do something with `data`, e.g. print data.name

                $$.getJSON("/app/services/cd.php?nome=" + data.name + "&email=" + data.email + "&senha=facebook&avatar=https://graph.facebook.com/" + data.id + "/picture&tipo=normal", function (dados) {
                    //$$.getJSON("/sys/lg.php?email=contato@thiago.ws&senha=123456", function(dados) {

                    if (dados.RETORNO != "FAIL") {

                        //##### CREATE COOKIE WITH ID  #######///
                        document.cookie = "userID=" + dados[0].iduser;
                        //console.log(dados[0].idpessoa);
                        
                        window.location = "index2.html";

                    } else {

                        myApp.hidePreloader();
                        myApp.alert("E-mail ou senha inválidos", "Ops!");

                    }
                })
            })/* r.get('/me')
            .done(function (data) {
                $$('#result').html('<img src="https://graph.facebook.com/' + data.id + '/picture">');


            })*/.fail(function (jqXHR, textStatus, errorThrown) {
                $$('#result').html("req error: " + textStatus);
            });
        })
        .fail(function (e) {
            $$('#result').html('error: ' + e.message);
        });
    });

    $$('#gg-connect').on('touchstart', function () {

        $$('#result').html("");
        OAuth.popup('google', {
            cache: true
        })
        .done(function (r) {
            // the access_token is available via r.access_token
            // but the http functions automagically wrap the jquery calls

            r.get("https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=" + r.access_token)
            .done(function (data) {
                myApp.alert(data.name + " " + data.email);
                $$('#result').html('<img src="' + data.picture + '">');
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                $$('#result').html("req error: " + textStatus);
            });
        })
        .fail(function (e) {
            $$('#result').html('error: ' + e.message);
        });
    });
});