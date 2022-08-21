import { compareCurrentToMax, compareCurrentToMin } from "./utils.js";
import { createInterface } from "./interface.js";

gWD(51.5, 0.12);
const getLocationButton = document.getElementById("getLocation");
getLocationButton.addEventListener("click", getLocation);

// get location coords
function getLocation() {
  navigator.geolocation.getCurrentPosition(
    (location) => {
      // send location coords to function which gets weather data
      gWD(location.coords.latitude, location.coords.longitude);
      // remove location button
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

document
  .getElementById("location_input")
  .addEventListener("input", getCoordsFromName);

let latsLongs;

let inputContainer = document.getElementById("input_container");

async function getCoordsFromName(e) {
  if (e.target.value.length) {
    latsLongs = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${e.target.value}&limit=10&appid=9e935cc2d4512c9d406b475894374293`
    );
    inputContainer.style.height = "20rem";
    getUserChoice(latsLongs.data);
  } else {
    userChoices.innerHTML = "";
  }
}
const userChoices = document.getElementById("userChoices");

const onUserChoice = (e) => {
  gWD(
    latsLongs.data[Number(e.target.id)].lat,
    latsLongs.data[Number(e.target.id)].lon
  );
  userChoices.innerHTML = "";
  inputContainer.style.height = "initial";
};

userChoices.addEventListener("click", onUserChoice);

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
