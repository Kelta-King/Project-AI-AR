
var context;

function init() {
    try {
        // Fix up for prefixing
        window.AudioContext = window.AudioContext||window.webkitAudioContext;
        context = new AudioContext();
    }
    catch(e) {
        alert('Web Audio API is not supported in this browser');
    }
}

init();

document.addEventListener('keydown', logKey);

function logKey(e) {

	if(e.keyCode == 87){
		console.log("begin");
		recognition.start();
		if (noteContent.length) {
			noteContent += ' ';
		}
	}
	
	if(e.keyCode == 83){
		recognition.stop();
		console.log("end");
		instructions.text('Voice recognition paused.');
	}

}

try {
  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  var recognition = new SpeechRecognition();
}
catch(e) {
  console.error(e);
  document.getElementById("no-browser").style.display = "block";
  document.getElementById("app").style.display = "none";
    
}

var noteTextarea = $('#note-textarea');
var instructions = $('#recording-instructions');

var noteContent = '';

// Get all notes from previous sessions and display them.



/*-----------------------------
      Voice Recognition 
------------------------------*/

// If false, the recording will stop after a few seconds of silence.
// When true, the silence period is longer (about 15 seconds),
// allowing us to keep recording even when the user pauses. 
recognition.continuous = true;

// This block is called every time the Speech APi captures a line. 
recognition.onresult = function(event) {

  // event is a SpeechRecognitionEvent object.
  // It holds all the lines we have captured so far. 
  // We only need the current one.
  var current = event.resultIndex;

  // Get a transcript of what was said.
  var transcript = event.results[current][0].transcript;

  // Add the current transcript to the contents of our Note.
  // There is a weird bug on mobile, where everything is repeated twice.
  // There is no official solution so far so we have to handle an edge case.
  var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);

  if(!mobileRepeatBug) {
    noteContent = transcript;
	console.log(noteContent);
	responsiveVoice.speak(noteContent,"Australian Female");
    noteTextarea.val(noteContent);
  }
};

recognition.onstart = function() { 
  instructions.text('Voice recognition activated. Try speaking into the microphone.');
}

recognition.onspeechend = function() {
  instructions.text('You were quiet for a while so voice recognition turned itself off.');
}

recognition.onerror = function(event) {
  if(event.error == 'no-speech') {
    instructions.text('No speech was detected. Try again.');  
  };
}



/*$('body').on('keydown', function (e) {
    if(e.keyCode == 87)
      $('button').click();
	console.log("start");
	recognition.start();

	if (noteContent.length) {
    noteContent += ' ';
  }
});

$('body').on('keydown', function (e) {
    if(e.keyCode == 83)
      $('button').click();

	 recognition.stop();
	 console.log("Jer");
  instructions.text('Voice recognition paused.');
});
*/
//window.addEventListener("keydown", function (event){});
/*-----------------------------
      App buttons and input 
------------------------------

$('#start_record').on('click', function(e) {
  if (noteContent.length) {
    noteContent += ' ';
  }
  recognition.start();
});


$('#pause_record').on('click', function(e) {
  recognition.stop();
  instructions.text('Voice recognition paused.');
});
*/
// Sync the text inside the text area with the noteContent variable.
noteTextarea.on('input', function() {
  noteContent = $(this).val();
})



