var ScreenDraw = ScreenDraw || ( function () {
    var _context, _curNo, _prevNo, CTX_W = 441, CTX_H = 277, _draw,
        _rgbArr = [{h:201, s:68, l:47}, {h:0, s:0, l:7}, {h:200, s:100, l:35}, {h:0, s:0, l:87}],
        _rgbMotion, _rgbS;

    function drawFirst(no, ctx) {
        _curNo = no;
        _context = ctx;
        switch (_curNo) {
            case 0:
                _draw = new SSSheeps(_context, CTX_W, CTX_H);
                break;
            case 1:
                _draw = new SSScream(_context, CTX_W, CTX_H);
                break;
            case 2:
                _draw = new SSWiper(_context, CTX_W, CTX_H);
                break;
            case 3:
                _draw = new SSRain(_context, CTX_W, CTX_H);
                break;
        }
        _context.fillStyle = 'hsl(' + _rgbArr[_curNo].h + ', ' + _rgbArr[_curNo].s + '%, ' + _rgbArr[_curNo].l + '%)';
        _context.fillRect(0, 0, CTX_W, CTX_H);
    }

    function drawSecond(no, ctx) {
        _prevNo = _curNo;
        _curNo = no;
        _context = ctx;
        switch (_curNo) {
            case 0:
                _draw = new SSSheeps(_context, CTX_W, CTX_H);
                break;
            case 1:
                _draw = new SSScream(_context, CTX_W, CTX_H);
                break;
            case 2:
                _draw = new SSWiper(_context, CTX_W, CTX_H);
                break;
            case 3:
                _draw = new SSRain(_context, CTX_W, CTX_H);
                break;
        }

        _rgbMotion = _rgbArr[_prevNo];
        _rgbS = {l:_rgbMotion.l};
        _context.fillStyle = 'hsl(' + _rgbMotion.h + ', ' + _rgbMotion.s + '%, ' + _rgbS.l + '%)';
        _context.fillRect(0, 0, CTX_W, CTX_H);

        TweenLite.killTweensOf(_rgbMotion);
        TweenLite.to(_rgbS, 0.2, {
            l:0,
            onUpdate:updateDraw,
            onComplete:showBg
        });
    }

    function showBg() {
        _rgbMotion = _rgbArr[_curNo];
        _rgbS = {l:0};
        _context.fillStyle = 'hsl(' + _rgbMotion.h + ', ' + _rgbMotion.s + '%, ' + _rgbS.l + '%)';
        _context.fillRect(0, 0, CTX_W, CTX_H);

        TweenLite.to(_rgbS, 0.2, {
            l:_rgbMotion.l,
            onUpdate:updateDraw
        });
    }

    function updateDraw() {
        _context.fillStyle = 'hsl(' + _rgbMotion.h + ', ' + _rgbMotion.s + '%, ' + _rgbS.l + '%)';
        _context.fillRect(0, 0, CTX_W, CTX_H);
    }


    function draw() {
        _draw.loop();
    }

    function dispose() {
        _draw.dispose();
        _draw = null;
    }

    return {
        drawSecond: drawSecond,
        drawFirst: drawFirst,
        draw: draw,
        dispose: dispose
    }

} )();






var SSRain = function(ctx, sw, sh) {
    var _context = ctx, _sw = sw, _sh = sh, MAX = 30, _itemArr = [], curTime;

    function init() {
        _itemArr = [];
        var i, item;
        for (i = 0; i < MAX; i++) {
            item = new RainmenItemsSS(_context, _sw, _sh);
            _itemArr[i] = item;
        }
        curTime = new Date().getTime();
    }
    function loop() {
        var now = new Date().getTime(),
            dt = now - curTime;
        if (dt > 20) {
            curTime = now;
            _context.fillStyle = 'rgb(221, 221, 221)';
            _context.fillRect (0 , 0, _sw, _sh);
            var i, item;
            for (i = 0; i < MAX; i++) {
                item = _itemArr[i];
                item.loop();
            }
        }
    }
    function dispose() {
        _context = null;
        var i, item;
        for (i = 0; i < MAX; i++) {
            item = _itemArr[i];
            item.dispose();
        }
        _itemArr = [];
    }
    init();

    return {
        loop : loop,
        dispose : dispose
    }
};

