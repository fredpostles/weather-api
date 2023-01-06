import { weekday, getDay } from "./utils.js";

// DOM references
const fourteenDays = document.getElementById("fourteen_day");
const userLocation = document.getElementById("location");
const summarySection = document.getElementById("summary");
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
  const historicalData = currentDay.normal;

  // SUMMARY SECTION
  // display user location (default is London)
  userLocation.innerHTML = `${location}`;

  // basic weather summary of current conditions
  let summaryHtml = `<h2 class="current_conditions">${
    currentConds.conditions
  }</h2>
                    <img src="./assets/weather-icons/visual-crossing-weather-icons/${
                      currentConds.icon
                    }.svg" alt="${currentConds.icon}" title="${
    currentConds.icon
  }" class="icon_large">
                    <div class="sunTimes_temp_container">
                      <div id="sunrise" class="sunrise">
                        <img src="./assets/weather-icons/sunrise.svg" alt="Sunrise icon" title="Sunrise icon" class="icon_small"/>
                        <p><span class="bold">${currentConds.sunrise.substr(
                          0,
                          5
                        )}</span></p>
                      </div>
                      <div class="temp_container">
                        <h2 class="temp"><span class="bold">${
                          currentConds.temp
                        }&deg;C</span></h2>
                      <div class="feels_like">
                      <p>Feels like: <span class="bold">${
                        currentConds.feelslike
                      }&deg;C</span></p>
                      </div></div>
                      <div id="sunset" class="sunset">
                      <img src="./assets/weather-icons/sunset.svg" alt="Sunset icon" title="Sunset icon" class="icon_small"/>
                      <p><span class="bold">${currentConds.sunset.substr(
                        0,
                        5
                      )}</span></p>
                      </div>
                    </div>
                    <div class="conditions">
                      <div class="precipitation_chance" title="Chance of rain">
                        <img src="./assets/weather-icons/visual-crossing-weather-icons/rain.svg" alt="Rain icon" class="icon_small"/>
                        <p><span class="bold">${
                          currentConds.precipprob
                        }%</span></p>
                      </div>
                      <div class="humidity">
                        <img src="./assets/weather-icons/humidity.png" alt="Humidity icon" title="Humidity icon" class="icon_small"/>
                        <p><span class="bold">${
                          currentConds.humidity
                        }%</span></p>
                      </div>
                      <div class="wind">
                        <img src="./assets/weather-icons/wind.png" alt="Wind icon" title="Wind icon" class="icon_small"/>
                        <p><span class="bold">${
                          currentConds.windspeed
                        }kph</span></p>
                      </div>
                    </div>
                    <div class="forecast_description">
                    <h3>Conditions ahead:</h3>
                    <p>${data.description}</p>
                    </div>
                    `;

  // write to the DOM
  summarySection.innerHTML = summaryHtml;

  // temp comparison
  let tempCompHtml = `<h4 class="sub-heading center">Historical temperatures:</h4>
                      <h4>Maximum on this date: <span class="bold">${historicalData.tempmax[2]}&deg;C<sup>*</sup></span></h4>
                      <p>${resultOfMaxComparison}</p>
                      <h4>Minimum on this date: <span class="bold">${historicalData.tempmin[0]}&deg;C<sup>*</sup></span></h4>
                      <p>${resultOfMinComparison}</p>
                      <p><small><sup>*</sup>Since 1970.</small></p>`;
  // write to DOM
  tempComparison.innerHTML = tempCompHtml;

  // NEXT FOUR DAYS SECTION
  let nextFourDays = "";

  data.days.slice(1, 5).forEach((day) => {
    // console.log("Day:", day, "Current conditions", currentConds);
    let fourDaysHtml = `<h2>${weekday[new Date(day.datetime).getDay()]}</h2>
                        <img src="./assets/weather-icons/visual-crossing-weather-icons/${
                          day.icon
                        }.svg" alt="${day.icon}" title="${
      day.icon
    } icon" class="icon_mid"/>
                        <h3>${day.conditions}</h3>
                        <div class="tempMaxMin">
                          <p>Max: <span class="bold">${
                            day.tempmax
                          }&deg;C</span></p>
                          <p>Min: <span class="bold">${
                            day.tempmin
                          }&deg;C</span></p>
                          <p>Feels like: <span class="bold">${
                            day.feelslike
                          }&deg;C</span></p>
                        </div>
                        <div class="conditions">
                          <div class="precipitation_chance" title="Chance of rain">
                            <img src="./assets/weather-icons/visual-crossing-weather-icons/rain.svg" alt="rain" class="icon_small"/>
                            <p><span class="bold">${day.precipprob}%</span></p>
                          </div>
                          <div class="humidity">
                            <img src="./assets/weather-icons/humidity.png" alt="Humidity icon" title="Humidity" class="icon_small"/>
                            <p><span class="bold">${day.humidity}%</span></p>
                          </div>
                          <div class="wind">
                            <img src="./assets/weather-icons/wind.png" alt="Wind icon" title="Wind" class="icon_small"/>
                            <p><span class="bold">${day.windspeed}kph</span></p>
                          </div>
                        </div>`;

    nextFourDays += `<div class="card day">${fourDaysHtml}</div>`;
  });
  // write to DOM
  fourDaySection.innerHTML = nextFourDays;

  // TWO WEEK FORECAST SECTION
  let result = "";

  // loop over array of dates and get basic weather data for each one
  data.days.slice(1, 15).forEach((day) => {
    let dayHtml = `<h2>${getDay(
      new Date(day.datetimeEpoch * 1000).getDate()
    )}</h2>`;
    dayHtml += `<img src="./assets/weather-icons/visual-crossing-weather-icons/${day.icon}.svg" alt="${day.icon}" title="${day.icon} icon">
    <div class="temp"><div class="maxTemp bold">${day.tempmax}&deg;C</div><div class="minTemp">${day.tempmin}&deg;C</div></div>`;
    result += `<div class="two_weeks day">${dayHtml}</div>`;
  });

  // write to DOM
  fourteenDays.innerHTML = result;
}
