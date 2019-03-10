var net = require('net');
var mic = require('mic');

var micInputStream, micInstance;
const server = net.createServer((socket) => {

	var open = true;
	micInstance = mic({
		//device: 'hw:CARD=Device,DEV=0',
		device: 'plughw:CARD=Device,DEV=0',
		rate: '11025',
		channels: '1',
		debug: true,
		exitOnSilence: 0
	});
	micInputStream = micInstance.getAudioStream();
	var seq = 0;
	micInputStream.on('data', function (data) {
		if (open) {
			//ws.send("data("+data.length+"):");
			//ws.send("seq:" + seq);
			console.log("seq:" + seq++);
			//console.log(data.read());
			//ws.send(data.toString('base64'));
			//ws.send(data.toString('hex'));
			//ws.send(data, {binary: true});
			socket.write(data);
		}
	});
	micInstance.start();

	//socket.end('goodbye\n');
}).on('error', (err) => {
	throw err;
}).on('close', () => {
	micInstance.stop();
});

// grab an arbitrary unused port.
server.listen(9999, '0.0.0.0', () => {
	console.log('opened server on', server.address());
});
