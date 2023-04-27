// API MOVIES FETCH

import { renderMovies, renderMovieInfo, renderCaution } from '../view/movies';

const container = document.getElementById('tui-pagination-container');

const TMBD_API_KEY = '394f7f7b9c091369c76717b88c1e71f3';
const TMBD_URL = 'https://api.themoviedb.org/3/';

// total_pages, total_results, poster_path, title, release_date, vote_average.

const getTrending = async (page = 1) => {
  const url = `${TMBD_URL}trending/movie/week?api_key=${TMBD_API_KEY}&page=${page}`;
  try {
    const resp = await fetch(url);
    const data = await resp.json();
    const filteredResults = data.results.filter(res => res.poster_path !== null);
    renderMovies(filteredResults);
  } catch (e) {
    console.error(e);
  }
};

const getSearched = async (query, page) => {
  const url = `${TMBD_URL}search/movie?api_key=${TMBD_API_KEY}&query=${query}&page=${page}`;
  try {
    const resp = await fetch(url);
    const data = await resp.json();
    if (data.total_results > 0) {
      const filteredResults = data.results.filter(res => res.poster_path !== null);
      renderMovies(filteredResults);
    } else {
      renderCaution();
    }
    return data;
  } catch (e) {
    console.error(e);
  }
};

// genres.name, title, original_title, popularity, vote_average, vote_count, overview.
const getMovieInfo = async id => {
  const url = `${TMBD_URL}movie/${id}?api_key=${TMBD_API_KEY}&language=en-US`;
  try {
    const resp = await fetch(url);
    const data = await resp.json();
    const genresList = data.genres.flatMap(genre => genre.name);
    renderMovieInfo(data, genresList);
  } catch (e) {
    console.error(e);
  }
};

const getMovieForLib = async id => {
  const url = `${TMBD_URL}movie/${id}?api_key=${TMBD_API_KEY}&language=en-US`;
  try {
    const resp = await fetch(url);
    const data = await resp.json();
    return data;
  } catch (e) {
    console.error(e);
  }
};

export { getTrending, getSearched, getMovieInfo, getMovieForLib };
