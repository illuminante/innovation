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
var googleapi = {
    authorize: function (options) {
        var deferred = $.Deferred();

        //Build the OAuth consent page URL
        var authUrl = 'https://accounts.google.com/o/oauth2/auth?' + $.param({
            client_id: options.client_id,
            redirect_uri: options.redirect_uri,
            response_type: 'code',
            scope: options.scope
        });

        //Open the OAuth consent page in the InAppBrowser
        var authWindow = window.open(authUrl, '_blank', 'location=no,toolbar=no');

        //The recommendation is to use the redirect_uri "urn:ietf:wg:oauth:2.0:oob"
        //which sets the authorization code in the browser's title. However, we can't
        //access the title of the InAppBrowser.
        //
        //Instead, we pass a bogus redirect_uri of "http://localhost", which means the
        //authorization code will get set in the url. We can access the url in the
        //loadstart and loadstop events. So if we bind the loadstart event, we can
        //find the authorization code and close the InAppBrowser after the user
        //has granted us access to their data.
        $$(authWindow).on('loadstart', function (e) {
            var url = e.originalEvent.url;
            var code = /\?code=(.+)$/.exec(url);
            var error = /\?error=(.+)$/.exec(url);

            if (code || error) {
                //Always close the browser when match is found
                authWindow.close();
            }

            if (code) {
                //Exchange the authorization code for an access token
                $$.post('https://accounts.google.com/o/oauth2/token', {
                    code: code[1],
                    client_id: options.client_id,
                    client_secret: options.client_secret,
                    redirect_uri: options.redirect_uri,
                    grant_type: 'authorization_code'
                }).done(function (data) {
                    deferred.resolve(data);
                }).fail(function (response) {
                    deferred.reject(response.responseJSON);
                });
            } else if (error) {
                //The user denied access to the app
                deferred.reject({
                    error: error[1]
                });
            }
        });

        return deferred.promise();
    }
};

$$(document).on('deviceready', function () {
    var $loginButton = $('#Glogin');


    $$loginButton.on('click', function () {
        googleapi.authorize({
            client_id: '339237216668-2aq99gfk8s2g3m646tqbu4nmo2e7s5kj.apps.googleusercontent.com',
            client_secret: 'WDJTpwi25MPvLGifzdu9vrIs',
            redirect_uri: 'http://localhost',
            scope: 'https://www.googleapis.com/auth/analytics.readonly'
        }).done(function (data) {
            myApp.alert('Access Token: ' + data.access_token);
        }).fail(function (data) {
            myApp.alert(data.error);
        });
    });
});