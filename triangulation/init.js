$(document).ready(function(){

    Triangulation.init();

    StageController.addDispose(CMDetect.saveID, function(){
        //console.log("data addDispose")
        StageController.removeStart(CMDetect.saveID);
        StageController.removePause(CMDetect.saveID);
        StageController.removeResume(CMDetect.saveID);
        StageController.removeListener(CMDetect.saveID);

        Triangulation.dispose();
    });
    StageController.addStart(CMDetect.saveID, function(){
        Triangulation.start();
    });
    StageController.addPause(CMDetect.saveID, function(){
        Triangulation.pause();
    });
    StageController.addResume(CMDetect.saveID, function(){
        Triangulation.resume();
    });
    StageController.addListener(CMDetect.saveID, function(){
        Triangulation.resize();
    });

  $("#init").click(function () {
    console.log("click init btn");
    Triangulation.init();
  });

  $("#dispose").click(function () {
    console.log("click dispose btn");
    Triangulation.dispose();
  });

  $("#start").click(function () {
    console.log("click start btn");
    Triangulation.start();
  });

  $("#pause").click(function () {
    console.log("click pause btn");
    Triangulation.pause();
  });

  $("#resume").click(function () {
    console.log("click resume btn");
    Triangulation.resume();
  });

  $("#resume").click(function () {
    console.log("click resize btn");
    Triangulation.resize();
  });
});