class SearchView {
  _parentElement = document.querySelector('.search');

  // Will take the input of the search typed in the search box
  getQuery() {
    const query = this._parentElement.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }
  //Will clear the input in the search box
  _clearInput() {
    this._parentElement.querySelector('.search__field').value = '';
  }

  // Will wait for the 'submit' event in the search box and exectue callback function passed from the controller
  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
