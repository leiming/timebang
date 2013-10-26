$(document).ready(function () {
  Sheeps.init();

  StageController.addDispose(CMDetect.saveID, function () {
    //console.log("data addDispose")
    StageController.removeStart(CMDetect.saveID);
    StageController.removePause(CMDetect.saveID);
    StageController.removeResume(CMDetect.saveID);
    StageController.removeListener(CMDetect.saveID);

    Sheeps.dispose();
  });
  StageController.addStart(CMDetect.saveID, function () {
    Sheeps.start();
  });
  StageController.addPause(CMDetect.saveID, function () {
    Sheeps.pause();
  });
  StageController.addResume(CMDetect.saveID, function () {
    Sheeps.resume();
  });
  StageController.addListener(CMDetect.saveID, function () {
    Sheeps.resize();
  });

  $("#start").click(function () {
    console.log("click start btn");
    Sheeps.start();
  });

  $("#pause").click(function () {
    console.log("click pause btn");
    Sheeps.pause();
  });

  $("#resume").click(function () {
    console.log("click resume btn");
    Sheeps.resume();
  });

  $("#resume").click(function () {
    console.log("click resize btn");
    Sheeps.resize();
  });

});

