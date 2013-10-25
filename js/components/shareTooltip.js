var ShareTooltip = ShareTooltip || ( function () {

    var _isShow, $share, $html = '<div id="foot-share-box">'+
        '<div id="foot-share-0" class="foot-share-item"></div>'+
        '<div id="foot-share-1" class="foot-share-item"></div>'+
        '<div id="foot-share-2" class="foot-share-item"></div>'+
        '<div id="foot-share-3" class="foot-share-item"></div>'+
        '<div id="foot-share-4" class="foot-share-item"></div>'+
        '<div id="foot-share-5" class="foot-share-item"></div></div>';


    function init() {
        _isShow = false;
        $share = $('#foot-sharecon');
        $share.html($html);
        $('#foot-share-box').on('mouseenter', shareOver).on('mouseleave', shareOut);

        $('#foot-share-0').on('click', onShare0);
        $('#foot-share-1').on('click', onShare1);
        $('#foot-share-2').on('click', onShare2);
        $('#foot-share-3').on('click', onShare3);
        $('#foot-share-4').on('click', onShare4);
        $('#foot-share-5').on('click', onShare5);
    }

    function onShare0() {
        var share_url = "https://www.facebook.com/dialog/feed?app_id=" + CMDetect.APP_ID +
                "&link=" + encodeURIComponent(CMDetect.SITE_URL) +
                "&picture=" + encodeURIComponent(CMDetect.SITE_URL + "images/share.jpg") +
                "&name=" + encodeURIComponent(CMDetect.SITE_TITLE) +
                "&caption=" + encodeURIComponent(CMDetect.SITE_URL) +
                "&description=" + encodeURIComponent(CMDetect.SITE_DES) +
                "&redirect_uri=" + encodeURIComponent(CMDetect.SITE_URL + "close.html") +
                "&display=popup";
        CMUtiles.openPopup(share_url, "", 600, 500);
    }
    function onShare1() {
        var share_url = "http://twitter.com/share?url=" + encodeURIComponent(CMDetect.SITE_URL) +
            "&text=" + encodeURIComponent("Form Follows Function - FFF is a collection of interactive experiences.");
        CMUtiles.openPopup(share_url, "", 600, 260);
    }
    function onShare2() {
        var share_url = "https://plus.google.com/share?url=" + encodeURIComponent(CMDetect.SITE_URL);
        CMUtiles.openPopup(share_url, "", 600, 400);
    }
    function onShare3() {
        var share_url = 'http://pinterest.com/pin/create/button/?url=' + encodeURIComponent(CMDetect.SITE_URL)
                + '&media=' + encodeURIComponent(CMDetect.SITE_URL + "images/share.jpg")
                + '&description=' + encodeURIComponent(CMDetect.SITE_DES);
        CMUtiles.openPopup(share_url, "", 700, 300);
    }
    function onShare4() {
        var share_url = "http://www.tumblr.com/share/link?url=" + encodeURIComponent(CMDetect.SITE_URL)
                + "&name=" + encodeURIComponent(CMDetect.SITE_TITLE)
                + "&description=" + encodeURIComponent(CMDetect.SITE_DES);
        CMUtiles.openPopup(share_url, "", 450, 450);
    }
    function onShare5() {
        var share_url = "http://delicious.com/save?url=" + encodeURIComponent(CMDetect.SITE_URL) +
            "&title=" + encodeURIComponent(CMDetect.SITE_TITLE);
        CMUtiles.openPopup(share_url, "", 600, 550);
    }

    function show() {
        if (_isShow) return;
        _isShow = true;
        $share.show();
        TweenLite.killTweensOf($share);
        TweenLite.to($share, 0.4, {
            css:{'height':118},
            ease:Expo.easeOut
        });
    }

    function hide() {
        if (!_isShow) return;
        _isShow = false;
        TweenLite.killTweensOf($share);
        TweenLite.to($share, 0.25, {
            css:{'height':0},
            ease:Cubic.easeIn,
            onComplete: endHide
        });
    }

    function endHide() {
        $share.hide();
    }

    function shareOver() {
        show();
    }
    function shareOut() {
        hide();
    }

    return {
        init: init,
        show: show,
        hide: hide
    }

} )();
