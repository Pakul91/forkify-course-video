import View from './View';
import icons from '../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  // Event handler for clicking on the button
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');

      if (!btn) return;
      console.log(btn);

      //retrieving the current page from the button dataset
      const goToPage = +btn.dataset.goto; //prepending '+' will convert string into number

      handler(goToPage);
    });
  }

  //Generating button markup depending on number of results
  _generateMarkup() {
    // Curent page the user is on
    const curPage = this._data.page;
    // Calculating how many pages needs to be displayed
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    //Markup for buttons
    const buttonBack = `
    <button data-goto="${
      curPage - 1
    }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
    </button>
  `;
    const buttonFront = `
    <button data-goto="${
      curPage + 1
    }" class="btn--inline pagination__btn--next">
        <span>Page ${curPage + 1}</span>
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
        </svg>
    </button>
  `;

    // Page 1, and there are other pages
    if (curPage === 1 && numPages > 1) {
      return buttonFront;
    }
    // Last page
    if (curPage === numPages && numPages > 1) {
      return buttonBack;
    }
    // Other page
    if (curPage < numPages) {
      return buttonBack + buttonFront;
    }
    // Page 1, and there are NO other pages
    return '';
  }
}

export default new PaginationView();
