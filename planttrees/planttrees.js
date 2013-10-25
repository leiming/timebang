var PlantTrees = PlantTrees || ( function () {

    var _isPaused = false, TREE_MAX_LENGTH = 180, TREE_MIN_LENGTH = 140,
        MAX_DEPTH = 9, MIN_DEPTH = 6, canvas, context, $button, _isDay = 1,
        _sw, _sh, tree, _saveAni, $guide;

    function init() {
        _isPaused = false;

        _sw = StageController.stageWidth;
        _sh = StageController.stageHeight;

        _isDay = 1;

        canvas = document.getElementById('planttrees');
        $button = $('#planttrees-bt');

        _saveAni = null;
    }


    function start() {
        //console.log("PlantTrees start")


        $guide = $('#planttrees-guide');
        startGuide();
        /*
        TweenLite.to($('#planttrees-bg'), 0.35, {
            css:{'bottom': '-60px'},
            ease:Back.easeOut
        });
        */
    }

    function startGuide() {
        _sw = StageController.stageWidth;
        _sh = StageController.stageHeight;

        $guide.css({'left':((_sw >> 1) - 90) + "px", 'top':(_sh >> 1) + "px"}).show();

        TweenLite.to($guide, 0, {
            css:{autoAlpha:0}
        });
        _saveAni = TweenLite.to($guide,.2, {
            css:{autoAlpha:1},
            onComplete:startGuide2
        });
    }

    function startGuide2() {
        _saveAni = TweenLite.to($guide,0.5, {
            onComplete:startGuide3
        });
    }

    function startGuide3() {
        tree = createTree(_sw / 2, _sh);
        requestAnimationFrame( animate );
        _saveAni = TweenLite.to($guide,3, {
            onComplete:startGuide4
        });
    }

    function startGuide4() {
        _sw = StageController.stageWidth;
        _sh = StageController.stageHeight;

        $guide.find('.guide-tooltip').html('click');

        _saveAni = TweenLite.to($guide,1, {
            css:{left:(_sw - 110) + "px", top:"50px"},
            onComplete:startGuide5
        });
    }

    function startGuide5() {
        _saveAni = TweenLite.to($guide,0.5, {
            onComplete:endGuide
        });
    }
    function endGuide() {
        _saveAni = null;
        TweenLite.to($guide, 0.2, {
            css:{autoAlpha:0}
        });
        addEvent();
    }







    function dispose() {
        //console.log("PlantTrees dispose")
        _isPaused = true;

        if ($guide != null) {
            TweenLite.killTweensOf($guide);
        }
        $guide = null;

        if (_saveAni != null) {
            TweenLite.killTweensOf(_saveAni);
        }
        _saveAni = null;

        removeEvent();
        tree = null;
    }

    function pause() {
        //console.log("PlantTrees pause")
        _isPaused = true;
        removeEvent();
        if (_saveAni != null) {
            _saveAni.pause();
        }
    }

    function resume() {
        //console.log("PlantTrees resume")
        _isPaused = false;
        requestAnimationFrame( animate );
        if (_saveAni == null) {
            addEvent();
        } else {
            _saveAni.resume();
        }
    }

    function resize() {
        if (context != null) {
            context.clearRect (0 , 0, _sw, _sh);
        }

        _sw = StageController.stageWidth;
        _sh = StageController.stageHeight;

        canvas.width = _sw;
        canvas.height = _sh;

        context = canvas.getContext('2d');
        context.lineCap = 'round';
        context.globalCompositeOperation = "lighter";

        tree = null;
    }

    function animate() {
        if (_isPaused) return;
        requestAnimationFrame( animate );
        loop();
    }


    function loop() {
        if (!tree) return;
        tree.draw(context);
        if (tree.complete()) tree = null;
    }

    function createTree(baseX, baseY) {
        var baseLength = CMUtiles.randomFloat(TREE_MIN_LENGTH, TREE_MAX_LENGTH),
            d = baseLength - TREE_MIN_LENGTH,
            p = (TREE_MAX_LENGTH - TREE_MIN_LENGTH) / (MAX_DEPTH - MIN_DEPTH),
            depth = MIN_DEPTH + ((0.5 + (d / p)) | 0),
            h = (Math.random() * 360) | 0;
            //h = CMUtiles.randomInteger(0, 15),
            //hsla = "hsla("+(h)+",100%," + _dayValue + "%,1)";
        return new TreeClass(baseX, baseY, baseLength, -90, h, depth, _isDay);
    }


    function addEvent() {
        if (CMDetect.isTouch) {
            StageController.addTouch("planttrees", touchStartHandler, touchMoveHandler, touchEndHandler);
        } else {
            StageController.addMove("planttrees", onDown, onMove, onUp);
        }
        $button.on('click', changeDay);
    }

    function removeEvent() {
        if (CMDetect.isTouch) {
            StageController.removeTouch("planttrees");
        } else {
            StageController.removeMove("planttrees");
        }
        $button.off('click', changeDay);
    }

    function touchStartHandler(event) {
        var mx = event.touches[0].pageX,
            my = event.touches[0].pageY;
        mouseDown(mx, my);
    }
    function touchMoveHandler(event) {
    }
    function touchEndHandler(event) {
    }

    function onDown(event) {
        var mx = event.pageX,
            my = event.pageY;
        mouseDown(mx, my);
    }
    function onMove(event) {
    }
    function onUp(event) {
    }

    function mouseDown(mx, my) {
        if (tree) return;
        if (mx < 100 || mx > _sw - 100 || my > _sh - 70) {
            return;
        }
        tree = createTree(mx, _sh);
    }


    function changeDay() {
        if (_isDay == 1) {
            _isDay = 0;
            goNight();
        } else {
            _isDay = 1;
            goDay();
        }

    }

    function goDay() {
        TweenLite.to($('#planttrees-con'), 1, {
           css:{'backgroundColor': '#ddd'}
        });
        $('#planttrees-bg').css('background-position', '0 0');
        $('#planttrees-bt').css('background-position', '0 0');
        resize();
        tree = createTree(_sw / 2, _sh);
        Address.blackLeft();
        Address.blackTop();
        ConfigModel.isWhite = 0;
    }
    function goNight() {
        TweenLite.to($('#planttrees-con'), 1, {
            css:{'backgroundColor': '#222222'}
        });
        $('#planttrees-bg').css('background-position', '0 -90px');
        $('#planttrees-bt').css('background-position', '0 -74px');
        resize();
        tree = createTree(_sw / 2, _sh);
        Address.whiteLeft();
        Address.whiteTop();
        ConfigModel.isWhite = 1;
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
    var PI = Math.PI,
        FPS = 60,
        DEG_TO_RAD = PI / 180,
        commands = {};

    function TreeClass(baseX, baseY, baseLength, baseAngle, color, depth, isDay) {
        this._color = color;
        this._isDay = isDay;
        this._changeColor = 90;
        this._brances = [];
        this._brances.push(new Branch(baseX, baseY, baseLength, baseAngle, CMUtiles.randomFloat(3, 6), depth, 1));
    }

    TreeClass.prototype = {
        _brances: null,
        _complete: false,

        complete: function() {
            return this._complete;
        },

        draw: function(ctx) {
            var branches = this._brances,
                len = branches.length,
                i, b, next, n;

            if (!len) {
                this._complete = true;
                return;
            }

            for (i = 0; i < len; i++) {
                b = branches[i];
                b.update();

                if (b.complete()) {
                    branches.splice(i, 1);
                    i--;

                    n = b.generation() < 3 ? CMUtiles.randomInteger(3, 4) : CMUtiles.randomInteger(2, 4);
                    next = b.createNext(n);
                    if (next) {
                        branches = this._brances = branches.concat(next);
                    }

                    len = branches.length;
                }
            }

            if (this._isDay == 1) {
                ctx.strokeStyle = "hsl(0,100%,0%)";
            } else {
                ctx.strokeStyle = "hsl(" + this._color + ",100%," + this._changeColor + "%)";
                if (this._changeColor > 50) {
                    this._changeColor = this._changeColor - 0.4;
                }
            }


            var command, line, lines;

            for (var key in commands) {
                command = commands[key];
                lines = command.lines;

                //ctx.save();
                ctx.beginPath();
                ctx.lineWidth = command.lineWidth;
                for (i = 0, len = lines.length; i < len; i++) {
                    line = lines[i];
                    ctx.moveTo(line[0][0], line[0][1]);
                    ctx.lineTo(line[1][0], line[1][1]);
                }
                ctx.stroke();
                //ctx.restore();

                delete commands[key];
            }
        }
    };

    function Branch(startX, startY, length, angle, speed, depth, generation) {
        this._start = new Point(startX, startY);
        this._length = length || 1;
        this._angle = angle || -90;
        this._speed = speed || 3;
        this._depth = depth || 1;
        this._generation = generation;

        this._speed *= 60 / FPS;


        var rad = this._angle * DEG_TO_RAD;
        this._end = new Point(
            this._start.x + this._length * Math.cos(rad),
            this._start.y + this._length * Math.sin(rad)
        );

        this._v = this._end.subtract(this._start);
        this._v.normalize(this._speed);

        this._current = this._start.add(this._v);
        this._latest = this._start.clone();

        this._currentLength = this._speed;
    }

    Branch.prototype = {
        _complete: false,
        _angleOffsetRange: 90,

        //depth: function() { return this._depth; },
        generation: function() { return this._generation; },
        complete: function() { return this._complete; },

        interpolate: function(f) {
            return Point.interpolate(this._end, this._start, f);
        },

        createNext: function(num) {
            var nextDepth = Math.max(this._depth - 1, 0);

            if (!nextDepth) return null;

            var offs = [],
                range = this._angleOffsetRange,
                n = range / num,
                i, min, max;

            for (i = 0; i < num; i++) {
                min = n * i - range / 2;
                max = min + n;
                offs[i] = (CMUtiles.randomFloat(min, max)) | 0;
            }

            offs.sort(function(a, b) {
                return (a > 0 ? a : -a) - (b > 0 ? b : -b);
            });

            var branches = [],
                nextGen = this._generation + 1,
                t = 0.55 / num,
                f, a, s, l, p;

            for (i = 0; i < num; i++) {
                f = i === 0 ? 0 : CMUtiles.randomFloat(t * i, t * (i + 1));
                p = this.interpolate(f);

                a = this._angle + offs[i];

                s = 0.3 * Math.abs(Math.cos((a + 90) * DEG_TO_RAD));
                l = this._length * CMUtiles.randomFloat(0.25 + s, 0.65 + s);

                branches[i] = new Branch(p.x, p.y, l, a, CMUtiles.randomFloat(3, 5), nextDepth, nextGen);
            }

            return branches;
        },

        update: function() {
            var complete = this._complete;
            if (complete) return;

            var current = this._current,
                latest = this._latest;

            if (this._length <= this._currentLength) {
                current = this._end;
                complete = this._complete = true;
            }

            var lineWidth = this._depth * this._depth * 0.2,
                key = 'CM' + lineWidth,
                command = commands[key];

            if (!command) {
                command = commands[key] = {
                    lineWidth: lineWidth,
                    lines: []
                };
            }

            command.lines.push([
                [latest.x, latest.y],
                [current.x, current.y]
            ]);

            if (complete) return;

            latest.set(current);
            current.offset(this._v);
            this._currentLength += this._speed;
        }
    };

    function Point(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    Point.create = function(o, y) {
        if (CMUtiles.isObject(o)) {
            return new Point(o.x, o.y);
        }
        return new Point(o, y);
    };

    Point.add = function(p1, p2) {
        return new Point(p1.x + p2.x, p1.y + p2.y);
    };

    Point.subtract = function(p1, p2) {
        return new Point(p1.x - p2.x, p1.y - p2.y);
    };

    Point.interpolate = function(p1, p2, f) {
        var dx = p2.x - p1.x,
            dy = p2.y - p1.y;
        return new Point(p1.x + dx * f, p1.y + dy * f);
    };


    Point.prototype = {
        add: function(p) {
            return Point.add(this, p);
        },

        subtract: function(p) {
            return Point.subtract(this, p);
        },

        length: function() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        },

        set: function(x, y) {
            if (CMUtiles.isObject(x)) {
                y = x.y;
                x = x.x;
            }

            this.x = x || 0;
            this.y = y || 0;

            return this;
        },

        offset: function(x, y) {
            if (CMUtiles.isObject(x)) {
                y = x.y;
                x = x.x;
            }

            this.x += x || 0;
            this.y += y || 0;

            return this;
        },

        normalize: function(thickness) {
            if ((thickness === null) || (thickness === 'undefined')) {
                thickness = 1;
            }

            var length = this.length();

            if (length > 0) {
                this.x = this.x / length * thickness;
                this.y = this.y / length * thickness;
            }

            return this;
        },

        clone: function() {
            return Point.create(this);
        }
    };


    window.TreeClass = TreeClass;

})(window);
