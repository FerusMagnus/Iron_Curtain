var urlblack = UTILS.fromBase64(decodeURIComponent(UTILS.getURLParameter(url, 'domain-block')));
var domain = UTILS.urlDomain(urlblack);

LIBRARY.msgBackground({action:'getInfoBlockPage'}, function(data, tabId){ 
	if(data) {
		sessionStorage.setItem(domain, JSON.stringify(data));
	}
});

LIBRARY.msgBackground({action:'getPassword'}, function(data){ 
	if(data) {
		sessionStorage.setItem('password', data);
	}
});

function addWhiteList(domain) {
	LIBRARY.msgBackground({action:'addWhiteList', url:domain}, function(data){ 
	});
}

function openOptions() {
	LIBRARY.msgBackground({action:'openOptions'}, function(data){ 
	});
}

document.addEventListener('addWhiteList', function() {
  addWhiteList(domain);
});

document.addEventListener('openOptions', function() {
	openOptions();
});