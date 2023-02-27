const animate = require("./animation");
const { Loader } = require("@googlemaps/js-api-loader");
const axios = require("axios");
const turf = require("@turf/turf");
import axios from "axios";

import { point } from "@turf/turf";

const chartService = require("./chartservices");

const loader = new Loader({
  apiKey: "XXXX",
  version: "weekly",
  libraries: ["places"],
});
let mapa1;
let radius = 1000;
let animation;
let nameCity;
// https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=41.3928406,2.0001025&radius=500&type=biblioteca&key=AIzaSyDWMP-tXPHNsbzaVHS1c8vEPO3j7VB4JlE

const mapOptions = {
  center: {
    lat: 41.40290258403054,
    lng: 2.1745425614441496,
  },
  zoom: 4,
};

var markers = [];
let wayPaths = [];

function deletePathWays() {
  wayPaths.forEach((wayPath) => {
    wayPath.setMap(null);
  });
  wayPaths = [];
}

const map1Loader = function (google) {
  mapa1 = new google.maps.Map(document.getElementById("map1"), mapOptions);
  /*mapa1.data.setStyle(function(feature) {
        return {
          fillColor: 'ffddd2',
          strokeWeight: 0,
          fillOpacity: 0.2
        };
      });*/
};
let google1;
let geocoder;
function loadMap1() {
  // Promise
  loader.load().then(map1Loader); // loader es un objecto que tiene el metodo .load()
}

loadMap1();
function callback(results, status) {
  if (status === google1.maps.places.PlacesServiceStatus.OK) {
    //var bounds = new google1.maps.LatLngBounds();
    for (var i = 0; i < results.length; i++) {
      //bounds.extend(results[i].geometry.location);
      createMarker(results[i]);
    }
    //mapa1.fitBounds(bounds);
  }
  chartService.drawCity1Places(nameCity, results.length);
}
function createMarker(place) {
  var marker = new google1.maps.Marker({
    map: mapa1,
    position: place.geometry.location,
  });
  markers.push(marker);
  /*  google1.maps.event.addListener(marker, "click", function () {
    infowindow.setContent(place.name);
    infowindow.open(mapa1, this);
  });*/
}

