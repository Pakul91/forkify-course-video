import View from './View';
import icons from '../../img/icons.svg';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded!';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }
  // Show window when btn is clicked
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }
  // Hide window when 'x' or overlay is clicked
  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  _convertArray(arr) {
    // const lastEl = newArr[newArr.length - 1][0]; // last element of the newArr
    // const newArr = [];

    // arr.forEach(el => {
    //   lastEl === el[0] ? console.log(el[0]) : newArr.push(el);
    // });
    // console.log(newArr);
    return newArr;
  }
  // Upload recipe when form is submited. handler = controlAddRecipe() from controller
  addHandlerUpload(handler) {
    this._parentElement.addEventListener('click', function (e) {
      e.preventDefault();
      const btn = e.target.closest('.upload__btn');
      if (!btn) return;
      // Retrive data from the form (all values from the input fields) and convert it into array. 'This' will point to the element which eventlistener is attached to
      const dataArr = [...new FormData(this)];
      console.log(dataArr);

      const newArr = [];

      dataArr.forEach(el => {
        if (newArr.length === 0) {
          newArr.push(el);
        } else {
          const lastEl = newArr.length - 1; // last element in array
          newArr[lastEl][0] === el[0]
            ? (newArr[lastEl][1] = `${newArr[lastEl][1]},${el[1]}`)
            : newArr.push(el);
        }
      });
      console.log(newArr);

      //converting an Array into object
      const data = Object.fromEntries(newArr);
      console.log(data);
      handler(data);
    });
  }

  /**
   * New form markup to be insterted after uploading a new recipe
   */
  insertNewForm() {
    const markup = `
    <form class="upload">
        <div class="upload__column">
          <h3 class="upload__heading">Recipe data</h3>
          <label>Title</label>
          <input value="TEST23" required name="title" type="text" />
          <label>URL</label>
          <input value="TEST23" required name="sourceUrl" type="text" />
          <label>Image URL</label>
          <input value="TEST23" required name="image" type="text" />
          <label>Publisher</label>
          <input value="TEST23" required name="publisher" type="text" />
          <label>Prep time</label>
          <input value="23" required name="cookingTime" type="number" />
          <label>Servings</label>
          <input value="23" required name="servings" type="number" />
        </div>

        <div class="upload__ingredients">
        <h3 class="upload__heading">Ingredients</h3>
        <div class="upload__ingredients__container">
          <div class="upload__ingredients__container__content">
            <label>Ingredient 1</label>
            <input
              value="0.5"
              type="text"
              required
              name="ingredient-1"
              placeholder="'Quantity'"
            />
            <input
              value="kg"
              type="text"
              required
              name="ingredient-1"
              placeholder="'Unit'"
            />
            <input
              value="rice"
              type="text"
              required
              name="ingredient-1"
              placeholder="'Description'"
            />
          </div>
          
        </div>
        <button class="btn">
          <svg>
            <use href="${icons}#icon-plus-circle"></use>
          </svg>
          <span>Add ingredient</span>
        </button>
      </div>

      <button class="btn upload__btn">
        <svg>
          <use href="${icons}.svg#icon-upload-cloud"></use>
        </svg>
        <span>Upload</span>
      </button>
    </form>
    `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  //Generating button markup depending on number of results
  _generateMarkup() {}
}

export default new AddRecipeView();
