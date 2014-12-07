var latlng = new google.maps.LatLng(49.25,123.1);
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

$.getJSON("/api/newsdata", function(d){ 
    data = {
        data: d
    };
    heatmap.setData(data);
});
