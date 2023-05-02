import { getGenresList } from '../api/movies';

const moviesContainer = document.querySelector('#movies');
const modal = document.querySelector('.modal');
const modalVideo = document.querySelector('.modal-video');
const cautionEl = document.querySelector('.notFoundCaution');

const createMoviesTemplate = (id, poster_path, title, release_date, vote_average, genreNames) => {
  const twoGenres = genreNames ? genreNames.slice(0, 2).join(', ') : [];
  const date = release_date ? new Date(release_date).getUTCFullYear() : 'Unknown';
  const vote = vote_average.toFixed(1);
  return `
      <div class="movieElement" id="${id}" data-modal="open">
            <img src="https://image.tmdb.org/t/p/original/${poster_path}" alt="movie poster" loading="lazy">  
            <div>
            <h4>${title}</h4>
            <div class="movieElement__info">
            <p>${twoGenres}</p>
            <p>| ${date}</p>
            <p>${vote}</p> 
            </div>
            </div>    
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
  if (screen.width <= 767) {
    moviesContainer.innerHTML += markup.join('');
  } else {
    moviesContainer.innerHTML = markup.join('');
  }
};

const renderMoviesLib = movies => {
  if (!movies) {
    moviesContainer.innerHTML = '';
  } else {
    const markup = movies.map(({ id, poster_path, title, release_date, vote_average, genres }) => {
      const genreNames = genres.map(genre => genre.name);
      return createMoviesTemplate(id, poster_path, title, release_date, vote_average, genreNames);
    });
    // moviesContainer.innerHTML = markup.join('');
    if (screen.width <= 767) {
      moviesContainer.innerHTML += markup.join('');
    } else {
      moviesContainer.innerHTML = markup.join('');
    }
  }
};

const renderMovieInfo = (data, genresList) => {
  const markup = `
  <div class="modal__content">
          <span class="modal__close" data-modal="close">&times;</span>
          <div class="modal__info">
          <img src="https://image.tmdb.org/t/p/original/${
            data.poster_path
          }" alt="movie poster" id="${data.id}" loading="lazy">
          <a href="#" id="${data.id}"></a>
          <div>
            <h5 class="modal__info--title">${data.title}</h5>
            <div class="modal__details">
                <div class="modal__details--section">
                    <p>Vote / Votes</p>
                    <p>Popularity</p>
                    <p>Original Title</p>
                    <p>Genre</p>
                </div>
                <div class="modal__details--section results">
                    <p><span>${data.vote_average}</span> / <span>${data.vote_count}</span></p>
                    <p>${data.popularity}</p>
                    <p>${data.original_title}</p>
                    <p>${genresList.join(', ')}</p>
                </div>
            </div>
        <div class="modal__about">
            <p>About</p>
            <p>${data.overview}</p>
        </div>
        <div class="modal__buttons">
            <button id="${data.id}" class='addToWatchedBtn'>add to Watched</button>
            <button id="${data.id}" class='addToQueueBtn'>add to queue</button>
        </div>
        </div>
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

const renderVideoModul = ({ key }) => {
  console.log(key);
  const markup = `<span>&times; close</span>
  <iframe width="360" height="250"
    src="https://www.youtube.com/embed/${key}?controls=0" frameborder="0"
    allowfullscreen
    allow="autoplay; encrypted-media">
    </iframe>`;
  modalVideo.innerHTML = markup;
};
export { renderMoviesHome, renderMoviesLib, renderMovieInfo, renderCaution, renderVideoModul };
