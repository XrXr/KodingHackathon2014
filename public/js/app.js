var latlng = new google.maps.LatLng(25.6586, -80.3568);
var opts = {
    zoom: 3,
    center: latlng
};

map = new google.maps.Map(document.getElementById("map-canvas"), opts);

heatmap = new HeatmapOverlay(map,
        {
            "radius": 2,
            "maxOpacity": 1,
            "scaleRadius": true,
            "useLocalExtrema": true,
            latField: 'lat',
            lngField: 'lng',
            valueField: 'count'
        }
);

var testData = {
      max: 8,
        data: [{lat: 24.6408, lng:46.7728, count: 3},{lat: 50.75, lng:-1.55, count: 1}]
};

heatmap.setData(testData);
