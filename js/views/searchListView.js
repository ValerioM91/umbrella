class SearchList {
  _parentElement = document.querySelector('.search-bar');
  searchBtnIcon = document.querySelector('.search-bar__btn--icon');
  _matchListElement = document.querySelector('.match-list');
  overlay = document.querySelector('.overlay');

  clear() {
    this.searchBtnIcon.style.fill = 'var(--color-primary)';
    this._matchListElement.innerHTML = '';
    this.overlay.style.display = 'none';
    this._matchListElement.style.display = 'none';
  }

  createList(matches) {
    this._matchListElement.innerHTML = '';
    for (let i = 0; i < 8 && i < matches.length; i++) {
      const markup = `<li class="match-list__result" data-id="${matches[i].id}">
    <div class="match-list__result--city">
    <svg class="match-list__location-icon">      
    <use href="img/icons.svg#icon-location-pin"></use>
    </svg>${matches[i].name}</div>
    <div class="match-list__result--country">${matches[i].country}</div>
  </li>`;
      this._matchListElement.insertAdjacentHTML('beforeend', markup);
    }
    this.searchBtnIcon.style.fill = 'var(--color-secondary)';
    this._matchListElement.style.display = 'block';
    this.overlay.style.display = 'block';
  }

  renderNoExactMatch(inputData) {
    const message = `<div class="match-list__message">Sorry, we couldn't find "${inputData}". Please try again!</div>`;
    this._matchListElement.insertAdjacentHTML('afterbegin', message);
    this._matchListElement.style.display = 'block';
    this.overlay.style.display = 'block';
  }
}
export default new SearchList();
