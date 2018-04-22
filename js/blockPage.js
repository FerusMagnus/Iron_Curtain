$('#text1').html(Localization('blockPage.text1') + $('#text1').html());
$('#text2').html(Localization('blockPage.text2') + $('#text2').html());
$('#text3a b').html(Localization('blockPage.text3a') + $('#text3a b').html());
$('#text3').html(Localization('blockPage.text3') + $('#text3').html());
$('#text4').html(Localization('blockPage.text4') + $('#text4').html());
$('#addWhiteList').html(Localization('blockPage.text5') + $('#addWhiteList').html());

var url = document.location.href;
var urlblack = UTILS.fromBase64(decodeURIComponent(UTILS.getURLParameter(url, 'domain-block')));
var status = UTILS.getURLParameter(url, 'domain-status');
var urlblackProtocol = urlblack.indexOf('https') == 0 ? 'https' : 'http';
var domain = UTILS.urlDomain(urlblack);
var isSearch = UTILS.getURLParameter(url, 'isSearch');
var badWords = LIBRARY.msgBackground({
    action: 'getInfoBlockPage'
}, function (data) {
    if (typeof (data) !== 'null') $('#badWords blockquote').html(data.badWords);
    $('#bad_world').show();
});
var configsPromo = LIBRARY.msgBackground({
    action: 'getConfig'
}, function (data) {
    configsPromo = data.r;
    loadPromo();
});

if (isSearch !== 'null') {
    $('#options-panel').hide();
}

$("#addWhiteList, #options-panel, #text3a").click(function (e) {
    if (e.target.id.indexOf('bad_world') >= 0 && $('#badWords blockquote').is(":visible")) return false;

    $('#input-pass').val('');
    $('#modal').modal('show');
});

$("#pwd-submit").bind('click', function () {
    var pass = $('#input-pass').val();
    checkPassword(pass, passCallback);
})


$('#addWhiteList').bind('click', function () {
    passCallback = function () {
        UTILS.removeBlackList(domain);
        UTILS.addWhiteList(domain);

        if (isSearch !== 'null') {} else {
            setTimeout(function () {
                window.location.replace(urlblack)
            }, 700);
        }
    }
});

$('#options-panel').on('mousedown', function (e) {
    e.preventDefault();

    passCallback = function () {
        chrome.tabs.create({
            url: chrome.runtime.getURL("html/options.html")
        });
    }
});

$('#text3a').bind('click', function (e) {
    e.preventDefault();

    if ($('#badWords blockquote').is(":visible")) {
        $('#badWords').slideToggle();
    } else {
        passCallback = function () {
            $('#badWords').slideToggle();
        };
    }
});

function checkPassword(pass, callback) {
    if (LIBRARY.load('password') === pass) {
        if (callback) {
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