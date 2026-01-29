import axios from 'axios';
import type { HttpsMovieResponse } from '../types/movie';

const myKey = import.meta.env.VITE_TMDB_API_KEY;

async function fetchMovies(query: string) {
  const response = await axios.get<HttpsMovieResponse>(
    `https://api.themoviedb.org/3/search/movie?query=${query}`,
    {
      headers: {
        Authorization: `Bearer ${myKey}`,
      },
    }
  );
  return response.data.results;
}

export default fetchMovies;
