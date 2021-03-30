const fetch = require('node-fetch');

//Portable
var token = "1212086753:AAEr45vT7bqPLecK_dozUT1NSrAoSQA5BN0";
var telegramUrl = "https://api.telegram.org/bot" + token;

GetPoll(); 

async function GetPoll(){
 var url = telegramUrl + "/getUpdates";
 var res = await FecthGet(url);
 ManagePoll(res);
}

async function PostPoll(ClearId){
 var url = telegramUrl + "/getUpdates";
 var params = {offset: ClearId};
 var res = await FecthPost(url,params);
 ManagePoll(res);
}

function ManagePoll(res){
 var updates = res.result.length;
 if (updates != 0){
  var response = res.result[0];
  Process(response);
  var ClearId = res.result[0].update_id + 1;
  PostPoll(ClearId);
 }else{
  GetPoll();
 }
}

function Process(response){
 if(response.message.text){
  sendMessage(response)
 } else if (response.message.photo){
  sendPhoto(response);
 }else if (response.message.document){
  sendDocument(response);
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

async function sendDocument(response) {
 var params = {chat_id: response.message.chat.id, document: response.message.document.file_id,     reply_to_message_id:response.message.message_id, caption:response.message.document.file_id};
 var url = telegramUrl + "/sendDocument";
 var res = await FecthPost(url,params);
 MessageSent(res);
}

function MessageSent(res){
 var myJSON = JSON.stringify(res);
 console.log(myJSON);
}

async function FecthGet(url){
 var res = await fetch(url);
 res = await res.json();
 return res;
}

async function FecthPost(url,params){
 var res = await fetch(url,{method: 'post',headers: {'Accept': 'application/json, text/plain, /','Content-Type':'application/json'},body:JSON.stringify(params)});
 var res = await res.json();
 return res;
}