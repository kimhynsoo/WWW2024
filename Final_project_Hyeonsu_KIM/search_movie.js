let currentPage = 1;
const moviesPerPage = 12; // The number of movies to display per page
let currentMovies = []; // A global variable to store the current list of searched movies

document.getElementById('searchButton').addEventListener('click', function() {
    const query = document.getElementById('searchInput').value;
    if (query) {
        searchMovies(query);
    }
});

document.getElementById('searchInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        const query = event.target.value;
        if (query) {
            searchMovies(query);
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

function searchMovies(query) {
    const apiKey = '95a143e64f44da13f34e5ff8a9cf4100';
    // Use the first page request to find out the total number of pages
    const firstPageUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=1`;
  
    fetch(firstPageUrl)
        .then(response => response.json())
        .then(data => {
            const totalPages = data.total_pages;
            const allPagesPromises = [];

            for (let page = 1; page <= totalPages; page++) {
                const pageUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=${page}`;
                allPagesPromises.push(fetch(pageUrl).then(response => response.json()));
            }

            // Use Promise.all to handle all page requests simultaneously
            Promise.all(allPagesPromises).then(pages => {
                const allMovies = pages.reduce((acc, pageData) => {
                // Merge the movie data from each page into one array
                return acc.concat(pageData.results);
                }, []);
            console.log('All movie data:', allMovies);
                
            currentMovies=allMovies;

            if (Array.isArray){
                currentPage = 1;
                displayMovies(currentMovies); // Updated part
                setupPagination(data.total_results);
            } 
            else {
                console.error('movies is not an array.');
            }

                
                
            });
        })
        .catch(error => console.error('An error occurred while fetching movie data.', error));
}
  
  


function setupPagination(totalResults) {
  const paginationElement = document.getElementById('pagination');
  paginationElement.innerHTML = '';

  const pageCount = Math.ceil(totalResults / moviesPerPage); // Calculate the total number of pages based on the total number of results

  // Calculate the start and end page
  let startPage = currentPage - 5;
  let endPage = currentPage + 4;
  if (startPage <= 0) {
      startPage = 1;
      endPage = Math.min(10, pageCount); // Handling for when the total number of pages is less than 10
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
        displayMovies(currentMovies); // Display the movie list for the current page
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
        const director = data.credits.crew.find(member => member.job === 'Director')?.name;
        const cast = data.credits.cast.slice(0, 5).map(actor => actor.name).join(', ');
        return{
            release_date: data.release_date,
            vote_average: data.vote_average,
            director: director,
            cast: cast,
            overview: data.overview
        };
        
        
    })
    .catch(error => console.error('Error:', error));
}

document.addEventListener('DOMContentLoaded', () => {
    // Apply saved color on page load
    const savedColor = localStorage.getItem('navbarColor');
    if (savedColor) {
        document.querySelector('.navbar').style.backgroundColor = savedColor;
    }
    
    // Color change button click event
    document.getElementById('changeColor').addEventListener('click', () => {
        let newColor = '#007bff'; // Default color
        if (document.querySelector('.navbar').style.backgroundColor === 'rgb(0, 123, 255)' || 
            document.querySelector('.navbar').style.backgroundColor === '') { // If the current color is the default color or not set
            newColor = '#28a745'; // Change to green
        }
        document.querySelector('.navbar').style.backgroundColor = newColor;
        localStorage.setItem('navbarColor', newColor); // Save the changed color to LocalStorage
    });
});
