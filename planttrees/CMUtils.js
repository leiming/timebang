var CMUtiles = CMUtiles || ( function () {
    
    var _public = {};

    //var _randomCur = 0, _randomArr;
    
    function getFullSize(stageW, stageH, imgW, imgH) {
        var sPer = stageW / stageH,
            imgPer = imgW / imgH,
            tw = stageW,
            th = stageH,
            tx = 0,
            ty = 0;
                
        if (imgPer > sPer) {
            tw = (0.5 + (imgW * (stageH / imgH))) | 0;
            tx = (0.5 + ((stageW - tw) / 2)) | 0;
        } else {
            th = (0.5 + (imgH * (stageW / imgW))) | 0;
            ty = (0.5 + ((stageH - th) / 2)) | 0;
        }
        
        return [tw, th, tx, ty];
    }
    
    function getInsideMax(no, total) {  
        return (no + (total * (Math.abs((no / 10) | 0) + 1))) % total;
    }

    function getCurrent($cur, $top, $bottom, $min, $max)
    {
        return ($max - $min) / ($bottom - $top) * ($cur - $top) + $min;
    }

    function getWallPosition($index, $x_num, $x_gap, $y_gap)
    {
        var tx = ($index % $x_num) * $x_gap,
            ty = (($index / $x_num) | 0) * $y_gap;
        return [tx, ty];
    }
    
    function openPopup(url, name, width, height) {  
        var wx = (screen.width - width) >> 1,
            wy = (screen.height - height) >> 1;
        window.open(url, name, "top="+wy+",left="+wx+",width="+width+",height="+height);
    }
    
    function addZeros(num, no) {
        var str = num.toString(),
            zero = "",
            len = str.length,
            total = no + 1;
        if (len < total) {
            var zeroTotal = total - len, i;
            for (i = 1; i <= zeroTotal; i++) zero += "0";
            str = zero + str;
        }
        return str;
    }

    function addDots(num, dot) {
        var arr = num.toString().split(""),
            tlen = arr.length,
            clen = (tlen / 3),
            i,
            fclen = (clen << 0);
        fclen = (fclen == clen)? fclen: fclen + 1;

        for (i = 1; i < fclen; i++) arr.splice(tlen - i * 3, 0, dot);
        return arr.join("");
    }


    function randomInteger(low, high) {
        return (0.5 + (Math.random()*(high-low) + low)) | 0;
    }

    function randomFloat(low, high) {
        return low + Math.random() * (high - low);
    }

    /*
    function randomInteger(low, high) {
        return low + ((getRandom() * (high - low)) | 0);
    }


    function randomFloat(low, high) {
        return low + getRandom() * (high - low);
    }
     */
    /*
    function initRandom() {
        if (_randomArr == null) {
            _randomArr = [];
            var i;
            for(i = 0; i < 600; i++) {
                _randomArr[i] = Math.random();
            }
        }
    }

    function getRandom() {
        _randomCur += 1;
        if (_randomCur > 599) _randomCur = 0;
        return _randomArr[_randomCur];
    }
    */

    function isArray(value) {
        return Object.prototype.toString.call(value) === '[object Array]';
    }

    function isObject(value, ignoreArray) {
        return typeof value === 'object' && value !== null;
    }

    /*
    function ceil(value ) {
        //return (value + (value < 0 ? -0.5 : 0.5))|0;
        var f = (value << 0);
        return f = (f == value)? f: f + 1;
    }
    function floor(value ) {
        return value | 0;
    }
    function round(value ) {
        return (0.5 + value) | 0;
    }
    */

    /*
     var keyframes = findKeyframesRule("anim", window.CSSRule.WEBKIT_KEYFRAMES_RULE);
     keyframes.deleteRule("0%");
     keyframes.insertRule("0% { top: 50px; }");
     http://www.gitorious.org/~simon/qtwebkit/simons-clone/blobs/ceaa977f87947290fa2d063861f90c820417827f/LayoutTests/animations/change-keyframes.html
     */
    /*
    function findKeyframesRule(rule, type) {
        var ss = document.styleSheets;
        for (var i = 0; i < ss.length; ++i) {
            for (var j = 0; j < ss[i].cssRules.length; ++j) {
                if (ss[i].cssRules[j].type == type && ss[i].cssRules[j].name == rule)
                return ss[i].cssRules[j];
            }
        }
        return null;
    }
    */

    function shuffle(oldArray) {
        var newArray = oldArray.slice();
        var len = newArray.length;
        var i = len;
        while (i--) {
            var p = parseInt(Math.random()*len);
            var t = newArray[i];
            newArray[i] = newArray[p];
            newArray[p] = t;
        }
        return newArray;
    };
    
    _public.getFullSize = getFullSize;
    _public.getInsideMax = getInsideMax;
    _public.openPopup = openPopup;
    _public.addZeros = addZeros;
    _public.addDots = addDots;
    _public.getCurrent = getCurrent;
    _public.getWallPosition = getWallPosition;
    //_public.initRandom = initRandom;
    //_public.getRandom = getRandom;
    _public.randomInteger = randomInteger;
    _public.randomFloat = randomFloat;
    //_public.findKeyframesRule = findKeyframesRule;
    _public.isArray = isArray;
    _public.isObject = isObject;
    _public.shuffle = shuffle;

    
    return _public;    
} )();