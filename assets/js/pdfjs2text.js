function PDFJS2TEXT(){
	/**
	*
	* @param data ArrayBuffer of the pdf file content
	* @param callbackPageDone To inform the progress each time
	*		when a page is finished. The callback function's input parameters are:
	*		1) number of pages done;
	*		2) total number of pages in file.
	* @param callbackAllDone The input parameter of callback function is 
	*		the result of extracted text from pdf file.
	*
	*/
	this.pdfToText = function(data, callbackPageDone, callbackAllDone){
		//Sanitise our input
		if(!(data	instanceof ArrayBuffer	|| typeof data == 'string' )) return false;

		//Get the PDF
		PDFJS.getDocument( data ).then( function(pdf) {

			//Set up reporting on progess for callback
			var completedPages = 0;
			var totalPages = pdf.numPages;
			callbackPageDone( completedPages, totalPages );

			//Iterate through each page and get all the text for that page, store in pages.
			var pages = {};
			var prevX = null;
			var prevY = null;
			var prevStr = null;
			
			for (var i = 1; i <= totalPages; i++){
				pdf.getPage(i).then( function(page){
					var pageText = "";
					var n = page.pageNumber;
					page.getTextContent().then( function(textContent){
						if( null != textContent.items ){
							for (var j = 0; j < textContent.items.length; j++ ){
								var block = textContent.items[j];
								var x = block.transform[4];
								var y = block.transform[5];
								var str = block.str;
								
								//Add a new line if our string is on a different y to the previous,
								//and our string starts with an uppercase or a letter.
								//(Trying to identify paragraphs)
								if(prevY != null && prevY != y && (str.match(/^([A-Z0-9])/) != null)){
									pageText += "\r\n";
								}
								
								pageText += str;
								prevX = x; prevY = y; prevStr = str;
							}
						}
						pages[n] = pageText;
						++ completedPages;
						callbackPageDone(completedPages, totalPages );
						if (completedPages == totalPages){
							var allText = "";
							for(var j = 1; j <= totalPages; j++){
								allText += pages[j]
							}
							callbackAllDone(allText);
						}
					});
				});
			}
		});
	};
};