var SSWiper = function(ctx, sw, sh) {

    var _context = ctx, _sw = sw, _sh = sh,
        _balls, _ballNum = 100, _lineNum = 32, _totalNum = _ballNum + _lineNum,
        LINE_H = 11, BALL_WIDTH = 26, GRAVITY = 0.1, SPRING = 0.4, FRICTION = 0.96,
        _sita = {no:0}, _lineSita = 0,
        STR_ARR = ["T", "Y", "P", "O", "G", "R", "H"], _strTotal = STR_ARR.length;

    function init() {
        makeTypo();
    }

    function loop() {
        _context.fillStyle = 'rgb(0, 116, 176)';
        _context.fillRect (0 , 0, _sw, _sh);
        collisionBalls();
        drawBalls();
    }

    function dispose() {
        _context = null;
    }

    function makeTypo() {
        _balls = [];
        var ball, line;
        for(var i = 0; i < _ballNum; i++){
            ball = new WiperTypo(_context, BALL_WIDTH, FRICTION, GRAVITY, _sw, _sh, STR_ARR, _strTotal, 20, 0, 8);
            _balls[i] = ball;
        }
        for(var j = 0; j < _lineNum; j++){
            line = new WiperLine(_context, j, LINE_H, _sw, _sh);
            _balls[i + j] = line;
        }
    }

    function collisionBalls(){
        var ballA, ballB, dx, dy, dist, minDist, angle, tx, ty, ax, ay,
            i, j;
        for (i = 0; i < _totalNum - 1; i++){
            ballA = _balls[i];
            for (j = i + 1; j < _totalNum; j++){
                ballB = _balls[j];
                dx = ballB.x - ballA.x;
                dy = ballB.y - ballA.y;
                dist = Math.sqrt(dx * dx + dy * dy);
                minDist = ballA.radius + ballB.radius;
                if(dist < minDist){
                    angle = Math.atan2(dy, dx);
                    tx = ballA.x + Math.cos(angle) * minDist;
                    ty = ballA.y + Math.sin(angle) * minDist;
                    ax = (tx - ballB.x) * SPRING;
                    ay = (ty - ballB.y) * SPRING;
                    ballA.vx -= ax;
                    ballA.vy -= ay;
                    ballB.vx += ax;
                    ballB.vy += ay;
                }
            }
        }
    }

    function drawBalls(){
        var typo, i;
        _lineSita += 0.01;
        _sita.no = Math.abs(Math.sin(_lineSita));
        for(i = 0; i < _totalNum; i++){
            typo = _balls[i];
            typo.draw();
            typo.move(_sita.no);
        }


    }

    init();

    return {
        loop : loop,
        dispose : dispose
    }
};





var SSScream = function(ctx, sw, sh) {

    var _context = ctx, _contextColor, _imgData, _sw = sw, _sh = sh, _imgW, _imgH, _brush;

    function init() {
        $('#screen-contents').append('<canvas id="ss-scream-color" class="disabled"></canvas>');
        var canvasColor = document.getElementById('ss-scream-color');
        canvasColor.width = _sw;
        canvasColor.height = _sh;
        _contextColor = canvasColor.getContext('2d');
        _imgData = new Image();
        _imgData.src = 'contents/scream/screammonk.jpg';
        _imgData.onload = loadedImg;
    }

    function loadedImg(){
        _imgW = _imgData.width;
        _imgH = _imgData.height;

        var sPer = _sw / _sh, imgPer = _imgW / _imgH,
            posW = _sw,
            posH = _sh,
            posX = 0,
            posY = 0;

        if (imgPer < sPer) {
            posW = (0.5 + (_imgW * (_sh / _imgH))) | 0;
            posX = (0.5 + ((_sw - posW) / 2)) | 0;
        } else {
            posH = (0.5 + (_imgH * (_sw / _imgW))) | 0;
            posY = (0.5 + ((_sh - posH) / 2)) | 0;
        }

        _contextColor.fillStyle = 'rgb(17, 17, 17)';
        _contextColor.fillRect(0, 0, _sw, _sh);
        _contextColor.drawImage(_imgData , posX, posY, posW, posH);

        _brush = new TheScreamDraw();
        _brush.init(_context, _contextColor, 0.2, 5, 2);
        _brush.resize(posX, posY, posW, posH, _sw, _sh);
    }

    function loop() {
        _brush.loop();
    }

    function dispose() {
        $("#ss-scream-color").remove();
        _context = null;
        _contextColor = null;
        _imgData = null;
    }

    init();

    return {
        loop : loop,
        dispose : dispose
    }
};





