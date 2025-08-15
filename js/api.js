import { TMDB_API_KEY, OMDB_API_KEY, YOUTUBE_API_KEY } from './config.js';
import { displayError } from './error.js';

// A helper function to fetch data from an API and handle common errors.
async function fetchAndHandle(url, errorMessage) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`${errorMessage}: ${response.statusText} (Status: ${response.status})`);
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        displayError(error.message);
        throw error;
    }
}

// Fetches movie data from The Movie Database (TMDb) API.
async function fetchTMDBMovies(query) {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`;
    const data = await fetchAndHandle(url, 'TMDB API request failed');
    if (!data.results || data.results.length === 0) {
        throw new Error('No movies found for your query.');
    }
    return data;
}

// Fetches additional movie data (like ratings) from the OMDb API.
async function fetchOMDBData(title) {
    const url = `http://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${OMDB_API_KEY}`;
    return await fetchAndHandle(url, 'OMDB API request failed');
}

// Fetches YouTube trailer information for a movie.
async function fetchYouTubeTrailer(title) {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(title + ' trailer')}&type=video&key=${YOUTUBE_API_KEY}`;
    return await fetchAndHandle(url, 'YouTube API request failed');
}

// Main function to fetch comprehensive movie details by combining data from multiple APIs.
export async function fetchMovies(query) {
    try {
        const tmdbData = await fetchTMDBMovies(query);

        if (!tmdbData.results) {
            return [];
        }

        // For each movie, fetch additional data from OMDb and YouTube concurrently.
        const moviePromises = tmdbData.results.map(async (movie) => {
            try {
                // Promise.all runs multiple promises at the same time, which is faster.
                const [omdbData, youtubeData] = await Promise.all([
                    fetchOMDBData(movie.title),
                    fetchYouTubeTrailer(movie.title)
                ]);

                const imdbRating = omdbData.imdbRating || 'N/A';
                // This line safely gets the Rotten Tomatoes rating.
                // The `?.` (optional chaining) prevents errors if `Ratings` or `find` returns nothing.
                // `|| 'N/A'` provides a default value if the rating isn't found.
                const rottenTomatoesRating = omdbData.Ratings?.find(r => r.Source === 'Rotten Tomatoes')?.Value || 'N/A';
                const trailerUrl = youtubeData.items.length > 0 ? `https://www.youtube.com/embed/${youtubeData.items[0].id.videoId}` : '';

                // Return a new movie object with all combined data.
                // The `...movie` part copies all original properties from the movie.
                return {
                    ...movie,
                    imdbRating,
                    rottenTomatoesRating,
                    trailerUrl
                };
            } catch (error) {
                console.error(`Failed to fetch additional data for ${movie.title}:`, error);
                // If fetching extra data fails, return the movie with default values.
                return {
                    ...movie,
                    imdbRating: 'N/A',
                    rottenTomatoesRating: 'N/A',
                    trailerUrl: ''
                };
            }
        });

        return Promise.all(moviePromises);
    } catch (error) {
        displayError(error.message);
        return [];
    }
}
