//O "ponto de entrada" que liga os eventos da tela às funções
import { API } from "./api.js";
import { UI } from "./ui.js";
import { STORAGE } from "./storage.js";
import { initAutocomplete } from "./autocomplete.js";

const menuButton = document.querySelector(".navigation__toggle");
const menu = document.querySelector(".navigation__menu");
const isHomePage = document.getElementById("home-page");
const isPopularPage = document.getElementById("popular-page");
const isTopRatedPage = document.getElementById("top-rated-page");
const isMyMoviesPage = document.getElementById("my-movies-page");
const filters = document.querySelectorAll(".filter");
const modal = document.querySelector(".modal");
const modalCloseBtn = document.querySelector(".modal__close");
const cardsContainers = document.querySelectorAll(".section__movie-cards");

const btnFavorite = document.querySelector("#btn-favorite");
const btnWatched = document.querySelector("#btn-watched");
const btnLater = document.querySelector("#btn-later");

let currentMovie = null;

// --- Menu mobile ---

if (menuButton && menu) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute(
      "aria-label",
      isOpen ? "Abrir menu" : "Fechar menu",
    );
    menu.classList.toggle("hidden", isOpen);
  });
}

// --- Modal ---

modalCloseBtn.addEventListener("click", () => {
  modal.close();
});

modal.addEventListener("close", () => {
  document.body.style.overflow = "auto";
});

// --- Botões do modal (Favorito / Watched / Watch Later) ---

btnFavorite.addEventListener("click", () => {
  if (!currentMovie) return;
  STORAGE.toggleFavorite(currentMovie);
  UI.updateModalButtons(currentMovie.id);
  if (isMyMoviesPage) renderCurrentTab();
});

btnWatched.addEventListener("click", () => {
  if (!currentMovie) return;
  STORAGE.toggleWatched(currentMovie);
  UI.updateModalButtons(currentMovie.id);
  if (isMyMoviesPage) renderCurrentTab();
});

btnLater.addEventListener("click", () => {
  if (!currentMovie) return;
  STORAGE.toggleWatchLater(currentMovie);
  UI.updateModalButtons(currentMovie.id);
  if (isMyMoviesPage) renderCurrentTab();
});

// --- Abrir detalhes ao clicar no card ---

cardsContainers.forEach((container) => {
  container.addEventListener("click", (event) => {
    const card = event.target.closest("article");
    if (card) {
      getMovieDetails(card.dataset.movieId);
    }
  });
});

// --- Filtros de gênero ---

filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    const activeButton = document.querySelector(".filter--active");
    if (activeButton) {
      activeButton.classList.remove("filter--active");
    }
    filter.classList.add("filter--active");
    if (filter.dataset.genre == "all") {
      location.reload();
      return;
    }
    filterGenre(filter.dataset.genre);
  });
});

// --- Funções de carregamento de filmes ---

async function homePopularMovies() {
  const container = document.querySelector("#home-popular");
  try {
    const data = await API.getPopularMovies();
    const homeMovies = data.results.slice(0, 10);
    UI.renderMovieList(homeMovies, container);
  } catch (error) {
    console.log(error);
  }
}

async function homeTopMovies() {
  const container = document.querySelector("#home-top-rated");
  try {
    const data = await API.getTopRatedMovies();
    const homeMovies = data.results.slice(0, 10);
    UI.renderMovieList(homeMovies, container);
  } catch (error) {
    console.log(error);
  }
}

async function PagePopularMovies() {
  const container = document.querySelector("#popular-movies");
  try {
    const page1 = await API.getPopularMovies();
    const page2 = await API.getPopularMovies(2);
    const page3 = await API.getPopularMovies(3);
    const movies = [...page1.results, ...page2.results, ...page3.results];
    UI.renderMovieList(movies, container);
  } catch (error) {
    console.log(error);
  }
}

async function PageTopRatedMovies() {
  const container = document.querySelector("#top-rated-movies");
  try {
    const page1 = await API.getTopRatedMovies();
    const page2 = await API.getTopRatedMovies(2);
    const page3 = await API.getTopRatedMovies(3);
    const movies = [...page1.results, ...page2.results, ...page3.results];
    UI.renderMovieList(movies, container);
  } catch (error) {
    console.log(error);
  }
}

async function filterGenre(genreId) {
  if (isPopularPage) {
    const container = document.querySelector("#popular-movies");
    try {
      const page1 = await API.getFilteredMovies(genreId, "popularity", 1);
      const page2 = await API.getFilteredMovies(genreId, "popularity", 2);
      const page3 = await API.getFilteredMovies(genreId, "popularity", 3);
      const movies = [...page1.results, ...page2.results, ...page3.results];
      UI.renderMovieList(movies, container);
    } catch (error) {
      console.log(error);
    }
  }
  if (isTopRatedPage) {
    const container = document.querySelector("#top-rated-movies");
    try {
      const page1 = await API.getFilteredMovies(
        genreId,
        "vote_average",
        1,
        "&without_genres=99,10755&vote_count.gte=200",
      );
      const page2 = await API.getFilteredMovies(
        genreId,
        "vote_average",
        2,
        "&without_genres=99,10755&vote_count.gte=200",
      );
      const page3 = await API.getFilteredMovies(
        genreId,
        "vote_average",
        3,
        "&without_genres=99,10755&vote_count.gte=200",
      );
      const movies = [...page1.results, ...page2.results, ...page3.results];
      UI.renderMovieList(movies, container);
    } catch (error) {
      console.log(error);
    }
  }
}

async function getMovieDetails(movieId) {
  try {
    const movie = await API.getMovieDetails(movieId);
    currentMovie = movie;
    UI.renderMovieDetails(movie);
    modal.showModal();
    document.body.style.overflow = "hidden";
  } catch (error) {
    console.log(error);
  }
}

// --- Página My Movies ---

let activeTab = "favorites";

const TAB_CONFIG = {
  favorites: {
    getMovies: STORAGE.getFavorites,
    emptyMsg: "No favorites yet",
  },
  watchLater: {
    getMovies: STORAGE.getWatchLater,
    emptyMsg: "No movies added for later",
  },
  watched: {
    getMovies: STORAGE.getWatched,
    emptyMsg: "No watched movies yet",
  },
};

function renderCurrentTab() {
  const container = document.querySelector(".section__movie-cards");
  const config = TAB_CONFIG[activeTab];
  const movies = config.getMovies();

  if (movies.length === 0) {
    UI.renderEmptyState(container, config.emptyMsg);
  } else {
    UI.renderMovieList(movies, container);
  }
}

function initMyMoviesPage() {
  const tabs = document.querySelectorAll(".collection-tabs__tab");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("collection-tabs__tab--active"));
      tab.classList.add("collection-tabs__tab--active");
      activeTab = tab.dataset.tab;
      renderCurrentTab();
    });
  });

  renderCurrentTab();
}

// --- Inicialização ---

document.addEventListener("DOMContentLoaded", () => {
  initAutocomplete(getMovieDetails);

  if (isHomePage) {
    homePopularMovies();
    homeTopMovies();
  }
  if (isPopularPage) {
    PagePopularMovies();
  }
  if (isTopRatedPage) {
    PageTopRatedMovies();
  }
  if (isMyMoviesPage) {
    initMyMoviesPage();
  }
});