function setMapOnAll(map) {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

function hideMarkers() {
  setMapOnAll(null);
}
function  deleteMarkers() {
  hideMarkers();
  markers = [];
}
let circuloLayer;

function sendCity(city, type = "park") {

  if(type === undefined  || type === null) {
    type = document.getElementsByClassName("active")[0].id
  }
  facility = type;
  nameCity = city;
  limpiarDatosMapa1();
  geocoder.geocode({ address: nameCity }, function (results, status) {
    if (selectedMapProvider === "google") {
      googleSearch(status, type, results);
    } else if (selectedMapProvider === "osm") {
      osmSearch(type, results);
    }
  });
}

loader
  .load()
  .then((google) => {
    google1 = google;
    geocoder = new google.maps.Geocoder();

    const handleEnterKey = ({ key, target }) => {
      // Only if the enter key is pressed and the tagetElementById("city1")get is an "enter-able" input
      if (key === "Enter" && target.id === "city1") {
          animation = animate()
        let city;
        if(target.value.toLowerCase() === 'barcelona') {
          city = 'Barcelona, Spain'
        } else {
          city = target.value
        }
        sendCity(city, document.getElementsByClassName("active")[0].id);
      }
    };

    // Add listener to the container that holds the inputs
    const localScope = document.getElementById("city1");
    localScope.addEventListener("keyup", handleEnterKey);
  })
  .catch((e) => {
    // do something
  });



function limpiarDatosMapa1() {
  deleteMarkers();
  deletePathWays();
}


function osmSearch(type, results) {
  const lat = results[0].geometry.location.lat(); 
  const lng =  results[0].geometry.location.lng();
  const mapCategories = {
    hospital: ['healthcare','clinic'],
    park: ['leisure', 'park'],
    store: ['amenity', 'marketplace'],
    library: ['amenity', 'library'],
    primary_school: ['amenity', 'school'],
    museum: ['tourism', 'museum'],
    gym: ['leisure', 'fitness_centre'],
    cycling: ['route', 'bicycle']
  }
  

  if(type === 'park'){
axios
    .get(`https://overpass-api.de/api/interpreter?data=[out:json][out:json];(
  way["leisure"="garden"]["access"!~"no|private"](if: length() > 10)(around:${radius},${lat}, ${lng});
  way["leisure"="park"]["access"!~"no|private"](if: length() > 10)(around:${radius},${lat}, ${lng});
);
out geom;`
    )
    .then(function (response) {
      let paths = []
      let arrayLatLng = [];
      let parksPolygons = []

      response.data.elements.forEach(element=> {
          if (element.type === "way" && element.geometry) {
            const path = element.geometry.map((point) => {
                            if (
                  typeof point.lat !== "number" ||
                  typeof point.lon !== "number" ||
                  isNaN(point.lat) ||
                  isNaN(point.lon) ||
                  point.lat < -90 ||
                  point.lat > 90 ||
                  point.lon < -180 ||
                  point.lon > 180
                ) {
                  return null;
                }
                arrayLatLng.push([point.lon,point.lat])
                return new google.maps.LatLng(point.lat, point.lon);
            });
            const line = turf.lineString(arrayLatLng);
            const polygon = turf.lineToPolygon(line, {mutate:true})  
            parksPolygons.push(polygon)
            

            paths.push(path.filter((point)=>point !== null));
        }
      });
    const fc = turf.featureCollection(parksPolygons);
    const union = turf.union(...fc.features);
    // calculate the area of the non-overlapping polygon
   

    var circle = turf.circle([lng,lat], radius, {steps: 32, units: 'meters'});    
    var intersection = turf.intersect(union, circle);


    const area = turf.area(intersection);



      console.log(area/10000, 'hectareas')
      paths.forEach((path) =>{
        const wayPath = new google.maps.Polygon({
          path: path,
          strokeColor: "#FF0000",
          fillColor: "#00FF00",
          fillOpacity: 1,
          strokeOpacity: 1.0,
          strokeWeight: 2,
        });
        wayPath.setMap(mapa1);
        wayPaths.push(wayPath);

      });
       chartService.drawCity1Places(nameCity + ' hectareas', Math.round(area/10000));
        drawCircle(lat, lng);
        animation.stop()
    });
 
  } else if(type === 'cycling'){
axios
    .get(`https://overpass-api.de/api/interpreter?data=[out:json][out:json];(
 node["highway"="cycleway"](around:${radius},${lat}, ${lng});
 way["highway"="cycleway"](around:${radius},${lat}, ${lng});
 relation["highway"="cycleway"](around:${radius},${lat}, ${lng});
);
out geom;`
    )
    .then(function (response) {
      let paths = []
      let kmOfLengthBike = 0;
      response.data.elements.forEach(element=> {
        if(element.tags['cycleway'] !== 'crossing') {
          if (element.type === "way" && element.geometry) {
            let pathForCalculateLength = [];
            const path = element.geometry.map((point) => {
                            if (
                  typeof point.lat !== "number" ||
                  typeof point.lon !== "number" ||
                  isNaN(point.lat) ||
                  isNaN(point.lon) ||
                  point.lat < -90 ||
                  point.lat > 90 ||
                  point.lon < -180 ||
                  point.lon > 180
                ) {
                  return null;
              }
                pathForCalculateLength.push([point.lon, point.lat])
                return new google.maps.LatLng(point.lat, point.lon);
            });

            var options = {steps: 32, units: 'meters'};
            var circle = turf.circle([lng,lat], radius-1, options);
            var line = turf.lineString(pathForCalculateLength);
            const segments = turf.lineSplit(line, circle);
            var circle2 = turf.circle([lng,lat], radius, options);

            if (turf.booleanWithin(line, circle2)) {
              // If the linestring is completely inside the polygon, add it to the segments array directly
              segments.features.push(line);
            }
            const segmentsInsidePolygon = segments.features.filter((segment) => {
              return turf.booleanWithin(segment, circle2);
            });
            let linestringInsidePolygon;
            if (segmentsInsidePolygon.length === 1) {
              linestringInsidePolygon = segmentsInsidePolygon[0];
            } else {
              linestringInsidePolygon = turf.combine(segmentsInsidePolygon);
            }
            kmOfLengthBike = kmOfLengthBike + turf.length(linestringInsidePolygon);
            paths.push(path.filter((point)=>point !== null));
          } else{
            console.log(element.tags)
          }
        }
      });
      paths.forEach((path) =>{
        const wayPath = new google.maps.Polyline({
          path: path,
          strokeColor: "#FF0000",
          strokeOpacity: 1.0,
          strokeWeight: 2,
        });

        wayPath.setMap(mapa1);
        wayPaths.push(wayPath);

      })
        chartService.drawCity1Places(nameCity + ' km', kmOfLengthBike);

        drawCircle(lat, lng);
        animation.stop()
    });
 
  } else {
axios
    .get(
      `https://overpass-api.de/api/interpreter?data=[out:json];
(node["${mapCategories[type][0]}"="${mapCategories[type][1]}"](around:${radius},${lat}, ${lng});
way["${mapCategories[type][0]}"="${mapCategories[type][1]}"](around:${radius}, ${lat}, ${lng});
relation["${mapCategories[type][0]}"="${mapCategories[type][1]}"](around:${radius},${lat}, ${lng});
);
out geom;`
    )
    .then(function (response) {
      var schools = response.data.elements;

      schools.forEach(function (school) {
        var { lat, lng } = extractLatLng(school);
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(lat, lng),
          map: mapa1,
          
        });
        markers.push(marker)
      });
      chartService.drawCity1Places(nameCity, schools.length);

      drawCircle(lat, lng);
      animation.stop()
    })
    .catch(function (error) {
      console.error(error);
        animation.stop()
    });
  }

  
    
}


