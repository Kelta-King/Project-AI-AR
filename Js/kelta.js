let context; //for web audio
let rec_btn = document.getElementById("mobile-rec");

//parameters for responsive voice
let parameters = {
	onstart:voiceStart,
	onend:voiceEnd
};
document.addEventListener("keydown", function(event){
	
	if(event.keyCode == 76){
		runRecognition();
	}
	
});

rec_btn.addEventListener("click", function(event){
	runRecognition();
});

function runRecognition(){
	
	var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
       var recognition = new SpeechRecognition();

	recognition.onstart = function(){
               console.log("listening, please speak");
       };
	
	recognition.onspeechend = function(){
               console.log("stopped listening, hope you are done...");
               recognition.stop();
       };
	
	recognition.onresult = function(event){

               let transcript = event.results[0][0].transcript;
               let confidence = event.results[0][0].confidence;
		console.log("Text:",transcript,"Confidence",confidence*100,"%");
		
		if((similarity(transcript, "Open GitHub")*100) > 80){
			console.log((similarity(transcript, "Open GitHub")*100));
			responsiveVoice.speak("Opening GitHub","UK English Male", {onstart: null , onend:openGitHub});
			
			
		}
		else if((similarity(transcript, "Open Google")*100) > 80){
			console.log((similarity(transcript, "Open GitHub")*100));
			responsiveVoice.speak("Opening Google","UK English Male", {onstart: null, onend:openGoogle});
			window.open("https://google.com", "_blank");
			
		}
		else if((similarity(transcript, "Open ipl")*100) > 80){
			console.log((similarity(transcript, "Open GitHub")*100));
			responsiveVoice.speak("Opening ipl","UK English Male",{onstart: null, onend:openIpl});
			window.open("https://ipl.com", "_blank");
			
		}
		else{
			let preMsg = prepareMsg(transcript);
			let reply = replyMsg(preMsg);
			
			responsiveVoice.speak(reply,"UK English Male", parameters);
		
		}
		
       };
	   
	recognition.start();
	
}

function init() {
    
	try {
		
		window.AudioContext = window.AudioContext||window.webkitAudioContext;
		context = new AudioContext();
		
	}
	catch(e) {
		alert('Web Audio API is not supported in this browser');
	}
	//responsiveVoice.speak("hey","Australian Male", parameters);
}

init();

function voiceStart(){
	console.log("Voice start");
	waveRightHand();
}

function voiceEnd(){
	console.log("Voice end");
}

function prepareMsg(input){
	
	let text = input.toLowerCase().replace(/[^\w\s\d]/gi, "");
	
	text = text
    .replace(/ a /g, " ")
    .replace(/i feel /g, "")
    .replace(/whats/g, "what is")
    .replace(/please /g, "")
    .replace(/ please/g, "");
	
	return text;
	
}

function replyMsg(text){

	const trigger = [
		//0 
		["hello", "hey", "hi", "yo"],
		//1
		["how are things", "how are you", "how you doing", "what is new"],
		//2
		["what is going on", "what is in your life", "what is up", "what is with you"],
		//3
		["cool", "fantastic", "good", "happy"],
		//4
		["bad", "bored", "sad", "tired"],
		//5
		["tell me joke", "tell me story", "~", "~"],
		//6
		["gracias", "thank you", "thanks", "~"],
		//7
		["bye", "good bye", "goodbye", "~"]
	];

	const reply = [
		
		["Hello!", "Hi!", "Hey!", "Hi there!"], 
		
		[
			"Fine... how are you?",
			"Pretty well, how are you?",
			"Fantastic, how are you?"
		],
		
		[
			"Nothing much",
			"Exciting things!",
			"Having tests"
		],
		
		["Glad to hear it"],
		
		["If it is because of me then I am sorry", "Cheer up buddy"],
		
		["I cannot", "Once upon a time, someone laughed"],
		
		["You're welcome", "No problem"],
		
		["Goodbye", "See you later", "hasta la vista"],
	];

	const alternative = [
		"Same",
		"Go on...",
		"Try again",
		"I'm listening...",
		"Listning is my ability",
		"Sometimes I will not reply"
	];
	
	const robot = ["Consider me a human", "I am not a bot"];
	
	if(compare(trigger, reply, text)){
		product = compare(trigger, reply, text);
	} 
	else if(text.match(/robot/gi)){
		product = robot[Math.floor(Math.random() * robot.length)];
	} 
	else{
		product = alternative[Math.floor(Math.random() * alternative.length)];
	}
	
	//this will be final reply
	return product;

}

function compare(trigger, replys, text){
	
	//trriger is the 2d array in which we have to search the text
	let m = trigger.length; //number of rows
	let n = trigger[0].length; //number of columns
	console.log(m);
	let i = m-1;
	let j = 0;
	let reply = "I don't have answer for that";
	
	while(i >= 0 && j < n){
	
		if(trigger[i][j] == "~"){
			i--;
			j=0;
			continue;
		}
		let val = trigger[i][j].localeCompare(text);
		
		if (val == 0){
			
			//we have to find reply from the ith row of reply 2d array
			reply = replys[i][Math.floor(Math.random() * replys[i].length)];
			return reply;
			
		}
		else if (val == -1){
			
			j++;
			if(j >= n){
			    
				i--;
				j = 0;
			    
			}
		}
		else{
			i--;
			j = 0;
		}
	
	}
	
	//no reply found soo then we have to look in alternative array for response
	return false;
	
}
