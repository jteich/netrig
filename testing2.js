const cardInfo = require('node-alsa-cardinfo');


let info;
info = cardInfo.get("dmix");
info = cardInfo.get("hw:CARD=Device,DEV=0");
console.log(info);
