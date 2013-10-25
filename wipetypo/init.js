$(document).ready(function () {
  wiperTypo.init();

  StageController.addDispose(CMDetect.saveID, function () {
    //console.log("data addDispose")
    StageController.removeStart(CMDetect.saveID);
    StageController.removePause(CMDetect.saveID);
    StageController.removeResume(CMDetect.saveID);
    StageController.removeListener(CMDetect.saveID);

    wiperTypo.dispose();
  });
  StageController.addStart(CMDetect.saveID, function () {
    wiperTypo.start();
  });
  StageController.addPause(CMDetect.saveID, function () {
    wiperTypo.pause();
  });
  StageController.addResume(CMDetect.saveID, function () {
    wiperTypo.resume();
  });
  StageController.addListener(CMDetect.saveID, function () {
    wiperTypo.resize();
  });

  $("#start").click(function () {
    console.log("click start btn");
    wiperTypo.start();
  });

  $("#pause").click(function () {
    console.log("click pause btn");
    wiperTypo.pause();
  });

  $("#resume").click(function () {
    console.log("click resume btn");
    wiperTypo.resume();
  });

  $("#resume").click(function () {
    console.log("click resize btn");
    wiperTypo.resize();
  });

});