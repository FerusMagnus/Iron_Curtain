var tabs = {};

//OPEN NEW TAB WITH SITE IF IT IS FIRST RUN	
if(!UTILS.checkUserID()) { 
	 //LOAD CONFIG FROM LOCAL FILE
	var config = LIBRARY.ajax({url: '../config/main.json', success: function(data) { config = JSON.parse(data); LIBRARY.save('config', data);}});
 }

//GET USER ID
var UID = UTILS.getUserID();

//GET VERSION EXTENSIONS
var ver = UTILS.getVer();

//LOAD CONFIG FROM LOCALSTORAGE
config = JSON.parse(LIBRARY.load('config'));

//ICON ALERT IF NO PASSWORD
UTILS.iconFlashForPasswd();

//CHECK STATUS ICON
UTILS.iconDisable();

//RELOAD ALL TABS
UTILS.reloadAllTabs();

//INIT CHECK DISABLING PLUGIN
disablePluginBackground.checkActiveCloseTab();

//ROUTER
LIBRARY.onMessage(function(request, sender, sendResponse) {

	if(request.action === 'getConfig') {
		sendResponse(config);
	}

	if(request.action === 'checkWhiteList') {
		sendResponse(UTILS.checkWhiteList(request.url));
	}

	if(request.action === 'checkBlackList') {
		sendResponse(UTILS.checkBlackList(request.url));
	}

	if(request.action == 'checkOffPlugin') {
		sendResponse(UTILS.checkTimeDisable());
	}

	if(request.action == 'badRequest') {
		sendResponse(UTILS.checkTimeDisable());
	}
	
	if(request.action == 'getPassword') {
		sendResponse(LIBRARY.load('password'));
	}
	
	if(request.action == 'addWhiteList') {
		UTILS.removeBlackList(request.url);
		sendResponse(UTILS.addWhiteList(request.url));
	}
	
	if(request.action == 'openOptions') {
		chrome.tabs.create({ url: chrome.runtime.getURL("html/options.html") });
	}
	
	if(request.action == 'getUID') {
		sendResponse(UID);
	}


	if(request.action == 'blockPage') {
		UTILS.addTotalBlock();
		UTILS.iconFlashForRequest();
		tabs[sender.tab.id] = { 'badWords': request.badWords};
	}
	
	if(request.action == 'getInfoBlockPage') {
		sendResponse(tabs[sender.tab.id], sender.tab.id);
		delete tabs[sender.tab.id];
	}
	
	if(request.action == 'iconStatus') {
		UTILS.iconDisable();
	}
	
	if(request.action == 'sentRequest') {
		LIBRARY.ajax({url: request.url, success: function(data) {
			if(request.success)
				request.success(data);
		}, error: function() {
			if(request.error)
				request.error(data);
		}});
	}

	if(request.action == 'pingServer') {
		LIBRARY.ajax({url: '', success: function(data) {
			LIBRARY.msgContent(sender.tab.id, {'action': 'pingServer', 'data': data});
		}, error: function() {
			LIBRARY.msgContent(sender.tab.id, false);
		}});
	} 
});

