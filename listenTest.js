const net = require('net');

const server = net.createServer((socket) => {
	socket.end('goodbye\n');
}).on('error', (err) => {
	// handle errors here
	//   throw err;
});

// grab an arbitrary unused port.
server.listen(() => {
	console.log('opened server on', server.address());
});
