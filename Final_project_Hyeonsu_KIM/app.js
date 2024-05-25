let currentPage = 1;
const moviesPerPage = 12; // 한 페이지에 표시할 영화 수
let currentMovies = []; // 현재 검색된 영화 목록을 저장할 전역 변수


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
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`;

  fetch(url)
  .then(response => response.json())
  .then(data => {
    console.log('검색된 영화 목록', data.results);
    const movies = data.results;
    currentMovies = movies; // 현재 검색된 영화 목록을 전역 변수에 저장
    const totalResults = data.total_results;
    console.log(totalResults);

    if (Array.isArray(movies)) {
        currentPage = 1;
        displayMovies(currentMovies); // 수정된 부분
        setupPagination(totalResults);
    } else {
        console.error('movies is not an array.');
    }
})

  .catch(error => console.error('Error:', error));
}


function setupPagination(totalResults) {
  const paginationElement = document.getElementById('pagination');
  paginationElement.innerHTML = '';

  const pageCount = Math.ceil(totalResults / moviesPerPage); // 총 결과 수를 기반으로 총 페이지 수를 계산합니다.

  // 시작 페이지와 끝 페이지 계산
  let startPage = currentPage - 5;
  let endPage = currentPage + 4;
  if (startPage <= 0) {
      startPage = 1;
      endPage = Math.min(10, pageCount); // 총 페이지 수가 10보다 작은 경우에 대한 처리
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
        displayMovies(currentMovies); // 현재 페이지에 맞는 영화 목록을 표시합니다.
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
