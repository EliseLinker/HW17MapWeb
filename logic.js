// Store our API endpoint inside queryUrl
// var queryUrl = "http://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=" +
//   "2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";
var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2018-05-01&endtime=2018-06-01&minmagnitude=5";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
      "</h3><hr><p> Magnitude:" + feature.properties.mag + "</p>");
  }
 
  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var satellitemap = L.tileLayer("http://api.mapbox.com/v4/mapbox.satellite.html?" + 
  "access_token=pk.eyJ1IjoiZWxpc2VsaW5rZXIiLCJhIjoiY2poYjRydHgxMGxtdDMwbjNrMW1hOHR0MSJ9." +
  "1FtKV3p773mbUw475LiTCQ");

  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoiZWxpc2VsaW5rZXIiLCJhIjoiY2poYjRydHgxMGxtdDMwbjNrMW1hOHR0MSJ9." +
  "1FtKV3p773mbUw475LiTCQ");

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoiZWxpc2VsaW5rZXIiLCJhIjoiY2poYjRydHgxMGxtdDMwbjNrMW1hOHR0MSJ9." +
  "1FtKV3p773mbUw475LiTCQ");

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    // "Satellite Map": satellitemap,  
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

// Define a markerSize function that will give each city a different radius based on its population
function markerSize2(mag) {
  return feature.properties.mag;
}
// Loop through the earthquakes array and create one marker for each city object
for (var i = 0; i < earthquakes.length; i++) {
  L.circle(earthquakes[i].geometry.coordinates, {
    fillOpacity: 0.75,
    color: "white",
    fillColor: "purple",
    // Setting our circle's radius equal to the output of our markerSize function
    // This will make our marker's size proportionate to its population
    radius: markerSize2(earthquakes[i].mag)
  }).bindPopup("<h1>" + earthquakes[i].name + "</h1> <hr> <h3>Magnitude: " + earthquakes[i].feature.properties.mag + "</h3>").addTo(myMap);
}


  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
        45.611,-12.8325
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}

