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

exports.collection = function(dbColl) {
    return db.collection(dbColl);
};

exports.database = function(collections){
    return mongojs(uri, collections);
};

exports.close = function () {
    db.close();
};