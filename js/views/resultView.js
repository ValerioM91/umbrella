import { changeUnit, currentUnit } from '../helpers.js';

class ResultView {
  resultHeadingElement = document.querySelector('.results__heading');
  resultListElement = document.querySelector('.results__list');
  resultElement = document.querySelector('.results');

  clear() {
    this.resultHeadingElement.innerHTML = '';
    this.resultListElement.innerHTML = '';
    this.resultElement.style.zIndex = 0;
  }

  renderHeading(data, i = 0) {
    const markup = `${data.dailyForecastArray[i].dateDay} ${data.dailyForecastArray[i].dateNumber} ${data.dailyForecastArray[i].dateMonth} in ${data.name}, ${data.country}`;
    this.resultHeadingElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderResultList(dataArray) {
    let markup = ``;
    dataArray.forEach(item => {
      const date = new Date(item.dt * 1000).toLocaleTimeString();
      const hour = date.slice(0, 5);
      const info = item.weather[0].main;
      const icon = item.weather[0].icon;
      const temperature = item.main.temp.toFixed(1);
      const feelsLike = item.main.feels_like.toFixed(1);

      markup += `<li class="result">
          <div class="result__hour">${hour}</div>
          <img class="result__icon" src="https://openweathermap.org/img/wn/${icon}@2x.png">
          <div class="result__infos">${info}</div>
          <div class="result__temp"><span class="temp-unit">${changeUnit(
            temperature,
            currentUnit
          )}</span>˚</div>
          <div class="result__feels-like">
            <span class="result__feels-like--text">Feels like</span><div class="result__feels--like-unit"><span class="temp-unit">${changeUnit(
              feelsLike,
              currentUnit
            )}</span>˚</div>
          </div>
        </li>`;
    });
    this.resultElement.style.zIndex = 3;
    this.resultElement.style.backgroundColor = 'white';
    this.resultListElement.insertAdjacentHTML('beforeend', markup);
  }
}
export default new ResultView();
