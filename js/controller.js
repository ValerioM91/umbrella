import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as model from './model.js';
import NavView from './views/navView.js';
import Spinner from './views/spinner.js';
import ResultView from './views/resultView.js';
import SearchList from './views/searchListView.js';
import { async } from 'regenerator-runtime';

const nav = document.querySelector('.nav');
const searchInput = document.querySelector('.search-bar__input');
const matchListEL = document.querySelector('.match-list');
const overlay = document.querySelector('.overlay');
const searchBtn = document.querySelector('.search-bar__btn');

// SEARCHLIST - List of cities - AUTOCOMPLETE when input is more than 3 letters
const controlMatchListOnType = async function (searchText) {
  if (searchText.length < 3) {
    SearchList.clear();
    Spinner.clear();
    return;
  }
  Spinner.clear();
  Spinner.renderSpinner();
  const matchList = await model.matchListArray(searchText);
  if (matchList.length === 0) {
    SearchList.clear();
    Spinner.clear();
    SearchList.renderNoExactMatch(searchText);
    return;
  }
  SearchList.createList(matchList);
  Spinner.clear();
};
searchInput.addEventListener('input', () =>
  controlMatchListOnType(searchInput.value.trim())
);

// SEARCH LIST - EXACT MATCHES ON ICON CLICK
const controlMatchList = async function (searchText) {
  SearchList.clear();
  Spinner.clear();
  Spinner.renderSpinner();
  const matchList = await model.matchListArray(searchText);
  if (matchList.length === 0) {
    SearchList.renderNoExactMatch(searchText);
    Spinner.clear();
    return;
  }
  Spinner.clear();
  SearchList.createList(matchList);
};

// Seatch for cities when enter key is pressed
document.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    if (searchInput.value === '') return;
    controlMatchList(searchInput.value.trim());
    searchInput.blur();
  }
});

// GET FORECAST - DAY 1 DEFAULT
const controlGetForecast = async function (id) {
  // 1. CLEAR NAV, RESULT LIST
  NavView.clear();
  ResultView.clear();
  // 2 . CLREAR INPUT FIELDS
  SearchList.clear();
  searchInput.value = '';
  // 3. RENDER SPINNER
  Spinner.renderSpinner();
  // 4. GET ID AND REQUEST API
  const forecast = await model.weatherForecastById(id);
  // 5. CLEAR SPINNER
  Spinner.clear();
  // 6. RENDER RESULTS
  NavView.renderNav(forecast.dailyForecastArray);
  ResultView.renderHeading(forecast);
  ResultView.renderResultList(forecast.dailyThreeHoursArray[0]);
  // 7. ADD EVENT LISTNER TO NAV
  nav.addEventListener('click', function (e) {
    nav.childNodes.forEach(day => day.classList.remove('nav__day--active'));
    const day = e.target.closest('.nav__day');
    day.classList.add('nav__day--active');
    ResultView.clear();
    ResultView.renderResultList(
      forecast.dailyThreeHoursArray[day.dataset.index]
    );
    ResultView.renderHeading(forecast, [day.dataset.index]);
  });
};

// Picking the city from matchList
matchListEL.addEventListener('click', async function (e) {
  const city = e.target.closest('.match-list__result');
  const id = city.dataset.id;
  await controlGetForecast(id);
});

//OVERLAY CLICK EVENT - HIDE MATCHLIST ON CLICK
overlay.addEventListener('click', function () {
  matchListEL.style.display = 'none';
  overlay.style.display = 'none';
});
searchInput.addEventListener('click', function () {
  matchListEL.style.display = 'block';
  overlay.style.display = 'block';
});

// ESCAPE KEY EVENT
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    SearchList.clear();
    searchInput.value = '';
  }
});
