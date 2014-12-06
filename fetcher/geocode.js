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
        var coords = {};
        coords['latitude'] = res[0]['latitude'];
        coords['longitude'] = res[0]['longitude'];
        cb(coords);
    });
};
