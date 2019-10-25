chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
		if (document.readyState === "complete") {
			clearInterval(readyStateCheckInterval);
			var main = document.getElementById('info')
			var button = document.createElement("button");
		    var text = document.createTextNode("RSS");
		    button.appendChild(text);
		    main.appendChild(button);
			button.onclick = rss;
			var box = document.createElement("p");
			for (var arrScripts = document.getElementsByTagName('script'), i = 0; i < arrScripts.length; i++) {
			    if (arrScripts[i].textContent.indexOf('browseId') != -1) {
			        var channelId = arrScripts[i].textContent.match(/\"browseId\"\s*\:\s*\"(.*?)\"/)[1];
			        box.innerHTML = channelRss = 'https://www.youtube.com/feeds/videos.xml?channel_id=' + channelId;
					break;
			    }
			}

			main.appendChild(box);
		}
	}, 10);
});


function rss() {

}
