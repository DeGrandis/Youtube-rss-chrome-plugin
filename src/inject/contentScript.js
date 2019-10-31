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
			//button.onclick = rss;

			var link = document.createElement("p");
			for (var arrScripts = document.getElementsByTagName('script'), i = 0; i < arrScripts.length; i++) {
			    if (arrScripts[i].textContent.indexOf('browseId') != -1) {
			        var channelId = arrScripts[i].textContent.match(/\"browseId\"\s*\:\s*\"(.*?)\"/)[1];
			        link.innerHTML = channelRss = 'https://www.youtube.com/feeds/videos.xml?channel_id=' + channelId;
					break;
			    }
			}
			var info = document.getElementById('info');
			info.appendChild(link);
			link.style.display = "none";

			button.addEventListener('click', function() {
            	rss(link);
        	});
		}
	}, 10);
});


function rss(rssinfo) {
	if (rssinfo.style.display === "none") {
    	rssinfo.style.display = "block";
  	} else {
    	rssinfo.style.display = "none";
  	}
	styles();
}

function styles() {
	//this.setAttribute("style", "background-color:#fff");
}
