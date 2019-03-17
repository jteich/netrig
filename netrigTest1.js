var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);
var mic = require('mic');
const cardInfo = require('node-alsa-cardinfo');

//var rate = 11025;
var rate = 44100;
var bitwidth = 16;

/**
 * see https://github.com/websockets/ws/blob/master/doc/ws.md for ws options
 * 
 */
app.use(express.static(process.env.STATIC_BASE));

app.use(function (req, res, next) {
	console.log('middleware');
	req.testing = 'testing';
	return next();
});

app.get('/radio/audioOutDevices', function (req, res) {
	info = cardInfo.list();
	//exclude input-only devices
	info = info.filter((item)=>{return item.io !== "Input" && item.name !== "null";});
	//for now, limit to plughw
	info = info.filter((item)=>{return item.name.startsWith("plughw");});
	res.json(info);
});

app.get('/radio/audioDeviceDetails/:device', function (req, res) {
	info = cardInfo.get(req.params.device);
	res.json(info);
});

app.ws('/radio/audioOut/:device', function (ws, req) {
	var open = true;

	//ws.send
	let setupBlock = new Int32Array(2);
	setupBlock[0] = rate;
	setupBlock[1] = bitwidth;
	ws.send(setupBlock);

	console.log("sent setup block");

	//see https://github.com/ashishbajaj99/mic for args
	micInstance = mic({
		endian: 'little', //or big
		bitwidth, //8, 16 or 24
		encoding: 'signed-integer', // OR unsinged-integer,
		fileType: 'raw', // or wav

		//device: 'plughw:CARD=Device,DEV=0',
		device: req.params.device,
		rate,
		channels: '1',
		debug: true,
		exitOnSilence: 0
	});

	console.log("get mic instance");

	var micInputStream = micInstance.getAudioStream();

	console.log("got audio stream");

	var seq = 0;
	micInputStream.on('data', function (data) {
		if (open) {
			ws.send(data, {binary: true});
		}
	});
	ws.on('close', function () {
		open = false;
		micInstance.stop();
	});
	console.log("attempting to start audio input");
	micInstance.start();
});
app.listen(3000);
