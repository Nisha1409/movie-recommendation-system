import axios from "axios";

const WATCHMODE_KEY = process.env.REACT_APP_WATCHMODE_KEY;
const OMDB_KEY = process.env.REACT_APP_OMDB_API_KEY;
const GOOGLE_CSE_KEY = process.env.REACT_APP_GOOGLE_CSE_API_KEY;
const GOOGLE_CX = process.env.REACT_APP_GOOGLE_CSE_CX;

const WATCHMODE_URL = "https://api.watchmode.com/v1";
const OMDB_URL = "https://www.omdbapi.com/";
const GOOGLE_CSE_URL = "https://www.googleapis.com/customsearch/v1";

const placeholderPoster = "https://via.placeholder.com/300x450?text=No+Poster";
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// 🔍 Fetch poster using OMDB or fallback to Google Custom Search
export const fetchMoviePoster = async (imdb_id, title) => {
  if (!title) return placeholderPoster;

  try {
    // Try OMDB first
    if (imdb_id) {
      const omdbRes = await axios.get(OMDB_URL, {
        params: { i: imdb_id, apikey: OMDB_KEY },
      });

      if (omdbRes.data.Poster && omdbRes.data.Poster !== "N/A") {
        return omdbRes.data.Poster;
      }
    }

    // Fallback to Google Custom Search
    const googleRes = await axios.get(GOOGLE_CSE_URL, {
      params: {
        key: GOOGLE_CSE_KEY,
        cx: GOOGLE_CX,
        q: `${title} movie poster`,
        searchType: "image",
        num: 1,
      },
    });

    return googleRes.data.items?.[0]?.link || placeholderPoster;
  } catch (err) {
    console.error(`Poster fetch failed for ${title}:`, err.message);
    return placeholderPoster;
  }
};

// 🧠 Generic fetch function
const fetchMovies = async ({ genre, languages, source_ids, sort_by = "popularity_desc", limit = 20 }) => {
  try {
    const params = {
      apiKey: WATCHMODE_KEY,
      types: "movie",
      sort_by,
      limit,
    };

    if (genre) params.genres = genre;
    if (languages) params.languages = languages;
    if (source_ids) params.source_ids = source_ids;

    const listRes = await axios.get(`${WATCHMODE_URL}/list-titles/`, { params });
    const movies = listRes.data.titles || [];
    const detailedMovies = [];

    for (const movie of movies) {
      try {
        const detailsRes = await axios.get(`${WATCHMODE_URL}/title/${movie.id}/details/`, {
          params: { apiKey: WATCHMODE_KEY },
        });

        const omdbRes = movie.imdb_id
          ? await axios.get(OMDB_URL, { params: { i: movie.imdb_id, apikey: OMDB_KEY } })
          : { data: {} };

        const poster = await fetchMoviePoster(movie.imdb_id, movie.title);

        detailedMovies.push({
          ...detailsRes.data,
          imdbRating: omdbRes.data.imdbRating || null,
          genre: omdbRes.data.Genre || detailsRes.data.genre_names?.join(", "),
          language: omdbRes.data.Language || detailsRes.data.original_language,
          poster,
          release_date: detailsRes.data.release_date || "1900-01-01",
        });
      } catch (err) {
        console.warn(`Error fetching details for ${movie.title}:`, err.message);
      }

      await delay(400); // ⏳ prevent rate limit
    }

    return detailedMovies;
  } catch (err) {
    console.error("Error fetching movies:", err.message);
    return [];
  }
};

// 🔗 Source IDs
const HOLLYWOOD_SOURCE_IDS = "203,26"; // Netflix and Prime

// 🔹 Genre-Based Movies (No Language / Source ID Filter)
export const fetchComedyMovies = (limit = 20) => fetchMovies({ genre: 4, limit });   // Comedy
export const fetchHorrorMovies = (limit = 20) => fetchMovies({ genre: 11, limit });  // Horror
export const fetchActionMovies = (limit = 20) => fetchMovies({ genre: 1, limit });   // Action

// 🔹 Bollywood Movies (Language: Hindi)
export const fetchBollywoodMoviesByDate = (limit = 20) =>
  fetchMovies({ languages: "hi", sort_by: "release_date_desc", limit });

export const fetchBollywoodMoviesByPopularity = (limit = 20) =>
  fetchMovies({ languages: "hi", sort_by: "popularity_desc", limit });

// 🔹 Hollywood Movies (Language: English + Source IDs)
export const fetchHollywoodMoviesByDate = (limit = 20) =>
  fetchMovies({
    languages: "en",
    source_ids: HOLLYWOOD_SOURCE_IDS,
    sort_by: "release_date_desc",
    limit,
  });

export const fetchHollywoodMoviesByPopularity = (limit = 20) =>
  fetchMovies({
    languages: "en",
    source_ids: HOLLYWOOD_SOURCE_IDS,
    sort_by: "popularity_desc",
    limit,
  });

// 🔹 Mixed Recent (Half Bollywood + Half Hollywood)
export const fetchMixedMoviesByDate = async (limit = 20) => {
  try {
    const [bolly, holly] = await Promise.all([
      fetchBollywoodMoviesByDate(Math.floor(limit / 2)),
      fetchHollywoodMoviesByDate(Math.floor(limit / 2)),
    ]);

    return [...bolly, ...holly].sort(
      (a, b) => new Date(b.release_date) - new Date(a.release_date)
    );
  } catch (err) {
    console.error("Error fetching mixed movies:", err.message);
    return [];
  }
};

// 🔍 Exported search method (optional)
export const fetchMovieBySearch = async (query) => {
  // console.log("fetchMovieBySearch called with query:", query); // Debugging log
  if (!query) return [];

  try {
    const normalizedQuery = query.trim().toLowerCase();
    const response = await axios.get(`${WATCHMODE_URL}/autocomplete-search/`, {
      params: {
        apiKey: WATCHMODE_KEY,
        search_value: normalizedQuery,
        search_type: 1,
      },
    });

    const titles = response.data.results || [];
    console.log(`Autocomplete Search Response for "${query}":`, titles);

    if (titles.length === 0) {
      console.warn("No titles found for query:", query);
      return [];
    }

    const detailedResults = [];

    for (const item of titles.slice(0, 5)) {
      try {
        // console.log("Processing title:", item); // Debugging log

        if (!item.id) {
          console.warn(`Skipping invalid title with no ID:`, item);
          continue;
        }

        const detailsRes = await axios.get(`${WATCHMODE_URL}/title/${item.id}/details/`, {
          params: { apiKey: WATCHMODE_KEY },
        });
        console.log("Fetched details for title ID:", item.id, detailsRes.data);

        const poster = await fetchMoviePoster(item.imdb_id, item.name || item.title);
        console.log("Fetched poster for title:", item.title, poster);

        detailedResults.push({
          ...detailsRes.data,
          poster,
          title: detailsRes.data.title,
          release_date: detailsRes.data.release_date || "1900-01-01",
        });
      } catch (err) {
        console.error(`Error fetching details for title ID ${item.id}:`, err.message);
      }

      await delay(300);
    }

    console.log("Final Detailed Results:", detailedResults);
    return detailedResults;
  } catch (err) {
    console.error("Error in fetchMovieBySearch:", err.message);
    return [];
  }
};