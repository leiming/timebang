$(document).ready(function(){

    /*
    StageController.addListener("index", onResizeInit);
    StageController.onResize();

    function onResizeInit(){
    }
*/

    if (CMDetect.isCanvas && CMDetect.browserName != "") {
        Address.init();
    } else {
        ErrorMsg.showFirst();
    }

});