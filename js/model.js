import { async } from 'regenerator-runtime';
import _ from 'lodash';
import { API_URL, API_KEY, MATCH_LIST_ELEMENTS } from './config.js';
import { getFormattedDate } from './helpers.js';

// 3 HOUR SLOTS FORECAST REQUEST + CURRENT WEATHER
export const weatherForecastById = async function (cityID) {
  // 3 hours
  const requestJSON = await (
    await fetch(
      `http://api.openweathermap.org/data/2.5/forecast?id=${cityID}${API_KEY}`
    )
  ).json();
  // Current
  const requestJSONCurrentWeather = await (
    await fetch(
      `http://api.openweathermap.org/data/2.5/weather?id=${cityID}${API_KEY}`
    )
  ).json();

  createForecastObject(requestJSON, requestJSONCurrentWeather);
  await dailyForecast(forecastObject.lat, forecastObject.lon);
  return forecastObject;
};

const forecastObject = {};

// CREATE A DAILY ARRAY[[DAY1],[DAY2],[DAY3],...]
const createForecastObject = function (requestJSON, requestJSONCurrentWeather) {
  forecastObject.name = requestJSON.city.name;
  forecastObject.country = requestJSON.city.country;
  forecastObject.today = new Date(requestJSON.list[0].dt_txt.slice(0, 10));
  forecastObject.lat = requestJSON.city.coord.lat;
  forecastObject.lon = requestJSON.city.coord.lon;
  // List of all the forecast in 3 hours slots
  const forecastThreeHoursArray = requestJSON.list;
  forecastThreeHoursArray.unshift(requestJSONCurrentWeather);
  // Creating an orderd by day array
  forecastObject.dailyThreeHoursArray = [[], [], [], [], []];
  forecastThreeHoursArray.map(function (item) {
    const twentyfourHours = 86400; // seconds (item.dt is in seconds)
    for (let i = 0; i < 5; i++) {
      if (
        item.dt - forecastObject.today / 1000 >= twentyfourHours * i &&
        item.dt - forecastObject.today / 1000 < twentyfourHours * (i + 1)
      ) {
        forecastObject.dailyThreeHoursArray[i].push(item);
      }
    }
  });
};

// DAILY FORECAST FOR THE NAV
const dailyForecast = async function (lat, lon) {
  try {
    const request = await (
      await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts${API_KEY}`
      )
    ).json();
    // Creating an array of objects. Each obj has daily temp Max, temp min, formatted date and icon code
    forecastObject.dailyForecastArray = [];
    for (let i = 0; i < 5; i++) {
      const day = {};
      day.temperatureMax = request.daily[i].temp.max.toFixed(1);
      day.temperatureMin = request.daily[i].temp.min.toFixed(1);
      day.icon = request.daily[i].weather[0].icon;
      const date = new Date(request.daily[i].dt * 1000);
      day.dateDay = getFormattedDate(date)[0];
      day.dateNumber = getFormattedDate(date)[1];
      day.dateMonth = getFormattedDate(date)[2];

      forecastObject.dailyForecastArray.push(day);
    }
  } catch (err) {
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
};

// memoize - making the request of the cities ONLY ONCE
const getCitiesList = _.memoize(async function () {
  const request = await (await fetch('data/city-list-min.json')).json();
  return request;
});

// MATCH LIST FOR AUTOCOMPLETE
export const matchListArray = async function (searchText) {
  try {
    const cities = await getCitiesList();

    // searching for cities that START with out input
    let matches = cities.filter(city => {
      const regex = new RegExp(`^${searchText}`, 'gi');
      return city.name.match(regex);
    });
    // ordering the cities array from the shortest name to the longest (to display first more relevant matches)
    const orderedMatches = matches.sort((a, b) => {
      if (a.name.length < b.name.length) return -1;
      if (a.name.length > b.name.length) return 1;
    });
    // Displaying N (from config file) results
    const matchListArray = orderedMatches.slice(0, MATCH_LIST_ELEMENTS);
    return matchListArray;
  } catch (err) {
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
};

// MATCH LIST ON CLICK - SHOWS ONLY EXACT MACTHES
export const matchListArrayExact = async function (searchText) {
  try {
    const cities = await (await fetch('data/city-list-min.json')).json();

    let matches = cities.filter(city => {
      const regex = new RegExp(`^${searchText}$`, 'gi');
      return city.name.match(regex);
    });
    const orderedMatches = matches.sort((a, b) => {
      if (a.name.length < b.name.length) return -1;
      if (a.name.length > b.name.length) return 1;
    });
    const matchListArrayExact = orderedMatches.slice(0, MATCH_LIST_ELEMENTS);
    return matchListArrayExact;
  } catch (err) {
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
};
