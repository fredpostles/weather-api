// import { getGeocodeFromLocation } from "./location.js";
// import {compareCurrentToMax} from "./utils"

// get location coords
navigator.geolocation.getCurrentPosition(
  (location) => {
    // send location coords to function which gets weather data
    gWD(location.coords.latitude, location.coords.longitude);

    // send location coords to reverse geocoding function
    // getLocationFromCoords(location.coords.latitude, location.coords.longitude);

    // test
    // console.log(location.coords.latitude, location.coords.longitude);
  },
  (error) => {
    console.log(error);
  },
  { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
);

async function gWD(latitude, longitude) {
  console.log(latitude, longitude);
  try {
    // get weather data from API
    const result = await axios.get(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude},${longitude}?unitGroup=metric&key=GG7GYPUL67AVRDLKJ4S62ZVHK&contentType=json&include=current,stats,fcst`
    );

    // get location names from API using coords
    const locationArray = await axios.get(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=9e935cc2d4512c9d406b475894374293`
    );
    const location = locationArray.data[0].name;

    // const dayOfWeek = result.data.days.forEach((datetimeEpoch) => {
    //   weekday[datetimeEpoch.getUTCDay()];
    // });
    // console.log(dayOfWeek);

    // call function to make comparison between current and max temp
    const resultOfComparison = compareCurrentToMax(result.data);

    // call function to send data to interface
    createInterface(result.data, resultOfComparison, location);
  } catch (error) {
    console.log(error);
  }
}

document
  .getElementById("location_input")
  .addEventListener("input", getCoordsFromName);

let lastApiCall;

let latsLongs;

async function getCoordsFromName(e) {
  console.log(e.target.value);

  latsLongs = await axios.get(
    `http://api.openweathermap.org/geo/1.0/direct?q=${e.target.value}&limit=10&appid=9e935cc2d4512c9d406b475894374293`
  );

  getUserChoice(latsLongs.data);

  // console.log(latLong);
  // if (lastApiCall === undefined || lastApiCall + 100 < Date.now()) {
  //   gWD(latsLongs.data[0].lat, latsLongs.data[0].lon);
  //   lastApiCall = Date.now();
  // }
}
const userChoices = document.getElementById("userChoices");

const onUserChoice = (e) => {
  console.log(e.target.id, latsLongs);
  gWD(
    latsLongs.data[Number(e.target.id)].lat,
    latsLongs.data[Number(e.target.id)].lon
  );
};

userChoices.addEventListener("click", onUserChoice);

function getUserChoice(latsLongs) {
  const html = latsLongs.map((latLon, index) => {
    let result = "";
    result += latLon.name ? latLon.name + ", " : "";
    result += latLon.state ? latLon.state + ", " : "";
    result += latLon.country ? latLon.country : "";
    return `<div>${result}</div>`;
  });
  userChoices.innerHTML = html.join("");
}

function compareCurrentToMax(data) {
  // defining variables to be used in comparison
  const maxTemp = data.days[0].normal.tempmax[2];
  const currentTemp = data.days[0].temp;

  // test to check values
  //   console.log(maxTemp, currentTemp);

  // create box for result of comparison to go into
  let resultOfComparison = "";

  // compare the current and max temp
  if (currentTemp > maxTemp) {
    resultOfComparison += `The current temperature is ${(
      currentTemp - maxTemp
    ).toFixed(
      1
    )}&deg;C higher than the maximum temperature recorded on this date.`;
  } else if (currentTemp < maxTemp) {
    resultOfComparison += `The current temperature is ${(
      maxTemp - currentTemp
    ).toFixed(
      1
    )}&deg;C lower than the maximum temperature recorded on this date.`;
  } else {
    resultOfComparison +=
      "The current temperature is the same as the maximum temperature recorded on this date.";
  }

  // return result of the comparison
  return resultOfComparison;
}

