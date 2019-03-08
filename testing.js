var coreAudio = require("node-core-audio");

// Create a new audio engine
var engine = coreAudio.createNewAudioEngine();

var opts = engine.getOptions();
console.log(opts);
