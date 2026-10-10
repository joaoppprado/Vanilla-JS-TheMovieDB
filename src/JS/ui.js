import { UTILS } from "./utils";
import { STORAGE } from "./storage";

// Cria e renderiza os elementos HTML (cards, modais, etc.)

const modalCover = document.querySelector(".modal__cover");
const modalTitle = document.querySelector(".modal__title");
const modalRating = document.querySelector(".banner__rating");
const modalYear = document.querySelector(".modal__year");
const modalDuration = document.querySelector(".modal__duration");
const modalGenreContainer = document.querySelector(".modal__genre-row");
const modalDescription = document.querySelector(".modal__description");

const btnFavorite = document.querySelector("#btn-favorite");
const btnWatched = document.querySelector("#btn-watched");
const btnLater = document.querySelector("#btn-later");

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

function renderMovieDetails(movie) {
  if (!movie || typeof movie !== "object") return;

  modalCover.style.backgroundImage = `url('${IMAGE_BASE_URL}${movie.backdrop_path}')`;
  modalTitle.innerText = movie.title;
  modalRating.innerText = UTILS.formatRating(movie.vote_average);
  modalYear.innerText = UTILS.getReleaseYear(movie.release_date);
  modalDuration.innerText = movie.runtime + "min";
  modalDescription.innerText = movie.overview;
  modalGenreContainer.innerHTML = "";

  if (movie.genres) {
    movie.genres.forEach((genre) => {
      let modalGenre = createElement("span", "modal__genre");
      modalGenre.innerText = genre.name;
      modalGenreContainer.appendChild(modalGenre);
    });
  }

  updateModalButtons(movie.id);
}

function updateModalButtons(movieId) {
  updateButton(btnFavorite, STORAGE.isFavorite(movieId), "Heart", "Favorite");
  updateButton(btnWatched, STORAGE.isWatched(movieId), "Bookmark", "Watched");
  updateButton(btnLater, STORAGE.isWatchLater(movieId), "Clock", "Watch Later");
}

function updateButton(btn, isActive, iconName, label) {
  if (!btn) return;
  const icon = btn.querySelector(".btn__icon");
  const suffix = isActive ? "-filled" : "";
  if (icon) icon.src = `./src/assets/${iconName}${suffix}.svg`;
  btn.classList.toggle("btn--active", isActive);
}

function renderEmptyState(container, message) {
  container.innerHTML = `
    <div class="empty-state">
      <p class="empty-state__title">${message}</p>
      <p class="empty-state__description">Use the modal buttons to add movies here.</p>
    </div>
  `;
}

export const UI = {
  createMovieCard,
  renderMovieList,
  renderMovieDetails,
  updateModalButtons,
  renderEmptyState,
};
