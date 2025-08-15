import { initSearch } from './search.js';
import { clearResults } from './ui.js';

// This function changes the clear button's text based on screen size.
function handleClearButtonText() {
    const clearButton = document.getElementById('clear-button');
    if (window.innerWidth <= 600) {
        clearButton.innerHTML = '&times;';
    } else {
        clearButton.textContent = 'Clear';
    }
}

// Main entry point of the application.
// This runs after the HTML document has finished loading.
document.addEventListener('DOMContentLoaded', () => {
    const clearButton = document.getElementById('clear-button');
    const searchInput = document.getElementById('search-input');

    // Sets up the search functionality, including event listeners.
    initSearch();

    // Add a click event to the clear button to reset the search.
    clearButton.addEventListener('click', () => {
        searchInput.value = '';
        clearResults();
    });

    // Set the initial text of the clear button.
    handleClearButtonText();

    // Update the clear button text when the window is resized.
    window.addEventListener('resize', handleClearButtonText);
});