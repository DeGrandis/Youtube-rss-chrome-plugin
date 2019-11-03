$(document).ready(function() {
	setTimeout(function () {
        init();
		console.log("Init Done");
    }, 1000);
});


function rss(rssinfo) {
	var slideSpeed = 200;

	if (rssinfo.style.display === "none") {
    	$("#rssDiv").slideDown(slideSpeed);
		var copyText = document.getElementById("linkInputBox");
		copyText.value = 'https://www.youtube.com/feeds/videos.xml?channel_id=' + document.getElementById("text-container").getElementsByTagName("a")[0].href.split("/")[4];
	  	copyText.select();
	  	copyText.setSelectionRange(0, 99999);
	  	document.execCommand("copy");
		copyText.blur();
		$("#rssDiv").delay(2000).slideUp(slideSpeed);
  	} else {
    	$("#rssDiv").fadeOut(slideSpeed);
  	}
}

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

function init() {
	var main = document.querySelector('#top-row.style-scope.ytd-video-secondary-info-renderer');
	var currentUrl = window.location.href.split("/")[3];
	if (!(main && currentUrl)) {
		setTimeout(function() {
			init();
			console.log("loading again");
		}, 1000);
		return false;
	}

	var rssButton = createRSSButton();
	main.appendChild(rssButton);


	var rssDiv = document.createElement("div");
	rssDiv.setAttribute("id", "rssDiv");

	var link = document.createElement("input");
	link.setAttribute("id", "linkInputBox");

	var isDarkMode = document.getElementsByTagName("html")[0].getAttribute("dark");

	if (isDarkMode) {
		link.style.setProperty("background-color", "#1F1F1F");
	}

	var copyText = document.createElement("p");
	copyText.setAttribute("id", "copyText");
	copyText.setAttribute("style", "display:inline-block");
	copyText.innerHTML = "RSS Link Copied to Clipboard!";

	var info = document.getElementById('info');

	rssDiv.appendChild(copyText);
	rssDiv.appendChild(link);
	info.appendChild(rssDiv);

	$("#rssDiv").hide();
}
