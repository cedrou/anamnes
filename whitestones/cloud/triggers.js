//
// Before saving a timestamp:
//   - check (end >= begin), otherwise set (end = begin)
//
Parse.Cloud.beforeSave("Timestamps", function(request, response) {
    var begin = request.object.get("begin");
    var end = request.object.get("end");
    if (end < begin) {
      request.object.set("end", begin);
    }
    
    response.success();
});

//
// After saving a timestamp:
//   - update beginTime and totalTime of the related Url
//
Parse.Cloud.afterSave("Timestamps", function(request) {
  var query = new Parse.Query("Urls");
  query.get(request.object.get("url").id).then(function(urlObject) {
    
    var beginTime = request.object.get("begin");
    var endTime = request.object.get("end");
    var totalTime = urlObject.get("totalTime");
    
    urlObject.save({
      totalTime: totalTime + endTime - beginTime,
      lastAccessed: beginTime
    });

  }, function(error) {
      console.error("Got an error in afterSave trigger for Timestamps: " + error.code + " - " + error.message);
  });
});

