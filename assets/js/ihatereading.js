function textCleanup(text){
	var wikipediaCitations = /\[[0-9]+\]/g
	return text.replace(wikipediaCitations, "")
}


function run(text){
	var text = textCleanup(text);
	var slideHolder = document.getElementById('slides');
	
	//Split our text into sentences.
	var sentences = tokenizer.sentences(text, {"newline_boundaries": true});
	
	//Create a slide for each sentence.
	sentences.forEach(function(sentence){
		var slide = document.createElement('SECTION');
		var slidep = document.createElement('P');
		slidep.innerHTML = sentence;
		slide.appendChild(slidep);
		slides.appendChild(slide);
	});
	
	document.getElementById('landing').style.display="none";
	document.getElementById('slides-container').style.display="block";
	
	Reveal.initialize({transition: 'concave'}); // none/fade/slide/convex/concave/zoom);
}

function runOnEnter(e, textBox){
	var key = e.which || e.keyCode;
	if (key == 13 && !e.shiftKey) { // 13 is enter
		e.preventDefault();
		run(textBox.value);
  }
}

function addListeners(){
	//On 'Enter', interpret the content of the textEntry box. 
	document.getElementById("textEntry").addEventListener('keypress', function (e) {
		runOnEnter(e, this);
	});
}

window.onload = function(){
	addListeners();
}
