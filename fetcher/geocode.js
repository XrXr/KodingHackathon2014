// module that converts a city, country to a lat, long coordinate

var geocodeProvider = "google";
var httpAdapter = "http";
var extra = {};

var geocoder = require('node-geocoder').getGeocoder(
        geocodeProvider,
        httpAdapter,
        extra
);

exports.getCoords = function(place, cb){
    geocoder.geocode(place, function(err, res) {
        cb(res);
    });
};
