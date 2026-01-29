import { useState } from 'react';
import css from './App.module.css';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import axios from 'axios';
import type { Movie, HttpsMovieResponse } from '../types/movie';
import toast from 'react-hot-toast';

const myKey = import.meta.env.VITE_TMDB_API_KEY;

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setIsError(false);
    setMovies([]);
    setSelectedMovie(null);

    try {
      const response = await axios.get<HttpsMovieResponse>(
        `https://api.themoviedb.org/3/search/movie?query=${query}`,
        {
          headers: {
            Authorization: `Bearer ${myKey}`,
          },
        }
      );
      if (response.data.results.length === 0) {
        toast.error('No movies found for your request.');
        setIsLoading(false);
        return;
      }
      setMovies(response.data.results);
    } catch (error) {
      setIsError(true);
      console.error('Error fetching movies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSelectMovie = (movieId: number) => {
    const movie = movies.find(m => m.id === movieId);
    setSelectedMovie(movie || null);
  };

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={onSelectMovie} />
      )}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}

export default App;
