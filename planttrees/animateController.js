var animateController = animateController ||(function() {

    function open(wrap) {
        wrap.css("display", "block").css("opacity", 1);
        PlantTrees.init();
    }

    function close() {
        wrap.css("display", "none").css("opacity", 0);
    }

    return {
        open: open,
        close: close
    }
})();