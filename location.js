// export async function getLocationFromCoords(latitude, longitude) {
//   // get location name(s) from lat and long
//   try {
//     const locationArray = await axios.get(
//       `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&&appid=9e935cc2d4512c9d406b475894374293`
//     );
//     // console.log(locationArray);
//     const location = locationArray.data[0].name;
//     // console.log(location);
//     createInterface(location);
//   } catch (error) {
//     console.log(error);
//   }
// }
