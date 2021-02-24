import { async } from 'regenerator-runtime';
import _ from 'lodash';
import { API_KEY, MATCH_LIST_ELEMENTS } from './config.js';
import { getFormattedDate } from './helpers.js';
import cityList from '../data/city-list.json';

// 3 HOUR SLOTS FORECAST REQUEST + CURRENT WEATHER
export const weatherForecastById = async function (cityID) {
  // 3 hours
  const requestJSON = await (
    await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?id=${cityID}${API_KEY}`
    )
  ).json();
  // Current
  const requestJSONCurrentWeather = await (
    await fetch(
      `https://api.openweathermap.org/data/2.5/weather?id=${cityID}${API_KEY}`
    )
  ).json();

  setState(requestJSON, requestJSONCurrentWeather);
  await dailyForecast(state.lat, state.lon);
  return state;
};

const state = {};

// CREATE A DAILY ARRAY[[DAY1],[DAY2],[DAY3],...]
const setState = function (requestJSON, requestJSONCurrentWeather) {
  state.name = requestJSON.city.name;
  state.country = requestJSON.city.country;
  state.today = new Date(requestJSON.list[0].dt_txt.slice(0, 10));
  state.lat = requestJSON.city.coord.lat;
  state.lon = requestJSON.city.coord.lon;
  // List of all the forecast in 3 hours slots
  const forecastThreeHoursArray = requestJSON.list;
  forecastThreeHoursArray.unshift(requestJSONCurrentWeather);
  // Creating an orderd by day array
  state.dailyThreeHoursArray = [[], [], [], [], []];
  forecastThreeHoursArray.map(function (item) {
    const twentyfourHours = 86400; // seconds (item.dt is in seconds)
    for (let i = 0; i < 5; i++) {
      if (
        item.dt - state.today / 1000 >= twentyfourHours * i &&
        item.dt - state.today / 1000 < twentyfourHours * (i + 1)
      ) {
        state.dailyThreeHoursArray[i].push(item);
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
    state.dailyForecastArray = [];
    for (let i = 0; i < 5; i++) {
      const day = {};
      day.temperatureMax = request.daily[i].temp.max.toFixed(1);
      day.temperatureMin = request.daily[i].temp.min.toFixed(1);
      day.icon = request.daily[i].weather[0].icon;
      const date = new Date(request.daily[i].dt * 1000);
      day.dateDay = getFormattedDate(date)[0];
      day.dateNumber = getFormattedDate(date)[1];
      day.dateMonth = getFormattedDate(date)[2];

      state.dailyForecastArray.push(day);
    }
  } catch (err) {
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
};

// MATCH LIST FOR AUTOCOMPLETE
export const matchListArray = function (searchText) {
  // searching for cities that START with out input
  let matches = cityList.filter(city => {
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
};
