import * as model from './model.js';
import searchView from './views/searchView.js';
import recipeView from './views/recipeView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

import 'core-js/stable';

//enabling parcel to dynamically update refresh the poge
// if (module.hot) {
//   module.hot.accept();
// }

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

//Controls the main area where recipe is displayed
const controlRecipes = async function () {
  try {
    //getting id from url #
    const id = window.location.hash.slice(1);

    // Guard close
    if (!id) return;
    // Rendering spinner
    recipeView.renderSpinner();

    // 0) Updating resultsView, and bookmarkView to mark selected search result, Using update() method from the View
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // 1) Loading the recipe. Calling loadRecipe() from the model module with id variable passed as an argument
    await model.loadRecipe(id);

    // 2) Rendering recipe.  Calling render method from recipe view and passing an object from model module.
    recipeView.render(model.state.recipe);
  } catch (err) {
    RecipeView.renderError();
  }
};

// Controls the search functionality
const controlSearchResults = async function () {
  try {
    //rendering spinner
    resultsView.renderSpinner();

    // Obtaining query from getQuery() method in searchView
    const query = searchView.getQuery();
    // Guard close
    if (!query) return;

    //calling and waiting for the resposne of the function from the model module with query variable as an argument
    await model.loadSearchResults(query);

    // Rendering results with render() method ('View' parent class method) in resultView with data from model module.
    //getSearchResults will determinate how many results will be displayed
    resultsView.render(model.getSearchResultsPage());

    // Rendering initial pagination results

    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

// Callback function to control pagination buttons. Will be called by event handler in paginationView
const controlPagination = function (goToPage) {
  // Rendering NEW results with render() method
  resultsView.render(model.getSearchResultsPage(goToPage));

  // Rendering initial pagination results
  paginationView.render(model.state.search);
};

// Will update the recipe servings number (in state). Will be called in recipeView.
const controlServings = function (newServings) {
  // Updating servings (model)
  model.updateServings(newServings);
  // Updatig recipeView
  // recipeView.render(model.state.recipe);
  // The update method will only update the text and atributes in the DOM without rendering the whole page. Method is placed in View class.
  recipeView.update(model.state.recipe);
};

// Will add bookmarks
const controlAddBookmark = function () {
  // Add bookmark to bookmarks array if not already ther
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  //  Remove bookmark from array if already there
  else model.deleteBookmark(model.state.recipe.id);

  // Update recipeView DOM
  recipeView.update(model.state.recipe);

  // Render bookmarks in the bookmarksView
  bookmarksView.render(model.state.bookmarks);
};

// callback function for bookmark event listener
const controlBookmarks = function () {
  // Render all bookmarks in bookmarks obj
  bookmarksView.render(model.state.bookmarks);
};

// callback function for addRecipeView event listener
const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Display sucess message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    // Window. history is a histroy API of the browser
    // .pushState() allows to change URL without reloading the page. Will take 3 arguments. 1st is a state (not important in this case), 2nd is a title (not important in this case), 3rd is the URL

    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form after X seconds
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);

    // Insert fresh form 0.5sec after closing the window
    setTimeout(function () {
      addRecipeView.insertNewForm();
    }, (MODAL_CLOSE_SEC + 0.5) * 1000);
  } catch (err) {
    console.error('💩💩💩💩', err);
    addRecipeView.renderError(err.message);
  }
};

const newFeature = function () {
  console.log(`Welcome to the application!`);
};

const init = function () {
  // Passing callback functions to the event handlers in the multiple 'views'
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  newFeature();
};
init();
