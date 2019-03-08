const cardInfo = require('node-alsa-cardinfo');

let info = cardInfo.list();

for(const dev of info){
	devInfo = cardInfo.get(dev.name);
	console.log(dev);
	console.log(devInfo);
}

