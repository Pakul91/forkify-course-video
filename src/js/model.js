import { async } from 'regenerator-runtime';
import 'regenerator-runtime/runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';

// State variable cantaining fetched data from API. Will recive data from loadRecipe() and loadSearchResults() fuctions
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1, // default value
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

// Create and object from recived data
const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    // conditinally adding property:
    ...(recipe.key && { key: recipe.key }),
  };
};

// Loading recipe from API and passing it to the state variable. Will be called by controlRecipes() function in controller module
export const loadRecipe = async function (id) {
  try {
    // Waiting for getJSON helper function to return data from API call
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    // Convert data returned from the API call. Assing it to the 'state' variable.
    state.recipe = createRecipeObject(data);
    // Check if there is any element with the matching ID in the array
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      // If yes set bookmark property to true
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    console.error(`${err} 💩💩💩💩`);
    throw err;
  }
};

//Loading the array of search results from the API database and passing them into to state variable. Will be called by controlSearchResults in controller module. Will take a 'query' as an argument
export const loadSearchResults = async function (query) {
  try {
    // Assiginig query to the new obj in state variable
    state.search.query = query;
    // Calling getJSON helper funtion
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    console.log(data);
    // Assining results of serch to the new obj in state variable
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    // Set current page to 1
    state.search.page = 1;
    //Error handling
  } catch (err) {
    console.error(`${err} 💩💩💩💩`);
    throw err;
  }
};

// Function responsible for determinating which results will be displayed
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; // 0;
  const end = page * state.search.resultsPerPage; // 10;

  return state.search.results.slice(start, end);
};

// Function responsible for updating ingrideints quantity in relation to number of servings
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    // Equation for new quantity
    // newQt = oldQt * newServings / oldServings
    ing.quantity = ing.quantity * (newServings / state.recipe.servings);
    // Updating servings to new number
  });
  state.recipe.servings = newServings;
};

// Transfer data to the local storage
const persistBookmarks = function () {
  // converting object into string and storing in in the local store with'bookmarks' keyword
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};
// Add bookmark
export const addBookmark = function (recipe) {
  // Add bookmark to the bookmarks array
  state.bookmarks.push(recipe);
  // Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  // Data to local storage
  persistBookmarks();
};
// Delete bookmark
export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // Mark current recipe as NOT bookmark
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  // Data to local storage
  persistBookmarks();
};

// Retrieve data from local storage
const init = function () {
  // Load data from local storage using keyword
  const storage = localStorage.getItem('bookmarks');
  // converting string back into object
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

// Clear bookmarks from the local storage

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

// Upload new recipe to the API

export const uploadRecipe = async function (newRecipe) {
  //converting object into array and filtering for 'ingredient' then removing all white space, spliting using ',' and destructuring. Returning an object with variables from destructuring.
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        // New array with results
        const ingArr = ing[1].split(',').map(el => el.trim());
        // Check formating and throw error if wrong
        if (ingArr.length !== 3) throw new Error('Wrong ingredient format');
        // Destructure array into variables
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    // convert new recipe to format accepted in API
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    console.log(recipe);
    // Send new recipe to API. Will return data
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    // Create new recipe object
    state.recipe = createRecipeObject(data);
    // Add bookmark
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
