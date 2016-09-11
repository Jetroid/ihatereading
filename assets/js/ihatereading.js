var textEntry = document.getElementById("textEntry");
var urlEntry = document.getElementById("urlEntry");
function updateProgress(percentage){
	var progressBar = document.getElementById('progress-bar');
	progressBar.setAttribute("style","width:" + percentage + "%");
	progressBar.style.width = percentage + "%";
}

function runPDF(url){
	var url = 'https://jetroidcors.herokuapp.com/' + url;
	PDFJS.workerSrc = './assets/js/pdf.worker.js';
	var pdfjs2text = new PDFJS2TEXT();
	pdfjs2text.pdfToText(
		url, 
		function(completed, total){ updateProgress(completed/total*100); },
		function(text) { run(text) }
	);
}

function textCleanup(text){
	var wikipediaCitations = /\[([0-9]+|edit)\]/g
	return text.replace(wikipediaCitations, "")
}

function run(text){
	if(text.endsWith(".pdf")){
		runPDF(text.trim());
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
	
	Reveal.initialize({transition: 'concave',overview: false}); // none/fade/slide/convex/concave/zoom);
}

function runOnButton(){
	var textbox = urlEntry.value == "" ? textEntry : urlEntry;
	var value = textbox.value;
	run(value);
}

function runOnEnter(e, textBox){
	var key = e.which || e.keyCode;
	if (key == 13 && !e.shiftKey) { // 13 is enter
		e.preventDefault();
		run(textBox.value);
	}
}

function disableOther(textBox){
	var other = textBox === textEntry ? urlEntry : textEntry;

	if(textBox.value == ""){
		other.disabled = false;
	} else {
		other.disabled = true;
	}
}

function closeOnEscape(evt){
	evt = evt || window.event;
	var isEscape = false;
	if ("key" in evt) {
		isEscape = evt.key == "Escape";
	} else {
		isEscape = evt.keyCode == 27;
	}
	if (isEscape) {
		var landing = document.getElementById('landing');
		var slidesContainer = document.getElementById('slides-container');

		//Immediately make landing visible
		landing.style.display="block";
		slidesContainer.style.display="none";

		//Delete old slides
		var slides = document.getElementById('slides');
		var cloned = slides.cloneNode(false);
		slidesContainer.replaceChild(cloned, slides);
  }
}

function addListeners(){
	//On 'Enter', interpret the content of the textEntry and urlEntry boxes.
	textEntry.addEventListener('keypress', function (e) {
		runOnEnter(e, this);
	});
	urlEntry.addEventListener('keypress', function(e) {
		runOnEnter(e, this);
	});
	//On change, disable the other box.
	textEntry.addEventListener('input', function (e) {
		disableOther(this);
	});
	urlEntry.addEventListener('input', function (e) {
		disableOther(this);
	});
	//Run
	document.getElementById("goButton").addEventListener('click', function(e) {
		runOnButton();
	});
	document.addEventListener('keydown', function(evt){
    closeOnEscape(evt);
	});
}

window.onload = function(){
	addListeners();
}
