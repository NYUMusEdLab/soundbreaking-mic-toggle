var playing = false;

function playSound() {
	player.start();
	scratch.start();
	playing = true;
}

function stopSound() {
	player.stop();
	scratch.stop();
	playing = false;
}

var player = new Tone.Player({
	url : 'audio/FunkYouVoxLeadDry_01.mp3',
	autostart : false,
	loop: true
});

var convolver = new Tone.Convolver({
	url: 'audio/IR/kingsmic.wav'
});

var scratch = new Tone.Player({
	url: 'audio/vinyl_scratch.mp3',
	loop: true
});
scratch.volume.value = -18;

var settings = {
	phonograph: {
		eq: {
			low: -48,
			mid: -3,
			high: -48,
			lowFrequency: 700,
			highFrequency: 3000,
		},
		compressor: {
			ratio:0.45,
			threshold:-36,
			release:0.25,
			attack:0.003,
			knee:3
		}
	},
	carbon: {
		eq: {
			low: -12,
			mid: 0,
			high: -48,
			lowFrequency: 1200,
			highFrequency: 2200,
		},
		compressor: {
			ratio:6,
			threshold:-36,
			release:0.25,
			attack:0.0003,
			knee:120
		}
	}
}

var eq = new Tone.EQ3(settings.phonograph.eq);
var compressor = new Tone.Compressor(settings.phonograph.compressor);

(function init() {
	initConnections();
	initUI();
})();

function initConnections() {
	convolver.connect(eq);
	eq.connect(compressor);
	compressor.toMaster();
}

function initUI() {
	document.getElementById('play-pause').addEventListener('click', function() {
		if (!playing) {
			playSound();
		} else {
			stopSound();
		}
	});

	document.querySelectorAll('.mic-thumb').forEach(function(item) {
		item.addEventListener('click', function(e) {
			toggleMic(e.target);
		});
	});
}

function toggleMic(elt) {
	var micType = elt.dataset.mic;
	var imgSrc = elt.src;

	document.getElementById('mic').setAttribute('src', imgSrc);

	switch(micType) {
		case 'phonograph':
			connectPhonograph();
			break;
		case 'u47':
			connectU47();
			break;
		default:
			connectCarbonMic();
			break;
	}
}


function connectPhonograph() {
	disconnect();

	compressor.set(settings.phonograph.compressor);
	eq.set(settings.phonograph.eq);
	eq.Q.value = 24;

	player.connect(convolver);
	convolver.output.gain.value = 20;

	player.connect(eq);
	scratch.connect(eq);
}

function connectCarbonMic() {
	disconnect();

	player.connect(eq);
	eq.set(settings.carbon.eq);
	compressor.set(settings.carbon.compressor);
	eq.Q.value = 12;

	player.connect(eq);
	eq.connect(compressor);
	compressor.toMaster();
}

function connectU47() {
	disconnect();

	player.toMaster();
}

function disconnect() {
	player.disconnect();
	scratch.disconnect();
	convolver.output.gain.value = 1;
}