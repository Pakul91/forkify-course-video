import View from './View';
import PreviewView from './prieviewView.js';
import icons from '../../img/icons.svg';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query!';
  _message = '';

  // Generating markup for each position from the array of the bookmarks. Stored in the model module in 'state' variable. Called in the controller module.
  _generateMarkup() {
    return this._data.map(result => PreviewView.render(result, false)).join('');
  }
}

export default new ResultsView();
