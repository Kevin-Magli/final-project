const movieResults = document.getElementById('movie-results');

// Shows a loading indicator.
export function showLoading() {
    movieResults.innerHTML = '<div class="loader"></div>';
}

// Clears all movie results.
export function clearResults() {
    movieResults.innerHTML = '';
}

// Returns the URL for a movie poster, or a placeholder if not available.
function getPosterUrl(posterPath) {
    // This is a "ternary operator" - a short way of writing an if/else statement.
    // It checks if `posterPath` exists. If true, it returns the real URL.
    // If false, it returns a placeholder image URL.
    return posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : 'https://via.placeholder.com/500x750.png?text=No+Image';
}

// Renders a list of movies to the page.
export function renderMovies(movies) {
    clearResults();

    if (movies.length === 0) {
        movieResults.innerHTML = '<p>No movies found.</p>';
        return;
    }

    movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');

        // Use a ternary operator to safely get the year or show 'N/A' if the date is missing.
        const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';

        // HTML structure for each movie card.
        movieElement.innerHTML = `
            <img src="${getPosterUrl(movie.poster_path)}" alt="${movie.title} poster">
            <div class="movie-info">
                <h3>${movie.title} (${releaseYear})</h3>
                <p>${movie.overview || 'No overview available.'}</p>
                <div class="ratings">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg" alt="IMDb logo" class="rating-logo">
                    <span>IMDb: ${movie.imdbRating}</span>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Rotten_Tomatoes.svg/1200px-Rotten_Tomatoes.svg.png" alt="Rotten Tomatoes logo" class="rating-logo">
                    <span>Rotten Tomatoes: ${movie.rottenTomatoesRating}</span>
                </div>
                ${
                  // Another ternary: if a trailer URL exists, create the iframe for it.
                  // Otherwise, insert an empty string so nothing is displayed.
                  movie.trailerUrl
                    ? `<div class="trailer"><iframe src="${movie.trailerUrl}" frameborder="0" allowfullscreen></iframe></div>`
                    : ""
                }
            </div>
        `;

        movieResults.appendChild(movieElement);
    });
}
