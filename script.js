if (localStorage.res) {
  StartPolling ();
} else {
var Val = prompt("Enter Bot token","");
localStorage.res = Val;  
StartPolling ();
}

var token;
var telegramUrl;
var UpdateId;
var GlobalTime = new Date().getTime();
var Runable;


async function StartPolling(){
  Runable = true;
  token = localStorage.res;
  telegramUrl = "https://api.telegram.org/bot" + token;
  document.getElementById("tble").style="display:block";
  document.getElementById("h3").style="display:block";
  document.getElementById("timediff").innerHTML="Calculating...";
  document.getElementById("updates").innerHTML="Calculating...";
  document.getElementById("btn").removeEventListener("click", StartPolling);
  document.getElementById("btn").addEventListener("click", StopPolling);
  document.getElementById("btn").innerHTML="Stop";
  var url = telegramUrl + "/getUpdates";
  var res = await FecthGet(url);
  if (res.result.length >0){
    var UpdateId = res.result[0].update_id;
    Main();
  } else {
    document.getElementById("timediff").innerHTML="Oops!!😬 (--no_recent_messages_found--)";
    StopPolling();
  }
}

function StopPolling(){
  Runable = false;
  document.getElementById("btn").removeEventListener("click", StopPolling);
  document.getElementById("btn").addEventListener("click", StartPolling);
  document.getElementById("btn").innerHTML="Start";
}

async function Main(){
  var url = telegramUrl + "/getUpdates";
  if(Runable){
  try {
    var params = {offset: UpdateId};
    var res = await FecthPost(url,params);
    var updates = res.result.length;
  document.getElementById("updates").innerHTML=updates-1;
  var myJSON = res.result[updates-1].update_id;
  if (updates != 1) {
    for (var i = 1; i < updates; i++) {
      var response = res.result[i];
      Process(response);
    }
  }
  UpdateId=myJSON;
  var NewTime = new Date().getTime();
  document.getElementById("timediff").innerHTML= ((NewTime-GlobalTime)/1000)+"sec";
  GlobalTime= NewTime;
  Main();
}
catch(err) {
  StartPolling ();
}  
  }
}
  

function Process(response){
  if(response.message.text){
    sendMessage(response)
  } else if (response.message.photo){
    sendPhoto(response);
  }
}

async function sendMessage(response) {
  var params = {chat_id: response.message.chat.id, text: response.message.text, reply_to_message_id:response.message.message_id};
  var url = telegramUrl + "/sendMessage";
  var res = await FecthPost(url,params);
  MessageSent(res);
}

async function sendPhoto(response) {
  var params = {chat_id: response.message.chat.id, photo: response.message.photo[0].file_id,     reply_to_message_id:response.message.message_id, caption:response.message.photo[0].file_id};
  var url = telegramUrl + "/sendPhoto";
  var res = await FecthPost(url,params);
  MessageSent(res);
}

function MessageSent(res){
  var myJSON = JSON.stringify(res);
  document.getElementById("demo").innerHTML += myJSON+"<br><br>";
}

async function FecthGet(url){
  var res = await fetch(url);
  var res = await res.json();
  return res;
}

async function FecthPost(url,params){
  var res = await fetch(url,{method: 'post',headers: {'Accept': 'application/json, text/plain, /','Content-Type':'application/json'},body:JSON.stringify(params)});
  var res = await res.json();
  return res;
}
