//Configurações e chamadas à API do TMDB

const TMDB_TOKEN = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

async function getPopularMovies(page = 1) {
  const url = `${BASE_URL}/movie/popular?language=en-US&page=${page}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error: Get popular movies didn't work. API code error = ${response.status}`,
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API error (getPopularMovies): ", error);
    throw error;
  }
}

async function getTopRatedMovies(page = 1) {
  const url = `${BASE_URL}/movie/top_rated?language=en-US&page=${page}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error: Get top rated movies didn't work. API code error = ${response.status}`,
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API error (getTopRatedMovies): ", error);
    throw error;
  }
}

async function getFilteredMovies(genreId, sortBy) {
  const url = `${BASE_URL}/discover/movie?with_genres=${genreId}&sort_by=${sortBy}.desc&language=en-US&page=1`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error: Get movies by genre didn't work. API code error = ${response.status}`,
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API error (getFilteredMovies): ", error);
    throw error;
  }
}

async function getMovieDetails(id) {}

async function searchMovieByName(query) {}

export const API = {
  getPopularMovies,
  getTopRatedMovies,
  getFilteredMovies,
};
