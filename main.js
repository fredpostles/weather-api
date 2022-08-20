// import {compareCurrentToMax} from "./utils"

// get location coords
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

async function gWD(latitude, longitude) {
  console.log(latitude, longitude);
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

    // call function to get images that match weather conditions
    // getImages(result.data);

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

async function getCoordsFromName(e) {
  // console.log(e.target.value);

  latsLongs = await axios.get(
    `http://api.openweathermap.org/geo/1.0/direct?q=${e.target.value}&limit=10&appid=9e935cc2d4512c9d406b475894374293`
  );

  getUserChoice(latsLongs.data);

  // console.log(latsLongs.data);
}
const userChoices = document.getElementById("userChoices");

const onUserChoice = (e) => {
  // console.log(e.target.id, latsLongs);
  gWD(
    latsLongs.data[Number(e.target.id)].lat,
    latsLongs.data[Number(e.target.id)].lon
  );
};

userChoices.addEventListener("click", onUserChoice);

function getUserChoice(latsLongs) {
  // console.log(latsLongs);
  const html = latsLongs.map((latLon, index) => {
    let result = "";
    result += latLon.name ? latLon.name + ", " : "";
    result += latLon.state ? latLon.state + ", " : "";
    result += latLon.country ? latLon.country : "";
    return `<p id="${index}">${result}</p>`;
  });
  // console.log(html);
  userChoices.innerHTML = html.join("");
}

// hide userChoice dropdown options once one has been chosen
// userChoices.addEventListener("onblur", hideUserChoices(e));

// function hideUserChoices(e) {
//   const html = "";
//   return (userChoices.innerHTML = html);
// }

function compareCurrentToMax(data) {
  // defining variables to be used in comparison
  const maxTemp = data.days[0].normal.tempmax[2];
  const currentTemp = data.days[0].temp;

  // create box for result of comparison to go into
  let resultOfMaxComparison = "";

  // compare the current and max temp
  if (currentTemp > maxTemp) {
    resultOfMaxComparison += `The current temperature is <span class="bold">${(
      currentTemp - maxTemp
    ).toFixed(
      1
    )}&deg;C</span> higher than the maximum temperature recorded on this date.`;
  } else if (currentTemp < maxTemp) {
    resultOfMaxComparison += `The current temperature is <span class="bold">${(
      maxTemp - currentTemp
    ).toFixed(
      1
    )}&deg;C</span> lower than the maximum temperature recorded on this date.`;
  } else {
    resultOfMaxComparison +=
      "The current temperature is the same as the maximum temperature recorded on this date.";
  }

  // return result of the comparison
  return resultOfMaxComparison;
}

function compareCurrentToMin(data) {
  // defining variables to be used in comparison
  const minTemp = data.days[0].normal.tempmin[0];
  const currentTemp = data.days[0].temp;

  // create box for result of comparison to go into
  let resultOfMinComparison = "";

  // compare the current and max temp
  if (currentTemp > minTemp) {
    resultOfMinComparison += `The current temperature is <span class="bold">${(
      currentTemp - minTemp
    ).toFixed(
      1
    )}&deg;C</span> higher than the minimum temperature recorded on this date.`;
  } else if (currentTemp < minTemp) {
    resultOfMinComparison += `The current temperature is <span class="bold">${(
      minTemp - currentTemp
    ).toFixed(
      1
    )}&deg;C</span> lower than the minimum temperature recorded on this date.`;
  } else {
    resultOfMinComparison +=
      "The current temperature is the same as the minimum temperature recorded on this date.";
  }

  // return result of the comparison
  return resultOfMinComparison;
}

// let weatherImage;
// async function getImages(data) {
//   weatherImage = await axios.get(
//     `https://api.unsplash.com/search/photos?query=${data.currentConditions.icon}?client_id=tWm8Hl5zbAD-pFPYGYKr2XcxC1Hsvjw3X2BKMFuHOfU`
//   );
// }

function createInterface(
  data,
  resultOfMaxComparison,
  resultOfMinComparison,
  location
) {
  // array of weekdays, to covert datetime to day of week
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Summary
  let locationHtml = `${location}`;

  document.getElementById("location").innerHTML = locationHtml;

  // basic weather summary of current conditions
  let summaryHtml = `<img src="./assets/weather-icons/${data.currentConditions.icon}.svg">`;
  summaryHtml += `<h3>Current temperature: <span class="bold">${data.currentConditions.temp}&deg;C</span></h3>`;
  summaryHtml += `<h3>Precipitation: <span class="bold">${data.currentConditions.precip}%</span></h3>`;

  document.getElementById("summary").innerHTML = summaryHtml;

  // forecast for next few days and today's sunrise/sunset times
  let summaryForecastHtml = `<h2 class="sub-heading">Forecast:</h2>
  <h3>${data.description}</h3>
  <div class="sun_times_container">
  <div id="sunrise" class="sunrise">
<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="512.000000pt" height="512.000000pt" viewBox="0 0 512.000000 512.000000"
 preserveAspectRatio="xMidYMid meet">

<g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
fill="#000000" stroke="none">
<path d="M2515 5109 c-31 -17 -335 -321 -351 -351 -19 -37 -18 -67 5 -104 24
-40 76 -59 117 -44 16 6 59 41 97 78 l67 66 0 -327 c0 -352 2 -366 52 -401 29
-21 87 -20 117 0 48 34 51 60 51 405 l0 322 73 -70 c83 -80 112 -92 165 -66
46 22 64 56 58 107 -4 35 -22 57 -168 203 -90 91 -175 171 -190 179 -32 17
-65 18 -93 3z"/>
<path d="M2494 3712 c-39 -31 -44 -55 -44 -212 0 -92 4 -160 11 -173 19 -38
51 -57 97 -57 35 0 49 6 73 29 l29 29 0 172 0 172 -29 29 c-24 23 -38 29 -73
29 -26 0 -52 -7 -64 -18z"/>
<path d="M1474 3441 c-20 -12 -37 -34 -44 -56 -11 -33 -9 -42 19 -98 17 -34
54 -102 84 -152 46 -79 57 -92 93 -104 35 -12 44 -12 75 3 42 20 63 54 62 100
-1 46 -138 283 -178 307 -38 24 -72 24 -111 0z"/>
<path d="M3510 3413 c-37 -34 -160 -248 -160 -279 0 -95 112 -147 177 -82 39
40 153 249 153 283 0 37 -22 70 -60 90 -43 22 -76 18 -110 -12z"/>
<path d="M2370 3113 c-78 -9 -267 -56 -349 -88 -498 -190 -852 -600 -969
-1125 -23 -102 -26 -137 -26 -315 0 -169 4 -216 22 -302 12 -55 22 -104 22
-107 0 -3 -218 -6 -485 -6 -533 0 -539 -1 -569 -59 -21 -40 -20 -69 4 -108 12
-21 32 -36 57 -43 27 -8 736 -10 2505 -8 l2467 3 28 21 c39 29 52 83 30 130
-31 64 -30 64 -577 64 -474 0 -491 1 -485 19 16 52 36 169 46 277 25 268 -32
555 -162 811 -265 524 -795 848 -1377 841 -81 0 -163 -3 -182 -5z m429 -228
c264 -51 496 -172 680 -354 191 -189 302 -384 368 -649 25 -97 27 -125 28
-292 0 -182 -5 -227 -42 -362 l-16 -58 -1258 0 -1258 0 -16 52 c-50 169 -63
408 -32 584 80 451 377 822 800 1001 95 40 243 79 349 93 98 12 294 5 397 -15z"/>
<path d="M733 2696 c-53 -24 -76 -87 -51 -141 12 -26 199 -145 283 -181 103
-43 196 87 118 165 -36 34 -254 160 -291 166 -15 3 -41 -1 -59 -9z"/>
<path d="M4290 2690 c-38 -11 -251 -138 -266 -158 -23 -30 -26 -69 -9 -106 20
-41 74 -71 112 -61 42 10 251 135 273 162 24 31 26 90 4 122 -13 18 -74 54
-86 50 -2 0 -14 -4 -28 -9z"/>
<path d="M455 1668 c-37 -20 -55 -52 -55 -96 0 -35 6 -49 29 -73 l29 -29 174
0 c193 0 208 4 234 65 19 46 2 100 -39 125 -28 18 -51 20 -192 20 -97 -1 -168
-5 -180 -12z"/>
<path d="M4304 1670 c-73 -29 -84 -130 -20 -182 31 -25 329 -26 365 -2 60 42
58 138 -2 174 -28 17 -50 20 -177 19 -80 0 -155 -4 -166 -9z"/>
<path d="M704 656 c-24 -24 -34 -43 -34 -65 0 -39 24 -87 49 -101 13 -7 613
-10 1846 -10 l1827 0 29 29 c43 43 41 101 -5 147 l-34 34 -1822 0 -1822 0 -34
-34z"/>
<path d="M1561 196 c-31 -17 -50 -53 -51 -94 0 -26 9 -43 34 -68 l34 -34 976
0 c1061 0 1018 -2 1044 55 22 47 15 90 -19 124 l-31 31 -981 0 c-796 -1 -987
-3 -1006 -14z"/>
</g>
</svg>
<h4>${data.currentConditions.sunrise.substr(0, 5)}</h4></div>
<div id="sunset" class="sunset">
<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="512.000000pt" height="512.000000pt" viewBox="0 0 512.000000 512.000000"
 preserveAspectRatio="xMidYMid meet">

<g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
fill="#000000" stroke="none">
<path d="M2513 4894 c-60 -30 -63 -47 -63 -405 l0 -323 -62 61 c-72 70 -94 83
-138 83 -48 0 -100 -56 -100 -106 0 -36 10 -48 183 -221 182 -182 183 -183
227 -183 44 0 45 1 227 183 173 173 183 185 183 221 0 50 -52 106 -100 106
-44 0 -66 -13 -137 -83 l-63 -61 0 323 c0 360 -2 376 -65 405 -41 20 -52 20
-92 0z"/>
<path d="M2494 3072 c-39 -31 -44 -55 -44 -212 0 -92 4 -160 11 -173 19 -38
51 -57 97 -57 35 0 49 6 73 29 l29 29 0 172 0 172 -29 29 c-24 23 -38 29 -73
29 -26 0 -52 -7 -64 -18z"/>
<path d="M1474 2801 c-35 -22 -60 -78 -49 -112 4 -12 41 -80 82 -151 64 -109
81 -133 111 -145 43 -18 78 -10 115 25 47 45 39 87 -47 238 -95 164 -135 192
-212 145z"/>
<path d="M3530 2787 c-29 -15 -79 -86 -140 -202 -41 -75 -43 -85 -35 -121 20
-78 116 -107 172 -52 33 34 153 248 153 274 0 40 -19 74 -52 94 -38 23 -63 25
-98 7z"/>
<path d="M2325 2466 c-560 -92 -1008 -455 -1204 -977 l-40 -104 -510 -5 -509
-5 -26 -24 c-27 -26 -42 -76 -32 -109 4 -11 18 -32 33 -46 l26 -26 2496 0
c2350 0 2497 1 2517 18 52 42 58 106 15 154 l-29 33 -514 3 -513 3 -29 82
c-16 45 -53 129 -83 187 -210 412 -591 701 -1056 802 -119 25 -424 34 -542 14z
m405 -211 c58 -8 139 -23 181 -34 392 -105 727 -406 879 -791 l20 -50 -1251 0
-1250 0 6 23 c15 49 94 207 138 272 278 422 776 648 1277 580z"/>
<path d="M733 2056 c-33 -15 -63 -60 -63 -96 0 -49 29 -78 142 -143 180 -103
176 -101 219 -88 72 22 100 93 60 156 -20 32 -253 172 -300 181 -14 2 -40 -2
-58 -10z"/>
<path d="M4290 2050 c-38 -11 -251 -138 -266 -158 -54 -72 18 -189 104 -167
41 10 251 135 272 162 24 31 26 90 4 122 -13 18 -74 54 -86 50 -2 0 -14 -4
-28 -9z"/>
<path d="M721 886 c-31 -17 -50 -53 -51 -94 0 -26 9 -43 34 -68 l34 -34 1816
0 c1386 0 1821 3 1841 12 67 30 73 130 11 180 -20 17 -131 18 -1841 17 -1492
0 -1824 -2 -1844 -13z"/>
<path d="M1563 410 c-17 -10 -37 -28 -42 -39 -16 -29 -13 -83 5 -110 37 -52
11 -51 1034 -51 1023 0 997 -1 1034 51 21 30 21 88 0 118 -37 52 -10 51 -1041
51 -931 0 -959 -1 -990 -20z"/>
</g>
</svg>
<h4>${data.currentConditions.sunset.substr(0, 5)}</h4>
</div>
</div>`;

  document.getElementById("summary_forecast").innerHTML = summaryForecastHtml;

  // temp comparison
  let tempCompHtml = `<h3 class="sub-heading center">Historical temperatures:</h3>
  <h4>Maximum on this date: ${data.days[0].normal.tempmax[2]}&deg;C<sup>*</sup>.</h4>`;
  tempCompHtml += `<p>${resultOfMaxComparison}</p>`;
  tempCompHtml += `<h4>Minimum on this date: ${data.days[0].normal.tempmin[0]}&deg;C<sup>*</sup>.</h4>`;
  tempCompHtml += `<p>${resultOfMinComparison}</p>`;
  tempCompHtml += `<p><small><sup>*</sup>Since 1970.</small></p>`;

  document.getElementById("tempComparison").innerHTML = tempCompHtml;

  // today's weather
  let todayHtml = `<h1>Today</h1>
  <img src="./assets/weather-icons/${data.days[0].icon}.svg">`;
  todayHtml += `<h2>${data.days[0].conditions}</h2>`;
  todayHtml += `<p>Temperature: ${data.days[0].temp}&deg;C</p>`;
  if (data.days[0].feelslike !== data.days[0].temp) {
    todayHtml += `<p>Feels like: ${data.days[0].feelslike}&deg;C</p>`;
  }
  todayHtml += `<p>Max: ${data.days[0].tempmax}&deg;C</p>`;
  todayHtml += `<p>Min: ${data.days[0].tempmin}&deg;C</p>`;
  todayHtml += `<p>Chance of rain: ${data.days[0].precipprob}%</p>`;
  todayHtml += `<p>Humidity: ${data.days[0].humidity}%</p>`;
  todayHtml += `<p>Wind: ${data.days[0].windspeed} kph</p>`;

  // write to DOM
  document.getElementById("today").innerHTML = todayHtml;

  // Day 1
  // day 1 data
  let dayOneHtml = `<h1>${
    weekday[new Date(data.days[1].datetime).getDay()]
  }</h1>`;
  dayOneHtml += `<img src="./assets/weather-icons/${data.days[1].icon}.svg">`;
  dayOneHtml += `<h2>${data.days[1].conditions}</h2>`;
  dayOneHtml += `<p>Temperature: ${data.days[1].temp}&deg;C</p>`;
  if (data.days[1].feelslike !== data.days[1].temp) {
    dayOneHtml += `<p>Feels like: ${data.days[1].feelslike}&deg;C</p>`;
  }
  dayOneHtml += `<p>Max: ${data.days[1].tempmax}&deg;C</p>`;
  dayOneHtml += `<p>Min: ${data.days[1].tempmin}&deg;C</p>`;
  dayOneHtml += `<p>Chance of rain: ${data.days[1].precipprob}%</p>`;
  dayOneHtml += `<p>Humidity: ${data.days[1].humidity}%</p>`;
  dayOneHtml += `<p>Wind: ${data.days[1].windspeed} kph</p>`;

  // write day 1 to the DOM
  document.getElementById("day_one").innerHTML = dayOneHtml;

  // Day 2
  // day 2 data
  let dayTwoHtml = `<h1>${
    weekday[new Date(data.days[2].datetime).getDay()]
  }</h1>`;
  dayTwoHtml += `<img src="./assets/weather-icons/${data.days[2].icon}.svg">`;
  dayTwoHtml += `<h2>${data.days[2].conditions}</h2>`;
  dayTwoHtml += `<p>Temperature: ${data.days[2].temp}&deg;C</p>`;

  if (data.days[2].feelslike !== data.days[2].temp) {
    dayTwoHtml += `<p>Feels like: ${data.days[2].feelslike}&deg;C</p>`;
  }
  dayTwoHtml += `<p>Max: ${data.days[2].tempmax}&deg;C</p>`;
  dayTwoHtml += `<p>Min: ${data.days[2].tempmin}&deg;C</p>`;
  dayTwoHtml += `<p>Chance of rain: ${data.days[2].precipprob}%</p>`;
  dayTwoHtml += `<p>Humidity: ${data.days[2].humidity}%</p>`;
  dayTwoHtml += `<p>Wind: ${data.days[2].windspeed} kph</p>`;

  // write day 2 to the DOM
  document.getElementById("day_two").innerHTML = dayTwoHtml;

  // Day 3
  // day 3 data
  let dayThreeHtml = `<h1>${
    weekday[new Date(data.days[3].datetime).getDay()]
  }</h1>`;
  dayThreeHtml += `<img src="./assets/weather-icons/${data.days[3].icon}.svg">`;
  dayThreeHtml += `<h2>${data.days[3].conditions}</h2>`;
  dayThreeHtml += `<p>Temperature: ${data.days[3].temp}&deg;C</p>`;
  if (data.days[3].feelslike !== data.days[3].temp) {
    dayThreeHtml += `<p>Feels like: ${data.days[3].feelslike}&deg;C</p>`;
  }
  dayThreeHtml += `<p>Max: ${data.days[3].tempmax}&deg;C</p>`;
  dayThreeHtml += `<p>Min: ${data.days[3].tempmin}&deg;C</p>`;
  dayThreeHtml += `<p>Chance of rain: ${data.days[3].precipprob}%</p>`;
  dayThreeHtml += `<p>Humidity: ${data.days[3].humidity}%</p>`;
  dayThreeHtml += `<p>Wind: ${data.days[3].windspeed} kph</p>`;

  // write day 3 to the DOM
  document.getElementById("day_three").innerHTML = dayThreeHtml;
}
