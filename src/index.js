import { getTrending, getSearched, getMovieInfo, getMovieTrailer } from './js/api/movies';
import { saveToWatchedOrQueue, getMoviesFromLib } from './js/utils/storage';
import { renderMoviesLib } from './js/view/movies';
import { createLibPagination, createHomePagination } from './js/components/pagination';

import './sass/index.scss';

const input = document.querySelector('#search-form');
const moviesContainer = document.querySelector('#movies');
const modal = document.querySelector('.modal');
const modalVideo = document.querySelector('.modal-video');
const libBtns = document.querySelectorAll('input[name="lib-btn"]');
const container = document.getElementById('tui-pagination-container');
const loadBtn = document.querySelector('.load-btn');

const WATCHED_KEY_LOCALSTORAGE = 'watched';
const QUEUE_KEY_LOCALSTORAGE = 'queue';

let page = 1;

const renderWatchedOrQueue = e => {
  let page = 1;
  loadBtn.classList.add('is-hidden');
  container.innerHTML = ' ';
  moviesContainer.innerHTML = '';
  const key = e.target.getAttribute('id');
  const moviesArray = getMoviesFromLib(key) ? getMoviesFromLib(key) : [];
  let moviesLimit = moviesArray.slice(0, 20);
  if (moviesArray.length > 20 && screen.width > 767) {
    createLibPagination(renderMoviesLib, moviesArray);
    renderMoviesLib(moviesLimit);
  } else if (moviesArray.length > 20 && screen.width <= 767) {
    renderMoviesLib(moviesLimit);
    loadBtn.classList.remove('is-hidden');
    const loadMoreLibPg = () => {
      let total = moviesArray.length;
      let itemsPerPage = 20;
      const paginatedArray = moviesArray.slice(
        page * itemsPerPage,
        total - (total - page * itemsPerPage - page * itemsPerPage) + 1,
      );
      console.log(paginatedArray);
      renderMoviesLib(paginatedArray);

      page++;
    };
    loadBtn.addEventListener('click', loadMoreLibPg);
  } else {
    renderMoviesLib(moviesArray);
  }
};

const searchMovies = e => {
  e.preventDefault();
  let query = e.currentTarget.searchQuery.value.trim();
  getSearched(query, page);
  query = '';
};

const loadMoreHomePg = () => {
  page++;
  getTrending(page);
};

// RENDER THE HOME PAGE OR LIB PAGE :

if (moviesContainer.classList.contains('movies-home')) {
  getTrending(page);
  input.addEventListener('submit', searchMovies);
  if (screen.width > 767) {
    createHomePagination(getTrending);
  } else {
    loadBtn.classList.remove('is-hidden');
    loadBtn.addEventListener('click', loadMoreHomePg);
  }
} else {
  const watchedArray = getMoviesFromLib(WATCHED_KEY_LOCALSTORAGE)
    ? getMoviesFromLib(WATCHED_KEY_LOCALSTORAGE)
    : [];
  let watchedLimit = watchedArray.slice(0, 20);
  if (watchedArray.length > 20 && screen.width > 767) {
    createLibPagination(renderMoviesLib, watchedArray);
    renderMoviesLib(watchedLimit);
  } else if (watchedArray.length > 20 && screen.width <= 767) {
    renderMoviesLib(watchedLimit);

    // Func onclick for LoadMore button for smartphones (screen.width < 767px)

    const loadMoreLibPg = () => {
      let total = watchedArray.length;
      let itemsPerPage = 20;
      const paginatedArray = watchedArray.slice(
        page * itemsPerPage,
        total - (total - page * itemsPerPage - page * itemsPerPage) + 1,
      );
      renderMoviesLib(paginatedArray);
      if (paginatedArray[paginatedArray.length - 1] === watchedArray[watchedArray.length - 1]) {
        loadBtn.classList.add('is-hidden');
      } else {
        page++;
      }
    };
    loadBtn.classList.remove('is-hidden');
    loadBtn.addEventListener('click', loadMoreLibPg);
  } else {
    renderMoviesLib(watchedArray);
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
  if (e.target.classList.contains('modal__close') || e.target.classList.contains('modal')) {
    modal.classList.toggle('is-hidden');
    modal.removeEventListener('click', addMovieToLib);
    modal.removeEventListener('click', closeModalOnClick);
  } else {
    return;
  }
};

const closeModalByKey = event => {
  if (event.code === 'Escape' && !modal.classList.contains('is-hidden')) {
    modal.classList.toggle('is-hidden');
    modal.removeEventListener('click', addMovieToLib);
    modal.removeEventListener('click', closeModalOnClick);
  } else {
    return;
  }
};

const closeTrailer = e => {
  if (e.target.nodeName === 'DIV' || e.target.nodeName === 'SPAN') {
    modalVideo.classList.toggle('is-hidden');
    modalVideo.removeEventListener('click', closeTrailer);
  }
};

const openTrailer = e => {
  if (e.target.nodeName === 'IMG' || e.target.nodeName === 'A') {
    const movieId = e.target.getAttribute('id');
    modalVideo.classList.toggle('is-hidden');
    getMovieTrailer(movieId);
    modalVideo.addEventListener('click', closeTrailer);
  }
};

const openModal = e => {
  if (!e.target.parentNode.classList.contains('movieElement')) {
    return;
  } else {
    const movieId = e.target.parentNode.getAttribute('id');
    getMovieInfo(movieId);
    modal.classList.toggle('is-hidden');
    modal.addEventListener('click', addMovieToLib);
    modal.addEventListener('click', closeModalOnClick);
    modal.addEventListener('click', openTrailer);
    document.addEventListener('keydown', closeModalByKey);
  }
};

moviesContainer.addEventListener('click', openModal);
