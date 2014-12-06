/*
  fetch from RSS feeds.
*/
var fs = require("fs");
var when = require("when");

var configFileName = "./feeds";
var configFileEncoding = "ASCII";
var retryDelay = 300000;  // 5 minutes

// load feeds from config file
var readFeeds = when.promise(function (resolve, reject) {
    fs.readFile(configFileName, {encoding: configFileEncoding}, function (err, data) {
        if (err) reject(err);
        resolve(data);
    });
});

readFeeds.then(splitLines).then(request);

function splitLines (str) {
    return str.split("\n");
}