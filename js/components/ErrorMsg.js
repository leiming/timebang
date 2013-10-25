var ErrorMsg = ErrorMsg || ( function () {

    function show(msg) {
        $("#root").append('<div id="popup"><div id="errorpopup-msg" class="errorpopup"><div id="errorpopup-txt-1"></div><div id="errorpopup-logo"></div></div></div>');
        $('#errorpopup-txt-1').html(msg);
        $('#popup').css('background-color', '#000').show();
    }

    function showFirst() {
        $("#root").append('<div id="popup"><div id="errorpopup-first" class="errorpopup"><div id="errorpopup-txt-2"></div><div id="errorpopup-logo"></div></div></div>');
        $('#errorpopup-txt-2').html("FFF is a collection of interactive experiences.<br>All the experiences are created in HTML5,<br>such as Canvas and CSS 2D/3D transforms.<br>But your browser does not seem to support HTML5 perfectly.<br>Please use <a href='http://www.google.com/chrome' target='_blank'>Google Chrome</a> browser.")
        $('#popup').css('background-color', '#000').show();
    }
    return {
        show: show,
        showFirst: showFirst
    }
} )();