function createInterface(data, resultOfComparison, location) {
  // console.log(data, resultOfComparison, location);

  // convert datetimeEpoch to day of the week
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  console.log(data.days[0]);
  const d = weekday[new Date(data.days[0].datetimeEpoch).getUTCDay()];
  console.log(d);

  // Summary
  let snapshotHtml = `<h1>${location}</h1>`;
  snapshotHtml += `<img src="./assets/weather-icons/${data.currentConditions.icon}.svg">`;
  snapshotHtml += `<h2>Forecast for this week: ${data.description}</h2>`;
  snapshotHtml += `<h3>The current temperature is ${data.currentConditions.temp}&deg;C.</h3>`;
  // temp comparison (to be moved to own div/aside)
  snapshotHtml += `<p>The historical maximum temperature on this date is ${data.days[0].normal.tempmax[2]}&deg;C<sup>*</sup>.</p>`;
  snapshotHtml += `<p>${resultOfComparison}</p>`;
  snapshotHtml += `<small><sup>*</sup>Since 1970.</small>`;

  let tempCompHtml = `<p>The historical maximum temperature on this date is ${data.days[0].normal.tempmax[2]}&deg;C<sup>*</sup>.</p>`;

  // write to the DOM
  document.getElementById("snapshot").innerHTML = snapshotHtml;
  // document.getElementById("tempComparison").innerHTML = tempCompHtml;

  // Day 1
  // day 1 data
  let dayOneHtml = `<h1>${
    weekday[new Date(data.days[0].datetimeEpoch).getUTCDay()]
  }</h1>`;
  dayOneHtml += `<img src="./assets/weather-icons/${data.days[0].icon}.svg">`;
  dayOneHtml += `<h2>${data.days[0].description}</h2>`;
  dayOneHtml += `<p>Temperature: ${data.days[0].temp}&deg;C</p>`;
  if (data.days[0].feelslike !== data.days[0].temp) {
    dayOneHtml += `<p>Feels like: ${data.days[0].feelslike}&deg;C</p>`;
  }
  dayOneHtml += `<p>Max: ${data.days[0].tempmax}&deg;C</p>`;
  dayOneHtml += `<p>Min: ${data.days[0].tempmin}&deg;C</p>`;
  dayOneHtml += `<p>Chance of rain: ${data.days[0].precipprob}%</p>`;
  dayOneHtml += `<p>Humidity: ${data.days[0].humidity}%</p>`;
  dayOneHtml += `<p>Wind: ${data.days[0].windspeed} kph</p>`;

  // write day 1 to the DOM
  document.getElementById("day_one").innerHTML = dayOneHtml;

  // Day 2
  // day 2 data
  let dayTwoHtml = `<h1>${data.days[1].datetime}</h1>`;
  dayTwoHtml += `<img src="./assets/weather-icons/${data.days[1].icon}.svg">`;
  dayTwoHtml += `<h2>${data.days[1].description}</h2>`;
  dayTwoHtml += `<p>Temperature: ${data.days[1].temp}&deg;C</p>`;

  if (data.days[1].feelslike !== data.days[1].temp) {
    dayTwoHtml += `<p>Feels like: ${data.days[1].feelslike}&deg;C</p>`;
  }
  dayTwoHtml += `<p>Max: ${data.days[1].tempmax}&deg;C</p>`;
  dayTwoHtml += `<p>Min: ${data.days[1].tempmin}&deg;C</p>`;
  dayTwoHtml += `<p>Chance of rain: ${data.days[1].precipprob}%</p>`;
  dayTwoHtml += `<p>Humidity: ${data.days[1].humidity}%</p>`;
  dayTwoHtml += `<p>Wind: ${data.days[1].windspeed} kph</p>`;

  // write day 2 to the DOM
  document.getElementById("day_two").innerHTML = dayTwoHtml;

  // Day 3
  // day 3 data
  let dayThreeHtml = `<h1>${data.days[2].datetime}</h1>`;
  dayThreeHtml += `<img src="./assets/weather-icons/${data.days[2].icon}.svg">`;
  dayThreeHtml += `<h2>${data.days[2].description}</h2>`;
  dayThreeHtml += `<p>Temperature: ${data.days[2].temp}&deg;C</p>`;
  if (data.days[2].feelslike !== data.days[2].temp) {
    dayThreeHtml += `<p>Feels like: ${data.days[2].feelslike}&deg;C</p>`;
  }
  dayThreeHtml += `<p>Max: ${data.days[2].tempmax}&deg;C</p>`;
  dayThreeHtml += `<p>Min: ${data.days[2].tempmin}&deg;C</p>`;
  dayThreeHtml += `<p>Chance of rain: ${data.days[2].precipprob}%</p>`;
  dayThreeHtml += `<p>Humidity: ${data.days[2].humidity}%</p>`;
  dayThreeHtml += `<p>Wind: ${data.days[2].windspeed} kph</p>`;

  // write day 2 to the DOM
  document.getElementById("day_three").innerHTML = dayThreeHtml;
}
