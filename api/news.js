// module that gets news data from the db

var mongojs = require('mongojs');
var util = require('util');
var db = require('../db/db.js');
var news = db.collection('news');

exports.getData = function(query, cb){
    news.find(function(err, docs){
        cb(docs);
    });
};

exports.getNews = function(startDate, endDate, loc){
     news.find(function(err, docs){
        cb(docs);
    });
};

