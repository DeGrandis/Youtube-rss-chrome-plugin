chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
		if (document.readyState === "complete") {
			clearInterval(readyStateCheckInterval);
			var main = document.getElementById('sponsor-button')
			var button = document.createElement("button");
		    var text = document.createTextNode("RSS");
			button.setAttribute("id", "rssbutton");
		    button.appendChild(text);
		    main.appendChild(button);
			var rssDiv = document.createElement("div");
			rssDiv.setAttribute("id", "rssDiv");
			var link = document.createElement("input");
			link.setAttribute("id", "linkInputBox")
			// for (var arrScripts = document.getElementsByTagName('script'), i = 0; i < arrScripts.length; i++) {
			//     if (arrScripts[i].textContent.indexOf('browseId') != -1) {
			//         var channelId = arrScripts[i].textContent.match(/\"browseId\"\s*\:\s*\"(.*?)\"/)[1];
			//         link.value = 'https://www.youtube.com/feeds/videos.xml?channel_id=' + channelId;
			// 		console.log(link.value);
			//     }
			// }
			link.value = document.links[9].href.split("/")[4];
			var info = document.getElementById('info');
			rssDiv.appendChild(link);
			info.appendChild(rssDiv);
			//rssDiv.style.display = "none";
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
	  	copyText.select();
	  	copyText.setSelectionRange(0, 99999);
	  	document.execCommand("copy");
		copyText.blur();
		$("#rssDiv").delay(1000).hide(slideSpeed);
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
