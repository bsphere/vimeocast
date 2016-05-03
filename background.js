var getFiles = function(videoId, callback) {
  $.getJSON("https://player.vimeo.com/video/" + videoId + "/config", function(result) {
    if (result !== undefined &&
      result.request !== undefined &&
      result.request.files !== undefined &&
      result.request.files.progressive !== undefined) {

        return callback(result.request.files.progressive);
      }

    callback(null);
  });
};

var getEncodedUrl = function(original) {
  return encodeURIComponent(encodeURI(original));
};

var cast = function(videoId) {
  getFiles(videoId, function(results) {
    var files = _.sortBy(results, 'height', function(o) {return o.height;});
    var url = files[files.length - 1].url;
    chrome.tabs.create({url: "https://vidcast.dabble.me/index.html?video_link=" + getEncodedUrl(url)}) + "&submit=Go";
  });
};

var onClick = function(event, tab) {
  if (event.frameUrl != null) {
      videoId = event.frameUrl.split("https://player.vimeo.com/video/")[1].split("?")[0];
      return cast(videoId);
  }

  chrome.tabs.sendRequest(tab.id, "getVideoId", function(videoId) {
    if (videoId == null || videoId === undefined) {
      return;
    }

    cast(videoId);
  });
};

chrome.contextMenus.create({
  "title": "Cast Video",
  "targetUrlPatterns": ["*://player.vimeo.com/*"],
  "contexts": ["frame", "editable"],
  "onclick": onClick
});
