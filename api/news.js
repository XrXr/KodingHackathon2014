// module that gets news data from the db

var mongojs = require('mongojs');
var util = require('util');

var dbuser = 'user';
var dbpassword = 'tuba';
var uri = util.format(
        'mongodb://%s:%s@ds061360.mongolab.com:61360/conaps',
        dbuser,
        dbpassword
);
var db = mongojs(uri);
var news = db.collection('news');

exports.getData = function(startDate, endDate, loc){
    // TODO: implementation
};

exports.getNews = function(startDate, endDate, loc){
    // TODO: implementation
};

