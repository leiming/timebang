$(document).ready(function(){
    
    var wrap = $('<div class="opacityWrapper"><div id="planttrees-con" class="contents-data"><div id="planttrees-bg"></div><canvas id="planttrees"></canvas><div id="planttrees-bt" class="disable-tabcolor"></div><div id="planttrees-guide" class="contents-guide"><div class="guide-tooltip">press</div><div class="guide-mouse"></div></div></div></div>');
    $("body").append(wrap);    
    animateController.open(wrap);
    PlantTrees.start();

    StageController.addDispose(CMDetect.saveID, function(){
        //console.log("data addDispose")
        StageController.removeStart(CMDetect.saveID);
        StageController.removePause(CMDetect.saveID);
        StageController.removeResume(CMDetect.saveID);
        StageController.removeListener(CMDetect.saveID);

        PlantTrees.dispose();
    });
    StageController.addStart(CMDetect.saveID, function(){
        PlantTrees.start();
    });
    
    StageController.addPause(CMDetect.saveID, function(){
        PlantTrees.pause();
    });
    StageController.addResume(CMDetect.saveID, function(){
        PlantTrees.resume();
    });
    StageController.addListener(CMDetect.saveID, function(){
        PlantTrees.resize();
    });
});