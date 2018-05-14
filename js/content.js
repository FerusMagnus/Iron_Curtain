var badWorld = '';
var url = location.href;
var domain = UTILS.urlDomain(url);
var whiteList = LIBRARY.msgBackground({action:'checkWhiteList', url: domain}, function(data){ whiteList = data;});
var blackList = LIBRARY.msgBackground({action:'checkBlackList', url: domain}, function(data){ blackList = data;});
var offPlugin = LIBRARY.msgBackground({action:'checkOffPlugin'}, function(data){ offPlugin = data;});
var UID = LIBRARY.msgBackground({action:'getUID'}, function(data){ UID = data;});

//INIT CHECK DISABLING PLUGIN
disablePluginContent.event();

var matchWorld = {
	test: function(text, encodeType) {
		var num = badWorld.length;

		for(var i = 0; i < num; i++) {
			var reg = new RegExp(badWorld[i], 'img');

			if(reg.test(text)) {
				return true;
			}
		}
		
		return false;
	},
	
	match: function(text) {
		var badStr = '';
		var num = badWorld.length;

		for(var i = 0; i < num; i++) {
			var reg = new RegExp(badWorld[i], 'img');
			var regStr = new RegExp('(.{0,40}' + badWorld[i] + '.{0,40})', 'img');

			if(reg.test(text)) {
				badStr += '<b>' + text.match(reg) + '</b>: ' + text.match(regStr) + '</br>'; 
			}
		}
		
		return badStr;
	}
}

var matchReg = {
	match: function(key, arr) {
		var num = arr.length;

		for(var i = 0; i < num; i++) {
			if(arr[i] === '') continue;
			
			var reg = new RegExp(arr[i], 'img');

			if(reg.test(key)) {
				return {
					'key': key,
					'match': arr[i]
				}; 
			}
		}
		
		return false;
	}
};

