function runPDF(url){
	var url = 'https://jetroidcors.herokuapp.com/' + url;
	PDFJS.workerSrc = './assets/js/pdf.worker.js';
	var pdfjs2text = new PDFJS2TEXT();
	pdfjs2text.pdfToText(
		url, 
		function(completed, total){ console.log ( completed + " / " + total); },
		function(text) { run(text) }
	);
}

function textCleanup(text){
	var wikipediaCitations = /\[([0-9]+|edit)\]/g
	return text.replace(wikipediaCitations, "")
}

function run(text){
	if(text.endsWith(".pdf")){
		runPDF(text);
		return;
	}

	//var text = textCleanup(text);
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
		console.log(textBox.value);
		run(textBox.value);
	}
}

function addListeners(){
	//On 'Enter', interpret the content of the textEntry box. 
	document.getElementById("textEntry").addEventListener('keypress', function (e) {
		runOnEnter(e, this);
	});
	document.getElementById("urlEntry").addEventListener('keypress', function(e) {
		runOnEnter(e, this);
	});
}

window.onload = function(){
	addListeners();
}
