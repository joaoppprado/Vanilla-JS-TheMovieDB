//O "ponto de entrada" que liga os eventos da tela às funções
import { API } from "./api.js";
import { UI } from "./ui.js";

const menuButton = document.querySelector(".navigation__toggle");
const menu = document.querySelector(".navigation__menu");

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

async function homePopularMovies() {
  const container = document.querySelector(".section__movie-cards-popular");
  try {
    const data = await API.getPopularMovies();
    const homeMovies = data.results.slice(0, 10);

    UI.renderMovieList(homeMovies, container);
  } catch (error) {
    console.log(error);
  }
}

async function homeTopMovies() {
  const container = document.querySelector(".section__movie-cards-top-rated");
  try {
    const data = await API.getTopRatedMovies();
    const homeMovies = data.results.slice(0, 10);

    UI.renderMovieList(homeMovies, container);
  } catch (error) {
    console.log(error);
  }
}

homePopularMovies();
homeTopMovies();
