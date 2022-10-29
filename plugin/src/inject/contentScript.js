//fires one second after page load.
//sometimes all elements are not created.
$(document).ready(function() {
	setTimeout(function () {
        init();
				//console.log("Init Done");
    }, 1000);
});

//determines if page is a video.
//if it is, it  creates the elements and puts them on the page
function init() {
	var main = document.querySelector('#owner');
	var currentUrl = window.location.href.split("/")[3];
	if (!(main && currentUrl)) {
		setTimeout(function() {
			init();
			//console.log("loading again");
		}, 1000);
		return false;
	}

	var rssButton = createRSSButton();
	main.appendChild(rssButton);

	var info;
	var divs = document.querySelectorAll('[id=info]');;
	for (var i = 0; i < divs.length; i++) {
		if (divs[i].className == "style-scope ytd-watch-flexy") {
			info = divs[i];
			break;
		}
	}

	var infoPopup = createPopup();
   	main.appendChild(infoPopup);

	$("#rssDiv").hide();
}

//on click method for the button press.
//extracts channel ID from profile link and appends to format.
function rss(rssinfo) {
	var slideSpeed = 200;

	if (rssinfo.style.display === "none") {
    	$("#rssDiv").slideDown(slideSpeed);
		var copyText = document.getElementById("linkInputBox");
		var urlFragment = 'https://www.youtube.com/feeds/videos.xml?channel_id=';
		var externalId =  document.querySelector("meta[itemprop=channelId]").getAttribute("content");
		var url = urlFragment + externalId
		copyText.value = url;
		copyText.select();
	  	copyText.setSelectionRange(0, url.length);
	  	document.execCommand("copy");
		copyText.blur();
		$("#rssDiv").delay(1000).slideUp(slideSpeed);
  	} else {
    	$("#rssDiv").fadeOut(slideSpeed);
  	}
}

//creates the RSS button.
function createRSSButton() {
	var buttonDiv = document.createElement("div");
	buttonDiv.setAttribute("id", "buttonDiv");
	buttonDiv.style.setProperty("display", 'inline-block', "important");
	buttonDiv.style.setProperty("height", '50px', "important");
	buttonDiv.style.setProperty("padding", '7px', "important");
	buttonDiv.style.setProperty("overflow", 'hidden', "important");
	buttonDiv.style.setProperty("box-sizing", 'border-box', "important");

	var button = document.createElement("button");
	button.setAttribute("id", "rssbutton");

	var buttonText = document.createTextNode("RSS");
	button.appendChild(buttonText);

	buttonDiv.appendChild(button)

	button.addEventListener('click', function() {
		rss(rssDiv);
	});

	return buttonDiv;
}

//creates the popup info
function createPopup() {
	var rssDiv = document.createElement("div");
	rssDiv.setAttribute("id", "rssDiv");
    rssDiv.style.setProperty("position", "absolute");
	var link = document.createElement("input");
	link.setAttribute("id", "linkInputBox");

	var isDarkMode = document.getElementsByTagName("html")[0].getAttribute("dark");

	if (isDarkMode) {
		link.style.setProperty("background-color", "#1F1F1F");
	}
	else {
		link.style.setProperty("background-color", "#F9F9F9");
	}

	var copyText = document.createElement("p");
	copyText.setAttribute("id", "copyText");
	copyText.setAttribute("style", "display:inline-block");
	copyText.innerHTML = "RSS Link Copied to Clipboard!";

	rssDiv.appendChild(copyText);
	rssDiv.appendChild(link);
	return rssDiv;
}
