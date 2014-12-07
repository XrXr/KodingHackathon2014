// module that gets news data from the db

var util = require('util');
var db = require('../db/db.js');
var news = db.collection('news');

exports.getData = function(query, cb){
    var d = db.database(['news', 'agg']);
    var mapper = function(){
        emit(this.loc, 1);
    };
    var reducer = function(_id, c){
        return Array.sum(c);
    };
    d.news.mapReduce(mapper, reducer, {out:'agg'});
    d.agg.find(function(err, docs){
        var data = docs.map(function(d){
            var td = {};
            td['lat'] = d["_id"]["lat"];
            td['lng'] = d["_id"]["long"];
            td['value'] = d["value"];
            return td;
        });
        cb(data);
    });
};

exports.getNews = function(startDate, endDate, loc){
     news.find(function(err, docs){
        cb(docs);
    });
};