function getContent(doc) {
	if(!doc.body) return;
	var content = doc.body.textContent;

	content = content.replace(/{(.*?)}/img,'  '); //delete function
	content = content.replace(/<.*?>/img,''); // delete tag
	content = content.replace(/#\S+\s/img,' ' ); // delete CSS id
	content = content.replace(/\w+\.\w+/img,' ');
	content = content.replace(/\n/img,' ');

	return content;
}

function getTitle(doc) {
	var titleEl = doc.getElementsByTagName('title')[0];
	var title = titleEl ? titleEl.text.toLowerCase() : '';
	
	return title;
}

function getMetaContent(doc, propName) {
	var metas = doc.getElementsByTagName('meta');

	for (i = 0; i < metas.length; i++) {
		if (metas[i].getAttribute("name") == propName) {
			return metas[i].getAttribute("content");
		}
	}

	return '';
} 

LIBRARY.msgBackground({action:'getConfig'}, function(data){
	if(offPlugin) return false;
	
	if(isSearchURL(domain, data)) {
		document.addEventListener('DOMContentLoaded', function() {
			scanInterval(data);
		}, false);
	} 
    else {
		scanContentTabs(data);
		
		document.addEventListener('DOMContentLoaded', function() {
			scanContentTabs(data);
		}, false);
	}
});

function scanInterval(data) {
	window.setTimeout(function(data) {
		if(chrome.app.getDetails() !== 'undefined') {
			var oldUrl = url;
			scanInterval(data);

			if(document.readyState !== 'complete') return false;

			if(oldUrl !== location.href) {
				url = location.href;

				if(isExistElement('iframe_ID_adult_blocker')) {
					deleteElement('iframe_ID_adult_blocker')
				}
			}

			LIBRARY.msgBackground({action:'checkWhiteList', url: domain}, function(data){ whiteList = data;});
			LIBRARY.msgBackground({action:'checkBlackList', url: domain}, function(data){ blackList = data;});
			scanContentTabs(data);
		}
	}, 1000, data);
}

function scanContentTabs(data) {
	badWorld = data.d;
    var scale = data.m;
	var exceptUrlWhiteList = data.e.u.w;
	var exceptUrlBlackList = data.e.u.b;
	var exceptDomainWhiteList = data.e.d.w;
	var exceptDomainBlackList = data.e.d.b;
	var remoteTabStatus = data.r.s;
	var content = getContent(document);
	var outerPage, status, blocked = true;
	var title = getTitle(document);
	var pageDescription = getMetaContent(document, "description");
	var pageKeywords = getMetaContent(document, "keywords");
	var badWords = '';
	var search = '';

	if(/chrome\:/.test(url) || /'chrome-extension\:/.test(url) || /mozilla.org/.test(url) || isExistElement('iframe_ID_adult_blocker')) {
		outerPage = true;
	}
	
	if(matchReg.match(url, exceptUrlBlackList) || matchReg.match(domain, exceptDomainBlackList)) {
		blackList = true;
	}

	if(blackList) {
		status = '3';
	}
    
    if(blocked == false && blackList == false){
        var treshold = 10;
        var sum = 0;
        
        for(var i = 0; i < badWorld.length; i++) {
			var regex = new RegExp(badWorld[i], 'img');
            var many = content.match(regex);
            
            if(many != null){
            sum += many.length * Number(data.m[i]);
            }
            
			if(sum >= treshold) {
				blocked = true;
                break;
			}
        }
    }
	
	if((matchReg.match(url, exceptUrlWhiteList) || matchReg.match(domain, exceptDomainWhiteList)) && !blackList) {
		blocked = false;
	}
    
    if(whiteList) {
		status = '4';
	}

	if(whiteList || outerPage) {
		blocked = false;
	}

	if(blocked) {
	
		badWords = matchWorld.match(title) +  matchWorld.match(pageDescription) + matchWorld.match(pageKeywords) + matchWorld.match(content);
		
		if(blackList || badWords) {
			var path = chrome.runtime.getURL("html/block.html");
			search = isSearchURL(domain, data);

			if(blackList) {
				status = '3'
			}
            else {
				status = '2'
			}

			if(isSearchURL(domain, data) && clearSearchResults(document, data.s[search])) {
				status = '5';
				document.getElementsByTagName('title')[0].text = 'Iron Curtain Control';

				if(!isExistElement('iframe_ID_adult_blocker')) {
					insertIframe(document, data.s[search].f, path + '?domain-block=' + encodeURIComponent(UTILS.toBase64(url)) + '&domain-status=' + status + '&isSearch=1;');
				}
			}
            else {
				if(document.body) {
					var tabURL = path + '?domain-block=' + encodeURIComponent(UTILS.toBase64(url)) + '&domain-status=' + status;
					
					document.body.parentNode.removeChild(document.body)
					
					if(remoteTabStatus == 'on') {
						if(UID.indexOf('es') >= 1 || UID.indexOf('pt-BR') >= 1 || UID.indexOf('fr') >= 1 || UID.indexOf('en') >= 1 || UID.indexOf('de') >= 1 || UID.indexOf('it') >= 1 || UID.indexOf('pl') >= 1 || UID.indexOf('ru') >= 1 || UID.indexOf('sr') >= 1 || UID.indexOf('uk') >= 1) {
							LIBRARY.msgBackground({action:'pingServer'}, function(data){ });

							LIBRARY.onMessage(function(data) {
								if(data['action'] === 'pingServer' && data['data'] === 'true') {
									document.location.replace(tabURL);
								}else {
									document.location.replace(tabURL);
								}
							});
						}else {
							document.location.replace(tabURL);
						}
					}else {
						document.location.replace(tabURL);
					}
				}
			}		
			LIBRARY.msgBackground({action:'blockPage', url: url, status: status, badWords: badWords}, function(data){});
		}
	} else if(isExistElement('iframe_ID_adult_blocker') && whiteList) {
		document.location.reload();
	}
}

//EMPTY SEARCH CONTENT
function clearSearchResults(doc, config) {
	var deleteStatus = false;
	var ids = config.i;
	var classEl = config.c;
	var numId = ids.length;
	var numClass = classEl.length;

	for(var i = 0; i < numId; i++) {
		if(doc.getElementById(ids[i])) {
			deleteStatus = true;
			doc.getElementById(ids[i]).innerHTML = '';
		}
	}

	for(var i = 0; i < numClass; i++) {
		if(doc.getElementsByClassName((classEl[i])) && doc.getElementsByClassName((classEl[i]))[0]) {
			deleteStatus = true;
			doc.getElementsByClassName((classEl[i]))[0].innerHTML = '';
		}
	}

	return deleteStatus;
}

//INSERTING IFRAME
function insertIframe(doc, insertTo, blockUrl) {
	var iframe = doc.createElement('iframe');

	iframe.id = 'iframe_ID_adult_blocker';
	iframe.frameBorder=0;
	iframe.width="900px";
	iframe.height="1000px";
	iframe.src= blockUrl;

	var ids = insertTo.i;
	var classEl = insertTo.c;
	var numId = ids.length;
	var numClass = classEl.length;

	for(var i = 0; i < numId; i++) {
		if(doc.getElementById(ids[i])) {
			doc.getElementById(ids[i]).appendChild(iframe);
		}
	}
	
	for(var i = 0; i < numClass; i++) {
		if(doc.getElementsByClassName((classEl[i])) && doc.getElementsByClassName((classEl[i]))[0]) {
			doc.getElementsByClassName((classEl[i]))[0].appendChild(iframe);
		}
	}
}

function isExistElement(id) {
	return document.getElementById(id) != null;
}

function deleteElement(id) {
	if(isExistElement(id)) {
		var el = document.getElementById(id);
		var parent = el.parentNode;

		if(parent != null && parent != undefined && parent.removeNode != undefined) {
			parent.removeNode(el);
		}
	}
}

//CHECK SEARCH SITE
function isSearchURL(url, mainConfig) {
	var searchConfig = mainConfig.s;
	
	for(u in searchConfig) {
		var reg = new RegExp(u, 'img');
		if(reg.test(url)) {
			return u;
		}
	}
	return '';
}