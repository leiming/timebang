var CircleAniamtion = CircleAniamtion || ( function () {

    var _cur = 0, $circleLside, $circleRside, $circleRstatic, $saveTmp, $con, obj = {no:0},
        _tween1, _tween2, _percent, _isShowLoading = false,
        _saveTime, _saveFn, _isShowL = false,
        _cssHead = CMDetect.cssHead + "Transform", _finishedAnimation, _finishedLoad,
        _loadingOpts = {
            lines: 12, // The number of lines to draw
            length: 3, // The length of each line
            width: 2, // The line thickness
            radius: 6, // The radius of the inner circle
            color: '#fff', // #rgb or #rrggbb
            speed: 1, // Rounds per second
            trail: 60, // Afterglow percentage
            shadow: false, // Whether to render a shadow
            hwaccel: false, // Whether to use hardware acceleration
            zIndex: 2e9 // The z-index (defaults to 2000000000)
        };

    function show(con, time, fn) {
        $con = $('#' + con);
        var html = '<div class="circle-side-l">' +
                        '<div class="rot-circle circle-ani">' +

                            '<div class="rotate right">' +
                                '<div class="circle-bg right"></div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +

                    '<div class="circle-side-r">' +
                        '<div class="rot-circle circle-ani circle-half-r">' +
                            '<div class="rotate left">' +
                                '<div class="circle-bg left"></div>' +
                            '</div>' +
                        '</div>'+
                    '</div>' +
                    '<div class="circle-side-r-static"><div>';

        TweenLite.to($con, 0, {
            css:{autoAlpha:0}
        });

        _percent = 0;

        $con.html(html).show();
        $circleLside = $con.find('.circle-side-l');
        $circleRside = $con.find('.circle-side-r');
        $circleRstatic = $con.find('.circle-side-r-static');

        $saveTmp = $('.rot-circle');
        $saveTmp.rotateLeft = $saveTmp.find('.rotate.left');
        $saveTmp.rotateRight = $saveTmp.find('.rotate.right');

        _isShowL = false;
        $circleLside.hide();

        _tween1 = TweenLite.to($con,.2, {
            css:{autoAlpha:1},
            onComplete:startCircle,
            onCompleteParams:[time, fn]
        });
    }

    function ready() {
        _finishedAnimation = false;
        _finishedLoad = false;
    }

    function startCircle(time, fn) {
        _tween1 = null;

        _saveTime = time;
        _saveFn = fn;

        startCircleAnimation();
    }

    function startCircleAnimation() {
        obj.no = 0;
        _tween2 = TweenLite.to(obj, _saveTime, {
            no:360,
            onUpdate:update,
            onComplete:endedAnimation
        });
    }



    function loaded() {
        _finishedLoad = true;
        hide();
    }

    function endedAnimation() {
        _finishedAnimation = true;
        hide();
    }

    function hide() {
        if (_finishedAnimation && !_finishedLoad) {
            _isShowLoading = true;
            if (ConfigModel.isWhite == 1) {
                _loadingOpts.color = '#fff';
                $('#circleCon-loading').removeClass('circleCon-loading-black').addClass('circleCon-loading-white').show();
            } else {
                _loadingOpts.color = '#000';
                $('#circleCon-loading').removeClass('circleCon-loading-white').addClass('circleCon-loading-black').show();
            }
            if (CMDetect.isTouch) {
                $('#circleCon-loading-icon').css('margin', '0').spin(_loadingOpts);
            } else {
                $('#circleCon-loading-icon').spin(_loadingOpts);
            }
            $('#close-bt').hide();
        } else if (_finishedAnimation && _finishedLoad) {
            _tween2 = null;

            if (_isShowLoading) {
                _isShowLoading = false;
                $('#circleCon-loading-icon').spin(false);
                $('#circleCon-loading').hide();
                $('#close-bt').show();
            }

            TweenLite.to($con,0.2, {
                css:{autoAlpha:0}
            });

            _saveFn();
            _saveFn = null;
        }
    }

    function cancel() {
        TweenLite.killTweensOf($con);
        TweenLite.killTweensOf(obj);
        $con.hide();

        _saveFn = null;
    }

    function pause() {
        if (_tween1 != null) {
            _tween1.pause();
        }
        if (_tween2 != null) {
            _tween2.pause();
        }
    }

    function resume() {
        if (_tween1 != null) {
            _tween1.resume();
        }
        if (_tween2 != null) {
            _tween2.resume();
        }
    }

    function update() {
        animation($saveTmp, obj.no);
    }

    function hideL() {
        if (!_isShowL) return;
        _isShowL = false;
        $circleLside.hide();
    }
    function showL() {
        if (_isShowL) return;
        _isShowL = true;
        $circleLside.show();
    }

    function animation(clock, current) {
        var angle = current, element;

        if(current == 0) {
            clock.rotateRight.hide();
            rotateElement(clock.rotateLeft,0);
        }

        if(angle <= 180) {
            hideL();
            element = clock.rotateLeft;
        } else {
            showL();
            //$circleRstatic.show();
            //$circleRside.hide();
            clock.rotateRight.show();
            clock.rotateLeft.show();
            rotateElement(clock.rotateLeft, 180);
            element = clock.rotateRight;
            angle = angle - 180;
        }
        rotateElement(element,angle);
    }

    function rotateElement(element,angle) {
        var rotate = 'rotate('+angle+'deg)';
        element.css(_cssHead, rotate);
        //TweenLite.to(element, 0, {css:{rotation:angle}});
    }


    return {
        show: show,
        cancel: cancel,
        pause: pause,
        resume: resume,
        loaded: loaded,
        ready: ready
    }

} )();