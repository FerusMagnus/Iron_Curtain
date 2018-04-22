$('#text1').html(Localization('optionsPage.text1') + $('#text1').html());
$('#text2').html(Localization('optionsPage.text2') + $('#text2').html());
$('#text3').html(Localization('optionsPage.text3') + $('#text3').html());
$('#text4').html(Localization('optionsPage.text4') + $('#text4').html());
$('#text5').html(Localization('optionsPage.text5') + $('#text5').html());
$('#text6').html(Localization('optionsPage.text6') + $('#text6').html());
$('#text7').html(Localization('optionsPage.text7') + $('#text7').html());
$('#text8').html(Localization('optionsPage.text8') + $('#text8').html());
$('#change-pass').html(Localization('optionsPage.text9') + $('#change-pass').html());
$('#text10').html(Localization('optionsPage.text10') + $('#text10').html());
$('#text11').html(Localization('optionsPage.text11') + $('#text11').html());


getWhiteList();
getBlackList();

$('#black-list').on('click', 'a.icon-delete', function (e) {
    e.preventDefault();
    var url = $(this).attr('data-url');

    UTILS.removeBlackList(url);
    getBlackList();
    return false;
});

$('#white-list').on('click', 'a.icon-delete', function (e) {
    e.preventDefault();
    var url = $(this).attr('data-url');

    UTILS.removeWhiteList(url);
    getWhiteList();
    return false;
});

function getWhiteList() {
    var ul = $('#white-list');
    var whiteList = UTILS.getWhiteList();
    var list = '';
    var num = whiteList.length;

    for (var i = 0; i < num; i++) {
        list += '<li>' + whiteList[i] + '<a href="" title="Delete" data-url="' + whiteList[i] + '" class="icon-delete"><i title="Удалить" class="glyphicon glyphicon-remove text-danger"></i></a></li>'
    }

    ul.empty();
    ul.append(list);
}

$('#change-pass').bind('click', function () {
    var oldpass = $('#oldpass').val();
    var pass1 = $('#pass1').val();
    var pass2 = $('#pass2').val();
    var verif = (LIBRARY.load('password') == oldpass);

    if (verif && pass1 && (pass1 == pass2)) {
        LIBRARY.save('password', pass1);
        alert(Localization('optionsPage.js.text1'));
    } else {
        alert(Localization('optionsPage.js.text2'));
    }

    return false;
});

$('#hidaIcon').bind('change', function () {
    var el = $(this)
    var status = el.prop('checked');

    if (status) {
        UTILS.hideIcon();
    } else {
        UTILS.showIcon();
    }
});

$('#hidaIcon').prop('checked', UTILS.getViewbilityIcon() === 'true' ? true : false);

function getBlackList() {
    var ul = $('#black-list');
    var blackList = UTILS.getBlackList();
    var list = '';
    var num = blackList.length;

    for (var i = 0; i < num; i++) {
        list += '<li>' + blackList[i] + '<a href="" title="Delete" data-url="' + blackList[i] + '" class="icon-delete"><i title="Удалить" class="glyphicon glyphicon-remove text-danger"></i></a></li>'
    }

    ul.empty();
    ul.append(list);
}

function Localization(key) {
    var newKey = key.replace(/\./img, '_');

    return chrome.i18n.getMessage(newKey);
}