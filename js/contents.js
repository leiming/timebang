var Contents = Contents || ( function () {

    var PI = Math.PI / 180, _img_h_w = CMDetect.IMG_HALF_W, _img_h_h = CMDetect.IMG_HALF_H, _img_w = CMDetect.IMG_W, _img_h = CMDetect.IMG_H,
        _isTranslate3d = CMDetect.isTranslate3d, _transform, _isTouch = CMDetect.isTouch,
        $loadCon, $posterImg, $posterCon, $detailCon, $mask, $contents,
        _curMode = 0, _saveNo, _saveCurBg, _saveData,
        _$txt, _$item, _isNotWebkit = (CMDetect.cssHead == "Webkit") ? false : true,
        _saveDetailPos = {x:0, y:0, w:0, h:0};


    /*
    if (CMDetect.cssHead == "Moz" && CMDetect.firefoxVersion >= 18.0) {
        _isTranslate3d = false;
    }
    */

    if (CMDetect.browserName == "ie10") {
        _isTranslate3d = false;
    }

    function init(no, curBg, txt, item) {
        if ($loadCon == null) {
            $loadCon = $('#load-con');
            $posterImg = document.getElementById('poster-big');
            $posterCon = $('#poster-con');
            $detailCon = $('#detail-con');
            $mask = $('#mask');
            $contents = $('#contents');

            if (_isNotWebkit) {
                $loadCon.css({'position':'relative'});
            }
        }

        StageController.addListener("contents", onResize);

        _$txt = txt;
        _$item = item;

        if (_isTranslate3d) {
            if (_transform == null) {
                _transform = new PerspectiveTransform($('#mask')[0], _img_w, _img_h, true);
            }
            showMask(no, curBg);
        } else {
            showMaskIE(no, curBg);
        }
    }

    function onResize(){
        var sh = StageController.stageHeight, sw = StageController.stageWidth,
            dh = sh - 180, dw = (_img_w * (dh / _img_h)) | 0;

        if (dw > 700) {
            dw = 700;
            dh = 986;
        }
        if (dw > sw - 220) {
            dw = sw - 220;
            dh = (_img_h * (dw / _img_w)) | 0;
        }

        var dx = sw - dw >> 1, dy = ((sh - dh) >> 1) + 2;

        _saveDetailPos.x = dx;
        _saveDetailPos.y = dy;
        _saveDetailPos.w = dw;
        _saveDetailPos.h = dh;
        //$posterImg.css({'width':dw + 'px', 'height':dh + 'px', 'left':dx + 'px', 'top':dy + 'px'});
        $posterImg.style.left = dx + 'px';
        $posterImg.style.top = dy + 'px';
        $posterImg.style.width = dw + 'px';
        $posterImg.style.height = dh + 'px';

        if (_isNotWebkit) {
            $loadCon.css({'width':sw + 'px', 'height':sh + 'px'});
        }
    }



    function pause() {
        //console.log("content pause")
        if (_curMode == 0) {
            CircleAniamtion.pause();
        } else {
            StageController.pauseContent(CMDetect.saveID);
        }
    }

    function resume() {
        //console.log("content resume")
        if (_curMode == 0) {
            CircleAniamtion.resume();
        } else {
            StageController.resumeContent(CMDetect.saveID);
        }

        Address.able();
    }



    function goBackAnimation() {
        setMask(_saveDetailPos.x, _saveDetailPos.y,
                _saveDetailPos.x + _saveDetailPos.w, _saveDetailPos.y,
                _saveDetailPos.x, _saveDetailPos.y + _saveDetailPos.h,
                _saveDetailPos.x + _saveDetailPos.w, _saveDetailPos.y + _saveDetailPos.h);

        $mask.show();
        $posterCon.hide();


        var pos = Home.posArr[_saveNo].pos,
            imgPos = Home.circlePos(pos),
            rot = pos + 90,
            saveTransformPos = setSaveTransform(imgPos, rot);

        enginMask(saveTransformPos.topLeft.x, saveTransformPos.topLeft.y,
                saveTransformPos.topRight.x, saveTransformPos.topRight.y,
                saveTransformPos.bottomLeft.x, saveTransformPos.bottomLeft.y,
                saveTransformPos.bottomRight.x, saveTransformPos.bottomRight.y,
            changeHome2);

    }

    function goBackAnimationIE() {
        $mask.show();
        $posterCon.hide();

        TweenLite.to($mask,0, {
            css:{left:_saveDetailPos.x, top:_saveDetailPos.y, width:_saveDetailPos.w, height:_saveDetailPos.h},
            ease:Cubic.easeInOut
        });

        var pos = Home.posArr[_saveNo].pos,
            imgPos = Home.circlePos(pos),
            rot = pos + 90,
            saveTransformPos = setSaveTransform(imgPos, rot);

        TweenLite.to($mask,0.8, {
            delay:0.1,
            css:{left:saveTransformPos.topLeft.x, top:saveTransformPos.topLeft.y, width:220, height:310},
            ease:Expo.easeInOut,
            onComplete:changeHome2
        });
    }

    function goBackDirect() {
        StageController.pauseContent(CMDetect.saveID);
        //changeHome2();
        var pos = Home.posArr[_saveNo].pos,
            imgPos = Home.circlePos(pos),
            rot = pos + 90,
            saveTransformPos = setSaveTransform(imgPos, rot);

        TweenLite.to($contents, 0.6, {
            css:{left:saveTransformPos.topLeft.x, top:saveTransformPos.topLeft.y, width:220, height:310},
            ease:Expo.easeOut,
            onComplete:changeHome2
        });
        if (_isNotWebkit) {
            TweenLite.to($loadCon, 0.6, {
                css:{marginLeft:-saveTransformPos.topLeft.x, marginTop:-saveTransformPos.topLeft.y},
                ease:Expo.easeOut
            });
        }

        CloseButton.remove();
        ShareButtons.remove();

        Address.blackTop();
    }


    function changeHome() {
        Address.unable();



        Home.initBackHome();

        if (_curMode == 1) {
            TweenLite.delayedCall(0.1, goBackDirect);
            Home.backToHome();

        } else {
            CircleAniamtion.cancel();
            CloseButton.hide();
            ShareButtons.hide();
            if (_isTranslate3d) {
                goBackAnimation();
            } else {
                goBackAnimationIE();
            }

        }
    }

    function changeHome2() {

        TweenLite.to($contents, 0.3, {
            css:{autoAlpha:0},
            ease:Cubic.easeIn,
            onComplete:dispose
        });

        if (_curMode == 0) {
            Home.backToHome();
            TweenLite.delayedCall(.1, Address.blackTop);
        }
    }

    function dispose() {
        $posterCon.hide();
        $loadCon.html('').hide();
        $detailCon.show();

        //console.log("content dispose")
        StageController.removeListener("contents");
        StageController.disposeContent(CMDetect.saveID);

        $contents.css({'left':0, 'top':0, 'width':'100%', 'height':'100%', 'background-color':'transparent'}).hide();

        TweenLite.to($contents, 0, {
            css:{autoAlpha:1}
        });
        TweenLite.to($posterCon,0, {
            css:{left:0}
        });
        //$loadCon.css('z-index', '135');


        if (_isNotWebkit) {
            $loadCon.css({'margin':'0', 'width':'100%', 'height':'100%'});
        }

        TweenLite.to($loadCon,0, {
            css:{left:'100%'}
        });

        Home.endBackToHome();
    }

    function showMaskIE(no, curBg) {
        var pos = Home.posArr[no].pos,
            imgPos = Home.circlePos(pos),
            rot = pos + 90,
            saveTransformPos = setSaveTransform(imgPos, rot),
            simg = ConfigModel.configArr[curBg].poster.img + '_s.jpg',
            bimg = ConfigModel.configArr[curBg].poster.img + '_b.jpg';

        _curMode = 0;
        _saveNo = no;
        _saveCurBg = curBg;

        $contents.show();
        $mask.html('<img src="' + simg + '" width="100%" height="100%" />').hide();
        $($posterImg).html('<img src="' + bimg + '" width="100%" height="100%" />');

        TweenLite.delayedCall(.2, delayedShowMaskIE, [saveTransformPos]);
    }

    function delayedShowMaskIE(saveTransformPos) {
        TweenLite.to($(_$item),.5, {
            css:{opacity:0},
            ease:Cubic.easeIn
        });

        TweenLite.to($mask,0, {
            css:{left:saveTransformPos.topLeft.x, top:saveTransformPos.topLeft.y, width:220, height:310},
            ease:Cubic.easeInOut
        });

        TweenLite.to($mask,0.8, {
            delay:0.1,
            css:{left:_saveDetailPos.x, top:_saveDetailPos.y, width:_saveDetailPos.w, height:_saveDetailPos.h},
            ease:Expo.easeInOut,
            onComplete:finishedShowContent
        });
        $mask.show();
    }


    function showMask(no, curBg) {
        var pos = Home.posArr[no].pos,
            imgPos = Home.circlePos(pos),
            rot = pos + 90,
            saveTransformPos = setSaveTransform(imgPos, rot),
            itemcolor = ConfigModel.configArr[curBg].poster.itemcolor,
            simg = ConfigModel.configArr[curBg].poster.img + '_c.png',
            bimg = ConfigModel.configArr[curBg].poster.img + '_cb.png';

        _curMode = 0;
        _saveNo = no;
        _saveCurBg = curBg;

        $contents.show();

        //$mask.css('background', itemcolor).show();
        //$($posterImg).css('background', itemcolor);
        $($posterImg).css('background', itemcolor).html('<img src="' + bimg + '" width="100%" height="100%" />');
        $mask.css('background', itemcolor + ' url(' + simg + ') no-repeat');


        setMask(saveTransformPos.topLeft.x, saveTransformPos.topLeft.y,
            saveTransformPos.topRight.x, saveTransformPos.topRight.y,
            saveTransformPos.bottomLeft.x, saveTransformPos.bottomLeft.y,
            saveTransformPos.bottomRight.x, saveTransformPos.bottomRight.y);

        TweenLite.delayedCall(0.2, delayedShowMask);
    }

    function delayedShowMask() {
        $mask.show();
        enginMask(_saveDetailPos.x, _saveDetailPos.y,
            _saveDetailPos.x + _saveDetailPos.w, _saveDetailPos.y,
            _saveDetailPos.x, _saveDetailPos.y + _saveDetailPos.h,
            _saveDetailPos.x + _saveDetailPos.w, _saveDetailPos.y + _saveDetailPos.h,
            finishedShowContent);

        TweenLite.to($(_$item),.3, {
            css:{opacity:0},
            ease:Cubic.easeOut
        });
    }

    function finishedShowContent() {
        var bgcolor = ConfigModel.configArr[_saveCurBg].poster.bgcolor;
        $contents.css({'background-color':bgcolor}).show();

        // dispose home
        Home.dispose();

        $mask.hide();
        $posterCon.show();


        $loadCon.html(_saveData);
        _saveData = null;

        TweenLite.to($(_$item),0, {
            css:{opacity:1}
        });
        TweenLite.to(_$txt,0, {
            css:{color:'#bcbbc5'}
        });

        var delay = 0.2;
        if (_isTouch) delay = 0.4;

        TweenLite.delayedCall(delay, showSide);
    }

    function showSide() {
        ShareButtons.show(_saveCurBg);
        CloseButton.show(endShowClose, onClose);
    }

    function endShowClose() {
        var delay = 0.1;
        if (_isTouch) delay = 0.4;
        TweenLite.delayedCall(delay, startCircleAni);
    }

    function startCircleAni() {
        CircleAniamtion.show('circleCon', 2, delayStart);
        Address.able();
    }


    function delayStart() {
        Address.unable();

        _curMode = 1;

        $loadCon.css('left','100%').show();

        TweenLite.to($posterCon,1, {
            css:{left:'-100%'},
            ease:Expo.easeInOut
        });
        TweenLite.to($loadCon,1, {
            delay:.3,
            css:{left:0},
            ease:Expo.easeInOut,
            onComplete:startData
        });

    }

    function startData() {

        $detailCon.hide();

        StageController.startContent(CMDetect.saveID);
        Address.able();

        if (CMDetect.isPaused) {
            pause();
        }
    }



    function setSaveTransform(imgPos, rot) {
        var saveTransformPos = {topLeft:{x:0, y:0}, topRight:{x:0, y:0}, bottomLeft:{x:0, y:0}, bottomRight:{x:0, y:0}};
        saveTransformPos.topLeft = transformation(imgPos.x + _img_h_w, imgPos.y + _img_h_h, imgPos.x, imgPos.y, rot * PI);
        saveTransformPos.topRight = transformation(imgPos.x + _img_h_w, imgPos.y + _img_h_h, imgPos.x + _img_w, imgPos.y, rot * PI);
        saveTransformPos.bottomLeft = transformation(imgPos.x + _img_h_w, imgPos.y + _img_h_h, imgPos.x, imgPos.y + _img_h, rot * PI);
        saveTransformPos.bottomRight = transformation(imgPos.x + _img_h_w, imgPos.y + _img_h_h, imgPos.x + _img_w, imgPos.y + _img_h, rot * PI);
        return saveTransformPos;
    }

    function setMask(top_left_x, top_left_y,
                     top_right_x, top_right_y,
                     bottom_left_x, bottom_left_y,
                     bottom_right_x, bottom_right_y) {
        _transform.topLeft.x = top_left_x;
        _transform.topLeft.y = top_left_y;
        _transform.topRight.x = top_right_x;
        _transform.topRight.y = top_right_y;
        _transform.bottomLeft.x = bottom_left_x;
        _transform.bottomLeft.y = bottom_left_y;
        _transform.bottomRight.x = bottom_right_x;
        _transform.bottomRight.y = bottom_right_y;
        _transform.update();
    }

    function enginMask(top_left_x, top_left_y,
                       top_right_x, top_right_y,
                       bottom_left_x, bottom_left_y,
                       bottom_right_x, bottom_right_y,
                       func) {

        var delay1 = 0.1, delay2 = .3, delay3 = .2, delay4 = .4,
            time = 0.4, ease = Quad.easeOut;

        TweenLite.to(_transform.topLeft,time, {
            delay:delay1,
            x:top_left_x,
            y:top_left_y,
            ease:ease,
            onUpdate:function() {
                _transform.update();
            }
        });
        TweenLite.to(_transform.topRight,time, {
            delay:delay2,
            x:top_right_x,
            y:top_right_y,
            ease:ease,
            onUpdate:function() {
                _transform.update();
            }
        });
        TweenLite.to(_transform.bottomLeft,time, {
            delay:delay3,
            x:bottom_left_x,
            y:bottom_left_y,
            ease:ease,
            onUpdate:function() {
                _transform.update();
            }
        });
        TweenLite.to(_transform.bottomRight,time, {
            delay:delay4,
            x:bottom_right_x,
            y:bottom_right_y,
            ease:ease,
            onUpdate:function() {
                _transform.update();
            },
            onComplete:func
        });

    }


    function onClose() {
        Address.goHome();
    }




    function transformation(cx, cy, px, py, rad) {
        var rx = Math.cos(rad) * (px - cx) - Math.sin(rad) * (py - cy) + cx,
            ry = Math.sin(rad) * (px - cx) + Math.cos(rad) * (py - cy) + cy;
        return {x:rx , y:ry};
    }

    function setData(data, id) {
        CMDetect.saveID = id;
        _saveData = data;
    }


    return {
        init: init,
        pause: pause,
        resume: resume,
        changeHome: changeHome,
        setData: setData
    }

} )();
