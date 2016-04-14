let extractPeaks = require('webaudio-peaks');

let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let analyser = audioCtx.createAnalyser();
let canvas = document.getElementById('canvas');
let cc = canvas.getContext('2d');
let playing = false;
let sampleRate = 44100;
let pixPerSec = null;
let duration = null;
let timescalex = 0;
let audioBuffer = null;
let zoomLevel = 2;
let samplesPerPeak = 4000;

let audio = new Audio();
audio.src = 'audio/girls.mp3';
document.body.appendChild(audio);

let zoomIn = document.getElementById('zoom-in');
let zoomOut = document.getElementById('zoom-out');

zoomIn.addEventListener('click', (e) => {
	zoomLevel = Math.max(1/8, zoomLevel/2);
	let percent = timescalex / canvas.width;
	draw( extractPeaks(audioBuffer, samplesPerPeak*zoomLevel, true) );
	timescalex = percent * canvas.width;
	drawTimescale(timescalex);
});

zoomOut.addEventListener('click', (e) => {
	zoomLevel = Math.min(8, zoomLevel*2);
	let percent = timescalex / canvas.width;
	draw( extractPeaks(audioBuffer, samplesPerPeak*zoomLevel, true) );
	timescalex = percent * canvas.width;
	drawTimescale(timescalex);
});

document.addEventListener('keydown', (e) => {
	switch(e.which) {
		case 32:
			console.log('playing');
			playing = !playing;
			if (playing === true) {
				audio.play();
			} else {
				audio.pause();
			}
			break;
	}
})

canvas.addEventListener('click', (e) => {
	if (!playing) {
		timescalex = e.pageX;
		audio.currentTime = timescalex / pixPerSec;
		$('#cursor').css({'left': timescalex});
	} else {
		drawTimescale(e.pageX);
		audio.currentTime = e.pageX / pixPerSec;
	}
})

audio.addEventListener('play', () => {
	playing = true;
	drawTimescale(timescalex);
})

audio.addEventListener('pause', () => {
	playing = false;
})

function loadMusic(url) {
  let req = new XMLHttpRequest();
  req.open( "GET", url, true );
  req.responseType = "arraybuffer";    
  req.onreadystatechange = function (e) {
    if (req.readyState == 4) {
    	if(req.status == 200)
    		// decodeAudioData returns a buffer
        audioCtx.decodeAudioData(req.response, 
          function(buffer) {
          	audioBuffer = buffer;
          	duration = buffer.length / 44100; // This line needs to change to buffer.length / sampleRate
          	// extractPeaks takes a buffer, and squeezes (in this case) samplesPerPeak samples into one peak. The length of
          	// the peaks object returned will be buffer.length/samplesPerPeak
						draw( extractPeaks(buffer, samplesPerPeak*zoomLevel, true) );
          }, 
          function() {
          	console.log('error decoding');
          });
    	else
        alert('error during the load.Wrong url or cross origin issue');
    }
  } ;
  req.send();
}

window.addEventListener('load', function(e) {
	loadMusic(audio.src);
}, false);

function drawTimescale(x) {
	/*
	requestAnimationFrame takes a callback that is called 60 times per second. Since we know
	how many pixels to move in one second, we can just divide it by 60 and it will animate 
	the cursor across the screen.
	*/

	if (playing === true) {
		let req = window.requestAnimationFrame(drawTimescale.bind(null, x+pixPerSec/60.0));
	}

	timescalex = x;
	$('#cursor').css({'left': x});
}

function draw(buffer) {
	/*
	Get the peaks and the number of bits from data given by extractPeaks.
	#bits is used to calculate max value to normalize all values later on.
	The for loop goes through and draws a max peak line from top and a 
	min peak line from bottom. The canvas is set to the same length as half
	the number of peaks, since 2 peaks will be used for every x-axis unit pixel.
	pixPerSec is used to calculate the cursor's speed in drawTimescale. 
	*/
	let peaks = buffer.data[0];
	let bits = buffer.bits;
	let offset = 0;

	let i;
	canvas.width = peaks.length/2;
	pixPerSec = canvas.width / duration;
  let len = canvas.width;
  let cc = canvas.getContext('2d');
  let h2 = canvas.height / 2;
  let maxValue = Math.pow(2, bits-1);

  let minPeak, min;
  let maxPeak, max;

	cc.fillStyle = '#000';
	cc.strokeStyle = '#fff';

	let skip = 1;
	let x = 0;

	for (i = 0; i < len; i++) {
    minPeak = peaks[(i+offset)*2] / maxValue;
    maxPeak = peaks[(i+offset)*2+1] / maxValue;

    min = Math.abs(minPeak * h2);
		max = Math.abs(maxPeak * h2);

		cc.fillRect(x, 0, skip, h2-max);
		cc.fillRect(x, h2+min, skip, h2-min);

		x += skip;
  }
};

