var textEntry = document.getElementById("textEntry");
var urlEntry = document.getElementById("urlEntry");
var goButton = document.getElementById("goButton");
var goEnabled = true;
var viewingSlides = false;
//The sentences we wanna display
var sentences;
var sentenceIndex = 0;

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

function resizeText(){
	var slide = document.getElementById("slide");
	var content = slide.firstElementChild;

	var compStyle = document.defaultView.getComputedStyle(slide);
	var slideWidth = parseInt(compStyle.getPropertyValue("width"));
	var slideHeight = parseInt(compStyle.getPropertyValue("height"));

	slide.style.width = slideWidth + "px";
	slide.style.height = slideHeight + "px";

	var contentCompStyle = document.defaultView.getComputedStyle(content);
	var fontSize = parseInt(contentCompStyle.getPropertyValue("font-size"));

	var $slideTextfill = $(slide);
	$slideTextfill.textfill({
		maxFontPixels: fontSize,
	});
}

function setText(text){
	var currentChild = document.getElementById("slide").firstElementChild;
	var newChild = document.createElement("SPAN");
	newChild.textContent = text;
	document.getElementById("slide").replaceChild(newChild,currentChild);
	resizeText();
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
	sentences = tokenizer.sentences(text, {"newline_boundaries": true});
	sentencesIndex = 0;

	document.getElementById('landing').style.display="none";
	document.getElementById('slide-container').style.display="block";
	viewingSlides = true;
	
	setText(sentences[0]);
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
	if(viewingSlides){
		var landing = document.getElementById('landing');
		var slidesContainer = document.getElementById('slide-container');

		//Immediately make landing visible
		landing.style.display="block";
		slidesContainer.style.display="none";

		//Enable the UI.
		viewingSlides = false;
		updateProgress(0);
		enableUI();
	}
}
function nextSlide(){
	var slide = document.getElementById("slide");
	if(sentenceIndex + 1 < sentences.length){
		sentenceIndex++;
		setText(sentences[sentenceIndex]); 
	}
}
function previousSlide(){
	var slide = document.getElementById("slide");
	if(sentenceIndex - 1 > -1){
		sentenceIndex--;
		setText(sentences[sentenceIndex]);
	}
}

function isEscape(evt){
	var isEscape = false;
	if ("key" in evt) {
		isEscape = evt.key == "Escape";
	} else {
		isEscape = evt.keyCode == 27;
	}
	return isEscape;
}

function keydownHandler(evt){
	evt = evt || window.event
	if (isEscape(evt)){
		closeSlides();
	//Left Arrow
	} else if (evt.keyCode === 37){
		previousSlide();
	//Right Arrow
	} else if (evt.keyCode === 39){
		nextSlide();
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
	//Close, Left and Right arrow keys
	document.addEventListener('keydown', function(evt){
		keydownHandler(evt);
	});
	document.getElementById('close').addEventListener('click', function(){
		closeSlides();
	});
	document.getElementById('left').addEventListener('click', function(){
		previousSlide();
	});
	document.getElementById('right').addEventListener('click', function(){
		nextSlide();
	});
}

window.onload = function(){
	addListeners();
}
