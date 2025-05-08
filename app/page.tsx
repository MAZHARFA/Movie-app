"use client";
import React, { useState, useEffect } from "react";
import Search from "../Components/search";
import Spinner from "../Components/Spinner";
import { toast } from "react-toastify";
import { useDebounce } from "react-use";
import { getTrendingMovies, updateSearchCount } from "../appwrite.js";
import MoiveCard from "../Components/MoiveCard";


type Movie = {
  id: string;
  $id?: string;
  title: string;
  vote_average: number; 
  poster_path: string;  
  release_date: string; 
  original_language: string; 
  poster_url?: string; 
  [key: string]: any;         
};

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);

  // Debounce search term
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  // Load trending movies
  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      if (movies) {
        const mappedMovies: Movie[] = movies.map((doc: any) => ({
          id: doc.$id, // Assign Appwrite $id to the required id field
          title: doc.title,
          vote_average: doc.vote_average || 0, // Default value if missing
          poster_path: doc.poster_path || "", // Default if missing
          release_date: doc.release_date || "", // Default if missing
          original_language: doc.original_language || "", // Default if missing
          poster_url: doc.poster_url || "", // Optional field
        }));
        setTrendingMovies(mappedMovies);
      } else {
        setTrendingMovies([]);
      }
    } catch (error) {
      toast.error(`Error Fetching Trending Movies: ${error}`);
      toast("Error Fetching Movies");
    }
  };

  const fetchMovies = async (query = "") => {
    setIsLoading(true);

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      const data = await response.json();

      if (data.Response === "False") {
        toast("Error occurred");
        setMovieList([]);
        return;
      }

      // Ensure required fields for MoiveCard
      const mappedMovies = data.results.map((movie: any) => ({
        id: movie.id,
        title: movie.title,
        vote_average: movie.vote_average,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        original_language: movie.original_language,
        poster_url: movie.poster_url, // Optional, if using Appwrite
      }));

      setMovieList(mappedMovies);

      if (query && data.results?.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      toast.error(`Error fetching Movies: ${error}`);
      toast("Error fetching Movies");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="./logo.jpeg" alt="background" />
          <img src="./maxresdefault.jpg" alt="Hero banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> you'll enjoy
            without hassle
          </h1>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.id || index}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2>All Movies</h2>
          {isLoading ? (
            <Spinner />
          ) : (
            <ul>
              {movieList.map((movie) => (
                <li key={movie.id}>
                  <MoiveCard movie={movie} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
