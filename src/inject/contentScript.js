chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
		if (document.readyState === "complete") {
			clearInterval(readyStateCheckInterval);
			var main = document.getElementById('sponsor-button');
			//var main = document.getElementById('subscribe-button');
			var buttonDiv = document.createElement("div");
			buttonDiv.setAttribute("id", "buttonDiv");
			var button = document.createElement("button");
			button.setAttribute("id", "rssbutton");

		    var text = document.createTextNode("RSS");
			var rssDiv = document.createElement("div");
			rssDiv.setAttribute("id", "rssDiv");
			rssDiv.setAttribute("id", "rssDiv");

			var link = document.createElement("input");
			link.setAttribute("id", "linkInputBox")

			var info = document.getElementById('info');

		    button.appendChild(text);
			buttonDiv.appendChild(button)
			buttonDiv.setAttribute("class", "style-scope ytd-video-secondary-info-renderer");
			main.parentNode.insertBefore(buttonDiv, main);
		    //main.appendChild(button);

			rssDiv.appendChild(link);
			info.appendChild(rssDiv);

			$("#rssDiv").hide();

			button.addEventListener('click', function() {
            	rss(rssDiv);
        	});

			document.addEventListener('DOMNodeInserted', function (event) {
				//getLink();
			});
		}
	}, 10);
});


function rss(rssinfo) {
	var slideSpeed = 200;

	if (rssinfo.style.display === "none") {
    	$("#rssDiv").show(slideSpeed);
		var copyText = document.getElementById("linkInputBox");
		copyText.value = 'https://www.youtube.com/feeds/videos.xml?channel_id=' + document.getElementById("text-container").getElementsByTagName("a")[0].href.split("/")[4];
	  	copyText.select();
	  	copyText.setSelectionRange(0, 99999);
	  	document.execCommand("copy");
		copyText.blur();
		$("#rssDiv").delay(2000).hide(slideSpeed);
  	} else {
    	$("#rssDiv").hide(slideSpeed);
  	}
}

function getLink() {
	for (var arrScripts = document.getElementsByTagName('script'), i = 0; i < arrScripts.length; i++) {
		if (arrScripts[i].textContent.indexOf('browseId') != -1) {
			var channelId = arrScripts[i].textContent.match(/\"browseId\"\s*\:\s*\"(.*?)\"/)[1];
			console.log('https://www.youtube.com/feeds/videos.xml?channel_id=' + channelId);
			break;
		}
	}
}
