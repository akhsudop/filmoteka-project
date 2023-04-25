const moviesContainer = document.querySelector('#movies');
const modal = document.querySelector('.modal');
const cautionEl = document.querySelector('.notFoundCaution');

const renderMovies = movies => {
  if (!movies) {
    moviesContainer.innerHTML = '';
  } else {
    const markup = movies
      .map(({ id, poster_path, title, release_date, vote_average }) => {
        const date = new Date(release_date).getUTCFullYear();
        const vote = vote_average.toFixed(1);
        return `
      <div class="movieElement" id="${id}" data-modal="open">
            <img src="https://image.tmdb.org/t/p/original/${poster_path}" alt="movie poster" loading="lazy" width="395">
            <p>${title}</p>
            <p>${date}</p>
            <p>${vote}</p>
        </div>`;
      })
      .join('');
    moviesContainer.innerHTML = markup;
  }
};

const renderMovieInfo = (data, genresList) => {
  const markup = `<div class="modal-content">
          <span class="close">&times;</span>
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

export { renderMovies, renderMovieInfo, renderCaution };
