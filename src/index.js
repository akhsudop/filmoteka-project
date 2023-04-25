import { getTrending, getSearched, getMovieInfo } from './js/api/movies';
import saveToWatchedOrQueue from './js/local-storage/movies_save';
import getMoviesFromLib from './js/local-storage/movies_load';
import { renderMovies } from './js/view/movies';
import Pagination from 'tui-pagination';

import './sass/index.scss';

const input = document.querySelector('#search-form');
const moviesContainerHome = document.querySelector('.movies-home');
const moviesContainer = document.querySelector('#movies');
const modal = document.querySelector('.modal');
const libBtns = document.querySelectorAll('input[name="lib-btn"]');
const container = document.getElementById('tui-pagination-container');

const WATCHED_KEY_LOCALSTORAGE = 'watched';
const QUEUE_KEY_LOCALSTORAGE = 'queue';

const renderWatchedOrQueue = e => {
  container.innerHTML = ' ';
  const key = e.target.getAttribute('id');
  const moviesArray = getMoviesFromLib(key);
  if (!moviesArray) {
    renderMovies(moviesArray);
  } else if (moviesArray.length > 5) {
    let moviesLimit = moviesArray.slice(0, 5);

    const pagination = new Pagination(container, {
      totalItems: moviesArray.length,
      itemsPerPage: 5,
      visiblePages: 7,
      page: 1,
      centerAlign: true,
      firstItemClassName: 'tui-first-child',
      lastItemClassName: 'tui-last-child',
      usageStatistics: false,
    });

    pagination.on('afterMove', e => {
      let currentPage = e.page;
      let paginatedArray = moviesArray.slice(
        5 * (currentPage - 1),
        moviesArray.length - (moviesArray.length - 5) + 1,
      );
      renderMovies(paginatedArray);
    });
    renderMovies(moviesLimit);
  } else {
    renderMovies(moviesArray);
  }
};

const searchMovies = e => {
  e.preventDefault();
  const query = e.currentTarget.searchQuery.value.trim();
  getSearched(query, (page = 3));
};

// RENDER THE HOME PAGE OR LIB PAGE :

if (moviesContainerHome) {
  const pagination = new Pagination(container, {
    totalItems: 20000,
    itemsPerPage: 20,
    visiblePages: 7,
    page: 1,
    centerAlign: true,
    firstItemClassName: 'tui-first-child',
    lastItemClassName: 'tui-last-child',
    usageStatistics: false,
  });

  pagination.on('afterMove', e => {
    let currentPage = e.page;
    getTrending(currentPage);
  });
  getTrending((page = 1));
  input.addEventListener('submit', searchMovies);
} else {
  const watchedArray = getMoviesFromLib(WATCHED_KEY_LOCALSTORAGE);
  if (!watchedArray) {
    return;
  } else if (watchedArray.length > 5) {
    let watchedLimit = watchedArray.slice(0, 5);
    const pagination = new Pagination(container, {
      totalItems: watchedArray.length,
      itemsPerPage: 5,
      visiblePages: 7,
      page: 1,
      centerAlign: true,
      firstItemClassName: 'tui-first-child',
      lastItemClassName: 'tui-last-child',
      usageStatistics: false,
    });

    pagination.on('afterMove', e => {
      let currentPage = e.page;
      let paginatedArray = watchedArray.slice(
        5 * (currentPage - 1),
        watchedArray.length - (watchedArray.length - 5) + 1,
      );
      console.log(paginatedArray);
      renderMovies(paginatedArray);
    });
    renderMovies(watchedLimit);
  } else {
    renderMovies(watchedArray);
  }
  libBtns.forEach(libBtn => libBtn.addEventListener('change', renderWatchedOrQueue));
}

// MODAL FUNC :

const addMovieToWatched = e => {
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

const openModal = e => {
  if (!e.target.parentNode.classList.contains('movieElement')) {
    return;
  } else {
    const movieId = e.target.parentNode.getAttribute('id');
    getMovieInfo(movieId);
    modal.style.display = 'block';
    modal.style.position = 'fixed';
    modal.addEventListener('click', addMovieToWatched);
  }
};

moviesContainer.addEventListener('click', openModal);
