import { fetchMovies } from "./api.js";
import { renderMovies, showLoading, clearResults } from "./ui.js";
import { displayError, clearError } from "./error.js";
import { saveSearch, renderRecentSearches } from "./storage.js";

// Handles the movie search process.
async function performSearch(query) {
    if (query && query.trim() !== '') {
        clearError();
        clearResults();
        showLoading();

        try {
            const movies = await fetchMovies(query);
            renderMovies(movies);
            saveSearch(query);
            renderRecentSearches();
        } catch (error) {
            console.error("Error during search:", error);
            displayError(`An error occurred: ${error.message}`);
        }
    }
}

// Sets up event listeners for the search input, search button, and recent searches.
export function initSearch() {
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    const recentSearchesContainer = document.getElementById('recent-searches');

    searchButton.addEventListener('click', () => {
        performSearch(searchInput.value.trim());
    });

    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            performSearch(searchInput.value.trim());
        }
    });

    // This is called "event delegation". Instead of adding a listener to each
    // recent search item, we add one to their container. `event.target` tells
    // us which specific item was actually clicked.
    recentSearchesContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('recent-search-item')) {
            const query = event.target.textContent;
            searchInput.value = query;
            performSearch(query);
        }
    });

    // Display recent searches on page load.
    renderRecentSearches();
}