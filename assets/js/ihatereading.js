function chunkit(text, numLines) {
  //Split into sentences so that we can join them into the correct things. 
  //Look for the end of a line (.?!), followed by a space (\s), followed by the start of a new sentence (A-Za-z0-9)
  //Then split on it
  var regex = /([.?!])[\s\n](?=[A-Za-z0-9])/g
  var sentences = text.replace(regex, "$1|").split(/[|\n]+/);
  //Break the text into chunks of [numLines] sentences
  var chunks = [];
  var chunk = "";
  var numscanned = 0;
  for(i = 0; i < sentences.length; i++){
    chunk += sentences[i] + " ";
    numscanned++;
    if (numscanned == numLines || i + 1 == sentences.length || chunk.length > 140) {
      chunks.push(chunk.trim());
      chunk = "";
      numscanned = 0;
    }
  }
  return chunks
}

function parseText(){
	//Get the value of the text
	var text = document.getElementById("textEntry").value;
	var numLines = 2;
	var chunks = chunkit(text, numLines);
	var chunkstring = "";
	for(i = 0; i < chunks.length; i++){
		chunkstring += chunks[i] + "\n";
	}
	document.getElementById("textOutput").value = chunkstring;
}

function parseOnEnter(e){
	var key = e.which || e.keyCode;
	if (key == 13 && !e.shiftKey) { // 13 is enter
		e.preventDefault()
		parseText();
  }
}

function addListeners(){
	//On 'Enter', interpret the content of the textEntry box. 
	document.getElementById("textEntry").addEventListener('keypress', function (e) {
		parseOnEnter(e);
	});
}

window.onload = function(){
	addListeners();
}
