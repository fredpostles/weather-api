export function compareCurrentToMax(data) {
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

  // call createInterface function and pass it the result + data from API call
  createInterface(data, resultOfComparison);
}
