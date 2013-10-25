var Home = Home || ( function () {

    var _public = {
        posArr:null
    }

    _public.posArr = [];

    var _itemArr = [], _isIE = (CMDetect.browserName == "ie"),
        _centerX, _centerY, _img_h_w = CMDetect.IMG_HALF_W, _img_h_h = CMDetect.IMG_HALF_H,
        RADIUS = 900, PI = Math.PI / 180, GAP = 10, ITEM_MAX = 20,
        _itemTotal, _posTotal = 360 / GAP,
        _offsetX = 0, _distance = 0, _isDrag = false, _oldMouseX = 0, _moveX = 0,
        _isClicked = false, _isPaused = false,
        _imgMax,

        _forceMoveObj = {pos:0}, _clickedID,

        _titleArr = [], _dateArr = [], _txtArr = [],
        _firstSection, _firstCurBg,
        $posterLoading,

        //_lastNo = 15, _firstNo = 0,
        _imgGap = 0,
        _isTouch = CMDetect.isTouch, _isTranslate3d = CMDetect.isTranslate3d, _cssHead = CMDetect.cssHead + "Transform";

    function init() {
        $posterLoading = document.getElementById('poster-loading');
        StageController.addListener("home", onResize);
        setting();
    }

    function onResize(){
        changeCenter();
        if (_isPaused) move();
    }

    function changeCenter(){
        var sh = StageController.stageHeight, sw = StageController.stageWidth, max_sy = sh + 400;
        _centerX = (sw >> 1);
        _centerY = (0.5 + (RADIUS + (sh / 1.618))) | 0;
        if (_centerY < max_sy) _centerY = max_sy;
        //_centerY = 1400;
        //_centerY = sh + 450;
        $posterLoading.style.top = (_centerY - RADIUS + 180) + 'px';

    }

    function initBackHome(){
        changeCenter();
        move();
    }

    function dispose() {
        //console.log("home dispose")
        StageController.removeListener("home");
        removeEvent();

        $('#pantone-loading').hide();
        $('#pantone').hide();
    }

    function pause() {
        //console.log("home pause")
        _isPaused = true;
        removeEvent();
    }

    function resume() {
        //console.log("home resume")
        _isPaused = false;
        addEvent();
        Address.able();
    }

    function addEvent() {
        //console.log("add home event")
        if (_isTouch) {
            StageController.addTouch("home", touchStartHandler, touchMoveHandler, touchEndHandler);
        } else {
            StageController.addMove("home", onDown, onMove, onUp);
        }
        requestAnimationFrame( animate );
    }

    function removeEvent() {
        //console.log("remove home event")
        if (_isTouch) {
            StageController.removeTouch("home");
        } else {
            StageController.removeMove("home");
        }
        _isDrag = false;
        _moveX = 0;
    }


    function backToHome() {
        //console.log("back to home")
        var i, item;
        for (i = 0; i < ITEM_MAX; i++) {
            item = _itemArr[i];
            item.click = 0;
        }

        _isClicked = false;
        _isPaused = false;

        $('#pantone').show();

        move();
    }


    function endBackToHome() {
        StageController.addListener("home", onResize);
        addEvent();
        Address.able();
        if (CMDetect.isPaused) {
            pause();
        }
    }




    function setting() {
        _firstSection = Address.curSection;
        _imgMax = ConfigModel.total;
        _imgGap = 36 - _imgMax;
        _firstCurBg = ConfigModel.convertIdToOrder(_firstSection);

        var i, item;
        for (i = 0; i < ITEM_MAX; i++) {
            item = document.getElementById('items' + i);
            _itemArr[i] = {item:item, use:0, no:0, click:0, bg:-1};
            setPosInit(_itemArr[i], i);
            if(_isIE) {
                $(item).append('<div class="item-button"  data-id="' + i + '"></div><div class="item-txt"><div class="item-txt-block"></div><div class="item-txt-title"></div><div class="item-txt-date"></div></div>');
            } else {
                $(item).append('<div class="item-button"  data-id="' + i + '"></div><div class="item-txt"><div class="item-txt-title"></div><div class="item-txt-date"></div></div>');
            }
            $(item).find('.item-button').on('click', onClick);

            _titleArr[i] = $(item).find('.item-txt-title');
            _dateArr[i] = $(item).find('.item-txt-date');
            _txtArr[i] = $(item).find('.item-txt');
        }

        for (i = 0; i < _posTotal; i++) {
            _public.posArr[i] = {pos:i * GAP - 90, use:0, cur:0, item:null, no:i};
        }
        _itemTotal = _itemArr.length;

        setFirstCircle();
    }

    function setFirstCircle() {
        var pos, i, sita;
        pos = _public.posArr[0];
        sita = pos.pos;
        for (i = 0; i < _posTotal; i++) {
            pos = _public.posArr[i];
            firstRender(pos, sita + (GAP * i), i);
        }
        startAnimation();
    }

    function firstRender(pos, sita, no) {
        sita = sita % 360;
        if (sita < 0) sita = sita + 360;
        pos.pos = sita;

        if (sita > 190 && sita < 350) {
            if (pos.use == 0|| pos.item == null) {
                pos.use = 1;

                var cur;
                if (no < 18) {
                    cur = CMUtiles.getInsideMax(no + _firstCurBg, _imgMax);
                } else {
                    cur = CMUtiles.getInsideMax(no - _imgGap + _firstCurBg, _imgMax);
                }

                pos.cur = cur;
                pos.item = getItem(no, cur);
            }
            if (pos.item != null) setPos(pos.item, sita, no);
        } else {
            if (pos.use == 1) {
                pos.use = 0;
                if (pos.item != null) {
                    pos.item.use = 0;
                    pos.item.bg = -1;
                    setPosInit(pos.item);
                    pos.item = null;
                }
            }
        }
    }

    function firstForceMove(no) {
        var value = _forceMoveObj.pos, pos, i;
        for (i = 0; i < _posTotal; i++) {
            pos = _public.posArr[i];
            firstRender(pos, value - (GAP * (no - i)), i);
        }
    }

    function startAnimation() {

        switch (Address.curURL) {
            case Address.URL_HOME:
                startHome();
                break;
            case Address.URL_SECTION:
                startSection();
                break;
            case Address.URL_ABOUT:
                startAbout();
                break;
            case Address.URL_SCREENSAVER:
                startScreenSaver();
                break;
        }
    }

    // home
    function startHome() {
        var backValue = 0.8;

        if (_isTouch) {
            _forceMoveObj.pos = 0;
            backValue = 1.2;
        } else {
            _forceMoveObj.pos = 320;
        }

        TweenLite.to(_forceMoveObj, 2, {
            pos:-90, //270 - 360,
            ease:Back.easeOut,
            easeParams:[backValue],
            onUpdate:firstForceMove,
            onUpdateParams:[0],
            onComplete:endStartHome
        });

        if (CMDetect.isTransition) {
            $('#pantone').addClass('show-pantone');
        } else {
            TweenLite.to($('#pantone'),.5, {
                css:{opacity:1},
                ease:Cubic.easeIn
            });
        }

    }

    function endStartHome() {
        showHeader();
        addEvent();
        Address.endFirstAnimation();
    }

    // about
    function startAbout() {
        var backValue = 1.2;
        _forceMoveObj.pos = 0;
        _isPaused = true;

        TweenLite.to(_forceMoveObj, 2, {
            pos:-90, //270 - 360,
            ease:Back.easeOut,
            easeParams:[backValue],
            onUpdate:forceMove,
            onUpdateParams:[0]
        });

        if (CMDetect.isTransition) {
            $('#pantone').addClass('show-pantone');
        } else {
            TweenLite.to($('#pantone'),.5, {
                css:{opacity:1},
                ease:Cubic.easeIn
            });
        }

        showHeader();
        About.show(1, 1);
    }

    // screen saver
    function startScreenSaver() {
        var backValue = 1.2;
        _forceMoveObj.pos = 0;
        _isPaused = true;

        TweenLite.to(_forceMoveObj, 2, {
            pos:-90, //270 - 360,
            ease:Back.easeOut,
            easeParams:[backValue],
            onUpdate:forceMove,
            onUpdateParams:[0]
        });

        if (CMDetect.isTransition) {
            $('#pantone').addClass('show-pantone');
        } else {
            TweenLite.to($('#pantone'),.5, {
                css:{opacity:1},
                ease:Cubic.easeIn
            });
        }

        showHeader();
        ScreenSaver.show(1, 1);
    }

    // section
    function startSection() {
        var backValue = 1.2;
        _forceMoveObj.pos = 0;
        _isPaused = true;

        TweenLite.to(_forceMoveObj, 1, {
            pos:-90, //270 - 360,
            ease:Back.easeOut,
            easeParams:[backValue],
            onUpdate:forceMove,
            onUpdateParams:[0],
            onComplete:endStartSection
        });

        if (CMDetect.isTransition) {
            $('#pantone').addClass('show-pantone');
        } else {
            TweenLite.to($('#pantone'),.5, {
                css:{opacity:1},
                ease:Cubic.easeIn
            });
        }

        showHeader();
    }

    function endStartSection() {
        _isClicked = true;
        _moveX = 0;
        Address.endFirstAnimation();
        Address.unable();
        changeSection(_firstSection);
    }








    function showHeader() {
        if (CMDetect.isTransition) {
            $('#header').addClass('showme');
            $('#footer').addClass('showme');
        } else {
            TweenLite.to($('#header'),.3, {
                css:{opacity:1}
            });
            TweenLite.to($('#footer'),.3, {
                css:{opacity:1}
            });
        }
    }



    // event
    function touchStartHandler(event) {
        _isDrag = true;
        _moveX = 0;
        _oldMouseX = event.touches[0].pageX;
    }
    function touchMoveHandler(event) {
        if (!_isDrag) return;
        _moveX = (event.touches[0].pageX - _oldMouseX);
        _oldMouseX = event.touches[0].pageX;
    }
    function touchEndHandler(event) {
        if (!_isDrag) return;
        _isDrag = false;
    }

    function onDown(event) {
        _isDrag = true;
        _moveX = 0;
        _oldMouseX = _offsetX = event.pageX;
    }
    function onMove(event) {
        if (!_isDrag) return;
        _moveX = (event.pageX - _oldMouseX);
        _oldMouseX = event.pageX;
    }
    function onUp(event) {
        if (!_isDrag) return;
        _isDrag = false;
        _distance = Math.abs(event.pageX - _offsetX);
    }

    function onClick(event) {
        if (_distance > 20) return;
        var id = Number($(event.currentTarget).data('id')),
            curBg = _itemArr[id].bg,
            curSection = ConfigModel.configArr[curBg].poster.id;
            //curSection = _imgMax - curBg;
            //name = ConfigModel.configArr[curBg].poster.id;

        if (curSection == "lock") return;
        _isClicked = true;
        _moveX = 0;
        Address.goSection(curSection);
    }

    function findID(curBg) {
        var i, item;
        for (i = 0; i < ITEM_MAX; i++) {
            item = _itemArr[i];
            if (item.bg == curBg) {
                return i;
            }
        }
        return 0;
    }

    function changeSection(curID) {
        //console.log("home change section")
        var curSection = ConfigModel.convertIdToOrder(curID),
            id = findID(curSection),
            no = _itemArr[id].no,
            item = _itemArr[id].item,
            txt = $(_txtArr[id]);

        _clickedID = id;
        _itemArr[id].click = 1;

        _forceMoveObj.pos = _public.posArr[no].pos;

        TweenLite.to(_forceMoveObj,.6, {
            pos:270,
            ease:Cubic.easeOut,
            onUpdate:forceMove,
            onUpdateParams:[no]
        });

        ConfigModel.load(no, curSection, txt, item);
        ConfigModel.isWhite = (ConfigModel.configArr[curSection].poster.white == 1) ? 1 : 0;

        if (ConfigModel.isWhite == 1) {
            Address.whiteLeft();
        } else {
            Address.blackLeft();
        }
        TweenLite.delayedCall(0.5, delayColor, [txt]);
    }

    function delayColor(txt) {
        if (ConfigModel.isWhite == 1) {
            Address.whiteTop();
            TweenLite.to(txt, 0, {
                css:{color:'#fff'}
            });
        } else {
            TweenLite.to(txt, 0, {
                css:{color:'#222'}
            });
        }

    }


    function forceMove(no) {
        var value = _forceMoveObj.pos, pos, i;
        for (i = 0; i < _posTotal; i++) {
            pos = _public.posArr[i];
            render(pos, value - (GAP * (no - i)), i);
        }
    }

    // render
    function animate() {
        if (_isClicked || _isPaused) return;
        requestAnimationFrame( animate );
        move();
    }

    function move() {
        //if (_distance < 20) return;
        var pos, i, sita;

        _moveX = _moveX * 0.9;

        pos = _public.posArr[0];
        sita = (pos.pos + (_moveX * 0.1));

        for (i = 0; i < _posTotal; i++) {
            pos = _public.posArr[i];
            render(pos, sita + (GAP * i), i);
        }
    }

    function render(pos, sita, no) {
        sita = sita % 360;
        if (sita < 0) sita = sita + 360;
        pos.pos = sita;

        if (sita > 190 && sita < 350) {
            if (pos.use == 0 || pos.item == null) {
                pos.use = 1;

                var cur, prev;
                if (sita < 250) {
                    prev = _public.posArr[CMUtiles.getInsideMax(no + 1, _posTotal)];
                    cur = CMUtiles.getInsideMax(prev.cur - 1, _imgMax);
                } else {
                    prev = _public.posArr[CMUtiles.getInsideMax(no - 1, _posTotal)];
                    cur = CMUtiles.getInsideMax(prev.cur + 1, _imgMax);
                }

                pos.cur = cur;
                pos.item = getItem(no, cur);
            }
            if (pos.item != null) setPos(pos.item, sita, no);
        } else {
            if (pos.use == 1) {
                pos.use = 0;
                if (pos.item != null) {
                    pos.item.use = 0;
                    pos.item.bg = -1;
                    setPosInit(pos.item);
                    pos.item = null;
                }
            }
        }
    }

    // factory pattern
    function getItem(no, cur) {
        var item, i, img;
        for (i = 0; i < _itemTotal; i++) {
            item = _itemArr[i];
            if (item.use == 0) {
                item.use = 1;
                item.no = no;
                item.bg = cur;
                img = ConfigModel.imgArr[cur] + '_c.png';
                //item.item.style.background = ConfigModel.configArr[cur].poster.itemcolor;
                item.item.style.background = ConfigModel.configArr[cur].poster.itemcolor + ' url(' + img + ') no-repeat';

                $(_titleArr[i]).html((ConfigModel.configArr[cur].poster.title).toLowerCase());
                $(_dateArr[i]).html(ConfigModel.configArr[cur].poster.date);

                return item;
            }
        }
    }

    // setting position
    function setPosInit(item, no) {
        if (_isTranslate3d) {
            item.item.style[_cssHead] = 'translate3d(-500px, -500px, 0px) rotate(0deg)';
        } else {
            item.item.style[_cssHead] = 'translate(-500px, -500px) rotate(0deg)';
        }
    }

    /*
    function getZindex(tx) {
        return (((_centerX - tx) / 30) | 0) + 30;
    }
    */

    function setPos(item, sita, no) {
        var imgPos = circlePos(sita),
            //zindex = getZindex(imgPos.x);
            value = 270 - sita,
            abs = Math.abs(value),
            zindex = 100 - abs | 0,
            scale = 1 - (abs * 0.006);

        imgPos = circlePos(sita + (value * value * value * value * value * 0.000000005));
            //imgPos = circlePos(sita + (value * value * value * 0.000047));
        //imgPos.y = imgPos.y + (abs * abs / 100);

        //scale = 1;

        if (_isTranslate3d) {
            item.item.style[_cssHead] = 'translate3d(' + imgPos.x + 'px, ' + imgPos.y + 'px, 0px) rotate(' + (sita + 90) + 'deg) scale(' + scale + ')';
        } else {
            item.item.style[_cssHead] = 'translate(' + imgPos.x + 'px, ' + imgPos.y + 'px) rotate(' + (sita + 90) + 'deg) scale(' + scale + ')';
        }

        //$(item.item).find('.item-num').html(sita);

        if (item.click == 1) item.item.style.zIndex = 110;
        else item.item.style.zIndex = zindex;
    }

    function circlePos(sita) {
        var cos = Math.cos(sita * PI),
            sin = Math.sin(sita * PI),
            imgX = (cos) * RADIUS + _centerX - _img_h_w,
            imgY = (sin) * RADIUS + _centerY - _img_h_h;
        return {x:imgX , y:imgY};
    }




    _public.init = init;
    _public.dispose = dispose;
    _public.pause = pause;
    _public.resume = resume;
    _public.changeSection = changeSection;
    _public.backToHome = backToHome;
    _public.endBackToHome = endBackToHome;
    _public.circlePos = circlePos;
    _public.initBackHome = initBackHome;

    return _public;
        
} )();
