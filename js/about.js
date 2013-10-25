var About = About || ( function () {

    var $about, $close, $contents, _isTouch = CMDetect.isTouch,
        _isMobile = CMDetect.isMobile, _first;

    function show(isCloseAni, first) {

        _first = first;

        if ($about == null) {
            $about = $('#about');
            $close = $('#about-close-bt');
            $contents = $('#about-contents');
        }

        if (_isMobile) {
            $contents.addClass('about-mobile');
        } else if (_isTouch) {
            $contents.addClass('about-tablet');
        }


        $('#about-h1').html("");
        TweenLite.to($('#about-h2'), 0, {
            css:{autoAlpha:0, paddingTop:10}
        });
        TweenLite.to($('#about-h3'), 0, {
            css:{autoAlpha:0, paddingTop:10}
        });
        TweenLite.to($('#about-h4'), 0, {
            css:{autoAlpha:0, paddingTop:10}
        });

        TweenLite.to($about, 0, {
            css:{autoAlpha:0}
        });
        TweenLite.to($about, 0.4, {
            delay:0.1,
            css:{autoAlpha:1},
            onComplete:startTxt,
            onStart:Address.whiteTop
        });
        $contents.show();
        $about.show();

        if (isCloseAni == 1) {
            TweenLite.to($close, 0, {
                css:{"marginLeft":70}
            });
            TweenLite.to($close, .35, {
                delay:2,
                css:{"marginLeft":0},
                ease:Back.easeOut
            });
        }
        $close.on('click', onClose);

    }

    function startTxt() {
        if (_isTouch) {
            $('#about-h1').shuffleLetters({"text":"Form Follows Function", "step":16, "fps":25});
        } else {
            $('#about-h1').shuffleLetters({"text":"Form Follows Function", "step":26, "fps":32});
        }

        TweenLite.delayedCall(0.7, delayStartTxt);
    }

    function delayStartTxt() {

        TweenLite.to($('#about-h2'), 0.4, {
            css:{autoAlpha:1, paddingTop:0}
        });

        TweenLite.to($('#about-h3'), 0.4, {
            delay:0.15,
            css:{autoAlpha:1, paddingTop:0}
        });

        TweenLite.to($('#about-h4'), 0.4, {
            delay:0.3,
            css:{autoAlpha:1, paddingTop:0},
            onComplete:endShow
        });
    }

    function endShow() {
        if (_first == 1) {
            Address.endFirstAnimation();
        } else {
            Address.able();
        }
    }

    function hide(fn) {
        $close.off('click', onClose);

        TweenLite.to($about, 0.3, {
            css:{autoAlpha:0},
            onComplete:endHide,
            onCompleteParams:[fn]
        });
    }

    function endHide(fn) {
        $about.hide();
        $contents.hide();
        fn();
    }

    function onClose() {
        Address.closePopup();
    }

    function changeShow() {
        _first = 0;
        if ($about == null) {
            $about = $('#about');
            $close = $('#about-close-bt');
            $contents = $('#about-contents');
        }


        $('#about-h1').html("");
        TweenLite.to($('#about-h2'), 0, {
            css:{autoAlpha:0, paddingTop:10}
        });
        TweenLite.to($('#about-h3'), 0, {
            css:{autoAlpha:0, paddingTop:10}
        });
        TweenLite.to($('#about-h4'), 0, {
            css:{autoAlpha:0, paddingTop:10}
        });

        TweenLite.delayedCall(.1, startTxt);
        $contents.show();
        $close.on('click', onClose);
    }

    function changeHide() {
        Address.unable();
        $close.off('click', onClose);
        TweenLite.to($contents, 0.2, {
            css:{autoAlpha:0},
            onComplete:endChangeHide
        });
    }

    function endChangeHide() {
        $contents.hide();
        TweenLite.to($contents, 0, {
            css:{autoAlpha:1}
        });
    }

    return {
        show: show,
        hide: hide,
        changeShow: changeShow,
        changeHide: changeHide
    }

} )();