function googleSearch(status, type, results) {
  let myKeyword
  if (status === "OK") {
    var service = new google1.maps.places.PlacesService(mapa1);
    if (type === "hospital" || "primary_school" || "parks") {
      myKeyword = "public";
    }
    service.nearbySearch(
      {
        location: results[0].geometry.location,
        radius: radius,
        type: type,
        keyword: myKeyword,
      },
      callback
    );
    /*var position = [ results[0].geometry.location.lng(),results[0].geometry.location.lat()];
    var point = turf.point(position);
    var buffered = turf.buffer(point, 1, {units: 'kilometres'});*/
    drawCircle(results[0].geometry.location.lat(), results[0].geometry.location.lng());
      animation.stop()
    /*menuItems.forEach(el => el.addEventListener('click', event => {
      event.feature.addGeoJson(null);
    }));*/
    // create a new polygon object
  } else {
    alert("Geocode was not successful for the following reason: " + status);
  }
}


function drawCircle(lat,lng) {
  if (circuloLayer) {
    circuloLayer.setMap(null);
  }

  //circuloLayer = mapa1.data.addGeoJson(buffered);
  circuloLayer = new google.maps.Circle({
    strokeColor: "ccd5ae",
    strokeOpacity: 0.3,
    strokeWeight: 0,
    fillColor: "83c5be",
    fillOpacity: 0.2,
    map: mapa1,
    center: {
      lat: lat,
      lng: lng,
    },
    radius: radius,
  });

  var bounds = circuloLayer.getBounds();
  mapa1.fitBounds(bounds);
}

function extractLatLng(school) {
    let centroid;
    let lat,lng;
  if(school.type === 'relation') {
        const lineStrings = school.members.map(way => turf.lineString(way.geometry.map(p => [p.lon, p.lat])));
        const featureCollection = turf.featureCollection(lineStrings);
        centroid = turf.centroid(featureCollection);
        lat = centroid.geometry.coordinates[1];
        lng = centroid.geometry.coordinates[0];
  } 

   if(school.type === 'way') {
        const coordinates = school.geometry.map(p => [p.lon, p.lat])));
         centroid = turf.centroid({
        "type": "Feature",
        "geometry": {
            "type": "LineString",
            "coordinates": coordinates
        }
        });
        lat = centroid.geometry.coordinates[1];
        lng = centroid.geometry.coordinates[0];
    
  } 
 if(school.type === 'node') {
        
        lat = school.lat
        lng = school.lon
  } 



  return {lat,lng}
}

module.exports = { sendCity, limpiarDatosMapa1} ;
