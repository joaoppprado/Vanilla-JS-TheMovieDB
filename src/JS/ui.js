import { UTILS } from "./utils";

// Cria e renderiza os elementos HTML (cards, modais, etc.)

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

function createElement(tag, className, hasData) {
  const element = document.createElement(tag);
  element.className = className;
  if (hasData) element.dataset.movieId = "";
  return element;
}

function createMovieCard(movie) {
  const card = createElement("article", "movie-card", true);
  const cardCover = createElement("div", "movie-card__cover");
  const movieName = createElement("p", "movie-card__movie-name");
  const movieInfo = createElement("p", "movie-card__movie-info");
  const movieYear = createElement("span", "movie-card__movie-year");
  const movieRating = createElement("span", "movie-card__movie-rate");

  card.dataset.movieId = movie.id;
  cardCover.style.backgroundImage = `url('${IMAGE_BASE_URL}${movie.poster_path}')`;
  movieName.innerText = movie.title;
  movieYear.innerText = UTILS.getReleaseYear(movie.release_date);
  movieRating.innerText = UTILS.formatRating(movie.vote_average);

  movieInfo.append(movieYear, " - ", movieRating);
  card.append(cardCover, movieName, movieInfo);
  return card;
}

function renderMovieList(movies, container) {
  container.innerHTML = "";
  movies.forEach((movie) => {
    const card = createMovieCard(movie);
    container.appendChild(card);
  });
}

export const UI = {
  createMovieCard,
  renderMovieList,
};
