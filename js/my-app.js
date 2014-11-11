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

    if (email != " " && senha != " ") {

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

        myApp.alert("Todos os campos são obrigatórios.");

    }



}

function newcadastro() {
    var nome = $$("#nometx").val();
    var email = $$("#emailtx").val();
    var senha = $$("#passwordtx").val();
    var senhasec = calcMD5(senha);

    if (nome != " " && email != " " && senha != " ") {

        $$.getJSON("/app/services/cd.php?nome=" + nome + "&email=" + email + "&senha=" + senhasec + "", function (dados) {
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

        myApp.alert("Todos os campos são obrigatórios.");

    }

}

function sendpass() {
    var emailf = $$("#emailf").val();
    myApp.hidePreloader();
    myApp.alert("Senha enviada com sucesso para: " + emailf, "Terça da Inovação", function () {
        mainView.router.back()
    });

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
                    myApp.alert(data.firstname + " " + data.lastname + " " + data.email + " " + data.user_photos);
                    // do something with `data`, e.g. print data.name
                })

                r.get('/me')
                    .done(function (data) {
                        $$('#result').html("facebook: Hello, " + data.name + "your email:" + data.email + " !");


                    })
                    .fail(function (jqXHR, textStatus, errorThrown) {
                        $$('#result').html("req error: " + textStatus);
                    });
            })
            .fail(function (e) {
                $$('#result').html('error: ' + e.message);
            });
    });

    $$('#tw-connect').on('touchstart', function () {
        $$('#result').html("");
        OAuth.popup('twitter', {
            cache: true
        })
            .done(function (r) {
                // the access_token is available via r.access_token
                // but the http functions automagically wrap the jquery calls
                r.me().done(function (data) {
                    myApp.alert(data);
                    // do something with `data`, e.g. print data.name
                })

                r.get('/1.1/account/verify_credentials.json')
                    .done(function (data) {
                        $$('#result').html("twitter: Hello, " + data.name + "your email:" + data.email + " !");
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