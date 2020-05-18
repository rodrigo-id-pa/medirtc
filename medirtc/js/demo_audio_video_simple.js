var selfEasyrtcid = "";
var parametrosUrl;
var conexao = new Object();
var connectList = {};
var channelIsActive = {}; 
maxCALLERS = 2;

function connect() {
    //easyrtc.enableDebug(true);
    easyrtc.enableDataChannels(true);
    easyrtc.setDataChannelOpenListener(openListener);
    easyrtc.setDataChannelCloseListener(closeListener);
    easyrtc.setPeerListener(addToConversation);
    easyrtc.setVideoDims(640,480);
    easyrtc.setRoomOccupantListener(callEverybodyElse);
    easyrtc.easyApp("easyrtc.audioVideoSimple", "selfVideo", ["callerVideo"], loginSuccess, loginFailure);
    CapturaParametrosUrl();

     var chaveValor = parametrosUrl.toString().split(",");

     conexao[chaveValor[0].substring(0, chaveValor[0].indexOf("="))] = chaveValor[0].substring(chaveValor[0].indexOf("=") + 1);
     conexao[chaveValor[1].substring(0, chaveValor[1].indexOf("="))] = chaveValor[1].substring(chaveValor[1].indexOf("=") + 1);
     conexao[chaveValor[2].substring(0, chaveValor[2].indexOf("="))] = chaveValor[2].substring(chaveValor[2].indexOf("=") + 1);
     conexao[chaveValor[3].substring(0, chaveValor[3].indexOf("="))] = chaveValor[3].substring(chaveValor[3].indexOf("=") + 1);
     conexao[chaveValor[4].substring(0, chaveValor[4].indexOf("="))] = chaveValor[4].substring(chaveValor[4].indexOf("=") + 1);
     if (chaveValor[5]!=undefined){
        conexao[chaveValor[5].substring(0, chaveValor[5].indexOf("="))] = chaveValor[5].substring(chaveValor[5].indexOf("=") + 1);
     }
     
     conexao.NOMEPACIENTE = conexao.NOMEPACIENTE.replace(/%20/g, " ")
     validadorConexao = conexao.NOMEPACIENTE + conexao.CRM + chaveValor[3]

     easyrtc.setUsername(validadorConexao);
}
var mutarVideo = false
function muteVideo() {
    updateVideoImage(mutarVideo);   
}

function updateVideoImage(toggle) {
    var ocultaVideo = document.getElementById("ocultaVideo");
        if(!toggle){
            easyrtc.enableCamera(toggle)
            mutarVideo = true
            ocultaVideo.innerHTML = '<i class="fas fa-video-slash"></i>'
        } else {
            easyrtc.enableCamera(toggle)
            mutarVideo = false
            ocultaVideo.innerHTML = '<i class="fas fa-video"></i>'
        }
}

var mutarMeuAudio = false
function muteMeuAudio() {
    updateMicImage(mutarMeuAudio);   
}

function updateMicImage(toggle) {
    var microphone = document.getElementById("microphone");
    if(!toggle){
        easyrtc.enableMicrophone(toggle)
        mutarMeuAudio = true
        microphone.innerHTML = '<i class="fas fa-microphone-alt-slash"></i>'
    } else {
        easyrtc.enableMicrophone(toggle)
        mutarMeuAudio = false
        microphone.innerHTML = '<i class="fas fa-microphone-alt"></i>'
    }
}

function muteOutroAudio() {
    updateFoneImage(true);
}

function updateFoneImage(toggle) {
    var mic = document.getElementById("mic");
    //if( activeBox > 0) { // no kill button for self video
        //muteButton.style.display = "block";
        var videoObject = document.getElementById("callerVideo");
        var isMuted = videoObject.muted?true:false;
        if( toggle) {
            isMuted = !isMuted;
            videoObject.muted = isMuted;
        }
        mic.innerHTML = isMuted?'<i class="fas fa-volume-mute"></i>':'<i class="fas fa-volume-up"></i>';
/*     }
    else {
        muteButton.style.display = "none";
    } */
}

function sair(){
    //window.location.href = "salaEspera.html";
    if(conexao.STATUS == "OK"){
        window.location.href = "http://localhost:8080/mediagenda_web/salaEspera.html?codAgendamento="+conexao.codAgendamento;
    }else if(conexao.STATUS == "Conf"){
        window.location.href = "sair.html";
    } 
}

function convertMiliseconds(millisecondVal) {
    var minuteVal = millisecondVal / 60000;
    minuteVal = Math.round(minuteVal);
    return minuteVal;
  };

function CapturaParametrosUrl() {

    //captura a url da página
    var url = window.location.href; 
    
    //tenta localizar o ?
    var res = url.split('?'); 
        
    if (res[1] === undefined) {
        alert('página sem parâmetros.');
    }
    
    if (res[1] !== undefined) {
        //tenta localizar os & (pode haver mais de 1)
        var parametros = res[1].split('&');
        parametrosUrl = parametros;   
    }
}

function pegarHoraAtual(){
    var dataAtual = new Date();
    var hora = (dataAtual.getHours()<10 ? '0' : '') + dataAtual.getHours();
    var minuto = (dataAtual.getMinutes()<10 ? '0' : '') + dataAtual.getMinutes();   
    var horaFormatada = hora + ":" + minuto;

    return horaFormatada;
}

function addToConversation(who, msgType, content) {
    // Escape html special characters, then add linefeeds.
    content = content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    content = content.replace(/\n/g, '<br />');
     if (who!='Me'){
        who = 'you'
    }
    document.getElementById('messages').innerHTML +=
                "<b>" + who + " Hoje às " + pegarHoraAtual() +  "</b><br>&nbsp;" + content + "<br />";
}


