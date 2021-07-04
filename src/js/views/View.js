import icons from '../../img/icons.svg';

export default class View {
  _data;
  // Will recive data from call from controller module and render it in given _parentElement. Will be used across multiple Views
  render(data, render = true) {
    //checkin if data exist is an array and its length is 0
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    // Updating data in the View
    this._data = data;
    // Generating new markup
    const markup = this._generateMarkup();

    // if render parameter will be set to false then the function will return markup only withot inserting it into DOM
    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // Will update the text and atributes without updating the whole page. Will be called in multiple modules
  update(data) {
    // Updating _data in the View
    this._data = data;
    // Generating new markup
    const newMarkup = this._generateMarkup();
    // Creating new 'virtual' DOM object. This will convert the string into the DOM element which we will next compare to already existing DOM element(displayed one)
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    // Selecting all elements in newly created DOM element (above) and converting them to array using Array.from()
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    // Selecting all DOM elements currently displayed in the window
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    // Looping over newElements array to compare each  to the curElement counterpart
    newElements.forEach((newEl, i) => {
      // ensuring that we are compering same elements using matching index
      const curEl = curElements[i];
      // comparing 2 elements content using isEqualNode() method

      //UPDATING TEXT
      // Checking if there is a difference between elements (.isEqualNode() method) AND if the element child exist and it is a text (using .nodeValue property on selected element child)
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        //replacing the current element text content to the new one if conditions are met

        curEl.textContent = newEl.textContent;
      }

      //UPDATING ATTRIBUTES
      // Checking if there is a difference between elements. The .attributes property will display all attribtes of selected element.
      if (!newEl.isEqualNode(curEl)) {
        //converting attribute list into array. And replacing curEl attributes(using .setAttribute() method ) with the newEl attributes

        Array.from(newEl.attributes).forEach(attr => {
          // console.error(Array.from(newEl.attributes));
          // Updating curEl attribute using newEl attributes
          curEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  //Clearing the parent element
  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
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
