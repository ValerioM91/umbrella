class Spinner {
  _parentElement = document.querySelector('.spinner');
  renderSpinner() {
    const markup = `   
                <svg class="spinner__icon">
                  <use href="img/icons.svg#icon-spinner"></use>
                </svg>
        `;
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  clear() {
    this._parentElement.innerHTML = '';
  }
}
export default new Spinner();
