export function createInterface(
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

  // display user location (default is London)
  let locationHtml = `${location}`;

  document.getElementById("location").innerHTML = locationHtml;

  // basic weather summary of current conditions
  let summaryHtml = `<img src="./assets/weather-icons/${data.currentConditions.icon}.svg">`;
  summaryHtml += `<h3>Current temperature: <span class="bold">${data.currentConditions.temp}&deg;C</span></h3>`;
  summaryHtml += `<h3>Precipitation: <span class="bold">${data.currentConditions.precip}%</span></h3>`;

  document.getElementById("summary").innerHTML = summaryHtml;

  // forecast for next few days and today's sunrise/sunset times
  let summaryForecastHtml = `<h2 class="sub-heading">Forecast:</h2>
    <h3>${data.description}</h3>`;

  // sunrise/sunset times
  // have had to put svg code here as was not successful inserting using img tag
  summaryForecastHtml += `<div class="sun_times_container">
    <div id="sunrise" class="sunrise">
  <img src="./assets/sunrise.svg" alt="Sunrise icon" title="Sunrise icon" />
  <h4>${data.currentConditions.sunrise.substr(0, 5)}</h4></div>
  <div id="sunset" class="sunset">
  <img src="./assets/sunset.svg" alt="Sunset icon" title="Sunset icon"/>
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

  let nextFourDays = "";
  //  next 4 days
  data.days.slice(0, 4).forEach((day) => {
    let fourDaysHtml = `<h1>${weekday[new Date(day.datetime).getDay()]}</h1>`;
    fourDaysHtml += `<img src="./assets/weather-icons/${day.icon}.svg"/>`;
    fourDaysHtml += `<h2>${day.conditions}</h2>`;
    fourDaysHtml += `<p>Temperature: ${day.temp}&deg;C</p>`;
    if (day.feelslike !== day.temp) {
      fourDaysHtml += `<p>Feels like: ${day.feelslike}&deg;C</p>`;
    }
    fourDaysHtml += `<p>Max: ${day.tempmax}&deg;C</p>`;
    fourDaysHtml += `<p>Min: ${day.tempmin}&deg;C</p>`;
    fourDaysHtml += `<p>Chance of rain: ${day.precipprob}%</p>`;
    fourDaysHtml += `<p>Humidity: ${day.humidity}%</p>`;
    fourDaysHtml += `<p>Wind: ${day.windspeed} kph</p>`;

    nextFourDays += `<div class="card day">${fourDaysHtml}</div>`;
  });

  // write to DOM
  document.getElementById("nextFourDays").innerHTML = nextFourDays;

  // two week forecast

  // add date in format '22nd'
  function getDay(day) {
    if (day > 3 && day < 21) {
      return day + "th";
    }
    switch (day % 10) {
      case 1:
        return day + "st";
      case 2:
        return day + "nd";
      case 3:
        return day + "rd";
      default:
        return day + "th";
    }
  }

  let result = "";

  // loop over array of dates and get basic weather data for each one
  data.days.forEach((day) => {
    let dayHtml = `<h2>${getDay(
      new Date(day.datetimeEpoch * 1000).getDate()
    )}</h2>`;
    dayHtml += `<img src="./assets/weather-icons/${day.icon}.svg">
    <div class="temps">${day.tempmax}&deg;C / ${day.tempmin}&deg;C</div>`;
    result += `<div class="two_weeks day">${dayHtml}</div>`;
  });

  // write to DOM
  document.getElementById("fourteen_day").innerHTML = result;
}
