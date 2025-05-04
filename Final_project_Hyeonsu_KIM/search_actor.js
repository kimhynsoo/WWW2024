let currentPage = 1;
const moviesPerPage = 12; // Number of movies to display per page
let currentMovies = []; // Global variable to store the current list of searched movies

document.getElementById('searchButton').addEventListener('click', function() {
    const query = document.getElementById('searchInput').value;
    if (query) {
        searchActor(query);
    }
});

document.getElementById('searchInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        const query = event.target.value;
        if (query) {
            searchActor(query);
        }
    }
});

function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    } else {
        return text;
    }
}

function searchActor(query) {
    const apiKey = '95a143e64f44da13f34e5ff8a9cf4100';
    const actorSearchUrl = `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${encodeURIComponent(query)}`;

    fetch(actorSearchUrl)
        .then(response => response.json())
        .then(data => {
            if (data.results.length > 0) {
                const actorId = data.results[0].id;
                searchMoviesByActor(actorId);
            } else {
                console.error('No actor found.');
            }
        })
        .catch(error => console.error('An error occurred while fetching actor data.', error));
}

function searchMoviesByActor(actorId) {
    const apiKey = '95a143e64f44da13f34e5ff8a9cf4100';
    const firstPageUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_cast=${actorId}&page=1`;

    fetch(firstPageUrl)
        .then(response => response.json())
        .then(data => {
            const totalPages = data.total_pages;
            const allPagesPromises = [];
            console.log(totalPages);

            for (let page = 1; page <= totalPages; page++) {
                const pageUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_cast=${actorId}&page=${page}`;
                allPagesPromises.push(fetch(pageUrl).then(response => response.json()));
            }

            // Use Promise.all to handle all page requests concurrently
            Promise.all(allPagesPromises).then(pages => {
                const allMovies = pages.reduce((acc, pageData) => {
                    // Merge movie data from each page into a single array
                    return acc.concat(pageData.results);
                }, []);
                console.log('All movie data:', allMovies);

                currentMovies = allMovies;

                if (Array.isArray(currentMovies)) {
                    currentPage = 1;
                    displayMovies(currentMovies); // updated part
                    setupPagination(data.total_results);
                } else {
                    console.error('currentMovies is not an array.');
                }
            });
        })
        .catch(error => console.error('An error occurred while fetching movie data.', error));
}

function setupPagination(totalResults) {
    const paginationElement = document.getElementById('pagination');
    paginationElement.innerHTML = '';

    const pageCount = Math.ceil(totalResults / moviesPerPage); // Calculate the total number of pages based on total results

    // Calculate start and end pages
    let startPage = currentPage - 5;
    let endPage = currentPage + 4;
    if (startPage <= 0) {
        startPage = 1;
        endPage = Math.min(10, pageCount); // Handling for when total pages are less than 10
    }
    if (endPage > pageCount) {
        endPage = pageCount;
        startPage = Math.max(1, pageCount - 9);
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageItem = document.createElement('li');
        pageItem.classList.add('page-item');
        if (i === currentPage) {
            pageItem.classList.add('active');
        }
        pageItem.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        pageItem.addEventListener('click', function(event) {
            event.preventDefault();
            currentPage = i;
            displayMovies(currentMovies); // Display the list of movies for the current page
            setupPagination(totalResults);
        });

        paginationElement.appendChild(pageItem);
    }
}

function displayMovies(movies) {
    const moviesElement = document.getElementById('movies');
    moviesElement.innerHTML = '';

    const start = (currentPage - 1) * moviesPerPage;
    const end = start + moviesPerPage;
    const moviesToShow = movies.slice(start, end);

    moviesToShow.forEach(movie => {
        fetchMovieDetails(movie.id).then(details => {
            const movieElement = document.createElement('div');
            movieElement.classList.add('col-md-4', 'mb-3');
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

            moviesElement.appendChild(movieElement);
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
    
