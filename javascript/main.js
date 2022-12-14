import { compareCurrentToMax, compareCurrentToMin } from "./utils.js";
import { createInterface } from "./interface.js";
import {
  defaultLat,
  defaultLong,
  locationConfig,
  mapboxAccessToken,
} from "./config.js";

// global variables
const marker = new mapboxgl.Marker(); // initialize a new mapbox marker
let latsLongs; // define variable to be used in 'getCoordsFromName' below

// DOM References
// get DOM reference for, and add event listener to, button that triggers navigator.geolocation
const getLocationButton = document.getElementById("getLocation");
getLocationButton.addEventListener("click", getLocation);

// get DOM reference for the form which handles location search
const locationSearchForm = document.getElementById("location_search_form");

// get DOM reference for location input box and add "input" event listener
const locationInput = document.getElementById("location_input");
locationInput.addEventListener("input", getCoordsFromName);

// get DOM reference for place where location options will be inserted
const userChoices = document.getElementById("userChoices");

// get DOM reference for input container, so that height can be modified to accomodate user choices (location options)
const inputContainer = document.getElementById("input_container");

// get weather for default location (London), in case user does not want to automatically allow location access
gWD(defaultLat, defaultLong);

// mapbox access token
mapboxgl.accessToken = mapboxAccessToken;

const createMap = (longitude, latitude) => {
  // add map to page using mapbox & intialize map
  const map = new mapboxgl.Map({
    container: "map", // Container ID
    style: "mapbox://styles/mapbox/outdoors-v12?optimize=true", // Map style to use
    center: [longitude, latitude], // Starting position [lng, lat]
    zoom: 5, // Starting zoom level
  });

  // get coords from map click
  map.on("click", (e) => {
    console.log(`A click event has occurred at ${e.lngLat}`);
    gWD(e.lngLat.lat, e.lngLat.lng);
    setMarker(map, e.lngLat.lng, e.lngLat.lat);
  });

  // set the marker to show the input/chosen location
  setMarker(map, longitude, latitude);
};

// add marker to map
const setMarker = (map, longitude, latitude) => {
  marker
    .setLngLat([longitude, latitude]) // Marker [lng, lat] coordinates
    .addTo(map); // Add the marker to the map
};

// initialize mapbox map with default coords
createMap(defaultLong, defaultLat);

// get location coords
function getLocation() {
  navigator.geolocation.getCurrentPosition(
    function (location) {
      // send location coords to function which gets weather data
      gWD(location.coords.latitude, location.coords.longitude);
      // send location coords to mapbox map
      createMap(location.coords.longitude, location.coords.latitude);
    },
    function (error) {
      console.log(error);
    },
    locationConfig
  );
}

async function gWD(latitude, longitude) {
  try {
    // get weather data from API
    const result = await axios.get(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude},${longitude}?unitGroup=metric&key=GG7GYPUL67AVRDLKJ4S62ZVHK&contentType=json&include=current,stats,fcst,hours`
    );
    // get location names from API using coords
    const locationArray = await axios.get(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=9e935cc2d4512c9d406b475894374293`
    );
    const location = locationArray.data[0].name;

    // call function to make comparison between current and max temp/min temp
    const resultOfMaxComparison = compareCurrentToMax(result.data);
    const resultOfMinComparison = compareCurrentToMin(result.data);

    // call function to send data to interface
    createInterface(
      result.data,
      resultOfMaxComparison,
      resultOfMinComparison,
      location
    );
  } catch (error) {
    console.log(error);
  }
}

// get latitude and longitude coordinates from user input
async function getCoordsFromName(e) {
  if (e.target.value.length) {
    latsLongs = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${e.target.value}&limit=10&appid=9e935cc2d4512c9d406b475894374293`
    );
    // make input container bigger to accommodate location names on user input
    inputContainer.style.height = "fit-content";
    // call function that returns location names based on user input
    getUserChoice(latsLongs.data);
  } else {
    userChoices.innerHTML = "";
  }
}

// get location names from user input
function getUserChoice(latsLongs) {
  const html = latsLongs.map((latLon, index) => {
    let result = "";
    result += latLon.name ? latLon.name + ", " : "";
    result += latLon.state ? latLon.state + ", " : "";
    result += latLon.country ? latLon.country : "";
    return `<ul><li class="userChoice" id="${index}">${result}</li></ul>`;
  });
  userChoices.innerHTML = html.join("");
}

// call function that gets weather data once user clicks on a choice
function onUserChoice(e) {
  const id = Number(e.target.id);
  gWD(latsLongs.data[id].lat, latsLongs.data[id].lon);
  createMap(latsLongs.data[id].lon, latsLongs.data[id].lat);
  userChoices.innerHTML = "";
  inputContainer.style.height = "initial";
}

userChoices.addEventListener("click", onUserChoice);

// if user presses enter after typing search term, select first result by default
function onEnter(e) {
  try {
    if (e.key === "Enter") {
      gWD(latsLongs.data[0].lat, latsLongs.data[0].lon);
      createMap(latsLongs.data[0].lon, latsLongs.data[0].lat);
      userChoices.innerHTML = "";
    }
  } catch (error) {
    console.log(error);
  }
}

locationInput.addEventListener("keyup", onEnter);

locationSearchForm.addEventListener("submit", (e) => {
  e.preventDefault();
});