function openListener(otherParty) {
    channelIsActive[otherParty] = true;
    //updateButtonState(otherParty);
}


function closeListener(otherParty) {
    channelIsActive[otherParty] = false;
    //updateButtonState(otherParty);
}

function vincularIdBotao() {

        console.log(connectList)
        console.log(easyrtc)
        //console.log(easyrtc.roomData.default.clientListDelta.updateClient)
         if (easyrtc.roomData.default.clientListDelta!=undefined){
             for (let easyrtcid in easyrtc.roomData.default.clientListDelta.updateClient){
                 console.log(easyrtc.roomData.default.clientListDelta.updateClient)
                 easyrtcidCaller = easyrtcid
             }

        }else{
            for (let easyrtcid in connectList){
                easyrtcidCaller = easyrtcid
            }
        }

        console.log(easyrtcidCaller)


        
        button = document.getElementById('enviar_menssagem');
        button.id = "send_" + easyrtcidCaller;
        button.onclick = function(easyrtcidCaller) {
            return function() {
                sendStuffP2P(easyrtcidCaller);
            };
        }(easyrtcidCaller);

    console.log("teste")

}

function sendStuffP2P(otherEasyrtcid) {
    var text = document.getElementById('menssagem').value;

    if (text.replace(/\s/g, "").length === 0) { // Don't send just whitespace
        return;
    }
    if (easyrtc.getConnectStatus(otherEasyrtcid) === easyrtc.IS_CONNECTED) {
        easyrtc.sendDataP2P(otherEasyrtcid, 'msg', text);
    }
    else {
        easyrtc.showError("NOT-CONNECTED", "not connected to " + easyrtc.idToName(otherEasyrtcid) + " yet.");
    }

    addToConversation("Me", "msgtype", text);
    document.getElementById('menssagem').value = "";
}

function callEverybodyElse(roomName, occupantList, isPrimary) {
    easyrtc.setRoomOccupantListener(null); // so we're only called once.
    connectList = occupantList;
    var list = [];
    var connectCount = 0;

    for(var easyrtcid in occupantList ) {
        if (validadorConexao.toString() === easyrtc.idToName(easyrtcid) ){
            let teste = easyrtcid
            console.log("teste")
            list.push(easyrtcid);
            //vincularIdBotao(easyrtcid)
            startCall(teste);
        }
    }
    //
    // Connect in reverse order. Latter arriving people are more likely to have
    // empty slots.
    //
/*     function establishConnection(easyrtcid) {
        
        function successCB() {
            connectCount++;
        }
        var failureCB = function() {};
        if( connectCount < maxCALLERS) {
            easyrtc.call(easyrtcid, successCB, failureCB);
        }
    
    } */

    function startCall(oi) {
        if (easyrtc.getConnectStatus(oi) === easyrtc.NOT_CONNECTED) {
            console.log(easyrtc.getConnectStatus(oi))
            console.log(easyrtc.NOT_CONNECTED)
            try {
            easyrtc.call(oi,
                    function() { // success callback
                        
                            // console.log("made call succesfully");
                            connectList[oi] = true;
                        
                    },
                    function(errorCode, errorText) {
                        connectList[oi] = false;
                        //easyrtc.showError(errorCode, errorText);
                    },
                    function(wasAccepted) {
                        // console.log("was accepted=" + wasAccepted);
                    }
            );
            }catch( callerror) {
                console.log("saw call error ", callerror);
            }
        }
        else {
            console.log(easyrtc.getConnectStatus(oi))
            console.log(easyrtc.NOT_CONNECTED)
            //easyrtc.showError("ALREADY-CONNECTED", "already connected to " + easyrtc.idToName(list[position]));
        }
    }

    
}

function converteData(data){
    var temporario = data.split("DATA=")
    temporario[1] = new Date(parseInt(temporario[1]))
    return temporario[1]
}

function loginSuccess(easyrtcid) {
    console.log(easyrtc)
    connectList = easyrtc.roomData.default.clientList
    selfEasyrtcid = easyrtcid;
    console.log(selfEasyrtcid)
    var logar = true;
    var cont = 0
    for(var tagConnection in easyrtc.roomData.default.clientList){
        if (validadorConexao.toString() === easyrtc.idToName(tagConnection)){
            //easyrtc.setRoomOccupantListener(vincularIdBotao);
            cont+=1 
        }
        horaEntrada = new Date()
        var horaLimite = converteData(easyrtc.idToName(tagConnection))
        //var intervalo = Date.parse(horaFinal) - Date.parse(horaInicial)
        if (Date.parse(horaEntrada) <= Date.parse(horaLimite)  && horaEntrada.toDateString(horaEntrada) === horaLimite.toDateString(horaLimite)){
            logar = true
        }else{
            logar = false
        }
    }

    if(cont > 2 ){
        easyrtc.disconnect();
        window.location.href = "erro.html";
    }
    if(logar === false ){
        easyrtc.disconnect();
        window.location.href = "erro.html";
    }

    if(conexao.STATUS != "OK"){
        if (conexao.STATUS === "Conf"){

        } else {
            easyrtc.disconnect();
            window.location.href = "erro.html";
        }
    }
   
}

function loginFailure(errorCode, message) {

    if(message.toString() === "Failed to get access to local media. Error code was NotFoundError."){
        alert("Você está sem transmitir vídeo, ou você não possui um dispositivo de vídeo ou alguma configuração do seu navegador não permite utilizar o mesmo")
        easyrtc.enableVideo(false)
        easyrtc.easyApp("easyrtc.audioVideoSimple", "selfVideo", ["callerVideo"], loginSuccess, loginFailure);
    }

    if(message.toString() !== "Failed to get access to local media. Error code was NotFoundError."){
        easyrtc.showError(errorCode, message);
    }
    
}