$('#site').html(chrome.i18n.getMessage("actionPopup_site") + $('#site').html());
$('#status').html(chrome.i18n.getMessage("actionPopup_status") + $('#status').html());
$('#exception').html(chrome.i18n.getMessage("actionPopup_exception") + $('#exception').html());
$('#enter_in').html(chrome.i18n.getMessage("actionPopup_enter_in") + $('#enter_in').html());
$('#addBlackList').html(chrome.i18n.getMessage("actionPopup_black_list") + $('#addBlackList').html());
$('#addWhiteList').html(chrome.i18n.getMessage("actionPopup_white_list") + $('#addWhiteList').html());
$('#mode_work').html(chrome.i18n.getMessage("actionPopup_mode_work") + $('#mode_work').html());
$('#status-plugin').html(chrome.i18n.getMessage("actionPopup_enable") + $('#status-plugin').html());
$('#change_mode').html(chrome.i18n.getMessage("actionPopup_change_mode") + $('#change_mode').html());
$('#enable_plugin').html(chrome.i18n.getMessage("actionPopup_enable_plugin") + $('#enable_plugin').html());
$('#disable_10_min').html(chrome.i18n.getMessage("actionPopup_disable_10_min") + $('#disable_10_min').html());
$('#disable_30_min').html(chrome.i18n.getMessage("actionPopup_disable_30_min") + $('#disable_30_min').html());
$('#disable_60_min').html(chrome.i18n.getMessage("actionPopup_disable_60_min") + $('#disable_60_min').html());
$('#locked_request').html(chrome.i18n.getMessage("actionPopup_locked_request") + $('#locked_request').html());

$('#text1').html(Localization('passwordPage.text1') + $('#text1').html());
$('#submit').html(Localization('passwordPage.text4') + $('#submit').html());
document.getElementById('input-pwd1').setAttribute('placeholder', Localization('passwordPage.text2'));
document.getElementById('input-pwd2').setAttribute('placeholder', Localization('passwordPage.text3'));

if (LIBRARY.load('disablePluginStatus') === 'true') {
    var disableData = JSON.parse(LIBRARY.load('disablePluginData'));
    var disableSaveLastId = LIBRARY.load('disablePluginLastId');
    var li = '';

    for (var i = 0; i < disableData.length; i++) {
        var disableTime = disableData[i]['disable_time'];
        var disableId = disableData[i]['id'];
    }

    $('#disable-time').html(li);
    $('.modal').css('top', 70);
    $('#disable-block').show();
} 
else if (LIBRARY.load('password')) {
    $('#main-block').show();
} 
else {
    $('#password-block').show();
}

//PASSWORD PAGE
$('#submit').bind('click', function () {
    var validate = true;
    var pwd1 = $('#input-pwd1').val();
    var pwd2 = $('#input-pwd2').val();
    var email = $('#input-email').val();

    if (email) {
        if (UTILS.validateEmail(email)) {
            LIBRARY.save('email', email);
        } else {
            validate = false;
            alert('Email incorrect');
        }
    }

    if (pwd1 && (pwd1 == pwd2)) {
        LIBRARY.save('password', pwd1);
    } else {
        validate = false;
        alert(Localization('passwordPage.alert'));
    }

    if (validate) {
        $('#password-block').hide();
        $('#main-block').show();
    }

    return false;
});

$('#toggle-email').bind('click', function () {
    var el = $(this);
    var span = $(this).find('span');

    if (span.hasClass('glyphicon-chevron-down')) {
        span.removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
        $('#email-notification').slideDown();
    } else {
        span.removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
        $('#email-notification').slideUp();
    }
})

var tabId = '',
    tabUrl = '',
    tabTitle = '';
var domain, urlblack, passCallback;
var status = 1;

var statusLog = {
    1: Localization('actionPopup.js.log1'),
    2: '<span class="text-danger">' + Localization('actionPopup.js.log2') + '<span>',
    3: '<span class="text-danger">' + Localization('actionPopup.js.log3') + '<span>',
    4: '<span class="text-success">' + Localization('actionPopup.js.log4') + '<span>',
    5: '<span class="text-danger">' + Localization('actionPopup.js.log5') + '<span>'
}

