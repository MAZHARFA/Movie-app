"use client"
import React, { useState, useEffect } from "react";
import Search from "../Components/search";
import Spinner from "../Components/Spinner";
import { toast } from "react-toastify";
import { useDebounce } from "react-use";
import { getTrendingMovies, updateSearchCount } from "../appwrite.js";
import MoiveCard from "../Components/MoiveCard";

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

  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [trendingMovies, setTrendingMovies] = useState<Document[]>([]);

  // debounce the search term to prevent many API request
  // by waiting for the user to stop typing  for 500ms
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
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
      // console.log(`response :::: `);
      console.log(response);

      const data = await response.json();

      if (data.Response === "False") {
        toast("Error occurred");
        setMovieList([]);
        return;
      }
      setMovieList(data.results || []);
      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
      setIsLoading(false);
    } catch (error) {
      toast.error(`Error fetching Movies: ${error}`);
      toast("Error fetching Movies");
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
          <img src="./maxresdefault.jpg" alt="Hero- banner" />

          <h1>
            Find <span className="text-gradient">Movies</span> you'll be enjoy
            without hassle
          </h1>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>

            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
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