import { displayError } from './error.js';

const RECENT_SEARCHES_KEY = 'recentSearches';

// Saves a search query to localStorage.
export function saveSearch(query) {
    try {
        let searches = getRecentSearches();
        if (!searches.includes(query)) {
            // `unshift` adds the new item to the beginning of the array.
            searches.unshift(query);
            // `slice` keeps the array from growing too large, here limiting it to 5 items.
            searches = searches.slice(0, 5);
            // localStorage can only store strings, so we convert the array to a JSON string.
            localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
        }
    } catch (error) {
        console.error('Failed to save recent search:', error);
        displayError('Could not save recent searches. Please check your browser settings.');
    }
}

// Retrieves recent search queries from localStorage.
export function getRecentSearches() {
    try {
        const searches = localStorage.getItem(RECENT_SEARCHES_KEY);
        // If searches exist, `JSON.parse` converts the string back into an array.
        return searches ? JSON.parse(searches) : [];
    } catch (error) {
        console.error('Failed to get recent searches:', error);
        displayError('Could not retrieve recent searches. Please check your browser settings.');
        return [];
    }
}

// Displays recent searches on the page.
export function renderRecentSearches() {
    const recentSearchesContainer = document.getElementById('recent-searches');
    const searches = getRecentSearches();

    recentSearchesContainer.innerHTML = '';

    if (searches.length > 0) {
        const title = document.createElement('h4');
        title.textContent = 'Recent Searches';
        recentSearchesContainer.appendChild(title);

        searches.forEach(search => {
            const searchItem = document.createElement('div');
            searchItem.classList.add('recent-search-item');
            searchItem.textContent = search;
            recentSearchesContainer.appendChild(searchItem);
        });
    }
}