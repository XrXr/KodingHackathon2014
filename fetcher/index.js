/*
  - fetch from rss feed then parse them
  - analyze articles for ones about conflicts
  - geocode country name
  - commit to db
*/
var when = require("when");
var fetch = require("./fetch");
var analyzer = require("./analyzer");
var geocode = require("./geocode");
var db = require("../db");

// exported function
function fetchConflicts () {
    fetch.fetchAndParse().then(analyzer.analyze).then(countryToLatLong)
        .then(commitToDb).then(db.close);
}

function countryToLatLong (conflicts) {
    return when.settle(conflicts.map(function (conflict) {
        return geocode.getCoords(conflict.country).then(function (location) {
            return {
                title: "",
                content: "",
                date: conflict.date,
                type: conflict.type,
                loc: location
            };
        });
    }));
}

function commitToDb (latLongConflicts) {
    var news = db.collection("news");
    var updates = [];
    latLongConflicts.forEach(function (event, index) {
        if (event.state === "fulfilled") {
            var doc = event.value;
            updates.push(when.promise(function (resolve, reject) {
                news.update(doc, doc, {upsert: true}, function (err, res) {
                    if (err) {
                        console.error(err);
                        return reject(err);
                    }
                    resolve(res);
                });
            }));
        }  // if something went wrong with geocode, then screw it!
    });
    return when.settle(updates);  // close the db after we are done
}

module.exports.fetchConflicts = fetchConflicts;