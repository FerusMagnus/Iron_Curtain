var UTILS = {
	updaterInterval: '',
	getUserID: function() {
		var uid = LIBRARY.load('UID');
		var browser;

		if(uid) {
			return uid;
		}
        else {
			browser = this.detectBrowser();
			uid = browser + ':' + chrome.i18n.getUILanguage() + ':' + Date.now();
			LIBRARY.save('UID', uid);
			return uid;
		}
	},

	checkUserID: function() {
		return  !!LIBRARY.load('UID');
	},

	detectBrowser: function() {
		var browser = 'unknown';

		browser = (!!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0) ? 'o' : browser; 
		browser = (typeof InstallTrigger !== 'undefined') ? 'f' : browser;
		browser = (Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor')>0) ? 's' : browser;
		browser = (!!window.chrome && browser !== 'o') ? 'c' : browser;
		browser = (/*@cc_on!@*/false || document.documentMode) ? 'i' : browser;

		return browser;
	},
	
	getVer: function() {
		return chrome.app.getDetails().version;
	},

	addWhiteList: function (domain) {
		var whiteList = JSON.parse(LIBRARY.load('whiteList') ? LIBRARY.load('whiteList') : '[]');

		if(this.checkWhiteList(domain)) {
			return false;
		}

		whiteList.push(domain);
		LIBRARY.save('whiteList', JSON.stringify(whiteList));
		whiteList = this.getWhiteList();
	},

	getWhiteList: function (){
		var whiteList = JSON.parse(LIBRARY.load('whiteList') ? LIBRARY.load('whiteList') : '[]');
		
		if(!whiteList) {
			whiteList = [];
		}
		
		return whiteList;
	},

	checkWhiteList: function (domain) {
		var whiteList = this.getWhiteList();
		var num = whiteList.length

		for (var i = 0; i < num; i++) {
			if(domain.indexOf(whiteList[i]) >= 0) {
				return true;
			}
		}
		
		return false;
	},

	addBlackList: function (domain) {
		var blackList = JSON.parse(LIBRARY.load('blackList') ? LIBRARY.load('blackList') : '[]');
	
		if(!blackList) {
			blackList = []
		}

		if(this.checkBlackList(domain)) {
			return false;
		}

		blackList.push(domain);
		LIBRARY.save('blackList', JSON.stringify(blackList));
		blackList = this.getBlackList();
	},

	getBlackList: function (){
		var blackList = JSON.parse(LIBRARY.load('blackList') ? LIBRARY.load('blackList') : '[]');
		
		if(!blackList) {
			blackList = []
		}
		
		return blackList;
	},

	checkBlackList: function (domain) {
		var blackList = this.getBlackList();
		var num = blackList.length;

		for (var i = 0; i < num; i++) {
			if(domain.indexOf(blackList[i]) >= 0) {
				return true;
			}
		}
		
		return false;
	},

	removeWhiteList: function(domain) {
		var status = false;
		whiteList = this.getWhiteList();
		
		if(whiteList) {
			var num = whiteList.length;

			for (var i = 0; i < num; i++) {
				if(domain.indexOf(whiteList[i]) == 0) {
					whiteList.splice(i, 1);
					status = true;
				}
			}
		}

		LIBRARY.save('whiteList', JSON.stringify(whiteList));
		whiteList = this.getWhiteList();
		return status;
	},

	removeBlackList: function(domain) {
		var status = false;
		var blackList = this.getBlackList();
		
		if(blackList) {
			var num = blackList.length;

			for (var i = 0; i < num; i++) {
				if(domain.indexOf(blackList[i]) == 0) {
					blackList.splice(i, 1);
					status = true;
				}
			}
		}

		LIBRARY.save('blackList', JSON.stringify(blackList));
		blackList = this.getWhiteList();
		return status;
	},

	urlDomain: function(href) {
		var a = document.createElement('a');
		a.href = href;
		return a.hostname;
	},
	
	setTimeDisable: function(sec) {
		var nowDate = new Date().getTime();
		var disTime = nowDate + sec * 1000;
		
		LIBRARY.save('disableTime', disTime);
	},

	getTimeDisable: function() {
		return LIBRARY.load('disableTime') ? LIBRARY.load('disableTime') : 0;
	},

	getViewbilityIcon: function() {
		return LIBRARY.load('hideIcon') ? LIBRARY.load('hideIcon') : 'false';
	},

	setViewbilityIcon: function(status) {
		LIBRARY.save('hideIcon', status);
	},

	checkTimeDisable: function() {
		return new Date().getTime() < this.getTimeDisable();
	},

	getURLParameter: function(url, name) {
		return decodeURI(
			(RegExp(name + '=' + '(.+?)(&|$)').exec(url)||[,null])[1]
		);
	},

	getTotalBlock: function() {
		return LIBRARY.load('totalBlock') ? LIBRARY.load('totalBlock') : 0;
	},

	addTotalBlock: function() {
		LIBRARY.save('totalBlock', LIBRARY.load('totalBlock')*1 + 1);
	},

	iconRed: function() {
		chrome.browserAction.setIcon({
			path: '../images/icon-19-red.png'
		});
	},

	iconBlack: function() {
		chrome.browserAction.setIcon({
			path: '../images/icon-19.png'
		});
	},

	iconGrey: function() {
		chrome.browserAction.setIcon({
			path: '../images/icon-19-grey.png'
		});
	},

	iconFlashForPasswd: function() {
		if(!LIBRARY.load('password')) {
			var scope = this;
			window.setTimeout(function() {
				scope.iconRed();
			}, 500);
			window.setTimeout(function() {
				scope.iconBlack();
				scope.iconFlashForPasswd();
			}, 1000)
		}
	},

	iconFlashForRequest: function(count) {
		count = count || 1;

		if(this.getViewbilityIcon() === 'false') {
			if(count <= 3) {
				var scope = this;
				window.setTimeout(function() {
					scope.iconRed();
				}, 500);
				window.setTimeout(function() {
					scope.iconBlack();
					scope.iconFlashForRequest(++count);
				}, 1000);
			}
		}
	},
	
	iconFlashForDisable: function() {
		if(LIBRARY.load('disablePluginStatus') === 'true') {
			var scope = this;
			window.setTimeout(function() {
				scope.iconRed();
			}, 500);
			window.setTimeout(function() {
				scope.iconBlack();
				scope.iconFlashForDisable();
			}, 1000)
		}
	},

	iconDisable: function() {
		if(this.getViewbilityIcon() === 'false') {
			if(this.checkTimeDisable()) {
				var scope = this;
				this.iconGrey();
				window.setTimeout(function() {
					scope.iconDisable();
				}, 1500);
			}else {
				this.iconBlack();
			}
		} else {
			this.hideIcon();
		}
	},

	hideIcon: function() {
		chrome.browserAction.setIcon({
			path: '../images/_.png'
		});
		chrome.browserAction.disable();
		this.setViewbilityIcon('true');
	},
	
	showIcon: function() {
		this.setViewbilityIcon('false');
		chrome.browserAction.enable();
		this.iconDisable();
	},

	validateEmail: function(email) { 
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	},
	
	padLeft: function(num, base, chr) {
		var  len = (String(base || 10).length - String(num).length)+1;
		return len > 0 ? new Array(len).join(chr || '0')+num : num;
	},
	
	compareDate: function(date){
		return [this.padLeft((date.getMonth()+1)),
		   this.padLeft(date.getDate()),
		   date.getFullYear()].join('/') +' ' +
		  [this.padLeft(date.getHours()),
		   this.padLeft(date.getMinutes()),
		   this.padLeft(date.getSeconds())].join(':');
	}, 
	
	reloadAllTabs: function() {
		chrome.windows.getAll(null, function(wins) {
			for (var j = 0; j < wins.length; ++j) {
				chrome.tabs.getAllInWindow(wins[j].id, function(tabs) {
				  for (var i = 0; i < tabs.length; ++i) {
					if (tabs[i].url.indexOf("http://") >= 0 || tabs[i].url.indexOf("https://") >= 0) {
							chrome.tabs.reload(tabs[i].id, {}, function(){})
						}
				  }
				});
			}
		});
	},

	toBase64: function(str) {
		return btoa(str);
	},

	fromBase64: function(str) {
		return atob(str);
	},
	
	configUpdater: function(url, callback) {
		var lastUpdate = LIBRARY.load('lastUpdateConfig');
		var timeNow = new Date;
		
		if (lastUpdate) {
			var nextUpdate = new Date(parseInt(lastUpdate)).setDate(new Date(parseInt(lastUpdate)).getDate() + 1);
			
			if (timeNow > nextUpdate) {
				this.loadConfig(url, callback);
			} else {
				this.updaterChecker(url, callback, nextUpdate - Date.now());
			}
		} else {
			this.loadConfig(url, callback);
		}
	},
	
	updaterChecker: function(url, callback, updateTime) {
		var self = this;
	
		this.updaterInterval = setTimeout(function() {
			self.configUpdater(url, callback);
		}, updateTime);
	},
};