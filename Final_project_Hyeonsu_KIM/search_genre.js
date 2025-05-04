// search_genre.js

const API_KEY = '95a143e64f44da13f34e5ff8a9cf4100'; // Enter your TMDB API key here
const BASE_URL = 'https://api.themoviedb.org/3';

function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    } else {
        return text;
    }
}
// Function to fetch list of genres
async function fetchGenres() {
    const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`);
    const data = await response.json();
    return data.genres;
}

// Function to fetch movies by a specific genre
async function fetchMoviesByGenre(genreId) {
    const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&language=en-US`);
    const data = await response.json();
    return data.results;
}


// Function to create genre buttons
function displayGenreButtons(genres) {
    const container = document.getElementById('genreButtons');
    container.innerHTML = '';
    genres.forEach(genre => {
        const button = document.createElement('button');
        button.className = 'btn btn-outline-primary m-1';
        button.textContent = genre.name;
        button.onclick = () => handleGenreClick(genre.id);
        container.appendChild(button);
    });
}

// Genre button click event handler
async function handleGenreClick(genreId) {
    const movies = await fetchMoviesByGenre(genreId);
    displayMovies(movies);
}

// Function to display list of movies
function displayMovies(movies) {
    const container = document.getElementById('movies');
    container.innerHTML = '';

    if (movies.length === 0) {
        container.innerHTML = '<p>No movies found for this genre.</p>';
        return;
    }

    movies.forEach(movie => {
        fetchMovieDetails(movie.id).then(details => {
        const movieElement = document.createElement('div');
        movieElement.className = 'col-md-4 mb-3';
        movieElement.innerHTML = `
            <div class="card">
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img-top" alt="${movie.title}">
                <div class="card-body">
                    <h5 class="card-title">${movie.title}</h5>
                    <p class="card-text"><strong>Release Date:</strong> ${details.release_date}</p>
                    <p class="card-text"><strong>Rating:</strong> ${details.vote_average}</p>
                    <p class="card-text"><strong>Director:</strong> ${details.director}</p>
                    <p class="card-text"><strong>Cast:</strong> ${details.cast}</p>
                    <p class="card-text"><strong>Overview:</strong> ${truncateText(details.overview, 100)}</p>
                    <a href="https://www.themoviedb.org/movie/${movie.id}" target="_blank" class="btn btn-primary btn-sm">View on TMDB</a>
                </div>
            </div>
        `;
        container.appendChild(movieElement);
    });
});
}
function fetchMovieDetails(movieId) {
    const apiKey = '95a143e64f44da13f34e5ff8a9cf4100';
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&append_to_response=credits`;

    return fetch(url)
    .then(response => response.json())
    .then(data => {
        const director = data.credits.crew.find(member => member.job === 'Director');
        const cast = data.credits.cast.map(member => member.name).slice(0, 3).join(', ');
        return {
            release_date: data.release_date,
            vote_average: data.vote_average,
            director: director ? director.name : 'N/A',
            cast: cast,
            overview: data.overview
        };
    });
}

// Initialization function
async function init() {
    const genres = await fetchGenres();
    displayGenreButtons(genres);
}

// Call initialization function on page load
document.addEventListener('DOMContentLoaded', function() {
    init(); // Remove duplicate function declarations and call the initialization function
});
