var Address = Address || ( function () {
    
    var _public = {
        app:null,
        curURL: null,
        prevURL: null,
        curSection: "",
        curScreenSaver: "",
        URL_HOME : "main",
        URL_SECTION : "section",
        URL_ABOUT : "about",
        URL_SCREENSAVER : "screensaver"
    };


    var $root, $popup, $preloader, $preloaderTxt, loadingObj = {no:0}, $block, _isAble = true, _isTouch = CMDetect.isTouch,
        $header, $footer, $about, $screensaver, $share, $full, $close, $circle, $facebook, $twitter, $google, $pinterest,
        _isBlackTop = 1, _isBlackLeft = 1, _isClick = false, _savedUrl=  "", _curFwa = 0,
        $footWeb = '<div id="foot-sharecon"></div><div id="foot-bigcon"><div id="foot-web-about">about this website</div><div id="foot-dot-big"></div><div id="foot-web-screen">screen saver</div></div><div id="foot-smallcon"><div id="foot-share" class="foot-share-full">share</div><div id="foot-dot"></div><div id="foot-full" class="foot-full-full">fullscreen</div></div>',
        $footWebIE = '<div id="foot-sharecon"></div><div id="foot-bigcon"><div id="foot-web-about">about this website</div><div id="foot-dot-big"></div><div id="foot-web-screen">screen saver</div></div><div id="foot-smallcon"><div id="foot-share-ie">share to sns</div></div>',
        $footTouch = '<div id="foot-touch" class="disable-tabcolor">about this website</div>',
        $firstLoader = '<div id="loader"><div id="loading-txt">LOADING&nbsp;&nbsp;<span id="loading-num">0</span>%</div></div>';


    function init(){
        Address.app = $.sammy(function() {
            this.get('#!/main/', function () {
                Address.run(_public.URL_HOME, "");
            });
            this.get("#!/:node1/:node2", function(){
                Address.run(this.params['node1'], this.params['node2']);
                return false;
            });
            this.get("#!/:node", function(){
                Address.run(this.params['node'], "")
            });
            return false;
        });

        $preloader = $("#preloader");

        $block = document.getElementById("block");
        $header = $('#header');
        $footer = $('#footer');
        $close = $('#close-bt');
        $circle = $('#circleCon');
        $facebook = $('#share-fbt');
        $twitter = $('#share-tbt');
        $google = $('#share-gbt');
        $pinterest = $('#share-pbt');
        $root = document.getElementById("root");



        if (_isTouch) {
            $footer.html($footTouch);
            $about = $('#foot-touch');
            $("#root").append($firstLoader + '<div id="popup"><div id="guidepopup"></div></div>');
            $popup = $('#popup');
        } else {

            $("#root").append($firstLoader);

            if (CMDetect.browserName == "ie") {
                $footer.html($footWebIE);
                $share = $('#foot-share-ie');
            } else {
                $footer.html($footWeb);
                $share = $('#foot-share');
            }
            $about = $('#foot-web-about');
            $screensaver = $('#foot-web-screen');
            $screensaver.on('click', clickScreenSaver);
            $full = $('#foot-full');
            $share.on('mouseenter', shareOver).on('mouseleave', shareOut);
            $full.on('click', onFull);
            ShareTooltip.init();
        }

        $preloaderTxt = $('#loading-num');

        $about.on('click', goAbout);

        if (CMDetect.cssHead == "Webkit") {
            document.addEventListener("webkitfullscreenchange", function () {
                if (document.webkitIsFullScreen) {
                    setFull();
                } else {
                    setNormal();
                }
            }, false);
        } else {
            document.addEventListener("mozfullscreenchange", function () {
                if (document.mozFullScreen) {
                    setFull();
                } else {
                    setNormal();
                }
            }, false);
        }

        Address.app.run('#!/' + _public.URL_HOME);

        _curFwa = 0;
        $("#root").append('<div id="fwa"><div id="fwa-sotd"></div><div id="fwa-adobe"></div><div id="fwa-motd"></div></div>');
        $("#fwa").on('click', onClickFwa);
        setTimeout(onFwa, 7000);
    }

    function onFwa() {
        _curFwa = _curFwa + 1;
        if (_curFwa > 2) _curFwa = 0;

        if (CMDetect.isTransition) {
            if (_curFwa == 0) {
                $("#fwa-motd").removeClass("show-fwa").addClass("hide-fwa");
                $("#fwa-sotd").removeClass("hide-fwa").addClass("show-fwa");
            } else if (_curFwa == 1) {
                $("#fwa-sotd").removeClass("show-fwa").addClass("hide-fwa");
                $("#fwa-adobe").removeClass("hide-fwa").addClass("show-fwa");
            } else {
                $("#fwa-adobe").removeClass("show-fwa").addClass("hide-fwa");
                $("#fwa-motd").removeClass("hide-fwa").addClass("show-fwa");
            }
        } else {
            if (_curFwa == 0) {
                TweenLite.to($('#fwa-motd'),.5, {
                    css:{opacity:0},
                    ease:Sine.easeIn
                });
                TweenLite.to($('#fwa-sotd'),.5, {
                    css:{opacity:1},
                    ease:Sine.easeOut
                });
            } else if (_curFwa == 1) {
                TweenLite.to($('#fwa-sotd'),.5, {
                    css:{opacity:0},
                    ease:Sine.easeIn
                });
                TweenLite.to($('#fwa-adobe'),.5, {
                    css:{opacity:1},
                    ease:Sine.easeOut
                });
            } else {
                TweenLite.to($('#fwa-adobe'),.5, {
                    css:{opacity:0},
                    ease:Sine.easeIn
                });
                TweenLite.to($('#fwa-motd'),.5, {
                    css:{opacity:1},
                    ease:Sine.easeOut
                });
            }
        }

        setTimeout(onFwa, 7000);
    }

    function onClickFwa() {
        if (_curFwa == 0) {
            window.open("http://www.thefwa.com/site/form-follows-function");
        } else if (_curFwa == 1) {
            window.open("http://www.thefwa.com/adobe/tcea/form-follows-function");
        } else {
            window.open("http://www.thefwa.com/mobile/form-follows-function");
        }
    }

    function onFull() {
        if ($root.webkitRequestFullscreen) {
            if (document.webkitIsFullScreen) {
                document.webkitCancelFullScreen();
                setNormal();
            } else {
                $root.webkitRequestFullscreen();
                setFull();
            }
        } else if ($root.mozRequestFullScreen) {
            if (document.mozFullScreen) {
                document.mozCancelFullScreen();
                setNormal();
            } else {
                $root.mozRequestFullScreen();
                setFull();
            }
        }
    }

    function setFull() {
        $("#foot-full").removeClass('foot-full-full').addClass('foot-full-normal');
        $("#foot-share").removeClass('foot-share-full').addClass('foot-share-normal');
    }
    function setNormal() {
        $("#foot-full").removeClass('foot-full-normal').addClass('foot-full-full');
        $("#foot-share").removeClass('foot-share-normal').addClass('foot-share-full');
    }

    function shareOver() {
        ShareTooltip.show();
    }
    function shareOut() {
        ShareTooltip.hide();
    }




    function goHome() {
        _isClick = true;
        window.location.href = '#!/' + _public.URL_HOME;
    }

    function goAbout() {
        _isClick = true;
        window.location.href = '#!/' + _public.URL_ABOUT;
    }

    function clickScreenSaver() {
        _isClick = true;
        window.location.href = '#!/' + _public.URL_SCREENSAVER + '/' + (ConfigModel.screensaverArr[0].item.id);
    }

    function goScreenSaver(id) {
        _isClick = true;
        window.location.href = '#!/' + _public.URL_SCREENSAVER + '/' + id;
    }

    function goSection(id) {
        _isClick = true;
        window.location.href = '#!/' + _public.URL_SECTION + '/' + id;
    }

    function replaceURL(url) {
        window.location.replace(url);
    }

    function run(page, section){
        if ((!_isAble && !_isClick)
            || (_public.curURL == page && _public.curURL != _public.URL_SCREENSAVER)
            || (_public.curURL == _public.URL_SCREENSAVER && _public.curURL == page && _public.curScreenSaver == section)) {

            if (_public.curURL == _public.URL_SECTION) {
                replaceURL("#!/" + _public.curURL + "/" + _public.curSection);
            } else if (_public.curURL == _public.URL_SCREENSAVER) {
                replaceURL("#!/" + _public.curURL + "/" + _public.curScreenSaver);
            } else {
                replaceURL("#!/" + _public.curURL);
            }

            return;
        }
        _isClick = false;

        unable();

        if (_isTouch && page == _public.URL_SCREENSAVER) {
            goHome();
            return;
        }


        if (_public.curURL == _public.URL_SCREENSAVER && _public.curURL == page) {
            // change screen saver
            _public.curScreenSaver = section;
            ScreenSaver.change();
            return;
        }


        _public.prevURL = _public.curURL;
        _public.curURL = page;

        if (_public.prevURL == null) {
            // first
            if (_public.curURL == _public.URL_SCREENSAVER) {
                _public.curScreenSaver = section;
            } else {
                _public.curSection = section;
            }
            _public.prevURL = _public.URL_HOME;
            loadConfig();
        } else {
            switch (_public.curURL) {
                case _public.URL_HOME:
                    if (_public.prevURL == _public.URL_SECTION) {
                        // section
                        Contents.changeHome();
                    } else if (_public.prevURL == _public.URL_ABOUT) {
                        // about
                        About.hide(Home.resume);
                        Address.blackTop();
                    } else {
                        // screen saver
                        ScreenSaver.hide(Home.resume);
                        Address.blackTop();
                    }
                    break;
                case _public.URL_SECTION:
                    _public.curSection = section;
                    if (_public.prevURL == _public.URL_HOME) {
                        // home
                        Home.changeSection(section);
                    }  else if (_public.prevURL == _public.URL_ABOUT) {
                        // about
                        About.hide(Contents.resume);
                        if (ConfigModel.isWhite == 0) {
                            Address.blackTop();
                        }
                    } else {
                        // screen saver
                        ScreenSaver.hide(Contents.resume);
                        if (ConfigModel.isWhite == 0) {
                            Address.blackTop();
                        }
                    }
                    break;
                case _public.URL_ABOUT:
                    if (_public.prevURL == _public.URL_HOME) {
                        // home
                        _savedUrl = _public.prevURL;
                        Home.pause();
                        About.show(1, 0);
                    } else if (_public.prevURL == _public.URL_SECTION) {
                        // section
                        _savedUrl = _public.prevURL;
                        Contents.pause();
                        About.show(0, 0);
                    } else {
                        // screen saver
                        ScreenSaver.changeHide();
                        TweenLite.delayedCall(.2, About.changeShow);
                    }
                    break;
                case _public.URL_SCREENSAVER:
                    _public.curScreenSaver = section;
                    if (_public.prevURL == _public.URL_HOME) {
                        // home
                        _savedUrl = _public.prevURL;
                        Home.pause();
                        ScreenSaver.show(1, 0);
                    } else if (_public.prevURL == _public.URL_SECTION) {
                        // section
                        _savedUrl = _public.prevURL;
                        Contents.pause();
                        ScreenSaver.show(0, 0);
                    } else {
                        // about
                        About.changeHide();
                        TweenLite.delayedCall(.2, ScreenSaver.changeShow);
                    }
                    break;
            }
        }
    }

    function closePopup() {
        if (_savedUrl == _public.URL_SECTION) {
            goSection(_public.curSection);
        } else {
            goHome();
        }
    }

    function loadConfig() {
        $.ajax({
            url : 'data/data.json',
            dataType : 'json'
        }).done(function(res){
            loadFirstImg(ConfigModel.init(res));
        }).fail(function(jqXHR, textStatus, errorThrown){
            ErrorMsg.show('A network error has occurred and connection has failed.<br>Please refresh the page to try again.');
        });
    }

    function loadFirstImg(arr) {
        var img_tag = arr.join("");
        $preloader.html(img_tag);
        var imgLoader = $preloader.imagesLoaded();
        imgLoader.progress( function( isBroken, $images, $proper, $broken ){
            var percent = ($proper.length + $broken.length) / $images.length;
            TweenLite.to(loadingObj, 1, {
                no:percent,
                ease: Cubic.easeOut,
                onUpdate:updateLoading
            });
        });
        imgLoader.always( function(){
            $preloader.empty();
            imgLoader = null;
        });
    }

    function updateLoading() {
        var progress = (loadingObj.no * 100) | 0;
        $preloaderTxt.html(progress);
        if (progress == 100) {
            TweenLite.to($('#loader'),.3, {
                delay:.4,
                css:{autoAlpha:0},
                ease: Cubic.easeOut
            });
            TweenLite.delayedCall(.6, endLoad);
        }
    }

    function endLoad() {
        $('#loader').remove();
        $firstLoader = null;
        Home.init();
    }

    function endFirstAnimation() {
        if (CMDetect.isIpad) {
            window.onorientationchange = function() {
                var orientation = window.orientation;
                switch(orientation) {
                    case 0:
                        /* portrait */
                        showPortrait();
                        break;
                    case 90:
                        /* landscape left */
                        hidePortrait();
                        break;
                    case -90:
                        /* landscape right */
                        hidePortrait();
                        break;
                }
            }
            window.onorientationchange();
        } else if (CMDetect.isMobile) {
            window.onorientationchange = function() {
                var orientation = window.orientation;
                switch(orientation) {
                    case 90:
                        window.scrollTo(0,1);
                        break;
                    case -90:
                        window.scrollTo(0,1);
                        break;
                }
            }
            window.onorientationchange();
            able();
        } else {
            able();
        }
    }

    function showPortrait() {
        unable();
        CMDetect.isPaused = true;
        switch (_public.curURL) {
            case _public.URL_HOME:
                Home.pause();
                break;
            case _public.URL_SECTION:
                Contents.pause();
                break;
            case _public.URL_ABOUT:
                break;
        }
        TweenLite.killTweensOf($popup);
        TweenLite.to($popup,0, {
            css:{autoAlpha:0}
        });
        TweenLite.to($popup,.3, {
            delay:0.1,
            css:{autoAlpha:1}
        });
        $popup.show();
    }
    function hidePortrait() {
        able();
        CMDetect.isPaused = false;
        switch (_public.curURL) {
            case _public.URL_HOME:
                Home.resume();
                break;
            case _public.URL_SECTION:
                Contents.resume();
                break;
            case _public.URL_ABOUT:
                break;
        }
        $popup.hide();
    }


    function whiteTop() {
        if (_isBlackTop == 0) return;
        _isBlackTop = 0;
        $header.removeClass('header-black').addClass('header-white');
        $footer.removeClass('footer-black').addClass('footer-white');
    }
    function blackTop() {
        if (_isBlackTop == 1) return;
        _isBlackTop = 1;
        $header.removeClass('header-white').addClass('header-black');
        $footer.removeClass('footer-white').addClass('footer-black');
    }
    function whiteLeft() {
        if (_isBlackLeft == 0) return;
        _isBlackLeft = 0;
        $close.removeClass('close-pos-black').addClass('close-pos');
        $circle.removeClass('circleCon-black').addClass('circleCon-white');
        $facebook.removeClass('fbt-pos-black').addClass('fbt-pos');
        $twitter.removeClass('tbt-pos-black').addClass('tbt-pos');
        $google.removeClass('gbt-pos-black').addClass('gbt-pos');
        $pinterest.removeClass('pbt-pos-black').addClass('pbt-pos');
    }
    function blackLeft() {
        if (_isBlackLeft == 1) return;
        _isBlackLeft = 1;
        $close.removeClass('close-pos').addClass('close-pos-black');
        $circle.removeClass('circleCon-white').addClass('circleCon-black');
        $facebook.removeClass('fbt-pos').addClass('fbt-pos-black');
        $twitter.removeClass('tbt-pos').addClass('tbt-pos-black');
        $google.removeClass('gbt-pos').addClass('gbt-pos-black');
        $pinterest.removeClass('pbt-pos').addClass('pbt-pos-black');
    }



    function able() {
        _isAble = true;
        //$block.hide();
        $block.removeAttribute('style');
        $block.style.display = 'none';
    }
    function unable() {
        _isAble = false;
        //$block.show();
        $block.removeAttribute('style');
        $block.style.display = 'block';
    }
   
    _public.init = init;
    _public.run = run;
    _public.able = able;
    _public.unable = unable;
    _public.whiteTop = whiteTop;
    _public.blackTop = blackTop;
    _public.whiteLeft = whiteLeft;
    _public.blackLeft = blackLeft;
    _public.goSection = goSection;
    _public.goHome = goHome;
    _public.goAbout = goAbout;
    _public.goScreenSaver = goScreenSaver;
    _public.closePopup = closePopup;
    _public.endFirstAnimation = endFirstAnimation;
    
    return _public;
} )();