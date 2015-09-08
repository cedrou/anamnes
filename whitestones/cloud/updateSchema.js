var _ = require('underscore');

function us1_Timestamps_Make_end_equals_begin_if_zero() {
  var tsQuery = new Parse.Query('Timestamps');
  return tsQuery.each(function(tsObject) {
    
    if (tsObject.get("end") == 0) {
      var beginTime = tsObject.get("begin");
      return tsObject.save({
        end: beginTime
      });
    }
     
  });
}

function us2_Timestamps_Remove_zero_duration_items() {
  var tsQuery = new Parse.Query('Timestamps');
  return tsQuery.each(function(tsObject) {
    
    if (tsObject.get("end") == tsObject.get("begin")) {
      return tsObject.destroy();
    }
     
  });
}

function us3_Urls_Add_lastAccessed_and_totalTime() {
  var urlQuery = new Parse.Query('Urls');
  return urlQuery.each(function(urlObject) {
    
    if (urlObject.get("totalTime")) {
      return;
    }
    
    var tsQuery = new Parse.Query('Timestamps').equalTo("url", urlObject);
    return tsQuery.find().then(function(timestamps) {
      
      var lastAccessed = 0;
      var totalTime = 0; 
      
      _.each(timestamps, function(tsObject, index, list) {
        
        var begin = tsObject.get("begin");
        var end = tsObject.get("end");
        
        if (begin > lastAccessed) lastAccessed = begin;
        totalTime = end - begin; 
      });
    
      return urlObject.save({
        totalTime: totalTime,
        lastAccessed: lastAccessed
      });
    });
  });
}


Parse.Cloud.define("updateSchema", function(request, response) {
  
  var promise = Parse.Promise.error({code: 0, message:"Please define an update method in Cloud Code."});
  //var promise = us1_Timestamps_Make_end_equals_begin_if_zero();
  //var promise = us2_Timestamps_Remove_zero_duration_items();
  //var promise = us3_Urls_Add_lastAccessed_and_totalTime();
  
  promise.then(function() {
    response.success("The schema has been updated successfully.");
    
  }, function(error) {
    response.error("Got an error while updating the schema : " + error.code + " - " + error.message);
    
  });
});

