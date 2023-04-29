import { getGenresList } from '../api/movies';

const moviesContainer = document.querySelector('#movies');
const modal = document.querySelector('.modal');
const cautionEl = document.querySelector('.notFoundCaution');

const createMoviesTemplate = (id, poster_path, title, release_date, vote_average, genreNames) => {
  const twoGenres = genreNames ? genreNames.slice(0, 2).join(', ') : [];
  const date = release_date ? new Date(release_date).getUTCFullYear() : 'Unknown';
  const vote = vote_average.toFixed(1);
  return `
      <div class="movieElement" id="${id}" data-modal="open">
            <img src="https://image.tmdb.org/t/p/original/${poster_path}" alt="movie poster" loading="lazy">  
            <h4>${title}</h4><span>| ${twoGenres}</span>
            <p>${date}</p>
            <p>${vote}</p>     
        </div>`;
};

const renderMoviesHome = async movies => {
  const markup = await Promise.all(
    movies.map(async ({ id, poster_path, title, release_date, vote_average, genre_ids }) => {
      const date = release_date ? new Date(release_date).getUTCFullYear() : 'Unknown';
      const vote = vote_average.toFixed(1);
      const genreNames = await getGenresList(genre_ids);
      return createMoviesTemplate(id, poster_path, title, release_date, vote_average, genreNames);
    }),
  );
  moviesContainer.innerHTML = markup.join('');
};

const renderMoviesLib = movies => {
  if (!movies) {
    moviesContainer.innerHTML = '';
  } else {
    const markup = movies.map(({ id, poster_path, title, release_date, vote_average, genres }) => {
      const genreNames = genres.map(genre => genre.name);
      return createMoviesTemplate(id, poster_path, title, release_date, vote_average, genreNames);
    });
    moviesContainer.innerHTML = markup.join('');
  }
};

const renderMovieInfo = (data, genresList) => {
  const markup = `
  <div class="modal-content">
          <span class="close" data-modal="close">&times;</span>
          <div>
          <img src="https://image.tmdb.org/t/p/original/${
            data.poster_path
          }" alt="movie poster" loading="lazy">
          <div class="info">
            <p>${data.title}</p>
            <div>
            <p>Vote / Votes</p>
            <p>${data.vote_average} / ${data.vote_count}</p>
            </div>
            <div>
            <p>Popularity</p>
            <p>${data.popularity}</p>
            </div>
            <div>
            <p>Original Title</p>
            <p>${data.original_title}</p>
            </div>
            <div>
            <p>Genre</p>
            <p>${genresList.join(', ')}</p>
            </div>
            <p>About</p>
            <p>${data.overview}</p>
          </div>
          </div>
          <div>
            <button id="${data.id}" class='addToWatchedBtn'>add to Watched</button>
            <button id="${data.id}" class='addToQueueBtn'>add to queue</button>
          </div>
        </div>`;

  modal.innerHTML = markup;
};

const renderCaution = () => {
  cautionEl.innerHTML = 'Search result not successful. Enter the correct movie name and try again.';
  setTimeout(() => {
    cautionEl.innerHTML = '';
  }, 5000);
};

export { renderMoviesHome, renderMoviesLib, renderMovieInfo, renderCaution };
