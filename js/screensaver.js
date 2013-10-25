var ScreenSaver = ScreenSaver || ( function () {

    var $about, $close, $contents, $prev, $next, $prevBlock, $nextBlock, $downMac, $downWin, _first,
        $ssdaplay, $ssbutton, $sscopy,
        _curSaver, _curNo, _maxNo, _isPause = false, _canvas, _context,
        $html = '<div id="ss-prev-block" class="ss-button-arrow"></div><div id="ss-next-block" class="ss-button-arrow"></div><div id="ss-prev" class="buttons ss-button-arrow"></div><div id="ss-next" class="buttons ss-button-arrow"></div><div id="ss-display"><div id="ss-canvas-mask"></div><canvas id="ss-canvas"></canvas></div><div id="ss-button-con"><div id="ss-button-mac" class="ss-button"><div id="ss-button-mac-txt"></div></div><div id="ss-button-win" class="ss-button"><div id="ss-button-win-txt"></div></div></div><div id="ss-copy">You need <a href="http://www.adobe.com/go/getflashplayer" target="_blank">Adobe Flash Player</a> 10.1 or higher to install this screensaver.</div>';

    function show(isCloseAni, first) {
        _first = first;

        _curSaver = Address.curScreenSaver;
        _curNo = ConfigModel.convertSaverIdToOrder(_curSaver);
        _maxNo = ConfigModel.screensaverTotal;

        if ($about == null) {
            $about = $('#about');
            $close = $('#about-close-bt');
            $contents = $('#screen-contents');
            $contents.html($html);
            $ssdaplay = $('#ss-display');
            $ssbutton = $('#ss-button-con');
            $sscopy = $('#ss-copy');
            $prev = $('#ss-prev');
            $next = $('#ss-next');
            $prevBlock = $('#ss-prev-block');
            $nextBlock = $('#ss-next-block');
            $downMac = $('#ss-button-mac');
            $downWin = $('#ss-button-win');
            _canvas = document.getElementById('ss-canvas');
            _canvas.width = 441;
            _canvas.height = 277;
            _context = _canvas.getContext('2d');
        }

        TweenLite.to($about, 0, {
            css:{autoAlpha:0}
        });
        TweenLite.to($about, 0.4, {
            delay:0.1,
            css:{autoAlpha:1},
            onStart:Address.whiteTop
        });
        $about.show();

        showFirst();

        if (isCloseAni == 1) {
            TweenLite.to($close, 0, {
                css:{"marginLeft":70}
            });
            TweenLite.to($close, .35, {
                delay:0.4,
                css:{"marginLeft":0},
                ease:Back.easeOut
            });
        }
        $close.on('click', onClose);
        $prev.on('click', onPrev);
        $next.on('click', onNext);
        $downMac.on('click', onDownMac);
        $downWin.on('click', onDownWin);

    }

    function showFirst() {
        TweenLite.to($ssdaplay, 0, {
            css:{autoAlpha:0, marginTop:14}
        });
        TweenLite.to($ssdaplay, 0.4, {
            delay:0.3,
            css:{autoAlpha:1, marginTop:4}
        });
        TweenLite.to($ssbutton, 0, {
            css:{autoAlpha:0, marginTop:10}
        });
        TweenLite.to($ssbutton, 0.4, {
            delay:0.5,
            css:{autoAlpha:1, marginTop:0}
        });
        TweenLite.to($sscopy, 0, {
            css:{autoAlpha:0, marginTop:10}
        });
        TweenLite.to($sscopy, 0.4, {
            delay:0.65,
            css:{autoAlpha:1, marginTop:0}
        });

        var prev_value, next_value;
        if (_curNo == 0) {
            prev_value = 0.2;
            next_value = 1;
            $prevBlock.show();
            $nextBlock.hide();
        } else if (_curNo == _maxNo - 1) {
            prev_value = 1;
            next_value = 0.2;
            $prevBlock.hide();
            $nextBlock.show();
        } else {
            prev_value = 1;
            next_value = 1;
            $prevBlock.hide();
            $nextBlock.hide();
        }

        TweenLite.to($prev, 0, {
            css:{autoAlpha:0, left:-10}
        });
        TweenLite.to($next, 0, {
            css:{autoAlpha:0, right:-10}
        });
        TweenLite.to($prev, 0.4, {
            delay:0.8,
            css:{autoAlpha:prev_value, left:0}
        });
        TweenLite.to($next, 0.4, {
            delay:0.8,
            css:{autoAlpha:next_value, right:0},
            onComplete:endShow
        });

        $contents.show();
        ScreenDraw.drawFirst(_curNo, _context);
    }

    function endShow() {
        if (_first == 1) {
            Address.endFirstAnimation();
        } else {
            Address.able();
        }

        checkArrow();

        _isPause = false;
        requestAnimationFrame( animate );
    }

    function animate() {
        if (_isPause) return;
        requestAnimationFrame( animate );
        ScreenDraw.draw();
    }


    function change() {
        _isPause = true;
        ScreenDraw.dispose();
        _curSaver = Address.curScreenSaver;
        _curNo = ConfigModel.convertSaverIdToOrder(_curSaver);
        checkArrow();
        ScreenDraw.drawSecond(_curNo, _context);

        _first = 0;
        TweenLite.delayedCall(.4, endShow);
    }

    function onPrev() {
        var no = _curNo - 1, id = ConfigModel.screensaverArr[no].item.id;
        Address.goScreenSaver(id);
    }


    function onNext() {
        var no = _curNo + 1, id = ConfigModel.screensaverArr[no].item.id;
        Address.goScreenSaver(id);
    }

    function checkArrow() {
        if (_curNo == 0) {
            TweenLite.to($prev, 0.2, {
                css:{autoAlpha:0.2}
            });
            TweenLite.to($next, 0.2, {
                css:{autoAlpha:1}
            });
            $prevBlock.show();
            $nextBlock.hide();
        } else if (_curNo == _maxNo - 1) {
            TweenLite.to($prev, 0.2, {
                css:{autoAlpha:1}
            });
            TweenLite.to($next, 0.2, {
                css:{autoAlpha:0.2}
            });
            $prevBlock.hide();
            $nextBlock.show();
        } else {
            TweenLite.to($prev, 0.2, {
                css:{autoAlpha:1}
            });
            TweenLite.to($next, 0.2, {
                css:{autoAlpha:1}
            });
            $prevBlock.hide();
            $nextBlock.hide();
        }
    }


    function hide(fn) {
        _isPause = true;
        $close.off('click', onClose);
        $prev.off('click', onPrev);
        $next.off('click', onNext);
        $downMac.off('click', onDownMac);
        $downWin.off('click', onDownWin);

        TweenLite.to($about, 0.3, {
            css:{autoAlpha:0},
            onComplete:endHide,
            onCompleteParams:[fn]
        });
    }

    function endHide(fn) {
        $about.hide();
        $contents.hide();
        ScreenDraw.dispose();
        fn();
    }

    function onClose() {
        Address.closePopup();
    }

    function changeShow() {
        _first = 0;

        _curSaver = Address.curScreenSaver;
        _curNo = ConfigModel.convertSaverIdToOrder(_curSaver);
        _maxNo = ConfigModel.screensaverTotal;

        if ($about == null) {
            $about = $('#about');
            $close = $('#about-close-bt');
            $contents = $('#screen-contents');
            $contents.html($html);
            $ssdaplay = $('#ss-display');
            $ssbutton = $('#ss-button-con');
            $sscopy = $('#ss-copy');
            $prev = $('#ss-prev');
            $next = $('#ss-next');
            $prevBlock = $('#ss-prev-block');
            $nextBlock = $('#ss-next-block');
            $downMac = $('#ss-button-mac');
            $downWin = $('#ss-button-win');
            _canvas = document.getElementById('ss-canvas');
            _canvas.width = 441;
            _canvas.height = 277;
            _context = _canvas.getContext('2d');
        }
        TweenLite.to($contents, 0, {
            css:{autoAlpha:0}
        });
        TweenLite.to($contents, 0.4, {
            delay:0.2,
            css:{autoAlpha:1}
        });
        $contents.show();

        showFirst();

        $close.on('click', onClose);
        $prev.on('click', onPrev);
        $next.on('click', onNext);
        $downMac.on('click', onDownMac);
        $downWin.on('click', onDownWin);
    }

    function changeHide() {
        Address.unable();
        _isPause = true;
        $close.off('click', onClose);
        $prev.off('click', onPrev);
        $next.off('click', onNext);
        $downMac.off('click', onDownMac);
        $downWin.off('click', onDownWin);
        TweenLite.to($contents, 0.2, {
            css:{autoAlpha:0},
            onComplete:endChangeHide
        });
    }

    function endChangeHide() {
        $contents.hide();
        ScreenDraw.dispose();
        TweenLite.to($contents, 0, {
            css:{autoAlpha:1}
        });
    }

    function onDownMac() {
        var url = ConfigModel.screensaverArr[_curNo].item.mac;
        window.open(url);
    }
    function onDownWin() {
        var url = ConfigModel.screensaverArr[_curNo].item.win;
        window.open(url);
    }

    return {
        show: show,
        hide: hide,
        change: change,
        changeShow: changeShow,
        changeHide: changeHide
    }

} )();
