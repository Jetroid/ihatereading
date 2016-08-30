//Create the XHR object.
function createXHRObject(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    //XHR for Chrome/Firefox/Opera/Safari.
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    //XDomainRequest for IE.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    //CORS not supported.
    xhr = null;
  }
  return xhr;
}

// Make the CORS request.
function makeCorsRequest(url) {
  url = "https://jetroidcors.herokuapp.com/" + url;

  var xhr = createXHRObject('GET', url);
  if (!xhr) {
  	//CORS not supported by browser
    alert('CORS not supported');
    return;
  }

  // Response handlers.
  xhr.onload = function() {
    var text = xhr.responseText;
    alert('Response from CORS request to ' + url + ': ' + text);
  };

  xhr.onerror = function() {
    alert('There was an error making the request. :(');
  };

  xhr.send();
}
