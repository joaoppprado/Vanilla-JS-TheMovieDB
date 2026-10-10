// Gerencia localStorage (Favoritos, Assistidos, Para Assistir)

const KEYS = {
  favorites: "cinecatalog_favorites",
  watchLater: "cinecatalog_watch_later",
  watched: "cinecatalog_watched",
};

// --- Helpers internos ---

function getList(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

function saveList(key, list) {
  localStorage.setItem(key, JSON.stringify(list));
}

function isInList(key, movieId) {
  return getList(key).some((movie) => movie.id === movieId);
}

function addToList(key, movie) {
  const list = getList(key);
  if (!isInList(key, movie.id)) {
    list.push(movie);
    saveList(key, list);
  }
}

function removeFromList(key, movieId) {
  const list = getList(key).filter((movie) => movie.id !== movieId);
  saveList(key, list);
}

function toggleInList(key, movie) {
  if (isInList(key, movie.id)) {
    removeFromList(key, movie.id);
    return false; // removido
  } else {
    addToList(key, movie);
    return true; // adicionado
  }
}

// --- Favoritos ---

function getFavorites() {
  return getList(KEYS.favorites);
}

function toggleFavorite(movie) {
  return toggleInList(KEYS.favorites, movie);
}

function isFavorite(movieId) {
  return isInList(KEYS.favorites, movieId);
}

// --- Para Assistir Mais Tarde ---

function getWatchLater() {
  return getList(KEYS.watchLater);
}

function toggleWatchLater(movie) {
  return toggleInList(KEYS.watchLater, movie);
}

function isWatchLater(movieId) {
  return isInList(KEYS.watchLater, movieId);
}

// --- Assistidos ---

function getWatched() {
  return getList(KEYS.watched);
}

function toggleWatched(movie) {
  return toggleInList(KEYS.watched, movie);
}

function isWatched(movieId) {
  return isInList(KEYS.watched, movieId);
}

export const STORAGE = {
  getFavorites,
  toggleFavorite,
  isFavorite,
  getWatchLater,
  toggleWatchLater,
  isWatchLater,
  getWatched,
  toggleWatched,
  isWatched,
};
