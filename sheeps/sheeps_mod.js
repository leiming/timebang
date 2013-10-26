var Sheeps = Sheeps || ( function () {
    var _isPause = false, _sw, _sh, _sheeps = [], _total = 0, $con, curTime,
        _isDrag = false, seletedSheep;

    function init() {
        $con = $("body");
        _total = 0;
        _sheeps = [];
    }

    function start() {
        _isPause = false;
        _isDrag = false;
        curTime = new Date().getTime();
        requestAnimationFrame( animate );
        //addEvent();
        addSheep();
    }

    function addSheep() {
        if (_isPause) return;
        getSheep();
        //TweenLite.delayedCall(1 + Math.random(), addSheep);
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
        sheep = new TheSheep($con, _total);
        _sheeps.push(sheep);
        _total = _sheeps.length;
    }

    function dispose() {
        TweenLite.killDelayedCallsTo(addSheep);
        _isPause = true;
        removeEvent();
        var i, item;
        for (i=0; i<_total; i++) {
            item = _sheeps[i];
            item.dispose();
        }
        _sheeps = [];
    }

    function pause() {
        _isPause = true;
        removeEvent();
    }

    function resume() {
        _isPause = false;
        curTime = new Date().getTime();
        requestAnimationFrame( animate );
        //addEvent();
        addSheep();
    }

    function resize() {
        _sw = $con.width();
        _sh = $con.height();
        var i, item;
        for (i=0; i<_total; i++) {
            item = _sheeps[i];
            item.resize(_sh);
        }
    }

    function animate() {
        if (_isPause) return;
        requestAnimationFrame( animate );

        var now = new Date().getTime(),
            dt = now - curTime;
        if (dt > 34) {
            curTime = now;
            loop();
        }
    }

    function loop() {
        var i, item;
        for (i=0; i<_total; i++) {
            item = _sheeps[i];
            item.loop();
        }
    }

    function addEvent() {
        if (CMDetect.isTouch) {
            StageController.addTouch("thesheep", touchStartHandler, touchMoveHandler, touchEndHandler);
        } else {
            StageController.addMove("thesheep", onDown, onMove, onUp);
        }
    }

    function removeEvent() {
        if (CMDetect.isTouch) {
            StageController.removeTouch("thesheep");
        } else {
            StageController.removeMove("thesheep");
        }
    }



    // event
    function touchStartHandler(event) {
        var mx = event.touches[0].pageX | 0, my = event.touches[0].pageY | 0;
        hitTest(mx, my);
    }
    function touchMoveHandler(event) {
        if (!_isDrag || !seletedSheep) return;
        var mx = event.touches[0].pageX | 0, my = event.touches[0].pageY | 0;
        seletedSheep.drag(mx, my);
    }
    function touchEndHandler(event) {
        _isDrag = false;
        if (seletedSheep) {
            seletedSheep.up();
            seletedSheep = null;
        }
    }

    function onDown(event) {
        var mx = event.pageX | 0, my = event.pageY | 0;
        hitTest(mx, my);
    }
    function onMove(event) {
        if (!_isDrag || !seletedSheep) return;
        var mx = event.pageX | 0, my = event.pageY | 0;
        seletedSheep.drag(mx, my);
    }
    function onUp(event) {
        _isDrag = false;
        if (seletedSheep) {
            seletedSheep.up();
            seletedSheep = null;
        }
    }

    function hitTest(mx, my) {
        var i, item;
        for (i=0; i<_total; i++) {
            item = _sheeps[i];
            if (item.hitTest(mx, my)) {
                _isDrag = true;
                seletedSheep = item;
                break;
            }
        }
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
    function TheSheep(con, index) {
        this.$con = con;
        this.cur = 0;
        this.last = 8;
        this.tx = 0;
        this.ty = 0;
        this.by = 0;
        this.targetY = 0;
        this.offsetX = 0;
        this.offsetY = 0;
        this.show = false;
        this.isPress = false;
        this.$dom = document.createElement('div');
        this.$dom.className = "sheeps";
        this.reset();
    }

    TheSheep.prototype = {
        hitTest : function(mx, my) {
            var minX = this.tx + 45, maxX = this.tx + 157, minY = this.ty, maxY = this.ty + 100;
            if (mx > minX && mx < maxX && my > minY && my < maxY) {
                //this.offsetX = mx - this.tx;
                //this.offsetY = my - this.ty;
                this.offsetX = 70;
                this.offsetY = 5;
                this.isPress = true;
                this.by = -127;
                return true;
            }
            return false;
        },
        drag : function(mx, my) {
            var nx = mx - this.offsetX, ny = my - this.offsetY;
            this.tx = nx;
            this.ty = ny;
            this.$dom.style.left = nx + 'px';
            this.$dom.style.top = ny + 'px';
        },
        up : function() {
            this.isPress = false;
            this.targetY = ($con.height() - 220);
            this.by = 0;
            /*
             var time = Math.abs(this.ty - this.targetY) * 0.0011;
             this.ty = this.targetY;
            TweenLite.killTweensOf(this.$dom);
            TweenLite.to(this.$dom, time, {
                css:{top:this.targetY},
                ease:Back.easeOut,
                easeParams:[0.7]
            });
            */
        },
        loop : function() {
            this.cur = (this.cur + 1) % this.last;
            var x = this.cur * 164;
            this.$dom.style.backgroundPosition = -x + "px " + this.by + "px";
            this.move();
        },
        move : function() {
            if (!this.show || this.isPress) return;
            this.tx = this.tx - this.speed;
            if (this.tx < -200) {
                this.show = false;
                this.isPress = false;
                //TweenLite.killTweensOf(this.$dom);
                $(this.$dom).remove();
            } else {
                this.$dom.style.left = this.tx + 'px';

                if (this.ty != this.targetY) {
                    this.ty += (this.targetY - this.ty) * 0.32;
                    this.ty = this.ty | 0;
                    if (this.ty < this.targetY + 5 && this.ty > this.targetY - 5) this.ty = this.targetY;
                    this.$dom.style.top = this.ty + 'px';
                }

            }
        },
        resize : function(sh) {
            if (this.isPress) return;
            this.ty = this.targetY = (sh - 220);
            this.$dom.style.top = this.ty + 'px';
        },
        reset : function() {
            this.cur = 0;
            this.show = true;
            this.isPress = false;
            this.speed = (0.5 + (Math.random()*(12-5) + 5)) | 0;
            this.tx = $con.width() + 20;
            this.$dom.style.zIndex = this.speed;
            this.$dom.style.left = this.tx + 'px';
            this.resize($con.height());
            this.$con.append(this.$dom);
        },
        dispose : function() {
            this.show = false;
            //TweenLite.killTweensOf(this.$dom);
            $(this.$dom).remove();
            this.$dom = null;
            this.isPress = false;
        }

    };

    window.TheSheep = TheSheep;

})(window);

$con = $("body");
Sheeps.init();
var iID = setInterval(Sheeps.start, 1500);