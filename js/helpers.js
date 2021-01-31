//
export const getFormattedDate = function (date) {
  const weekDays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const day = weekDays[date.getDay()];
  const dateNumber = date.getDate();
  const month = months[date.getMonth()];
  return [day, dateNumber, month];
};

//
export let currentUnit = 'celsius';

const toCelsiusIcon = document.querySelector('.units__icons--celsius');
toCelsiusIcon.addEventListener('click', function () {
  if (currentUnit === 'celsius') return;
  changeToCelsius();
});

const toFarenheitIcon = document.querySelector('.units__icons--fahrenheit');
toFarenheitIcon.addEventListener('click', function () {
  if (currentUnit === 'farenheit') return;
  changeToFarenheit();
});

export const changeToFarenheit = function () {
  const temperatures = document.querySelectorAll('.temp-unit');
  temperatures.forEach(temp => {
    temp.textContent = ((+temp.textContent * 9) / 5 + 32).toFixed(1);
  });
  currentUnit = 'farenheit';
  toFarenheitIcon.classList.add('units__icons--active');
  toCelsiusIcon.classList.remove('units__icons--active');
};

export const changeToCelsius = function () {
  const temperatures = document.querySelectorAll('.temp-unit');
  temperatures.forEach(temp => {
    temp.textContent = (((+temp.textContent - 32) * 5) / 9).toFixed(1);
  });
  currentUnit = 'celsius';
  toFarenheitIcon.classList.remove('units__icons--active');
  toCelsiusIcon.classList.add('units__icons--active');
};

export const changeUnit = function (temperature, currentUnit) {
  currentUnit === 'celsius'
    ? (temperature = (temperature - 273.15).toFixed(1))
    : '';
  currentUnit === 'farenheit'
    ? (temperature = (((temperature - 273.15) * 9) / 5 + 32).toFixed(1))
    : '';
  return temperature;
};
