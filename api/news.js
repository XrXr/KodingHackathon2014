// module that gets news data from the db

var util = require('util');
var db = require('../db');
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

exports.getNews = function(query, cb){
    var q = cleanQuery(query);
    news.find(q, function(err, docs){
        cb(docs);
    });
};

function cleanQuery(q){
    if (q['loc.lat']){
        q['loc.lat'] = parseFloat(q['loc.lat']);
    }
    if (q['loc.long']){
        q['loc.long'] = parseFloat(q['loc.long']);
    }

    return q;
}

