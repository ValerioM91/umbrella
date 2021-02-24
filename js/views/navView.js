import { changeUnit, currentUnit } from '../helpers.js';

class NavView {
  _parentElement = document.querySelector('.nav');

  clear() {
    this._parentElement.innerHTML = '';
  }

  renderNav(dataArray) {
    dataArray.forEach((el, i) => {
      const markup = `<div class="nav__day nav__day--${i + 1} ${
        i === 0 ? 'nav__day--active' : ''
      }" data-index="${i}">
      <div class="nav__day--date">
        <div class="nav__day--date week-day">${
          i === 0 ? 'Today' : el.dateDay
        }</div>
        <div class="nav__day--date day-month">${el.dateNumber} ${
        el.dateMonth
      }</div>
      </div>
      <img class="nav__day--icon" src="https://openweathermap.org/img/wn/${
        el.icon
      }@2x.png">
      <div class="nav__day--temp">
     <div class="temp-max"> <span class="temp-unit">${changeUnit(
       el.temperatureMax,
       currentUnit
     )}</span>˚ </div> <div class="temp-min"> <span class="temp-unit">${changeUnit(
        el.temperatureMin,
        currentUnit
      )}</span>˚</div>
      </div>
    </div>`;

      this._parentElement.insertAdjacentHTML('beforeend', markup);
    });
  }
}

export default new NavView();
