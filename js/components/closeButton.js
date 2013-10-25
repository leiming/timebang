var CloseButton = CloseButton || ( function () {

    var $close, $right;

    function show(complete, func) {
        if ($right == null) {
            $close = $('#close-bt');
            $right = $('#right');
        }

        TweenLite.to($close, 0, {
            css:{"marginLeft":70}
        });
        TweenLite.to($close, .35, {
            delay:0.1,
            css:{"marginLeft":0},
            ease:Back.easeOut,
            onComplete:complete
        });

        $right.show();
        $close.on('click', func);
    }
    function hide() {
        $close.off('click');

        TweenLite.to($close, .3, {
            css:{"marginLeft":70},
            ease:Back.easeIn
        });
    }
    function remove() {
        $close.off('click');

        TweenLite.killTweensOf($close);
        TweenLite.to($close, 0, {
            css:{"marginLeft":70}
        });
    }


    return {
        show: show,
        hide: hide,
        remove: remove
    }

} )();