var SSSheeps = function(ctx, sw, sh) {
    var _context = ctx, _sw = sw, _sh = sh, _sheeps = [], curTime, _total = 0;

    function init() {
        curTime = new Date().getTime();
        addSheep();
    }
    function addSheep() {
        getSheep();
        TweenLite.delayedCall(1 + Math.random(), addSheep);
    }
    function getSheep() {
        var i, sheep;
        for (i=0; i<_total; i++) {
            sheep = _sheeps[i];
            if (!sheep.show) {
                sheep.reset();
                return;
            }
        }
        sheep = new SheepItemsSS(_context, _sw, _sh);
        _sheeps.push(sheep);
        _total = _sheeps.length;
    }
    function loop() {
        var now = new Date().getTime(),
            dt = now - curTime;
        if (dt > 34) {
            curTime = now;
            _context.fillStyle = 'rgb(37, 142, 204)';
            _context.fillRect (0 , 0, _sw, _sh);
            var i, item;
            for (i = 0; i < _total; i++) {
                item = _sheeps[i];
                item.loop();
            }
        }
    }
    function dispose() {
        TweenLite.killDelayedCallsTo(addSheep);
        _context = null;
        var i, item;
        for (i = 0; i < _total; i++) {
            item = _sheeps[i];
            item.dispose();
        }
        _sheeps = [];
    }
    init();

    return {
        loop : loop,
        dispose : dispose
    }
};




(function(window) {
    function RainmenItemsSS() {
        this.init.apply(this, arguments);
    }
    RainmenItemsSS.prototype = {
        init : function(ctx, sw, sh) {
            this.mx = 0;
            this.ctx = ctx;
            this.sw = sw;
            this.sh = sh;
            this.img = new Image();
            this.img.src = "images/ss-rain.png";
            this.reset();
        },
        dispose : function() {
            this.img = null;
        },
        reset : function() {
            this.posX = CMUtiles.randomInteger(-20, this.sw + 20);
            this.posY = CMUtiles.randomInteger(97, 500) * -1;
            this.duration = CMUtiles.randomInteger(10, 3);
            var scale = this.duration * 0.1;
            this.tw = 57 * scale;
            this.th = 95 * scale;
            this.duration = (this.duration / 4);

        },
        loop : function() {
            this.posY = (this.posY + this.duration);
            if (this.posY > this.sh || this.posX < -97 || this.posX > this.sw + 97) {
                this.reset();
                return;
            }
            this.mx = this.mx * 0.995;
            this.posX += this.mx;
            this.ctx.drawImage(this.img, this.posX, this.posY, this.tw, this.th);
        }
    };

    function SheepItemsSS() {
        this.init.apply(this, arguments);
    }
    SheepItemsSS.prototype = {
        init : function(ctx, sw, sh) {
            this.show = false;
            this.ctx = ctx;
            this.sw = sw;
            this.sh = sh;
            this.tw = 77;
            this.th = 59;
            this.cur = 0;
            this.last = 8;
            this.ty = this.sh - 80;
            this.img = new Image();
            this.img.src = "images/sheep-ani-ss.png";
            this.reset();
        },
        dispose : function() {
            this.img = null;
            this.show = false;
        },
        reset : function() {
            this.speed = (0.5 + (Math.random()*(6-3) + 3)) | 0;
            this.tx = this.sw + 5;
            this.show = true;
        },
        loop : function() {
            if (!this.show) return;
            this.tx = this.tx - this.speed;
            if (this.tx < -100) {
                this.show = false;
            } else {
                this.cur = (this.cur + 1) % this.last;
                var x = this.cur * 82;
                //sprites,srcX,srcY,srcW,srcH,destX,destY,destW,destH
                this.ctx.drawImage(this.img, x, 0, this.tw, this.th, this.tx, this.ty, this.tw, this.th);
            }
        }
    };
    window.RainmenItemsSS = RainmenItemsSS;
    window.SheepItemsSS = SheepItemsSS;

})(window);