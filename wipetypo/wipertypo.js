var wiperTypo = wiperTypo || ( function () {
    var _isPause = false, _sw, _sh, canvas, context, _lineSita, _isTouch = CMDetect.isTouch,
        _ballNum = 350, _lineNum, LINE_H = 22, _totalNum, _balls,
        _isDrag = false, _sita = {no:0}, $cursor, _startMx, _releaseDirection,
        BALL_WIDTH = 50, GRAVITY = 0.1, SPRING = 0.4, FRICTION = 0.96,
        STR_ARR = ["3", "6", "0", "安", "全", "卫", "士"], _strTotal = STR_ARR.length;

  /******************/
  _ballNum = 350;
  var STR_STR= "国内最大的免费安全平台。提供360安全卫士、360免费杀毒软件、360企业杀毒软件、360安全浏览器、360游戏保险箱及各种其他免费杀毒软件。杀木马、防欺诈、免费修电脑、保护电脑安全、保护上网安全，就用360";
  STR_ARR = STR_STR.split("");
  _strTotal = STR_ARR.length;
  /******************/
    function init() {
        _isPause = false;
        _totalNum = _ballNum + _lineNum;
        _lineSita = 0;
        canvas = document.getElementById('wipertypo-world');
        $cursor = document.getElementById('wipertypo-cursor');
        if (_isTouch) {
            _ballNum = 150;
        }
        _sita.no = 0;
        _startMx = -10;
        _releaseDirection = 1;
    }

    function start() {0
        console.log("wiperTypo start")
        requestAnimationFrame( animate );
        addEvent();
    }

    function dispose() {
        console.log("wiperTypo dispose")
        _isPause = true;
        _balls = [];
        canvas = null;
        context = null;
        removeEvent();
        _isDrag = false;
    }

    function pause() {
        console.log("wiperTypo pause")
        _isPause = true;
        removeEvent();
        _isDrag = false;
    }

    function resume() {
        console.log("wiperTypo resume")
        _isPause = false;
        requestAnimationFrame( animate );
        addEvent();
    }

    function resize() {
        if (context != null) {
            context.clearRect (0 , 0, _sw, _sh);
        }
        _sw = StageController.stageWidth;
        _sh = StageController.stageHeight;

        _lineNum = (_sh / LINE_H * 1.2) | 0;
        var max = 75;
        if (_isTouch) max = 60;
        if (_lineNum > max) _lineNum = max;
        _totalNum = _ballNum + _lineNum;

        canvas.width = _sw;
        canvas.height = _sh;
        context = canvas.getContext('2d');

        $cursor.style.width = (_sw - 200) + 'px';

        makeTypo();
    }

    function makeTypo() {
        _balls = [];
        var ball, line;
        for(var i = 0; i < _ballNum; i++){
            ball = new WiperTypo(context, BALL_WIDTH, FRICTION, GRAVITY, _sw, _sh, STR_ARR, _strTotal, 40, 0, 15);
            _balls[i] = ball;
        }
        for(var j = 0; j < _lineNum; j++){
            line = new WiperLine(context, j, LINE_H, _sw, _sh);
            _balls[i + j] = line;
        }
    }

    function animate() {
        if (_isPause) return;
        requestAnimationFrame( animate );
        loop();
    }
  
    function loop() {
        context.clearRect (0 , 0, _sw, _sh);
        collisionBalls();
        drawBalls();
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
        if (_isDrag) {

            for(i = 0; i < _totalNum; i++){
                typo = _balls[i];
                typo.draw();
                typo.move(_sita.no);
            }
        } else {
            _lineSita += 0.01;
            _sita.no = Math.abs(Math.sin(_lineSita));
            //console.log(_lineSita, Math.abs(Math.sin(_lineSita)))
            for(i = 0; i < _totalNum; i++){
                typo = _balls[i];
                typo.draw();
                typo.move(_sita.no);
            }
        }

    }






    function addEvent() {
        if (CMDetect.isTouch) {
            StageController.addTouch("wipertypo", touchStartHandler, touchMoveHandler, touchEndHandler);
        } else {
            StageController.addMove("wipertypo", onDown, onMove, onUp);
        }
    }

    function removeEvent() {
        if (CMDetect.isTouch) {
            StageController.removeTouch("wipertypo");
        } else {
            StageController.removeMove("wipertypo");
        }
    }


    // event
    function touchStartHandler(event) {
        var mx = event.touches[0].pageX;
        if (mx < 100 || mx > _sw - 100) {
            return;
        }
        _isDrag = true;
        mouseDown(mx);
    }
    function touchMoveHandler(event) {
        if (!_isDrag) return;
        var mx = event.touches[0].pageX;
        mouseDown(mx);
    }
    function touchEndHandler(event) {
        _isDrag = false;
        TweenLite.killTweensOf(_sita);
        _lineSita = Math.asin(_sita.no) * _releaseDirection;
        _startMx = -10;
    }

    function onDown(event) {
        var mx = event.pageX;
        if (mx < 100 || mx > _sw - 100) {
            return;
        }
        _isDrag = true;
        mouseDown(mx);
    }
    function onMove(event) {
        if (!_isDrag) return;
        var mx = event.pageX;
        mouseDown(mx);
    }
    function onUp(event) {
        _isDrag = false;
        TweenLite.killTweensOf(_sita);
        _lineSita = Math.asin(_sita.no) * _releaseDirection;
        _startMx = -10;
    }

    function mouseDown(mx) {
        if (!_isDrag) return;

        var mouseX = CMUtiles.getCurrent(mx, 100, _sw - 100, 0, 101) * 0.01;

        TweenLite.killTweensOf(_sita);
        TweenLite.to(_sita, 2, {
            no:mouseX
        });

        if (_startMx >= 0) {
            if (mx > _startMx) {
                _releaseDirection = 1;
            } else {
                _releaseDirection = -1;
            }
        } else {
            if (_sita.no > mouseX) {
                _releaseDirection = -1;
            } else {
                _releaseDirection = 1;
            }
        }

        _startMx = mx;


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






(function(window) {
    var PI = Math.PI;

    function WiperTypo(ctx, ballw, friction, gravity, sw, sh, str, strtotal, textSize, fx, fy) {
        this.w = ballw;
        this.radius = this.w * 0.5;
        this.color = 'rgb(255, 255, 255)';
        this.ctx = ctx;
        this.friction = friction;
        this.gravity = gravity;
        this.sw = sw;
        this.sh = sh;
        this.str = str;
        this.strtotal = strtotal;
        this.textSize = textSize;
        this.fx = fx;
        this.fy = fy;
        this.reset();
    }

    WiperTypo.prototype = {
        move : function(){
            this.vx *= this.friction;
            this.vy *= this.friction;
            this.vy += this.gravity;
            this.x += this.vx;
            this.y += this.vy;

            if (this.x - this.radius > this.sw) {
                this.reset();
            } else if (this.x + this.radius < 0) {
                this.reset();
            }
            if (this.y - this.radius > this.sh) {
                this.reset();
            } else if (this.y + this.radius < 0) {
                //this.reset();
            }
        },

        reset : function(){
            this.x = CMUtiles.randomInteger(0, this.sw);
            this.y = -30;
            this.vx = Math.random() * 6 - 3;
            this.vy = Math.random() * 6 - 3;
            this.rotate = 0;
            this.text = this.str[CMUtiles.randomInteger(0, this.strtotal - 1)];
        },

        draw : function(){
            this.rotate += 0.01;
            this.ctx.save();
/*
            this.ctx.beginPath();
            this.ctx.fillStyle = 'rgba(255,0,0,1)';
            this.ctx.arc(this.x, this.y, this.radius, 0, PI*2, false);
            this.ctx.fill();
*/
            this.ctx.beginPath();
            this.ctx.translate(this.x, this.y);
            this.ctx.rotate(this.rotate * PI);
            this.ctx.textAlign = 'center';
            this.ctx.font = 'bold ' + this.textSize + 'px Helvetica';
            this.ctx.fillStyle = this.color;
            this.ctx.fillText(this.text, this.fx, this.fy);
            //this.ctx.fill();
            this.ctx.restore();
        }
    };

    function WiperLine(ctx, index, lineH, sw, sh) {
        this.index = index;
        this.w = lineH;
        this.h = lineH - (index * 0.2);
        this.ctx = ctx;
        this.radius = this.w * 0.5;
        this.hh = this.h * 0.5;
        this.color = 'rgb(0,0,0)';
        this.centerX = sw >> 1;
        this.centerY = sh + this.w;
        this.x = 0;//this.centerX;
        this.y = 0;//this.centerY - (index * this.w);
        this.vx = 0;
        this.vy = 0;
        this.rotation = 0;
    }

    WiperLine.prototype = {
        move : function(sita){
            var cos = Math.cos(sita * PI),
                sin = Math.sin(sita * PI),
                imgX = (cos) * (-(this.w - 2) * this.index) + this.centerX,
                imgY = (sin) * (-(this.w - 2) * this.index) + this.centerY;
            this.x = imgX;
            this.y = imgY;
            this.rotation = sita;
        },

        draw : function(){
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.fillStyle = this.color;
            //ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
            this.ctx.translate(this.x, this.y);
            this.ctx.rotate( this.rotation * PI);
            this.ctx.fillRect(-this.radius, -this.hh, this.w, this.h);
            //this.ctx.fill();
            this.ctx.restore();
        }
    };

    window.WiperTypo = WiperTypo;
    window.WiperLine = WiperLine;

})(window);