var Triangulation = Triangulation || ( function () {
    var _isPause, canvas, ctx, canvas2, ctx2, imageObj,
        _objTween = {no:0}, _colorData, _triangles, _trianglesTotal,
        _isLoadImg, _isLoadJson, _isMoved, _isFirst, _curNo,
        $loading, $con, $move, $guide, _saveAni, _dragEase,
        _savePos, _saveTx, _saveTy, _isDrag, _saveDrag, _buttonArray,
        _triArr = ['tri1.json',
                    'tri2.json',
                    'tri3.json',
                    'tri4.json',
                    'tri5.json',
                    'tri6.json',
                    'tri7.json'],
        _imgArr = ['ny1.jpg',
                    'ny2.jpg',
                    'ny3.jpg',
                    'ny4.jpg',
                    'ny5.jpg',
                    'ny6.jpg',
                    'ny7.jpg'],
        _loadingOpts = CMDetect.loadingOpts;

    function init() {
        _isPause = false;
        _isDrag = false;
        _isFirst = true;

        canvas = document.getElementById('triangulation-world');
        canvas.width = 466;
        canvas.height = 466;
        ctx = canvas.getContext('2d');

        canvas2 = document.createElement('canvas');
        canvas2.width = 466;
        canvas2.height = 466;
        ctx2 = canvas2.getContext("2d");

        $loading = $('#triangulation-loading');
        $con = document.getElementById('triangulation-con');
        $move = $('#triangulation-img-move');

        _buttonArray = [];
        var button, i;
        for(i=0; i<7; i++) {
            button = $('#triangulation-bt-' + (i + 1));
            if (i == 0) {
                button.css('background-position', -(i * 46) + 'px -68px');
            } else {
                button.css('background-position', -(i * 46) + 'px 0');
            }
            _buttonArray[i] = button;
        }
        _curNo = 0;
    }

    function load(no) {
        Address.unable();
        //$loading.hide().spin(false);
        $loading.show().spin(_loadingOpts);

        if (imageObj != null) {
            imageObj = null;
        }
        _isLoadImg = false;
        _isLoadJson = false;
        if (_isFirst) {
            _isMoved = true;
        }

        var img = _imgArr[no], tri = _triArr[no];

        imageObj = new Image();
        imageObj.src = img;
        imageObj.onload = loadImg;

        $.ajax({
            url : tri,
            dataType : 'json'
        }).done(function(res){
            loadJson(res);
        }).fail(function(jqXHR, textStatus, errorThrown){
            failedLoad();
        });
    }

    function loadImg() {
        ctx2.drawImage(imageObj, 0, 0);
        _colorData = ctx2.getImageData(0, 0, 466, 466).data;
        _isLoadImg = true;
        checkLoad();
    }

    function loadJson(res) {
        _triangles = res;
        _trianglesTotal = _triangles.length;
        _isLoadJson = true;
        checkLoad();
    }

    function checkLoad() {
        if (_isPause) return;
        if (_isLoadImg && _isLoadJson && _isMoved) {
            startAnimation();
        }
    }

    function failedLoad() {

    }




    function start() {
        //console.log("triangulation start")
        load(0);
    }

    function dispose() {
        //console.log("triangulation dispose")
        TweenLite.killTweensOf(_objTween);
        removeEvent();
        _isPause = true;
        if ($guide != null) {
            TweenLite.killTweensOf($guide);
        }
        $guide = null;

        if (_saveAni != null) {
            TweenLite.killTweensOf(_saveAni);
        }
        _saveAni = null;

        _colorData = null;
        _triangles = null;
        canvas = null;
        ctx = null;
        canvas2 = null;
        ctx2 = null;
        $loading = null;
        $con = null;
        $move = null;
        _buttonArray = [];
    }

    function pause() {
        //console.log("triangulation pause")
        _isPause = true;
        TweenLite.killTweensOf(_objTween);
        removeEvent();
        if (_saveAni != null) {
            _saveAni.pause();
        }
    }

    function resume() {
        //console.log("triangulation resume")
        _isPause = false;
        if (_saveAni == null) {
            addEvent();
        } else {
            _saveAni.resume();
        }
    }

    function resize() {
        var sw = StageController.stageWidth, sh = StageController.stageHeight;
        _saveTx = (sw - 476) >> 1;
        _saveTy = ((sh - 476) >> 1);
        //$con.css({'left':_saveTx + 'px', 'top':_saveTy + 'px'});
        $con.style.left = _saveTx + 'px';
        if (sh > 710) {
            $con.style.top = _saveTy + 'px';
        } else {
            $con.style.top = (_saveTy - 25) + 'px';
        }
    }




    function startAnimation() {
        $loading.hide().spin(false);

        TweenLite.killTweensOf(_objTween);
        _saveDrag = 0;
        _savePos = 0;
        _objTween.no = 0;

        if (_isFirst) {
            _isFirst = false;
            _saveAni = TweenLite.to(_objTween, 3, {
                delay:.1,
                no:_trianglesTotal,
                onUpdate:update,
                onComplete:startGuide,
                ease:Expo.easeInOut
            });
        } else {
            TweenLite.to(_objTween, 3, {
                delay:.1,
                no:_trianglesTotal,
                onUpdate:update,
                ease:Expo.easeInOut
            });
            Address.able();
        }
    }


    function startGuide() {
        $guide = $('#triangulation-guide');
        $guide.css({'left':(_saveTx + 280) + "px", 'top':(_saveTy) + "px"}).show();

        _dragEase = 0.3;

        TweenLite.to($guide, 0, {
            css:{autoAlpha:0}
        });
        TweenLite.to($('#triangulation-btcon'),0, {
            css:{autoAlpha:0}
        });
        $('#triangulation-btcon').show();
        _saveAni = TweenLite.to($guide,.2, {
            css:{autoAlpha:1},
            onComplete:startGuide2
        });
    }
    function startGuide2() {
        _saveAni = TweenLite.to($guide,1, {
            delay:0.6,
            css:{'top':_saveTy + 350},
            onUpdate:updateGuide,
            onComplete:startGuide3
        });
    }

    function startGuide3() {
        _saveAni = TweenLite.to($guide,1, {
            delay:0.3,
            css:{'top':_saveTy},
            onUpdate:updateGuide,
            onComplete:endGuide
        });
    }
    function endGuide() {
        _saveAni = null;
        TweenLite.to($guide, 0.2, {
            css:{autoAlpha:0}
        });
        TweenLite.to($('#triangulation-btcon'),0.3, {
            css:{autoAlpha:1}
        });
        _dragEase = 1;
        addEvent();
        Address.able();
    }
    function updateGuide() {
        var pos = $guide.position();
        setMousePos(pos.left, pos.top + 10);
    }


    function update() {
        if (_isPause) return;
        var index = (0.5 + (_objTween.no)) | 0;
        if (_savePos == index) return;
        _savePos = index;
        ctx.clearRect(0, 0, 466, 466);
        var i;
        for (i = 0; i < index; i++) {
            draw(i);
        }
    }

    function draw(index) {
        var j, p0, p1, p2, cx, cy, t;

        t = _triangles[index];
        p0 = t.nodes[0]; p1 = t.nodes[1]; p2 = t.nodes[2];

        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p0.x, p0.y);

        cx = (p0.x + p1.x + p2.x) * 0.33333;
        cy = (p0.y + p1.y + p2.y) * 0.33333;

        j = ((cx | 0) + (cy | 0) * 466) << 2;

        ctx.fillStyle = 'rgba(' + _colorData[j] + ', ' + _colorData[j + 1] + ', ' + _colorData[j + 2] + ', 1)';
        ctx.fill();
    }

    function move(no) {
        ctx.clearRect(0, 0, 466, 466);
        _isMoved = false;
        TweenLite.killTweensOf(_objTween);
        load(no);
        TweenLite.to($move, 0.4, {
            css:{left:(466 * -no)},
            onComplete:endMove,
            ease:Cubic.easeInOut
        });
    }

    function endMove() {
        _isMoved = true;
        checkLoad();
    }



    function addEvent() {
        if (CMDetect.isTouch) {
            StageController.addTouch("triangulation", touchStartHandler, touchMoveHandler, touchEndHandler);
        } else {
            StageController.addMove("triangulation", onDown, onMove, onUp);
        }
        var button, i;
        if (CMDetect.isTouch) {
            for(i=0; i<7; i++) {
                button = _buttonArray[i];
                button.off().on('click', onClickBt);
            }
        } else {
            for(i=0; i<7; i++) {
                button = _buttonArray[i];
                button.off().on('click', onClickBt).on('mouseenter', onOverBt).on('mouseleave', onOutBt);
            }
        }

    }

    function removeEvent() {
        if (CMDetect.isTouch) {
            StageController.removeTouch("triangulation");
        } else {
            StageController.removeMove("triangulation");
        }
        var button, i;
        for(i=0; i<7; i++) {
            button = _buttonArray[i];
            button.off();
        }
    }

    function onOverBt(event) {
        var id = Number((event.currentTarget.id).substr(17, 18)) - 1;
        var button, i;
        for(i=0; i<7; i++) {
            button = _buttonArray[i];
            TweenLite.killTweensOf(button);
            if (i == id) {
                button.css('background-position', -(i * 46) + 'px -68px');
                TweenLite.to(button, 0.2, {
                    css:{opacity:1}
                });
            } else {
                button.css('background-position', -(i * 46) + 'px 0');
                TweenLite.to(button, 0.2, {
                    css:{opacity:0.4}
                });
            }
        }
    }

    function onOutBt(event) {
        var button, i;
        for(i=0; i<7; i++) {
            button = _buttonArray[i];
            if (i == _curNo) {
                button.css('background-position', -(i * 46) + 'px -68px');
            } else {
                button.css('background-position', -(i * 46) + 'px 0');
            }
            TweenLite.killTweensOf(button);
            TweenLite.to(button, 0.2, {
                css:{opacity:1}
            });
        }
    }

    function onClickBt(event) {
        _curNo = Number((event.currentTarget.id).substr(17, 18)) - 1;
        move(_curNo);

        var button, i;
        for(i=0; i<7; i++) {
            button = _buttonArray[i];
            if (i == _curNo) {
                button.css('background-position', -(i * 46) + 'px -68px');
            } else {
                button.css('background-position', -(i * 46) + 'px 0');
            }
        }
    }

    function touchStartHandler(event) {
        if (!_isMoved) return;
        _isDrag = true;
        setMousePos(event.touches[0].pageX, event.touches[0].pageY);
    }
    function touchMoveHandler(event) {
        if (!_isDrag || !_isMoved) return;
        setMousePos(event.touches[0].pageX, event.touches[0].pageY);
    }
    function touchEndHandler(event) {
        if (!_isDrag || !_isMoved) return;
        _isDrag = false;
    }

    function onDown(event) {
        if (!_isMoved) return;
        _isDrag = true;
        setMousePos(event.pageX, event.pageY);
    }
    function onMove(event) {
        if (!_isDrag || !_isMoved) return;
        setMousePos(event.pageX, event.pageY);
    }
    function onUp(event) {
        if (!_isDrag || !_isMoved) return;
        _isDrag = false;
    }

    function setMousePos(tx, ty) {
        var my = ty - _saveTy,
            mx = tx - _saveTx;
        if (mx < 0 || mx > 476 || my < 0 || my > 476) {
            return;
        }
        var value = CMUtiles.getCurrent(my, 0, 476, _trianglesTotal, 0);
        updateDrag(value);
    }

    function updateDrag(value) {
        if (_savePos == value) return;
        _saveDrag = value;
        TweenLite.killTweensOf(_objTween);
        TweenLite.to(_objTween, _dragEase, {
            no:_saveDrag,
            onUpdate:update,
            ease:Cubic.easeOut
        });
    }

    return {
        init:init,
        start:start,
        dispose:dispose,
        pause:pause,
        resume:resume,
        resize:resize
    }
} )();