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

$.getJSON("/api/newsstories", function(d){
//    addStories(d);
});

function addStories(d){
    var genHTML = "<h3>Stories</h3>";
    d.forEach(function(data) {
 
        $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + data['loc']['lat'] + "," + data['loc']['long'], function(loc){
            var r = loc["results"][0]["address_components"];
            var locData = r[r.length-1]['long_name'];
        
            d = {
                "title": data["title"],
                "loc": locData
            };
            genHTML = genHTML + generateInfo(d);

            $(".info")[0].innerHTML = genHTML; 
        });

    });


}

function generateInfo(data){
    return "<div class='story'>" +
        "<div><b>" + data['title'] + "</b></div>" +
        "<span class='small'>location</span> <span>" + data["loc"]  + 
        "</span>"+
        "</div>";
}
