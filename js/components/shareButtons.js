var ShareButtons = ShareButtons || ( function () {

    var $facebook, $twitter, $google, $pinterest, $left, _curIndex;

    function show(curIndex) {
        _curIndex = curIndex;

        if ($left == null) {
            $facebook = $('#share-fbt');
            $twitter = $('#share-tbt');
            $google = $('#share-gbt');
            $pinterest = $('#share-pbt');
            $left = $('#left');
        }

        TweenLite.to($facebook, 0, {
            css:{"marginLeft":-70}
        });
        TweenLite.to($twitter, 0, {
            css:{"marginLeft":-70}
        });
        TweenLite.to($google, 0, {
            css:{"marginLeft":-70}
        });
        TweenLite.to($pinterest, 0, {
            css:{"marginLeft":-70}
        });
        TweenLite.to($facebook, .3, {
            delay:0.1,
            css:{"marginLeft":0},
            ease:Back.easeOut
        });
        TweenLite.to($twitter, .3, {
            delay:0.2,
            css:{"marginLeft":0},
            ease:Back.easeOut
        });
        TweenLite.to($google, .3, {
            delay:0.3,
            css:{"marginLeft":0},
            ease:Back.easeOut
        });
        TweenLite.to($pinterest, .3, {
            delay:0.4,
            css:{"marginLeft":0},
            ease:Back.easeOut
        });

        $left.show();

        $facebook.on('click', onFacebook);
        $twitter.on('click', onTwitter);
        $google.on('click', onGoogle);
        $pinterest.on('click', onPinterest);
    }


    function hide() {
        $facebook.off('click', onFacebook);
        $twitter.off('click', onTwitter);
        $google.off('click', onGoogle);
        $pinterest.off('click', onPinterest);

        TweenLite.to($facebook, .3, {
            css:{"marginLeft":-70},
            ease:Back.easeIn
        });
        TweenLite.to($twitter, .3, {
            delay:0.1,
            css:{"marginLeft":-70},
            ease:Back.easeIn
        });
        TweenLite.to($google, .3, {
            delay:0.2,
            css:{"marginLeft":-70},
            ease:Back.easeIn
        });
        TweenLite.to($pinterest, .3, {
            delay:0.3,
            css:{"marginLeft":-70},
            ease:Back.easeIn
        });
    }

    function remove() {
        $facebook.off('click', onFacebook);
        $twitter.off('click', onTwitter);
        $google.off('click', onGoogle);
        $pinterest.off('click', onPinterest);

        TweenLite.killTweensOf($facebook);
        TweenLite.killTweensOf($twitter);
        TweenLite.killTweensOf($google);
        TweenLite.killTweensOf($pinterest);
        TweenLite.to($facebook, 0, {
            css:{"marginLeft":-70}
        });
        TweenLite.to($twitter, 0, {
            css:{"marginLeft":-70}
        });
        TweenLite.to($google, 0, {
            css:{"marginLeft":-70}
        });
        TweenLite.to($pinterest, 0, {
            css:{"marginLeft":-70}
        });
    }

    function onFacebook() {
        var poster = CMDetect.SITE_URL + ConfigModel.configArr[_curIndex].poster.img + '_t.jpg',
            title = CMDetect.SITE_TITLE + " - " + ConfigModel.configArr[_curIndex].poster.title,
            url = CMDetect.SITE_URL + "#!/section/" + ConfigModel.configArr[_curIndex].poster.id,
            php_url = CMDetect.SITE_URL + "share.php?url=" + encodeURIComponent(url) +
                "&title=" + encodeURIComponent(title) +
                "&poster=" + encodeURIComponent(poster),

            share_url = "https://www.facebook.com/dialog/feed?app_id=" + CMDetect.APP_ID +
            "&link=" + encodeURIComponent(php_url) +
            "&picture=" + encodeURIComponent(poster) +
            "&name=" + encodeURIComponent(title) +
            "&caption=" + encodeURIComponent(url) +
            "&description=" + encodeURIComponent(CMDetect.SITE_DES) +
            "&redirect_uri=" + encodeURIComponent(CMDetect.SITE_URL + "close.html") +
            "&display=popup";
        CMUtiles.openPopup(share_url, "", 600, 500);
    }

    function onTwitter() {
        var title = CMDetect.SITE_TITLE + " - " + ConfigModel.configArr[_curIndex].poster.title,
            url = CMDetect.SITE_URL + "#!/section/" + ConfigModel.configArr[_curIndex].poster.id,
            share_url = "http://twitter.com/share?url=" + encodeURIComponent(url) + "&text=" + encodeURIComponent(title);
        CMUtiles.openPopup(share_url, "", 600, 260);
    }

    function onGoogle() {
        var poster = CMDetect.SITE_URL + ConfigModel.configArr[_curIndex].poster.img + '_t.jpg',
            title = CMDetect.SITE_TITLE + " - " + ConfigModel.configArr[_curIndex].poster.title,
            url = CMDetect.SITE_URL + "#!/section/" + ConfigModel.configArr[_curIndex].poster.id,
            php_url = CMDetect.SITE_URL + "share.php?url=" + encodeURIComponent(url) +
                "&title=" + encodeURIComponent(title) +
                "&poster=" + encodeURIComponent(poster),
            share_url = "https://plus.google.com/share?url=" + encodeURIComponent(php_url);
        CMUtiles.openPopup(share_url, "", 600, 400);
    }

    function onPinterest() {
        var poster = CMDetect.SITE_URL + ConfigModel.configArr[_curIndex].poster.img + '_b.jpg',
            title = CMDetect.SITE_TITLE + " - " + ConfigModel.configArr[_curIndex].poster.title,
            url = CMDetect.SITE_URL + "#!/section/" + ConfigModel.configArr[_curIndex].poster.id,

            share_url = 'http://pinterest.com/pin/create/button/?url=' + encodeURIComponent(url)
            + '&media=' + encodeURIComponent(poster)
            + '&description=' + encodeURIComponent(title);
        CMUtiles.openPopup(share_url, "", 700, 300);
    }


    return {
        show: show,
        hide: hide,
        remove: remove
    }

} )();
