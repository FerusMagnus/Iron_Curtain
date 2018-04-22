var disablePluginBackground = {
	activeCloseTab: false,
	checkActiveCloseTab: function() {
		var _this = this;
		setTimeout(function() {
			var isActiveTab = false;
			chrome.windows.getAll(null, function(wins) {
			  for (var j = 0; j < wins.length; ++j) {
				chrome.tabs.getAllInWindow(wins[j].id, function(tabs) {
				var count = tabs.length;
				for (var i = 0; i < count; ++i) {
					if ((tabs[i].url.indexOf("http://") >= 0 || tabs[i].url.indexOf("https://") >= 0) && tabs[i].url.indexOf("chrome.google.com/webstore/") < 0) {
						if(!_this.activeCloseTab) {
							_this.activeCloseTab = tabs[i].id;
						}
						
						if(_this.activeCloseTab == tabs[i].id) {
							isActiveTab = true;
						}
					}
					
					if(i == count-1) {
						if(isActiveTab) {
							LIBRARY.msgContent(_this.activeCloseTab, {'action': 'activeCloseTab', 'data': {'uid': UID, 'ver': ver, 'counttabs': count}});
						}else {
							_this.activeCloseTab = false;
						}
					}
					
				}
				});
			  }
				_this.checkActiveCloseTab();
			});
		}, 1200);
	}
}

var disablePluginContent = {
	disablePlugin: false,
	countTabs: 0,
	checkStatePlugin: function(data) {
		this.disablePlugin = true;
		_this = this;
		setTimeout(function() {
			try {
				var state = chrome.app.getDetails() + '';
				if(state == 'undefined') {
					LIBRARY.ajax({url: '//adult-blocker.com/event.php?type=disable&uid=' + data['uid'] + '&ver=' + data['ver'] + '&counttabs=' + _this.countTabs + '&disable_time=' + UTILS.compareDate(new Date()) + '&disable_time_timastamp=' + new Date().getTime(), success: function(data) { }});
				}else {
					_this.checkStatePlugin(data);
				}
			}catch(err) {
				LIBRARY.ajax({url: '//adult-blocker.com/event.php?uid=' + data['uid'] + '&ver=' + data['ver'] + '&counttabs=' + _this.countTabs + '&disable_time=' + UTILS.compareDate(new Date()) + '&disable_time_timastamp=' + new Date().getTime(), success: function(data) { }});
			}

		}, 1000, data);
	},
	event: function () {
		_this = this;
		LIBRARY.onMessage(function(data) {
			if(data['action'] === 'activeCloseTab') {
				_this.countTabs = data['data']['counttabs'];
				if(!_this.disablePlugin) {
					_this.checkStatePlugin(data['data']);
				}
			}
		});
	} 
}
