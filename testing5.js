const cardInfo = require('node-alsa-cardinfo');

let info = cardInfo.get("dmix");
console.log(info);

info = cardInfo.list();
console.log(info);
