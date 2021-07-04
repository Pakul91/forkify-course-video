import View from './View';
import icons from '../../img/icons.svg';

class PreviewView extends View {
  _parentElement = '';

  // Generating markup for each position from the array of results(search or bookmark) stored in the model module in 'state' variable. Called in the controller module.

  // Callback function for the _generateMarkup() method
  _generateMarkup(result) {
    // Current(displayed) recipe ID
    const id = window.location.hash.slice(1);

    return `
    <li class="preview">
      <a class="preview__link ${
        this._data.id === id ? 'preview__link--active' : ''
      }" href="#${this._data.id}">
        <figure class="preview__fig">
          <img src="${this._data.image}" alt="${this._data.title}" />
        </figure>
        <div class="preview__data">
          <h4 class="preview__title">${this._data.title}</h4>
          <p class="preview__publisher">${this._data.publisher}</p>
          <div class="preview__user-generated ${
            this._data.key ? '' : 'hidden'
          }">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
        </div>
      </a>
    </li>
      `;
  }
}

export default new PreviewView();
