//O "ponto de entrada" que liga os eventos da tela às funções
import { API } from "./api.js";
import { UI } from "./ui.js";

const menuButton = document.querySelector(".navigation__toggle");
const menu = document.querySelector(".navigation__menu");
const isHomePage = document.getElementById("home-page");
const isPopularPage = document.getElementById("popular-page");
const isTopRatedPage = document.getElementById("top-rated-page");
const filterAll = document.querySelector('[data-genre="all"]');
const filters = document.querySelectorAll(
  '[data-genre]:not([data-genre="all"])',
);

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

filterAll.addEventListener("click", () => {
  filterAll.classList.add("filter--active");

  filters.forEach((filter) => {
    filter.classList.remove("filter--active");
  });
});

filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    filterAll.classList.remove("filter--active");
    filter.classList.toggle("filter--active");
    const anyActive = Array.from(filters).some((filter) =>
      filter.classList.contains("filter--active"),
    );
    console.log(Array.from(filters));
    if (!anyActive) {
      filterAll.classList.add("filter--active");
    }
  });
});

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

document.addEventListener("DOMContentLoaded", () => {
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
});
