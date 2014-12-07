// module that converts a city, country to a lat, long coordinate
var when = require("when");

var geocodeProvider = "google";
var httpAdapter = "http";
var extra = {};

var geocoder = require('node-geocoder').getGeocoder(
        geocodeProvider,
        httpAdapter,
        extra
);

exports.getCoords = function(place){
    return when.promise(function (resolve, reject) {
        geocoder.geocode(place, function(err, res) {
            if (err) return reject(err);
            resolve({
                latitude: res[0].latitude,
                longitude: res[0].longitude
            });
        });
    });
};
