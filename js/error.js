// Displays an error message to the user in the results container.
export function displayError(message) {
    const resultsContainer = document.getElementById('movie-results');
    resultsContainer.innerHTML = `<p class="error">${message}</p>`;
    console.error(message);
}

// Clears any currently displayed error messages.
export function clearError() {
    const resultsContainer = document.getElementById('movie-results');
    const errorElement = resultsContainer.querySelector('.error');
    if (errorElement) {
        resultsContainer.innerHTML = '';
    }
}