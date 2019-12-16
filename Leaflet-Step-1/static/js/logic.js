// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

function pickColor(myMag) {
    var newColor = "";
  
    if (myMag <= 1) {
        newColor = "#80ff00"; // greenish
    } else if (myMag <= 2) {
        newColor = "#bfff00";
    } else if (myMag <= 3) {
        newColor = "#ffff00"; // yellow
    } else if (myMag <= 4) {
        newColor = "#ffbf00";
    } else if (myMag <= 5) {
        newColor = "#ff8000";
    } else { 
        newColor = "#ff4000"; //reddish, 5+
    }

    return newColor;
}

function createMap(earthquakes) {

  // Define lightMap layer
  lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });


  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Light Map": lightMap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the lightmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
        40.7608,-111.8910
    ],
    zoom: 4,
    layers: [lightMap, earthquakes]
  });

  /*Legend specific*/
  var legend = L.control({ position: "bottomright" });

  legend.onAdd = function(map) {
    var div = L.DomUtil.create("div", "legend");

    div.innerHTML += '<i style="background: #80ff00"></i><span>0-1</span><br>';
    div.innerHTML += '<i style="background: #bfff00"></i><span>1-2</span><br>';
    div.innerHTML += '<i style="background: #ffff00"></i><span>2-3</span><br>';
    div.innerHTML += '<i style="background: #ffbf00"></i><span>3-4</span><br>';
    div.innerHTML += '<i style="background: #ff8000"></i><span>4-5</span><br>';
    div.innerHTML += '<i style="background: #ff4000"></i><span>5+</span><br>';

    return div;
  };

  legend.addTo(myMap);

}

function createFeatures(earthquakeData) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {

      layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr" 
      + "<p>Earthquake Magnitude = " + feature.properties.mag + "</p>"
      + "<hr><p>"  + new Date(feature.properties.time) + "</p>");
    }

    function createCircleMarker(feature, latlng){
        // Change the values of these options to change the symbol's appearance
        let options = {
          radius: feature.properties.mag*2,
          fillColor: pickColor(feature.properties.mag),
          color: "gray",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        };

        return L.circleMarker( latlng, options );
    }
  
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: createCircleMarker,
        onEachFeature: onEachFeature
    });
  
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
}

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
  });


 