chrome.tabs.getSelected(null, function (tab) {
    tabId = tab.id;
    tabUrl = tab.url;
    tabTitle = tab.title;

    var pageBlock = /domain-block=/.test(tabUrl) ? true : false;
    
    if (pageBlock) {
        urlblack = UTILS.fromBase64(decodeURIComponent(getURLParameter(tabUrl, 'domain-block')));
        status = getURLParameter(tabUrl, 'domain-status');
        domain = UTILS.urlDomain(urlblack);
        $('#site-insert').text(domain);
    } 
    else if (tabTitle == 'Iron Curtain Control') {
        domain = UTILS.urlDomain(tabUrl);
        status = 5;
    } 
    else {
        domain = UTILS.urlDomain(tabUrl);
    }

    if (UTILS.checkWhiteList(domain)) {
        status = 4;
    }
    $('#site-insert').text(domain);
    $('#status-insert').html(statusLog[status]);
    $('#total').text(UTILS.getTotalBlock());
});

/* $('#btn_promo').attr('href', $('#btn_promo').attr('href') + '?uid=' + UTILS.getUserID() + '&ver=' + UTILS.getVer()); */

checkDisablePlugin();

//DISABLE PLUGIN PAGE
$('#submit-disable').bind('click', function () {
    passCallback = function () {
        LIBRARY.save('disablePluginStatus', 'false');
        LIBRARY.save('disablePluginLastId', disableData[0]['id']);
        setTimeout(function () {
            window.location.reload();
        }, 200);
    };

    return false;
});

$('#addBlackList').bind('click', function () {
    passCallback = function () {
        UTILS.removeWhiteList(domain);
        UTILS.addBlackList(domain);
        chrome.tabs.reload(tabId);
        setTimeout(function () {
            window.location.reload();
        }, 1000);
    };
});

$('#addWhiteList').bind('click', function () {
    passCallback = function () {
        UTILS.removeBlackList(domain);
        UTILS.addWhiteList(domain);
        chrome.tabs.update(tabId, {
            url: urlblack
        });
        setTimeout(function () {
            window.location.reload();
        }, 1000);
    };
})

$(".control a:eq(0)").click(function () {
    passCallback = function () {
        UTILS.setTimeDisable(-10);
        LIBRARY.msgBackground({
            action: 'iconStatus'
        }, function (data) {});
        setTimeout(function () {
            window.location.reload();
        }, 200);
    };
});

$(".control a:eq(1)").click(function () {
    passCallback = function () {
        UTILS.setTimeDisable(600);
        LIBRARY.msgBackground({
            action: 'iconStatus'
        }, function (data) {});
        setTimeout(function () {
            window.location.reload();
        }, 200);
    };
});

$(".control a:eq(2)").click(function () {
    passCallback = function () {
        UTILS.setTimeDisable(1800);
        LIBRARY.msgBackground({
            action: 'iconStatus'
        }, function (data) {});
        setTimeout(function () {
            window.location.reload();
        }, 200);
    };
});

$(".control a:eq(3)").click(function () {
    passCallback = function () {
        UTILS.setTimeDisable(3600);
        LIBRARY.msgBackground({
            action: 'iconStatus'
        }, function (data) {});
        setTimeout(function () {
            window.location.reload();
        }, 200);
    };
});

$('#options-panel').on('mousedown', function (e) {
    passCallback = function () {
        chrome.tabs.create({
            url: chrome.runtime.getURL("html/options.html")
        });
    };
});

$(".control a, #addBlackList, #addWhiteList, #options-panel, #submit-disable").click(function () {
    $('#input-pass').val('');
    $('#modal').modal('show');
});

$("#pwd-submit").bind('click', function () {
    var pass = $('#input-pass').val();
    checkPassword(pass, passCallback);
});

function checkDisablePlugin() {
    if (UTILS.checkTimeDisable()) {
        var disTime = UTILS.getTimeDisable() * 1;
        var now = new Date().getTime();
        var min = Math.round((disTime - now) / (1000 * 60));

        $(".eye i").removeClass("glyphicon-eye-ok").addClass("glyphicon-eye-close red");
        $('#status-plugin').text(Localization('actionPopup.js.log6') + ' ' + min + Localization('actionPopup.js.log7'));
    }
}

function getURLParameter(url, name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(url) || [, null])[1]
    );
}

function Localization(key) {
    var newKey = key.replace(/\./img, '_');

    return chrome.i18n.getMessage(newKey);
}

function checkPassword(pass, callback) {
    if (LIBRARY.load('password') === pass) {
        if (callback) {
            callback();
        }
    } else {
        alert(Localization('actionPopup.js.log8'));
    }
}