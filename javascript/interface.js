import { weekday, getDay } from "./utils.js";

// DOM references
const fourteenDays = document.getElementById("fourteen_day");
const userLocation = document.getElementById("location");
const summarySection = document.getElementById("summary");
const summaryForecast = document.getElementById("summary_forecast");
const tempComparison = document.getElementById("tempComparison");
const fourDaySection = document.getElementById("nextFourDays");

export function createInterface(
  data,
  resultOfMaxComparison,
  resultOfMinComparison,
  location
) {
  // destructuring
  const currentConds = data.currentConditions;
  const currentDay = data.days[0];

  // Summary section
  // display user location (default is London)
  userLocation.innerHTML = `${location}`;

  // basic weather summary of current conditions
  let summaryHtml = `<img src="./assets/weather-icons/${currentConds.icon}.svg" alt="${currentConds.icon}">
                    <h3>Current temperature: <span class="bold">${currentConds.temp}&deg;C</span></h3>
                    <h3>Precipitation: <span class="bold">${currentConds.precip}%</span></h3>`;
  // write to the DOM
  summarySection.innerHTML = summaryHtml;

  // forecast for next few days and today's sunrise/sunset times
  let summaryForecastHtml = `<h2 class="sub-heading">Forecast:</h2>
                            <h3>${data.description}</h3>`;
  // sunrise/sunset times
  summaryForecastHtml += `<div class="sun_times_container">
                          <div id="sunrise" class="sunrise">
                          <img src="./assets/sunrise.svg" alt="Sunrise icon" title="Sunrise icon" />
                          <h4>${currentConds.sunrise.substr(0, 5)}</h4></div>
                          <div id="sunset" class="sunset">
                          <img src="./assets/sunset.svg" alt="Sunset icon" title="Sunset icon"/>
                          <h4>${currentConds.sunset.substr(0, 5)}</h4>
                          </div>
                          </div>`;
  // write to DOM
  summaryForecast.innerHTML = summaryForecastHtml;

  // temp comparison
  let tempCompHtml = `<h2 class="sub-heading center">Historical temperatures:</h2>
                      <h3>Maximum on this date: ${currentDay.normal.tempmax[2]}&deg;C<sup>*</sup>.</h3>
                      <p>${resultOfMaxComparison}</p>
                      <h3>Minimum on this date: ${currentDay.normal.tempmin[0]}&deg;C<sup>*</sup>.</h3>
                      <p>${resultOfMinComparison}</p>
                      <p><small><sup>*</sup>Since 1970.</small></p>`;
  // write to DOM
  tempComparison.innerHTML = tempCompHtml;

  let nextFourDays = "";
  //  next 4 days
  data.days.slice(0, 4).forEach((day) => {
    console.log("Day:", day, "Current conditions", currentConds);
    let fourDaysHtml = `<h1>${weekday[new Date(day.datetime).getDay()]}</h1>
                        <img src="./assets/weather-icons/${
                          day.icon
                        }.svg" alt="${day.icon}"/>
                        <h2>${day.conditions}</h2>
                        <p>${day.temp}&deg;C</p>`;
    if (day.feelslike !== day.temp) {
      fourDaysHtml += `<p>Feels like: ${day.feelslike}&deg;C</p>`;
    }
    fourDaysHtml += `<p>Max: ${day.tempmax}&deg;C</p>
                    <p>Min: ${day.tempmin}&deg;C</p>
                    <p>Chance of rain: ${day.precipprob}%</p>
                    <p>Humidity: ${day.humidity}%</p>
                    <p>Wind: ${day.windspeed} kph</p>`;

    nextFourDays += `<div class="card day">${fourDaysHtml}</div>`;
  });
  // write to DOM
  fourDaySection.innerHTML = nextFourDays;

  // two week forecast
  let result = "";

  // loop over array of dates and get basic weather data for each one
  data.days.slice(1, 15).forEach((day) => {
    let dayHtml = `<h2>${getDay(
      new Date(day.datetimeEpoch * 1000).getDate()
    )}</h2>`;
    dayHtml += `<img src="./assets/weather-icons/${day.icon}.svg" alt="${day.icon}">
    <div class="temps">${day.tempmax}&deg;C / ${day.tempmin}&deg;C</div>`;
    result += `<div class="two_weeks day">${dayHtml}</div>`;
  });

  // write to DOM
  fourteenDays.innerHTML = result;
}
