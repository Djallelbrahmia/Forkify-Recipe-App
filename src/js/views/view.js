import icons from 'url:../../img/icons.svg';

export default class View {
  _parentElement;
  _data;
  _errorMessage = 'We could not find that recipe ,please try another one';
  _successMessage = `Start by searching for a recipe or an ingredient. Have fun!`;
  render(data, render = true) {
    this._data = data;
    const markup = this._generateMarkup();
    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  _clear() {
    this._parentElement.innerHTML = '';
  }
  renderSpinner() {
    const markup = ` <div class="spinner">
      <svg>
        <use href="${icons}.svg#icon-loader"></use>
      </svg>
    </div> `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterBegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `   <div class="error">
    <div>
      <svg>
        <use href="${icons}#icon-alert-triangle"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div> `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterBegin', markup);
  }
  renderSuccess(message) {
    const markup = `   <div class="message">
    <div>
      <svg>
        <use href="#${icons}#icon-smile"></use>
      </svg>
    </div>
    <p>${this._successMessage}</p>
  </div> `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterBegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr => {
          curEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }
  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
