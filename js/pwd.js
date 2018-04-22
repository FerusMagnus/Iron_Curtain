$('#text1').html(Localization('blockPage.text1') + $('#text1').html());
$('#text2').html(Localization('blockPage.text2') + $('#text2').html());

var passCallback = function() {
	var path = chrome.runtime.getURL("html/options.html");
	document.location.replace(path);
}

$("#options-panel").click(function(e){
	if(e.target.id.indexOf('bad_world') >= 0 && $('#badWords blockquote').is(":visible")) return false;
	
	$('#input-pass').val('');
	$('#modal').modal('show');
});

$("#pwd-submit").bind('click', function() {
	var pass = $('#input-pass').val();
	checkPassword(pass, passCallback);
});

$('#options-panel').on('mousedown', function(e){
	e.preventDefault();
	
	passCallback = function() {
		var path = chrome.runtime.getURL("html/options.html");
		document.location.replace(path);
	}
});

$('#modal').modal({
  show: true
});


function checkPassword(pass, callback) {
	if(LIBRARY.load('password') === pass) {
		if(callback) {
			callback();
		}
	} else {
		alert(Localization('actionPopup.js.log8'));
	}
}

function Localization(key) {
	var newKey = key.replace(/\./img, '_');

	return chrome.i18n.getMessage(newKey);
}