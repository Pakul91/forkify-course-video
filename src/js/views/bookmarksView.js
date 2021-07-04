import View from './View';
import icons from '../../img/icons.svg';
import PreviewView from './prieviewView.js';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = ' No bookmarks yet. Find a nice recipe and bookmark it :)';
  _message = '';

  // Load all
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  // Generating markup for each position from the array of the bookmarks. Stored in the model module in 'state' variable. Called in the controller module.
  _generateMarkup() {
    return this._data
      .map(bookmark => PreviewView.render(bookmark, false))
      .join('');
  }
}

export default new BookmarksView();
