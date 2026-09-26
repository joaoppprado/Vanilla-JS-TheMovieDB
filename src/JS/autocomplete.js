//Lógica específica da barra de pesquisa e sugestões

import { API } from "./api.js";
import { UTILS } from "./utils.js";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w92";

export function initAutocomplete(onSelectMovie) {
  const searchForm = document.querySelector(".search");
  const searchInput = document.querySelector("#movie-search");

  const dropdown = document.createElement("div");
  dropdown.className = "search__dropdown hidden";
  searchForm.appendChild(dropdown);

  let currentResults = [];
  let selectedIndex = -1;
  let debounceTimer = null;

  function closeDropdown() {
    dropdown.classList.add("hidden");
    dropdown.innerHTML = "";
    currentResults = [];
    selectedIndex = -1;
  }

  function updateItemHighlight() {
    const items = dropdown.querySelectorAll(".search__item");
    items.forEach((item, idx) => {
      if (idx === selectedIndex) {
        item.classList.add("is-selected");
        item.scrollIntoView({ block: "nearest" });
      } else {
        item.classList.remove("is-selected");
      }
    });
  }

  async function handleSearch(query) {
    if (!query || query.trim().length < 2) {
      closeDropdown();
      return;
    }

    try {
      const data = await API.searchMovieByName(query);
      currentResults = (data.results || []).slice(0, 6);
      selectedIndex = -1;

      dropdown.innerHTML = "";

      if (currentResults.length === 0) {
        const empty = document.createElement("div");
        empty.className = "search__empty";
        empty.textContent = "No movies found";
        dropdown.appendChild(empty);
      } else {
        currentResults.forEach((movie, index) => {
          const item = document.createElement("div");
          item.className = "search__item";
          item.dataset.index = index;

          const posterUrl = movie.poster_path
            ? `${IMAGE_BASE_URL}${movie.poster_path}`
            : "./src/assets/movie-cover-empty.png";
          const year = UTILS.getReleaseYear(movie.release_date);
          const rating = UTILS.formatRating(movie.vote_average);

          item.innerHTML = `
            <img src="${posterUrl}" alt="" class="search__item-poster" />
            <div class="search__item-info">
              <span class="search__item-title">${movie.title}</span>
              <span class="search__item-meta">${year} · ★ ${rating}</span>
            </div>
          `;
          item.addEventListener("click", () => {
            closeDropdown();
            searchInput.value = "";
            if (typeof onSelectMovie === "function") {
              onSelectMovie(movie.id);
            }
          });
          dropdown.appendChild(item);
        });
        dropdown.classList.remove("hidden");
      }
    } catch (error) {
      console.error("Autocomplete search error:", error);
      closeDropdown();
    }
  }

  searchInput.addEventListener("input", (event) => {
    clearTimeout(debounceTimer);
    const query = event.target.value;
    debounceTimer = setTimeout(() => {
      handleSearch(query);
    }, 300);
  });

  searchInput.addEventListener("keydown", (event) => {
    if (dropdown.classList.contains("hidden")) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (currentResults.length > 0) {
        selectedIndex = (selectedIndex + 1) % currentResults.length;
        updateItemHighlight();
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (currentResults.length > 0) {
        selectedIndex =
          (selectedIndex - 1 + currentResults.length) % currentResults.length;
        updateItemHighlight();
      }
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (currentResults.length > 0) {
        const targetMovie =
          selectedIndex >= 0
            ? currentResults[selectedIndex]
            : currentResults[0];
        closeDropdown();
        searchInput.value = "";
        if (typeof onSelectMovie === "function") {
          onSelectMovie(targetMovie.id);
        }
      }
    } else if (event.key === "Escape") {
      closeDropdown();
    }
  });

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
  });
  document.addEventListener("click", (event) => {
    if (!searchForm.contains(event.target)) {
      closeDropdown();
    }
  });
}
