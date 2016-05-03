var videoId = null;

var onEvent = function(event) {
  //right click
  if(event.button == 2) {
    var element = $(event.target).closest(".js-player, .faux_player")[0];
    if (element == null || element === undefined) {
      return;
    }

    if (element.className == "faux_player") {
      videoId = element.attributes["data-clip-id"].value;
    } else if (element.className.indexOf("player" > -1)) {
      videoId = element.id;
    }
  }
};

$(document).bind("contextmenu", onEvent);
$(document).ready(function() {
  setTimeout(function() {
    $(".js-player, .faux_player").each(function(id, el) {
      $(el).attr('contenteditable','true').css("outline", "none");
    });
  }, 0);

});

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if(request == "getVideoId" && videoId != null) {
        sendResponse(videoId);
    }
});
