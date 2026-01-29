import { useState } from 'react'
import css from './App.module.css'
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import axios from 'axios';
import type { Movie, HttpsMovieResponse } from '../types/movie';

const myKey = import.meta.env.VITE_TMDB_API_KEY;

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSearch = async (query: string) => {
    try {
      setIsLoading(true);
      setIsError(false);
      const response = await axios.get<HttpsMovieResponse>(`https://api.themoviedb.org/3/search/movie?query=${query}`, {
        headers: {
          Authorization: `Bearer ${myKey}`
        }
      });
      setMovies(response.data.results);
    } catch (error) {
      setIsError(true);
      console.error("Error fetching movies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSelectMovie = (movieId: number) => {
    const movie = movies.find(m => m.id === movieId);
    setSelectedMovie(movie || null);
  }

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {movies.length > 0 && <MovieGrid movies={movies} onSelect={onSelectMovie} />}
      {selectedMovie && <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />}
    </div>
  )
}

export default App
