var textEntry = document.getElementById("textEntry");
var urlEntry = document.getElementById("urlEntry");
var goButton = document.getElementById("goButton");
var goEnabled = true;
var viewingSlides = false;

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
	var citations = /\s?\[([0-9,]+)\]/g
	return text.replace(citations, "")
}

function disableUI(){
	urlEntry.disabled = true;
	textEntry.disabled = true;
	goEnabled = false;
}

function enableUI(){
	if(urlEntry.value != ""){
		urlEntry.disabled = false;
	}else{
		textEntry.disabled = false;
	}
	goEnabled = true;
}

function resizeText(slideContainer, forceResize){
	if(!slideContainer.resizedBefore || forceResize){
		slideContainer.resizedBefore = true;

		var slideTextfill = slideContainer.firstElementChild;
		var content = slideTextfill.firstElementChild;

		var compStyle = document.defaultView.getComputedStyle(slideContainer);
		var slideWidth = parseInt(compStyle.getPropertyValue("width"));
		var slideHeight = parseInt(compStyle.getPropertyValue("height"));

		slideTextfill.style.width = slideWidth + "px";
		slideTextfill.style.height = slideHeight + "px";

		var contentCompStyle = document.defaultView.getComputedStyle(content);
		var fontSize = parseInt(contentCompStyle.getPropertyValue("font-size"));

		var $slideTextfill = $(slideTextfill);
		$slideTextfill.textfill({
			maxFontPixels: fontSize,
		});
	}
}

function run(text){
	disableUI();
	if(text.endsWith(".pdf")){
		runPDF(text.trim());
		return;
	}

	//Clean our text
	var text = textCleanup(text);
	//Split our text into sentences.
	var sentences = tokenizer.sentences(text, {"newline_boundaries": true});

	//Create a slide for each sentence.
	sentences.forEach(function(sentence){
		var slideSpan = document.createElement('SPAN');
		slideSpan.innerHTML = sentence;

		//get the width and height of the slide container, and re-set it statically to the Textfill
		var slideTextfill = document.createElement('DIV');
		slideTextfill.className = "textfill";
		slideTextfill.appendChild(slideSpan)

		var slideContainer = document.createElement('SECTION');
		slideContainer.appendChild(slideTextfill);

		slides.appendChild(slideContainer);
	});
	
	document.getElementById('landing').style.display="none";
	document.getElementById('slides-container').style.display="block";

	Reveal.initialize({transition: 'none',overview: false}); // none/fade/slide/convex/concave/zoom);
	viewingSlides = true;

	var firstSlide = document.getElementById("slides").firstElementChild;
	resizeText(firstSlide, false);

	Reveal.addEventListener( 'slidechanged', function( event ) {
		resizeText(event.currentSlide, false);
	});
}

function runOnButton(){
	if(goEnabled){
		var textbox = urlEntry.value == "" ? textEntry : urlEntry;
		var value = textbox.value;
		run(value);
	}
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

function closeSlides(){
	var landing = document.getElementById('landing');
	var slidesContainer = document.getElementById('slides-container');

	//Immediately make landing visible
	landing.style.display="block";
	slidesContainer.style.display="none";

	//Delete old slides
	var slides = document.getElementById('slides');
	var cloned = slides.cloneNode(false);
	slidesContainer.replaceChild(cloned, slides);

	//Enable the UI.
	viewingSlides = false;
	updateProgress(0);
	enableUI();
}

function closeOnEscape(evt){
	if(viewingSlides){
		evt = evt || window.event;
		var isEscape = false;
		if ("key" in evt) {
			isEscape = evt.key == "Escape";
		} else {
			isEscape = evt.keyCode == 27;
		}
		if (isEscape) {
			closeSlides();
		}
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
	goButton.addEventListener('click', buttonHandler = function() {
		runOnButton();
	});
	//Close
	document.addEventListener('keydown', function(evt){
		closeOnEscape(evt);
	});
	document.getElementById('close').addEventListener('click', function(){
		closeSlides();
	});
}

window.onload = function(){
	addListeners();
}
