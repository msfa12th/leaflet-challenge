// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

function pickColor(d) {
  return d > 5 ? "#ff0000" : //red
          d > 4 ? "#ff8000" :
          d > 3 ? "#ffcd00" :
          d > 2 ? "#ffff00" :
          d > 1 ? "#bfff00" : 
          "#80ff00" ; //greenish
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
    var div = L.DomUtil.create('div', 'info legend');
    grades = [0,1,2,3,4,5];
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML += '<i style="background:' + pickColor(grades[i] + 0.5) + '"></i> ' + 
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
    return div;
  };

  legend.addTo(myMap);

}

function createFeatures(earthquakeData) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {

      layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr" 
      + "<p>Earthquake of Magnitude = " + feature.properties.mag + "</p>"
      + "<hr><p>"  + new Date(feature.properties.time) + "</p>");
    }

    function createCircleMarker(feature, latlng){
        // Change the values of these options to change the symbol's appearance
        let options = {
          radius: feature.properties.mag*3,
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


 
