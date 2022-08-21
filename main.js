import { compareCurrentToMax, compareCurrentToMin } from "./utils.js";
import { createInterface } from "./interface.js";

// get weather for default location (London), in case user does not want to automatically allow location access
gWD(51.5, 0.12);

// get DOM reference for, and add event listener to, button that triggers navigator.geolocation
const getLocationButton = document.getElementById("getLocation");
getLocationButton.addEventListener("click", getLocation);

// get DOM reference for location input box and add "input" event listener
const locationInput = document.getElementById("location_input");
locationInput.addEventListener("input", getCoordsFromName);

// get DOM reference for place where location options will be inserted
const userChoices = document.getElementById("userChoices");

// define variable to be used in 'getCoordsFromName' below
let latsLongs;

// get DOM reference for input container, so that height can be modified to accomodate user choices (location options)
const inputContainer = document.getElementById("input_container");

// get location coords
function getLocation() {
  navigator.geolocation.getCurrentPosition(
    (location) => {
      // send location coords to function which gets weather data
      gWD(location.coords.latitude, location.coords.longitude);
    },
    (error) => {
      console.log(error);
    },
    { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
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

    // call function to make comparison between current and max temp
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
    inputContainer.style.height = "20rem";
    // call function that returns location names based on user input
    getUserChoice(latsLongs.data);
  } else {
    userChoices.innerHTML = "";
  }
}

// call function that gets weather data once user clicks on a choice
const onUserChoice = (e) => {
  gWD(
    latsLongs.data[Number(e.target.id)].lat,
    latsLongs.data[Number(e.target.id)].lon
  );
  userChoices.innerHTML = "";
  inputContainer.style.height = "initial";
};

userChoices.addEventListener("click", onUserChoice);

// get location names from user input
function getUserChoice(latsLongs) {
  const html = latsLongs.map((latLon, index) => {
    let result = "";
    result += latLon.name ? latLon.name + ", " : "";
    result += latLon.state ? latLon.state + ", " : "";
    result += latLon.country ? latLon.country : "";
    return `<p id="${index}">${result}</p>`;
  });
  userChoices.innerHTML = html.join("");
}
