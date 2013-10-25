var StageController = StageController || ( function () {
    
    var _public = {
        windowWidth: 0,
        windowHeight: 0,
        minWidth: 900,
        minHeight: 645,
        stageWidth: 0,
        stageHeight: 0
    };
    
    var _funcArr = [],
        _nameArr = [],
        _disposeArr = [],
        _disposeNameArr = [],
        _startArr = [],
        _startNameArr = [],
        _pauseArr = [],
        _pauseNameArr = [],
        _resumeArr = [],
        _resumeNameArr = [],
        _keyArr = [],
        _keyNameArr = [],
        _touchStartArr = [],
        _touchMoveArr = [],
        _touchEndArr = [],
        _touchNameArr = [],

        _moveStartArr = [],
        _moveMoveArr = [],
        _moveEndArr = [],
        _moveNameArr = [];
        
    function init(){
        $(window).resize(onResize); 
        onResize();

        //Keyboard Controls
        $(window).keydown(onKeyDown);
        
        if (CMDetect.isTouch) {
            $(document)[0].addEventListener('touchstart', touchStartHandler, true);
            $(document)[0].addEventListener('touchmove', touchMoveHandler, true);
            $(document)[0].addEventListener('touchend', touchEndHandler, true);
        } else {
            $(document).on('mousedown', onDown);
            $(document).on("mousemove", onMove);
            $(document).on("mouseup", onUp);
        }

    }

    /* move event */
    function addMove(name, start, move, end) {
        var check = jQuery.inArray(name, _moveNameArr);
        if (check > -1) {
            return;
        }
        _moveNameArr.unshift(name);
        _moveStartArr.unshift(start);
        _moveMoveArr.unshift(move);
        _moveEndArr.unshift(end);
    }

    function removeMove(name) {
        var check = jQuery.inArray(name, _moveNameArr);
        if (check > -1) {
            _moveNameArr.splice(check, 1);
            _moveStartArr.splice(check, 1);
            _moveMoveArr.splice(check, 1);
            _moveEndArr.splice(check, 1);
        }
    }

    function onDown(event) {
        var i = _moveStartArr.length;
        while(i--) _moveStartArr[i](event);
    }
    function onMove(event) {
        var i = _moveMoveArr.length;
        while(i--) _moveMoveArr[i](event);
    }
    function onUp(event) {
        var i = _moveEndArr.length;
        while(i--) _moveEndArr[i](event);
    }





    /* touch event */
    function addTouch(name, start, move, end) {
        var check = jQuery.inArray(name, _touchNameArr);
        if (check > -1) {
            return;
        }
        _touchNameArr.unshift(name);
        _touchStartArr.unshift(start);
        _touchMoveArr.unshift(move);
        _touchEndArr.unshift(end);
    }
    
    function removeTouch(name) {        
        var check = jQuery.inArray(name, _touchNameArr);    
        if (check > -1) {
            _touchNameArr.splice(check, 1);
            _touchStartArr.splice(check, 1);
            _touchMoveArr.splice(check, 1);
            _touchEndArr.splice(check, 1);
        }
    }
    
    function touchStartHandler(event) {
        var i = _touchStartArr.length;
        while(i--) _touchStartArr[i](event);
    }

    function touchMoveHandler(event) {
        event.preventDefault();
        //var mx = e.touches[0].pageX,
         //   my = e.touches[0].pageY,
        var i = _touchMoveArr.length;
        while(i--) _touchMoveArr[i](event);
    }
    
    function touchEndHandler(event) {
        var i = _touchEndArr.length;
        while(i--) _touchEndArr[i](event);
    }
 
    /* resize */
    function addListener(name, func) {
        var check = jQuery.inArray(name, _nameArr);
        if (check > -1) {
            return;
        }
        _nameArr.unshift(name);
        _funcArr.unshift(func);
        func();
    }
    
    function removeListener(name) {        
        var check = jQuery.inArray(name, _nameArr);    
        if (check > -1) {
            _nameArr.splice(check, 1);
            _funcArr.splice(check, 1);
        }
    }

    function onResize() {
        if (document.documentElement) {
            _public.windowWidth = document.documentElement.clientWidth;
            _public.windowHeight = document.documentElement.clientHeight;
        } else if (document.body.clientWidth) {
            _public.windowWidth = document.body.clientWidth;
            _public.windowHeight = document.body.clientHeight;
        } else {
            _public.windowWidth = window.innerWidth;
            _public.windowHeight = window.innerHeight;
        }
        
        _public.stageWidth = _public.windowWidth < _public.minWidth ? _public.minWidth : _public.windowWidth;
        _public.stageHeight = _public.windowHeight < _public.minHeight ? _public.minHeight : _public.windowHeight;


        var i = _funcArr.length;
        while(i--) _funcArr[i]();
    }

    /* dispose */
    function addDispose(name, func) {
        var check = jQuery.inArray(name, _disposeNameArr);
        if (check > -1) {
            return;
        }
        _disposeNameArr.unshift(name);
        _disposeArr.unshift(func);
    }

    function disposeContent(name) {
        var check = jQuery.inArray(name, _disposeNameArr);
        if (check > -1) {
            _disposeArr[check]();
            _disposeNameArr.splice(check, 1);
            _disposeArr.splice(check, 1);
        }
    }

    /* start */
    function addStart(name, func) {
        var check = jQuery.inArray(name, _startNameArr);
        if (check > -1) {
            return;
        }
        _startNameArr.unshift(name);
        _startArr.unshift(func);
    }

    function startContent(name) {
        var check = jQuery.inArray(name, _startNameArr);
        if (check > -1) {
            _startArr[check]();
        }
    }

    function removeStart(name) {
        var check = jQuery.inArray(name, _startNameArr);
        if (check > -1) {
            _startNameArr.splice(check, 1);
            _startArr.splice(check, 1);
        }
    }

    /* pause */
    function addPause(name, func) {
        var check = jQuery.inArray(name, _pauseNameArr);
        if (check > -1) {
            return;
        }
        _pauseNameArr.unshift(name);
        _pauseArr.unshift(func);
    }

    function pauseContent(name) {
        var check = jQuery.inArray(name, _pauseNameArr);
        if (check > -1) {
            _pauseArr[check]();
        }
    }

    function removePause(name) {
        var check = jQuery.inArray(name, _pauseNameArr);
        if (check > -1) {
            _pauseNameArr.splice(check, 1);
            _pauseArr.splice(check, 1);
        }
    }

    /* resume */
    function addResume(name, func) {
        var check = jQuery.inArray(name, _resumeNameArr);
        if (check > -1) {
            return;
        }
        _resumeNameArr.unshift(name);
        _resumeArr.unshift(func);
    }

    function resumeContent(name) {
        var check = jQuery.inArray(name, _resumeNameArr);
        if (check > -1) {
            _resumeArr[check]();
        }
    }

    function removeResume(name) {
        var check = jQuery.inArray(name, _resumeNameArr);
        if (check > -1) {
            _resumeNameArr.splice(check, 1);
            _resumeArr.splice(check, 1);
        }
    }
    
    /* keyboard event */
    function addKeydown(name, func) {
        var check = jQuery.inArray(name, _keyNameArr);
        if (check > -1) {
            return;
        }
        _keyNameArr.unshift(name);
        _keyArr.unshift(func);
    }
    
    function removeKeydown(name) {  
        var check = jQuery.inArray(name, _keyNameArr);    
        if (check > -1) {
            _keyNameArr.splice(check, 1);
            _keyArr.splice(check, 1);
        }
    }
    
    function onKeyDown(e) {
        var i = _keyArr.length;
        while(i--) _keyArr[i](e);
    }
            
    $(document).ready(init);
    
    _public.addListener = addListener;
    _public.removeListener = removeListener;
    _public.onResize = onResize;
    _public.addDispose = addDispose;
    _public.disposeContent = disposeContent;
    _public.addKeydown = addKeydown;
    _public.removeKeydown = removeKeydown;
    _public.addTouch = addTouch;
    _public.removeTouch = removeTouch;
    _public.addMove = addMove;
    _public.removeMove = removeMove;
    _public.addPause = addPause;
    _public.pauseContent = pauseContent;
    _public.removePause = removePause;
    _public.addResume = addResume;
    _public.resumeContent = resumeContent;
    _public.removeResume = removeResume;
    _public.addStart = addStart;
    _public.startContent = startContent;
    _public.removeStart = removeStart;

    return _public;
    
} )();