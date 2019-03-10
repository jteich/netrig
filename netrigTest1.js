var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);
var mic = require('mic');

/**
 * see https://github.com/websockets/ws/blob/master/doc/ws.md for ws options
 * 
 */
app.use(function (req, res, next) {
	console.log('middleware');
	req.testing = 'testing';
	return next();
});

app.get('/', function (req, res, next) {
	console.log('get route', req.testing);
	res.end();
});

app.ws('/', function (ws, req) {
	ws.on('message', function (msg) {
		console.log(msg);
		ws.send("OK");
	});
	console.log('socket', req.testing);
});
app.ws('/test-output', function (ws, req) {
	var open = true;

	var micInstance = mic({
		//device: 'hw:CARD=Device,DEV=0',
		device: 'plughw:CARD=Device,DEV=0',
		rate: '11025',
		channels: '1',
		debug: true,
		exitOnSilence: 0
	});
	var micInputStream = micInstance.getAudioStream();
	var seq = 0;
	micInputStream.on('data', function (data) {
		if (open) {
			ws.send("data(" + data.length + "):");
			ws.send("seq:" + seq);
			console.log("seq:" + seq++);
			//console.log(data.read());
			//ws.send(data.toString('base64'));
			ws.send(data.toString('hex'));
			//ws.send(data, {binary: true});
		}
	});
	ws.on('close', function () {
		open = false;
		micInstance.stop();
	});
	micInstance.start();
});
app.ws('/radio', function (ws, req) {
	var open = true;

	//see https://github.com/ashishbajaj99/mic for args
	var micInstance = mic({
		endian: 'little', //or big
		bitwidth: 16, // or 8 , 24
		encoding: signed-integer, // OR unsinged-integer,
		fileType: 'raw', // or wav

		device: 'plughw:CARD=Device,DEV=0',
		rate: '11025',
		channels: '1',
		debug: true,
		exitOnSilence: 0
	});
	var micInputStream = micInstance.getAudioStream();
	var seq = 0;
	micInputStream.on('data', function (data) {
		if (open) {
			ws.send("data(" + data.length + "):");
			ws.send("seq:" + seq);
			console.log("seq:" + seq++);
			//console.log(data.read());
			//ws.send(data.toString('base64'));
			ws.send(data.toString('hex'));
			//ws.send(data, {binary: true});
		}
	});
	ws.on('close', function () {
		open = false;
		micInstance.stop();
	});
	micInstance.start();
});
app.listen(3000);
