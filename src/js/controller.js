import * as model from './model';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import icons from 'url:../img/icons.svg';
import searchView from './views/search_view';
import resultsView from './views/result';
import bookMarksView from './views/bookmarks';

import paginationView from './views/pagination';

import recipeView from './views/recipe';
import AddRecipeView from './views/addRecipe';
import { MODAL_CLOSE_SEC } from './config';
import addRecipe from './views/addRecipe';

// https://forkify-api.herokuapp.com/v2

const showRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    resultsView.update(model.getSearchResultsPage());
    await model.loadRecipe(id);
    recipeView.render(model.state.recipe);
    bookMarksView.update(model.state.bookmarks);
  } catch (e) {
    recipeView.renderError();
    console.log(e);
  }
};
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) return;
    await model.loadSearchResults(query);
    resultsView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.renderError();
  }
};
const controlPagination = function (goToPage) {
  resultsView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
};
const controlServings = function (newServings) {
  //Update the recipe servings(in state)
  model.updateServing(newServings);

  //update the recipe view

  recipeView.update(model.state.recipe);
};
const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }
  recipeView.update(model.state.recipe);
  bookMarksView.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookMarksView.render(model.state.bookmarks);
};
const controllAddRecipe = async function (newRecipe) {
  try {
    addRecipe.renderSpinner();
    await model.uploadRecipe(newRecipe);
    recipeView.render(model.state.recipe);
    AddRecipeView.renderMessage('Recipe is successfully uploaded');
    bookMarksView.render(model.state.bookmarks);
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    setTimeout(function () {
      AddRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (e) {
    console.log(e);
    AddRecipeView.renderError(e.message);
  }
};
const init = function () {
  bookMarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  recipeView.addHandlerRender(showRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  AddRecipeView.addHandlerUpload(controllAddRecipe);
};

init();
///////////////////////////////////////
