import { getTrending, getSearched, getMovieInfo } from './js/api/movies';
import saveToWatchedOrQueue from './js/local-storage/movies_save';
import getMoviesFromLib from './js/local-storage/movies_load';
import { renderMovies } from './js/view/movies';
import { createLibPagination, createHomePagination } from './js/components/pagination';

import './sass/index.scss';

const input = document.querySelector('#search-form');
const moviesContainer = document.querySelector('#movies');
const modal = document.querySelector('.modal');
const libBtns = document.querySelectorAll('input[name="lib-btn"]');
const container = document.getElementById('tui-pagination-container');
const loadBtn = document.querySelector('.load-btn');

const WATCHED_KEY_LOCALSTORAGE = 'watched';
const QUEUE_KEY_LOCALSTORAGE = 'queue';

let page = 1;

const renderWatchedOrQueue = e => {
  container.innerHTML = ' ';
  const key = e.target.getAttribute('id');
  const moviesArray = getMoviesFromLib(key);
  if (moviesArray.length > 20 && screen.width > 767) {
    let moviesLimit = moviesArray.slice(0, 5);
    createLibPagination(renderMovies, moviesArray);
    renderMovies(moviesLimit);
  } else if (moviesArray.length > 20 && screen.width <= 767) {
    loadBtn.classList.remove('is-hidden');
    // loadBtn.addEventListener('click', loadMoreMovies);
  } else {
    renderMovies(moviesArray);
  }
};

const searchMovies = e => {
  e.preventDefault();
  let query = e.currentTarget.searchQuery.value.trim();
  getSearched(query, page);
  query = '';
};

// RENDER THE HOME PAGE OR LIB PAGE :

if (moviesContainer.classList.contains('movies-home')) {
  getTrending(page);
  input.addEventListener('submit', searchMovies);
  if (screen.width > 767) {
    createHomePagination(getTrending);
  } else {
    loadBtn.classList.remove('is-hidden');

    // loadBtn.addEventListener('click', loadMoreMovies);
  }
} else {
  const watchedArray = getMoviesFromLib(WATCHED_KEY_LOCALSTORAGE);
  if (watchedArray.length > 20 && screen.width > 767) {
    let watchedLimit = watchedArray.slice(0, 5);
    createLibPagination(renderMovies, watchedArray);
    renderMovies(watchedLimit);
  } else if (watchedArray.length > 20 && screen.width <= 767) {
    loadBtn.classList.remove('is-hidden');
    // loadBtn.addEventListener('click', loadMoreMovies);
  } else {
    renderMovies(watchedArray);
  }
  libBtns.forEach(libBtn => libBtn.addEventListener('change', renderWatchedOrQueue));
}

// MODAL FUNC :

const addMovieToLib = e => {
  const movieId = e.target.getAttribute('id');
  if (e.target.classList.contains('addToWatchedBtn')) {
    console.log('clicked WATCHED BTN :)');
    saveToWatchedOrQueue(WATCHED_KEY_LOCALSTORAGE, QUEUE_KEY_LOCALSTORAGE, movieId);
  } else if (e.target.classList.contains('addToQueueBtn')) {
    console.log('clicked QUEUE BTN :)');
    saveToWatchedOrQueue(QUEUE_KEY_LOCALSTORAGE, WATCHED_KEY_LOCALSTORAGE, movieId);
  } else {
    return;
  }
};

const closeModalOnClick = e => {
  console.log(e.target);
  if (e.target.classList.contains('close') || e.target.classList.contains('modal')) {
    modal.classList.toggle('is-hidden');
  } else {
    return;
  }
};

const closeModalByKey = event => {
  if (event.code === 'Escape' && !modal.classList.contains('is-hidden')) {
    modal.classList.toggle('is-hidden');
  }
};

const openModal = e => {
  if (!e.target.parentNode.classList.contains('movieElement')) {
    return;
  } else {
    console.log(e.target);
    const movieId = e.target.parentNode.getAttribute('id');
    getMovieInfo(movieId);
    modal.classList.toggle('is-hidden');
    modal.addEventListener('click', addMovieToLib);
    modal.addEventListener('click', closeModalOnClick);
    document.addEventListener('keydown', closeModalByKey);
  }
};

moviesContainer.addEventListener('click', openModal);
