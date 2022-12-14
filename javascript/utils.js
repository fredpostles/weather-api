export function compareCurrentToMax(data) {
  // defining variables to be used in comparison
  const maxTemp = data.days[0].normal.tempmax[2];
  const currentTemp = data.currentConditions.temp;

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

export function compareCurrentToMin(data) {
  // defining variables to be used in comparison
  const minTemp = data.days[0].normal.tempmin[0];
  const currentTemp = data.currentConditions.temp;

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

// array of weekdays, to convert datetime to day of week
export const weekday = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// add date in format '22nd'
export const getDay = (day) => {
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
};
